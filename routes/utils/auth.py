from flask import request, redirect, make_response, current_app, abort, session, url_for, g, flash
from dotenv import load_dotenv
from functools import wraps
import jwt
import os 
load_dotenv()

JWT_KEY = os.getenv("JWT_KEY")
def token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token_val = request.cookies.get("token")
        if not token_val:
            return redirect("/login")       
        try:
            # ==================================== DECODIFICAMOS TOKEN
            token = jwt.decode(token_val, JWT_KEY, algorithms=["HS256"])
            g.user_id = token["user_id"]
            g.session_id = token["ses_id"]
            # ==================================== FIN DE DECOFICACION DEL TOKEN
            
            # ========================= PERMISOS
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("""
                            SELECT per_name
                            FROM t_role_permission rp
                            
                            INNER JOIN t_permission p ON rp.per_id = p.per_id
                            INNER JOIN t_user_role ur ON ur.rol_id = rp.rol_id
                                
                            WHERE user_id = %s
                            """, (token['user_id'],))
            permissionData = [x[0] for x in cursor.fetchall()]
            g.permissionData = permissionData
            # ======================== FIN DE PERMISOS
            
            # ==================================== MODIFICAMOS LA SESION
            cursor.execute("""
                            SELECT ses_state
                            FROM t_sessions
                            WHERE ses_id = %s 
                                AND ses_state = 'closed'
                            """, (g.session_id,))
            ses_state = cursor.fetchone()
            if ses_state:
                response = make_response(redirect(url_for("login.login")))  
                response.delete_cookie("token")
                session.clear()
                flash("Sesion finalizada", "info")
                return response
            
            cursor.execute("""
                            UPDATE t_sessions
                            SET ses_last_activity = NOW()
                            WHERE ses_id = %s
                            """, (g.session_id,))
            cursor.connection.commit()
        
            # ==================================== FIN DE MODIFICACION DE LA SESION
            
        except Exception as e:
            print("Error en decorador token", e)
            response = make_response(redirect(url_for("login.login")))
            response.delete_cookie("token")
            session.clear()
            return response
        
        # ==================================== PREPARAMOS RESPUESTA DEL TOKEN
        response = make_response(f(*args, **kwargs))
        return response
    # ==================================== FIN DE RESPUESTA DEL TOKEN
    return decorated


def permission(permission_required):
    def decorater(f):
        @wraps(f)
        def decorated(*args, **kwargs): 
            if permission_required not in g.permissionData:
                # print("SIN PERMISO")
                return abort(403)     
            # print("CON PERMISO", permission_required, session.get("permissionData"))
            return f(*args, **kwargs) 
        return decorated
    return decorater
