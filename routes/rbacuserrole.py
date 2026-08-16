from flask import Blueprint, redirect, request, flash, render_template, current_app, session, abort
import phonenumbers
from phonenumbers import NumberParseException
from .utils.auth import token, permission
from MySQLdb import OperationalError, IntegrityError
from .utils.wtf import rbacUserRole
import uuid

rbacuserrole_bp = Blueprint("rbacuserrole", __name__, template_folder= "../templates")


# Ruta entrar a la RBAC USUARIOS
@rbacuserrole_bp.route("/rbac/users") 
@token
@permission("rbacs.view")
def getRbac():
    try: 
        # si viene de un error del CREAR carga la info en el form 
        rbacUserRoleBackup = session.pop("rbacUserRoleBackup", {})
        rbacUserRoleForm = rbacUserRole(data=rbacUserRoleBackup)
        # asignamos los roles al select
        cursor = current_app.mysql.connection.cursor()
        cursor.execute(""" 
                        SELECT * 
                        FROM t_role
                        WHERE rol_name != 'gerente'
                        """)
        roles = cursor.fetchall()
        rbacUserRoleForm.rolid.choices = [(rol[0], rol[1]) for rol in roles]
        
        # realizamos consulta de ruta
        cursor.execute(""" 
                        SELECT  u.user_id, u.user_name, u.user_lastname, u.user_user, u.user_number_phone,
                        r.rol_name, 
                        CONCAT('[',
                            GROUP_CONCAT(
                                CONCAT(
                                        '{"per_name":"',p.per_name, 
                                        '","control":', CASE
                                                            WHEN rp.per_id IS NULL THEN 0
                                                            ELSE 1
                                                        END,
                                        '}'
                                      )
                                    ORDER BY
                                    CASE
                                        WHEN p.per_name LIKE 'platforms.%%' THEN 1
                                        WHEN p.per_name LIKE 'accounts.%%' THEN 2
                                        WHEN p.per_name LIKE 'profiles.%%' THEN 3
                                        WHEN p.per_name LIKE 'customers.%%' THEN 4
                                        WHEN p.per_name LIKE 'sales.%%' THEN 5
                                        WHEN p.per_name LIKE 'rbacs.%%' THEN 6
                                        WHEN p.per_name LIKE 'management.%%' THEN 7
                                        WHEN p.per_name LIKE 'codes.%%' THEN 8
                                    END,
                                    p.per_name
                                )
                            ,']') AS per_name,
                            r.rol_id
                        FROM t_user u
                        
                        INNER JOIN t_user_role ur ON ur.user_id = u.user_id
                        INNER JOIN t_role r ON r.rol_id = ur.rol_id
                        
                        CROSS JOIN t_permission p

                        LEFT JOIN t_role_permission rp
                            ON rp.rol_id = r.rol_id
                            AND rp.per_id = p.per_id
                            
                        GROUP BY
                            u.user_id,
                            u.user_name,
                            u.user_lastname,
                            u.user_user,
                            u.user_number_phone,
                            r.rol_name,
                            r.rol_id

                        ORDER BY
                            u.user_name ASC
                        """)
        users = cursor.fetchall()
        # print(users)
        return render_template("rbac.html", users = users, rbacUserRoleForm = rbacUserRoleForm)
    except OperationalError as e:
        print("error en userrole", e)
        return abort(500)
    except Exception as e:
        print("error en userrole", e)
        return abort(500) 

