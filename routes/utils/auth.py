from flask import request, redirect, make_response, current_app, g, abort, session
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
            data = jwt.decode(token_val, JWT_KEY, algorithms=["HS256"])
            
            # =================== PERMISOS
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("""
                            SELECT per_name
                            FROM t_role_permission rp
                            
                            INNER JOIN t_permission p ON rp.per_id = p.per_id
                            INNER JOIN t_user_role ur ON ur.rol_id = rp.rol_id
                                
                            WHERE user_id = %s
                            """, (data['user_id'],))
            permissionData = [x[0] for x in cursor.fetchall()]
            # print(permissionData)
            session['permissionData'] = permissionData
            g.user_id      = data['user_id']
            g.permissions  = permissionData
            # print(g.permissions)
        except Exception as e:
            response = make_response(redirect("/login"))
            response.delete_cookie("token")
            print("Error en decorador token", e)
            return response
            
        response = make_response(f(*args, **kwargs))
        response.set_cookie(
            "token",
            token_val,
            httponly=True,
            samesite="Lax",
            secure=False, 
            max_age=3600
        )
        return response
    return decorated


def permission(permission_required):
    def decorater(f):
        @wraps(f)
        def decorated(*args, **kwargs): 
            try:
                # print("CON PERMISO", permission_required, g.permissions)
                if permission_required not in g.permissions:
                    # print("SIN PERMISO")
                    return abort(403)     
            except Exception as e:
                response = make_response(redirect("/login"))
                response.delete_cookie("token")
                print("Error en decorador token", e)
                return response
            return f(*args, **kwargs) 
        return decorated
    return decorater
