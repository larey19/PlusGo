from flask import Blueprint, redirect, request, flash, render_template, current_app, session, abort
from .utils.auth import token, permission
from MySQLdb import OperationalError, IntegrityError
from MySQLdb.cursors import DictCursor 
from .utils.wtf import rbacRolePermission
import uuid

rbacrolepermission_bp = Blueprint("rbacrolepermission", __name__, template_folder= "../templates")

# Ruta entrar a la RBAC permisos de los roles
@rbacrolepermission_bp.route("/rbac/roles/permissions") 
@token 
@permission("rbacs.view")
def getRbac():
    try: 
        # si viene de un error del CREAR carga la info en el form 
        rbacRolePermissionBackup = session.pop("rbacRolePermissionBackup", {})
        rbacPermissionBackup = session.pop("rbacPermissionBackup", [])
        rbacRolPerForm = rbacRolePermission(data=rbacRolePermissionBackup)
        
        # realizamos consulta de ruta
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("""
                        -- consultamos los roles y los id 
                        SELECT DISTINCT r.rol_id , r.rol_name
                        FROM t_role_permission rp
                            RIGHT JOIN t_role r ON r.rol_id = rp.rol_id
                        """)
        roles = cursor.fetchall()
        # print(roles)
        # obtenemos los permisos de cada rol 
        rolesPermissionsData = [] #contiene todos los permisos de cada rol
        for r in roles :
            cursor.execute(""" 
                            SELECT
                                p.*,
                                CASE
                                    WHEN rp.rol_id IS NULL THEN 0
                                    ELSE 1
                                END AS control
                                
                            FROM t_permission p
                            -- conectamos las tablas, traemos todo de la izquierda "p" 
                            LEFT JOIN t_role_permission rp 
                                ON rp.per_id = p.per_id 
                                AND rp.rol_id = %s
                            -- ordenamos las columnas en categorias
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
                            END
                            """, (r[0],))
            rolperdata = cursor.fetchall() # contiene todos los permisos de un solo rol
            
            rolesPermissionsData.append({               
                    "rol_id"         : r[0],
                    "rol_name"       : r[1],
                    "rol_permissions": [
                        {
                        "per_id"  : rp[0],
                        "per_name": rp[1],
                        "control" : rp[2]
                        } for rp in rolperdata
                    ]
            }) # agrega todos los permisos de un rol a la lista que contiene todos los permisos de todos los roles
        # print(rolesPermissionsData)
        return render_template("rbac.html", rolesPermissionsData = rolesPermissionsData, roles = roles, rbacRolPerForm = rbacRolPerForm, rbacPermissionBackup = rbacPermissionBackup)
    except OperationalError as e:
        print("error en rolepermission", e)
        return abort(500)
    except Exception as e:
        print("error en rolepermission", e)
        return abort(500) 

# Ruta entrar a la RBAC permisos crear
@rbacrolepermission_bp.route("/rbac/roles/permissions", methods = ["POST"]) 
@token
@permission("rbacs.create")
def createRbac():
    # GUARDAMOS LA URL 
    if request.referrer and '/rbac/roles/permissions' in request.referrer:
        session["url_back_post"] = request.referrer 
    try: 
        # Guardamos el formulario
        form = rbacRolePermission()
        if form.validate_on_submit():
            rol_id = uuid.uuid4()
            rolname = (form.rolename.data).strip() 
            permissions = request.form.getlist("per_name")

            # BLOCK DE VALIDACIONES
            if len(rolname) >= 50: 
                session["rbacRolePermissionBackup"] = form.data
                flash("Se excedio el limite de caracteres permitidos", "error") 
                return redirect(session.get("url_back_post"))
            
            if len(permissions) == 0:
                session["rbacRolePermissionBackup"] = form.data
                flash("No se selecciono ningun permiso", "error") 
                return redirect(session.get("url_back_post"))
            
            cursor = current_app.mysql.connection.cursor()
            
            cursor.execute("SELECT * FROM t_role WHERE rol_name = %s", (rolname,)) #Realizar consulta SQL
            if cursor.fetchone():#obtener resultado de la consulta 
                session["rbacRolePermissionBackup"] = form.data
                session["rbacPermissionBackup"] = permissions
                flash("Nombre de rol ya esta en uso", "error") 
                return redirect(session.get("url_back_post"))
            
            cursor.execute("""
                INSERT INTO t_role (rol_id, rol_name)
                VALUES (%s, %s)
            """, (rol_id, rolname,))
            cursor.connection.commit()
            
            for p in permissions:
                cursor.execute("""
                        INSERT INTO t_role_permission (rol_id, per_id)
                        SELECT %s, p.per_id
                        FROM t_permission p
                        WHERE   
                            p.per_name = %s
                    """, (rol_id, p))   
                cursor.connection.commit()
            
            # REDIRECCIONA A LA URL QUE GUARDO 
            flash("Registro Exitoso", "success")
            return redirect(session.get('url_back_post'))
        print(form.errors)
        session["rbacRolePermissionBackup"]= form.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    except IntegrityError as e:
        print("error en rolepermission create", e)
        session["rbacRolePermissionBackup"]= form.data
        flash("Error al registrar Venta", "error")  
        return redirect(session.get('url_back_post'))
    except OperationalError as e:
        print("error en rolepermission create", e)
        return abort(500)
    except Exception as e:
        print("error en rolepermission create", e)
        return abort(500) 

