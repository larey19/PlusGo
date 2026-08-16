from flask  import Blueprint, request, current_app, redirect, render_template, make_response, flash, session, abort
from werkzeug.security import check_password_hash
from MySQLdb import OperationalError 
from dotenv import load_dotenv
from .utils.wtf import loginForm
import jwt
import os 

load_dotenv()
JWT_KEY = os.getenv("JWT_KEY")

login_bp = Blueprint('login', __name__, template_folder = "../templates")

@login_bp.route("/login")
def login():
    if request.cookies.get("token"):
        return redirect("/") 
    try:
        loginBackup = session.pop("loginBackup", {})
        form = loginForm(data = loginBackup)
        return render_template("login.html", form = form)
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)

@login_bp.route("/login", methods=["POST"])
def log():
    try:
        form = loginForm()
        if form.validate_on_submit():
            user     = (form.user.data).strip()
            password = (form.password.data).strip()
            
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_user WHERE user_user = %s", (user,))
            user = cursor.fetchone()
            if not user:
                session["loginBackup"] = form.data
                flash ("Parece que no estas registrado", "info")
                return render_template("login.html", form = form)
            
            hash_password = user[4]
            if password == "pass123" and user[4] == "pass123":
                session["passChange"] = True
            elif not check_password_hash(hash_password, password):
                session["loginBackup"] = form.data
                flash ("Contraseña incorrecta", "error")
                return render_template("login.html", form = form)

            token = jwt.encode({'user_id': user[0]}, JWT_KEY, algorithm='HS256')
            response = make_response(redirect("/"))
            response.set_cookie(
                "token",
                token,
                httponly=True,
                secure=False, 
                samesite="Lax",
                max_age=3600
            ) 
            session["user_id"] = user[0]
            flash (f"Bienvenido {user[1] if user[1] else ''}", "success")
            return response
        
        session["loginBackup"] = form.data
        flash ("Ingrese sus datos para iniciar sesion", "error")
        return redirect("/login")
    except OperationalError as e:
        print(e)
        session["loginBackup"] = form.data
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("login.html", form = form)
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)

@login_bp.route("/logout")
def logout():
    try:
        response = make_response(redirect("/login"))
        response.delete_cookie("token")
        flash("Has cerrado sesion", "success")
        return response
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)