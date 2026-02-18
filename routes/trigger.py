from flask import Blueprint, render_template, current_app, jsonify, url_for, flash
from .auth import token
from MySQLdb import OperationalError
trigger_bp = Blueprint("trigger", __name__, template_folder="../layouts", url_prefix="/trigger")

@trigger_bp.route("/sale")
@token
def getTriggerSale():
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM trg_sale ORDER BY trg_date DESC")
        trg = cursor.fetchall()

        data = [{
            "trg_id": trg[0],
            "trg_date" : trg[1],
            "trg_action": trg[2],
            "sal_id":trg[3],
            "sal_price": trg[4],
            "sal_date_start": trg[5],
            "sal_date_end": trg[6],
            "cst_id":trg[7],
            "cst_name":trg[8],
            "cst_lastname":trg[9]
        } for trg in trg]
        return render_template("trigger.html", sale = data)
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@trigger_bp.route("/account")
@token
def getTriggerAccount():
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM trg_account ORDER BY trg_date DESC")
        trg = cursor.fetchall()

        data = [{
            "trg_id": trg[0],
            "trg_action": trg[1],
            "trg_date" : trg[2],
            "acc_id":trg[3],
            "acc_nickname": trg[4],
            "acc_provider": trg[5],
            "acc_date_pay": trg[6],
            "acc_email": trg[7],
            "pla_name":trg[8],

        } for trg in trg]
        return render_template("trigger.html", account = data)
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@trigger_bp.route("/platform")
@token
def getTriggerPlatform():
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM trg_platform ORDER BY trg_date DESC")
        trg = cursor.fetchall()

        data = [{
            "trg_id": trg[0],
            "trg_action": trg[1],
            "trg_date" : trg[2],
            "pla_id":trg[3],
            "pla_name": trg[4],
            "pla_profiles": trg[5],
        } for trg in trg]
        return render_template("trigger.html", platform = data)
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@trigger_bp.route("/profile")
@token
def getTriggerProfile():
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM trg_profile ORDER BY trg_date DESC")
        trg = cursor.fetchall()

        data = [{
            "trg_id": trg[0],
            "trg_action": trg[1],
            "trg_date" : trg[2],
            "pro_id":trg[3],
            "pro_profile":trg[4],
            "pro_pin_profile": trg[5],
            "acc_email": trg[6],
            "acc_number_phone": trg[7]
        } for trg in trg]
        return render_template("trigger.html", profile = data)
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")