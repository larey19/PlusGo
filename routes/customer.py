from flask import Blueprint, redirect, request, flash, render_template, current_app, session, url_for
from .auth import token
from MySQLdb import OperationalError
import phonenumbers
from phonenumbers import NumberParseException
from .wtf import cstForm
import uuid
customer_bp = Blueprint("customer", __name__, template_folder= "../layouts")


@customer_bp.route("/customer")
@token
def getCustomer():
    try:
        cstBackup = session.pop("cstBackup", {})
        form = cstForm(data = cstBackup)
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_customer ORDER BY cst_name ASC")
        customer = cursor.fetchall()
        return render_template("customer.html", customer = customer, form = form)
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception:
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@customer_bp.route("/customer", methods = ["POST"])
@token
def crtCustomer():
    if request.referrer and '/customer' not in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        form = cstForm()
        if request.method == "POST":
            cstid = uuid.uuid4()
            cstname = form.cstname.data
            cstlastname = form.cstlastname.data
            cstphonenumber = (form.cstphonenumber.data).strip()
            
            if cstphonenumber and not phonenumbers.is_valid_number(phonenumbers.parse(cstphonenumber, "CO")):
                session['cstBackup'] = form.data
                flash("Telefono Invalido", "error")  
                return redirect("/customer")
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_customer WHERE cst_phone_number = %s", (cstphonenumber,))
            if cstphonenumber and cursor.fetchone():
                session['cstBackup'] = form.data
                flash("Numero de Telefono Duplicado", "error")  
                return redirect("/customer")
            cursor.execute("INSERT INTO t_customer (cst_id, cst_name, cst_lastname, cst_phone_number) VALUES (%s, %s, %s, %s)", (cstid, cstname, cstlastname, cstphonenumber,))
            cursor.connection.commit()
            flash("Registro Exitoso", "success")
            return redirect("/customer")
    except NumberParseException:
        session['cstBackup'] = form.data
        flash("Telefono Invalido", "error")  
        return redirect("/customer")
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as Error:
        print(Error)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@customer_bp.route("/customer/<cst_id>", methods = ["POST"])
@token
def putCustomer(cst_id):
    if request.referrer and '/customer' not in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        cstname = (request.form["cst_name"]).strip()
        cstlastname = (request.form["cst_lastname"]).strip()
        cstphonenumber = (request.form["cst_phone_number"]).strip()
        if not phonenumbers.is_valid_number(phonenumbers.parse(cstphonenumber, "CO")):
            flash("Telefono Invalido", "error")  
            return redirect("/customer")
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_customer WHERE cst_phone_number = %s AND cst_id != %s", (cstphonenumber, cst_id,))
        if cursor.fetchone():
            flash("Numero de Telefono Duplicado", "error")  
            return redirect("/customer")
        cursor.execute("UPDATE t_customer SET cst_name = %s, cst_lastname= %s, cst_phone_number= %s WHERE cst_id = %s", (cstname, cstlastname, cstphonenumber, cst_id,))
        cursor.connection.commit()
        flash("Cliente Actualizado", "success")
        return redirect("/customer")
    except NumberParseException:
        flash("Telefono Invalido", "error")  
        return redirect("/customer")
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as Error:
        print(Error)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")