# Ruta entrar a la RBAC permisos editar
@rbacrolepermission_bp.route("/rbac/roles/permissions/<rol_id>", methods = ["POST"]) 
@token
@permission("rbacs.create")
def updateRbac(rol_id):
    # GUARDAMOS LA URL 
    if request.referrer and '/rbac/roles/permissions' in request.referrer:
        session["url_back_post"] = request.referrer 
    try: 
        # Guardamos el formulario
        form = rbacRolePermission()
        if form.validate_on_submit():
            rolname = (form.rolename.data).strip() 
            permissions = request.form.getlist("per_name")
            # print(rol_id, form.data, permissions)
            # BLOCK DE VALIDACIONES
            if len(rolname) >= 50: 
                session["rbacRolePermissionBackup"] = form.data
                flash("Se excedio el limite de caracteres permitidos", "error") 
                return redirect(session.get("url_back_post"))
            
            if len(permissions) == 0:
                session["rbacRolePermissionBackup"] = form.data
                flash("No se selecciono ningun permiso", "error") 
                return redirect(session.get("url_back_post"))
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_role WHERE rol_id = %s", (rol_id,)) #Realizar consulta SQL
            if not cursor.fetchone():#obtener resultado de la consulta 
                flash("Rol no encontrado", "error") 
                return redirect(session.get("url_back_post"))
            
            
            cursor.execute("SELECT * FROM t_role WHERE rol_name = %s AND rol_id != %s", (rolname, rol_id,)) #Realizar consulta SQL
            if cursor.fetchone():#obtener resultado de la consulta 
                flash("Nombre de usuario ya esta en uso", "error") 
                return redirect(session.get("url_back_post"))
            
            # QUERY DE UPDATE
            cursor.execute("""UPDATE t_role 
                            SET rol_name = %s
                            WHERE rol_id = %s
                            """, (rolname, rol_id,))
            
            cursor.execute("""
                            DELETE FROM t_role_permission
                            WHERE rol_id = %s
                        """, (rol_id,))

            
            cursor.connection.commit()
            
            for p in permissions:
                cursor.execute("""
                        INSERT INTO t_role_permission (rol_id, per_id)
                        SELECT %s, p.per_id
                        FROM t_permission p
                        WHERE   
                            p.per_name = %s
                    """, (rol_id, p))   
                cursor.connection.commit()
            
            # REDIRECCIONA A LA URL QUE GUARDO 
            flash("Actualizacion Exitosa", "success")
            return redirect(session.get('url_back_post'))
        
        print(form.errors)
        session["rbacRolePermissionBackup"]= form.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    except IntegrityError as e:
        print("error en rolepermission create", e)
        session["rbacRolePermissionBackup"]= form.data
        flash("Error al registrar Venta", "error")  
        return redirect(session.get('url_back_post'))
    except OperationalError as e:
        print("error en rolepermission create", e)
        return abort(500)
    except Exception as e:
        print("error en rolepermission create", e)
        return abort(500) 
