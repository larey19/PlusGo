from flask import Blueprint, current_app, jsonify
from .auth import token
from MySQLdb.cursors import DictCursor

local_bp = Blueprint("local", __name__)

@local_bp.context_processor
def lcl_Cst_Pla():
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_customer ORDER BY cst_name ASC")
        customers = cursor.fetchall()
        cursor.execute("SELECT * FROM t_platform ORDER BY pla_name ASC")
        platforms = cursor.fetchall()
        return dict(
            customers=customers,
            platforms=platforms
        )
    except Exception as e:
        print(e)
        return dict(customers=[], platforms=[])
