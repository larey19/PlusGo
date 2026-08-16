from flask import Blueprint, render_template, current_app, abort
from .utils.auth import token, permission
from MySQLdb import OperationalError

rbacpermission_bp = Blueprint("rbacpermission", __name__, template_folder= "../templates")


# Ruta entrar a la RBAC USUARIOS
@rbacpermission_bp.route("/rbac/permission") 
# @permission("rbacs.view")
@token
def getRbac():
    try: 
        # asignamos los roles al select
        cursor = current_app.mysql.connection.cursor()
        # realizamos consulta de ruta
        cursor.execute(""" 
                        SELECT GROUP_CONCAT(
                            p.per_name
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
                        FROM t_permission p 
                        LIMIT 1
                        """)
        permission = cursor.fetchone()[0]
        # print(permission)
        return render_template("rbac.html", permission = permission)
    except OperationalError as e:
        print("error en userrole", e)
        return abort(500)
    except Exception as e:
        print("error en userrole", e)
        return abort(500) 