# Ruta entrar a la RBAC USUARIOS crear
@rbacuserrole_bp.route("/rbac/user", methods = ["POST"]) 
@token
@permission("rbacs.create")
def createRbac():
    # GUARDAMOS LA URL 
    if request.referrer and '/rbac/users' in request.referrer:
        session["url_back_post"] = request.referrer 
    try: 
        rbacUserRoleForm = rbacUserRole()
        # asignamos los roles al select
        cursor = current_app.mysql.connection.cursor()
        cursor.execute(""" 
                        SELECT * 
                        FROM t_role
                        """)
        roles = cursor.fetchall()
        rbacUserRoleForm.rolid.choices = [(rol[0], rol[1]) for rol in roles]
        
        if rbacUserRoleForm.validate_on_submit():
            user_id = uuid.uuid4()
            username = (rbacUserRoleForm.username.data).strip() 
            userlastname = (rbacUserRoleForm.userlastname.data).strip() 
            useruser = (rbacUserRoleForm.useruser.data).strip() 
            usernumberphone = ((rbacUserRoleForm.usernumberphone.data).strip().replace("+57","")).replace(" ", "") 
            rolid = (rbacUserRoleForm.rolid.data).strip() 
            
            if len(username) >= 50 and len(userlastname) >= 50 and len(useruser) >= 50 and (len(usernumberphone) > 10 or len(usernumberphone) < 10): 
                session["rbacUserRoleBackup"] = rbacUserRoleForm.data
                flash("Se excedio el limite de caracteres permitidos", "error") 
                return redirect(session.get("url_back_post"))
            
            # utilizamos la libreria para validar el numero
            if usernumberphone and not phonenumbers.is_valid_number(phonenumbers.parse(usernumberphone, "CO")):
                flash("Telefono Invalido", "error")  
                return redirect(session.get('url_back_post')) 
            
            cursor = current_app.mysql.connection.cursor()
            
            cursor.execute("SELECT * FROM t_user WHERE user_user = %s", (useruser,)) #Realizar consulta SQL
            if cursor.fetchone():#obtener resultado de la consulta 
                session["rbacUserRoleBackup"] = rbacUserRoleForm.data
                flash("Nombre de usuario ya esta en uso", "error") 
                return redirect(session.get("url_back_post"))

            cursor.execute("SELECT * FROM t_user WHERE user_number_phone = %s", (usernumberphone,)) #Realizar consulta SQL
            if cursor.fetchone():#obtener resultado de la consulta 
                session["rbacUserRoleBackup"] = rbacUserRoleForm.data
                flash("Numero de telefono ya esta en uso", "error") 
                return redirect(session.get("url_back_post"))
            
            cursor.execute("""INSERT INTO t_user 
                            (user_name, user_lastname, user_user, user_number_phone, user_id) 
                            VALUES (%s, %s, %s, %s, %s)""", (username, userlastname, useruser, usernumberphone, user_id,))
            
            cursor.execute("""
                            INSERT INTO t_user_role 
                            (rol_id, user_id)
                            VALUES(%s, %s)
                            """, (rolid, user_id))
            cursor.connection.commit()
            
            # REDIRECCIONA A LA URL QUE GUARDO 
            flash("Registro Exitoso", "success")  
            return redirect(session.get('url_back_post'))
        print(rbacUserRoleForm.errors)
        session["rbacUserRoleBackup"]= rbacUserRoleForm.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    
    except NumberParseException as e:
        print("error en userrole", e)
        session["rbacUserRoleBackup"]= rbacUserRoleForm.data
        flash("Telefono invalido", "error")  
        return redirect(session.get('url_back_post'))
    except IntegrityError as e:
        print("error en userrole", e)
        session["rbacUserRoleBackup"]= rbacUserRoleForm.data
        flash("Error al registrar usuario", "error")  
        return redirect(session.get('url_back_post'))
    except OperationalError as e:
        print("error en userrole", e)
        return abort(500)
    except Exception as e:
        print("error en userrole", e)
        return abort(500) 

