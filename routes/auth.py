from flask import request, redirect, make_response
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
            request.adm_id = data['adm_id']
        except Exception:
            response = make_response(redirect("/login"))
            response.delete_cookie("token")
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
