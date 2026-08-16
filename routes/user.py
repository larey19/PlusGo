from flask import Blueprint, redirect, request, flash, render_template, current_app, session, url_for, abort
import phonenumbers
from phonenumbers import NumberParseException
from .utils.auth import token
from werkzeug.security import check_password_hash, generate_password_hash
from MySQLdb import OperationalError
from .utils.wtf import userForm, userPasswordForm

user_bp = Blueprint("user", __name__, template_folder= "../templates")


# Ruta Para Obtener un usuario Registrados en la base de datos 
@user_bp.route("/user/<user_id>") 
@token
def getAccounts(user_id):
    userBackup = session.pop("userBackup", {}) 
    userPasswordBackup= session.pop("userPasswordBackup", {})
    form = userForm(data = userBackup)
    PasswordForm = userPasswordForm(data = userPasswordBackup)
    try: 
        cursor = current_app.mysql.connection.cursor() #Crea Variable para entablar conexion con la base de datos
        cursor.execute("""SELECT u.*, r.rol_name 
                        FROM t_user u 
                        INNER JOIN t_user_role ur ON ur.user_id = u.user_id 
                        INNER JOIN t_role r ON r.rol_id = ur.rol_id  
                        WHERE u.user_id = %s""", (user_id,)) #Realizar consulta SQL
        user = cursor.fetchone()#obtener resultado de la consulta
        if not user:
            flash("Usuario no encontrado", "error") 
            return redirect(session.get('url_back_post'))
        return render_template("user.html", user = user, form = form, PasswordForm = PasswordForm)
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return abort(500)
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500) 

@user_bp.route("/user/<user_id>", methods=["POST"]) 
@token
def putAccounts(user_id):
    if request.referrer and '/user' in request.referrer:
        session["url_back_post"] = request.referrer
    try:
        form = userForm()
        if form.validate_on_submit():
            user_name       = (form.username.data).strip()
            user_lastname   = (form.userlastname.data).strip()
            user_user       = (form.useruser.data).strip()
            user_number_phone = (((form.usernumberphone.data).strip()).replace("+57","")).replace(" ", "")
            if len(user_name) >= 50 or len(user_lastname) >= 50 or len(user_user) >= 50 or (len(user_number_phone) > 10 or len(user_number_phone) < 10):
                session["userBackup"] = form.data
                flash("Se excedio el limite de caracteres permitidos", "error") 
                return redirect(session.get("url_back_post"))
            
            if user_number_phone and not phonenumbers.is_valid_number(phonenumbers.parse(user_number_phone, "CO")):
                flash("Telefono Invalido", "error")  
                return redirect(session.get('url_back_post')) 
            
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_user WHERE user_id = %s", (user_id,)) #Realizar consulta SQL
            if not cursor.fetchone():#obtener resultado de la consulta 
                session["userBackup"] = form.data
                flash("Usuario no encontrado", "error") 
                return redirect(session.get("url_back_post"))
            
            
            cursor.execute("SELECT * FROM t_user WHERE user_user = %s AND user_id != %s", (user_user, user_id,)) #Realizar consulta SQL
            if cursor.fetchone():#obtener resultado de la consulta 
                session["userBackup"] = form.data
                flash("nombre de usuario ya esta en uso", "error") 
                return redirect(session.get("url_back_post"))
            
            cursor.execute("UPDATE t_user SET user_name = %s, user_lastname = %s, user_user = %s, user_number_phone = %s WHERE user_id = %s", (user_name, user_lastname, user_user, user_number_phone, user_id,))
            cursor.connection.commit()
            flash("Datos Actualizados", "success")
            return redirect(session.get('url_back_post'))
        print(form.errors)
        session["userBackup"] = form.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    except NumberParseException:
        flash("Telefono Invalido", "error")  
        return redirect(session.get('url_back_post'))  
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return abort(500)
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)

@user_bp.route("/user/password/<user_id>", methods=["POST"])
@token
def putPassword(user_id):
    if request.referrer and '/user' in request.referrer:
        session["url_back_post"] = request.referrer
    try:
        form = userPasswordForm()
        if form.validate_on_submit():
            user_password_old_check  = (form.userpassword.data).strip()
            user_password_new_check = (form.userpasswordcheck.data).strip()
            user_password_new        = generate_password_hash(form.userpasswordnew.data)
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT user_password FROM t_user WHERE user_id = %s",(user_id,))
            user_password_old = cursor.fetchone()
            if not user_password_old:   
                session["userPasswordBackup"] = form.data
                flash("Usuario no encontrado", "error") 
                return redirect(session.get('url_back_post'))
            
            if not check_password_hash(user_password_old[0],user_password_old_check):
                print(form.data)
                session["userPasswordBackup"] = form.data
                flash("Contraseña incorrecta", "error")
                return redirect(session.get('url_back_post'))
            if not check_password_hash(user_password_new,user_password_new_check):
                session["userPasswordBackup"] = form.data
                flash("Las contraseñas no coinciden", "error")
                return redirect(session.get('url_back_post'))
            
            cursor.execute("UPDATE t_user SET user_password = %s WHERE user_id = %s", (user_password_new, user_id,))
            cursor.connection.commit()
            flash("Actualizacion de contraseña Exitosa", "success")
            return redirect(session.get('url_back_post'))
        print(form.errors)
        session["userPasswordBackup"] = form.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return abort(500)
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)


@user_bp.route("/user/password/temporary/<user_id>", methods=["POST"])
@token
def putPasswordTemporary(user_id):
    if request.referrer and '/user' in request.referrer:
        session["url_back_post"] = request.referrer
    try:
        form = userPasswordForm()
        form.userpassword.validators = []
        if form.validate_on_submit() and session.pop("passChange", False):
            user_password_new_check = (form.userpasswordcheck.data).strip()
            user_password_new        = generate_password_hash(form.userpasswordnew.data)
            
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT user_password FROM t_user WHERE user_id = %s",(user_id,))
            user_password_old = cursor.fetchone()
            if not user_password_old:   
                session["userPasswordBackup"] = form.data
                flash("Usuario no encontrado", "error") 
                return redirect(session.get('url_back_post'))
            
            if not check_password_hash(user_password_new,user_password_new_check):
                session["userPasswordBackup"] = form.data
                flash("Las contraseñas no coinciden", "error")
                return redirect(session.get('url_back_post'))
            
            cursor.execute("UPDATE t_user SET user_password = %s WHERE user_id = %s", (user_password_new, user_id,))
            cursor.connection.commit()
            flash("Actualizacion de contraseña Exitosa", "success")
            return redirect(session.get('url_back_post'))
        print(form.errors)
        session["userPasswordBackup"] = form.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return abort(500)
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)
