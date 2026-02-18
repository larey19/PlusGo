from flask  import Blueprint, request, current_app, redirect, render_template, make_response, flash, url_for
from werkzeug.security import check_password_hash
from MySQLdb import OperationalError 
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import jwt
import os 

load_dotenv()
JWT_KEY = os.getenv("JWT_KEY")

login_bp = Blueprint('login', __name__, template_folder = "../layouts")

@login_bp.route("/login", methods=["GET" , "POST"])
def login():
    if request.cookies.get("token"):
        return redirect("/") 
    if request.method == "POST":
        try:
            user = (request.form["adm_user"]).strip()
            password = (request.form["adm_password"]).strip()
            if not user or not password:
                flash ("Ingrese sus datos para iniciar sesion", "error")
                return redirect("/login")
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_admin WHERE adm_user = %s", (user,))
            admin = cursor.fetchone()
            if not admin:
                flash ("Parece que no estas registrado", "info")
                return render_template("login.html", data = {"user" : user, "password": password})
            elif admin:
                hash_password = admin[3]
                if not check_password_hash(hash_password, password):
                    flash ("Contraseña incorrecta", "error")
                    return render_template("login.html", data = {"user" : user, "password": password})
                token = jwt.encode({'adm_id': admin[0]}, JWT_KEY, algorithm='HS256')
                response = make_response(redirect("/"))
                response.set_cookie(
                    "token",
                    token,
                    httponly=True,
                    secure=False, 
                    samesite="Lax",
                    max_age=3600
                )
                flash ("Bienvenido", "success")
                return response
        except OperationalError:
            flash("Conexion fallida, Intenta más tarde.", "error")
            return render_template("login.html", data = {"user" : user, "password": password})
        except Exception:
            flash("Ocurrio un error, Intenta más tarde.", "error")
            return render_template("500.html")
    return render_template('login.html')
    

@login_bp.route("/logout")
def logout():
    try:
        response = make_response(redirect("/login"))
        response.delete_cookie("token")
        flash("Has cerrado sesion", "success")
        return response
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception:
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")