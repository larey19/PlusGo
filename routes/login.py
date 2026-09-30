from flask  import Blueprint, request, current_app, redirect, render_template, make_response, flash, session, abort, url_for
from werkzeug.security import check_password_hash
from MySQLdb import OperationalError 
from dotenv import load_dotenv
from user_agents import parse
from .utils.wtf import loginForm
import jwt
import os 
import uuid

load_dotenv()
JWT_KEY = os.getenv("JWT_KEY")

login_bp = Blueprint('login', __name__, template_folder = "../templates")

@login_bp.route("/login", methods=["GET","POST"])
def login():
    try:
        form = loginForm()
        if request.method == "POST": 
        # INICIO LOGIN POST
            if form.validate_on_submit():
                # ==================================== VARIABLES BASE LOGIN
                user     = (form.user.data).strip()
                password = (form.password.data).strip()
                rememberme = (form.password.data).strip()
                
                session_id = str(uuid.uuid4())
                user_agent = parse(request.headers.get("User-Agent"))
                
                # ==================================== LOGICA LOGIN
                cursor = current_app.mysql.connection.cursor()
                cursor.execute("SELECT * FROM t_user WHERE user_user = %s", (user,))
                user = cursor.fetchone()
                if not user:
                    session["loginBackup"] = form.data
                    flash ("Parece que no estas registrado", "info")
                    return render_template("login.html", form = form)
                
                hash_password = user[4]
                if user[6] == "change_password" and (user[4] == "plusgo" and password == "plusgo"):
                    session["passChange"] = True
                elif not check_password_hash(hash_password, password):
                    session["loginBackup"] = form.data
                    flash ("Contraseña incorrecta", "error")
                    return render_template("login.html", form = form)
                #===================================== FIN LOGICA LOGIN
                
                
                # ==================================== CREACION DE TOKEN
                token = jwt.encode({
                    'user_id': user[0],
                    'ses_id' : session_id
                    }, JWT_KEY, algorithm='HS256')
                # ==================================== FIN DE CREACION DE TOKEN 
                
                
                # ==================================== REGISTRO DE SESION
                cursor.execute("""
                    INSERT INTO t_sessions (
                        ses_id,
                        ses_user_id,
                        ses_token,
                        ses_device,
                        ses_browser,
                        ses_os,
                        ses_ip,
                        ses_user_agent
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    session_id,
                    user[0],
                    token,
                    user_agent.device.family,
                    user_agent.browser.family,
                    user_agent.os.family,
                    request.remote_addr,
                    request.headers.get("User-Agent")
                ))
                cursor.connection.commit()
                # =================================== FIN REGISTRO DE SESION
                
                # ==================================== CREANDO RESPUESTA DE LOGIN CON TOKEN
                response = make_response(redirect("/"))  
                response.set_cookie(
                    "token",
                    token,
                    httponly=True,
                    secure=False, 
                    samesite="Lax",
                    max_age =  60 * 60 * 24 * 30 if rememberme else 60 * 60 * 3                
                ) 
                flash (f"Bienvenido {user[1] if user[1] else ''}", "success")
                return response
                # ==================================== FIN DE RESPUESTA DE LOGIN CON TOKEN
                
            
            print(form.errors)
            session["loginBackup"] = form.data
            flash ("Ingrese sus datos para iniciar sesion", "error")
            return render_template("login.html", form = form)
        
        # FIN POST LOGIN
        else:
            # LOGIN GET
            if request.cookies.get("token"):
                return redirect("/") 
            loginBackup = session.pop("loginBackup", {})
            form = loginForm(data = loginBackup)
            return render_template("login.html", form = form)
            #  FIN LOGIN GET
            
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
        # =========================================VARIABLES BASE
        token_val = request.cookies.get("token")
        
        if not token_val:
            return redirect(url_for("login.login"))
        # ==================================== DECODIFICAMOS TOKEN 
        token = jwt.decode(
                    token_val,
                    JWT_KEY,
                    algorithms=["HS256"]
                )
        session_id = token["ses_id"]
        # ======================================= FIN DE DECODIFICACION DE TOKEN
        
        # ==================================== LOGICA DE CIERRE DE SESION Y RESPUESTA 
        if session_id:    
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("""
                            UPDATE t_sessions
                            SET ses_state = 'closed',
                                ses_closed_at = NOW()
                            WHERE ses_id = %s
                            """, (session_id,))
            cursor.connection.commit()
        
        response = make_response(redirect(url_for("login.login")))
        response.delete_cookie("token")
        session.clear()
        flash("Has cerrado sesion", "success")
        return response
        # ==================================== FIN DE CIERRE DE SESION Y RESPUESTA 
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)