# Ruta entrar a la RBAC USUARIOS crear
@rbacuserrole_bp.route("/rbac/user/<user_id>", methods = ["POST"]) 
@token
@permission("rbacs.edit")
def updateRbac(user_id):
    # GUARDAMOS LA URL 
    if request.referrer and '/rbac/users' in request.referrer:
        session["url_back_post"] = request.referrer 
    try: 
        rbacUserRoleForm = rbacUserRole()
        # asignamos los roles al select
        cursor = current_app.mysql.connection.cursor()
        cursor.execute(""" 
                        SELECT * 
                        FROM t_role
                        """)
        roles = cursor.fetchall()
        rbacUserRoleForm.rolid.choices = [(rol[0], rol[1]) for rol in roles]
        
        if rbacUserRoleForm.validate_on_submit():
            username = (rbacUserRoleForm.username.data).strip() 
            userlastname = (rbacUserRoleForm.userlastname.data).strip() 
            useruser = (rbacUserRoleForm.useruser.data).strip() 
            usernumberphone = ((rbacUserRoleForm.usernumberphone.data).strip().replace("+57","")).replace(" ", "")
            rolid = (rbacUserRoleForm.rolid.data).strip() 
            # print(rbacUserRoleForm.data)
            # return
            # BLOCK DE VALIDACIONES
            if len(username) >= 50 and len(userlastname) >= 50 and len(useruser) >= 50 and (len(usernumberphone) > 10 or len(usernumberphone) < 10): 
                flash("Se excedio el limite de caracteres permitidos", "error") 
                return redirect(session.get("url_back_post"))
                        
            # utilizamos la libreria para validar el numero
            if usernumberphone and not phonenumbers.is_valid_number(phonenumbers.parse(usernumberphone, "CO")):
                flash("Telefono Invalido", "error")  
                return redirect(session.get('url_back_post')) 
            
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("""
                            SELECT r.rol_name, (
                                SELECT r.rol_name
                                FROM t_role r 
                                WHERE r.rol_id = %s
                                LIMIT 1
                            )
                            FROM t_user_role ur
                                INNER JOIN t_user u ON u.user_id = ur.user_id
                                INNER JOIN t_role r ON r.rol_id = ur.rol_id
                            WHERE u.user_id = %s
                            """, (rolid, user_id,))
            ur = cursor.fetchone()
            if ur[0].lower() == "gerente" and ur[1].lower() != ur[0].lower():
                flash("Imposible de modificar", "error") 
                return redirect(session.get("url_back_post"))
            
            cursor.execute("SELECT * FROM t_user WHERE user_id = %s", (user_id,)) #Realizar consulta SQL
            if not cursor.fetchone():#obtener resultado de la consulta 
                flash("Usuario no encontrado", "error") 
                return redirect(session.get("url_back_post"))
            
            
            cursor.execute("SELECT * FROM t_user WHERE user_user = %s AND user_id != %s", (useruser, user_id,)) #Realizar consulta SQL
            if cursor.fetchone():#obtener resultado de la consulta 
                flash("Nombre de usuario ya esta en uso", "error") 
                return redirect(session.get("url_back_post"))
            
            # QUERY DE UPDATE
            cursor.execute("""UPDATE t_user 
                            SET user_name = %s, 
                                user_lastname = %s, 
                                user_user = %s, 
                                user_number_phone = %s 
                            WHERE user_id = %s
                            """, (username, userlastname, useruser, usernumberphone, user_id,))
            
            cursor.execute("""
                            UPDATE t_user_role
                            SET rol_id = %s
                            WHERE user_id = %s
                            """, (rolid, user_id,))
            cursor.connection.commit()
            
            # REDIRECCIONA A LA URL QUE GUARDO 
            flash("Usuario Actualizado", "success")
            return redirect(session.get('url_back_post'))
        
        print(rbacUserRoleForm.errors)
        session["rbacUserRoleBackup"]= rbacUserRoleForm.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    except NumberParseException as e:
        print("error en userrole", e)
        session["rbacUserRoleBackup"]= rbacUserRoleForm.data
        flash("Telefono", "error")  
        return redirect(session.get('url_back_post'))
    except IntegrityError as e:
        print("error en userrole", e)
        session["rbacUserRoleBackup"]= rbacUserRoleForm.data
        flash("Error al registrar usuario", "error")  
        return redirect(session.get('url_back_post'))
    except OperationalError as e:
        print("error en userrole", e)
        return abort(500)
    except Exception as e:
        print("error en userrole", e)
        return abort(500) 
