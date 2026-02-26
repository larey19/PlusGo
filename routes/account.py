from flask import Blueprint, redirect, request, flash, render_template, current_app, url_for, session
from .auth import token
from email_validator import validate_email, EmailNotValidError
import phonenumbers
from phonenumbers import NumberParseException
from MySQLdb.cursors import DictCursor 
from MySQLdb import OperationalError 
from datetime import datetime
from .wtf import accForm
import uuid
account_bp = Blueprint("account", __name__, template_folder= "../layouts")
    
def backup(form):
    backup = form.data.copy()
    backup['accdatepay'] = backup['accdatepay'].strftime("%Y-%m-%d")
    session["accBackup"] = backup

@account_bp.context_processor
def lcl_Cst_Pla():
    try:
        cursor = current_app.mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT pla_id FROM t_platform")
        pla_id = cursor.fetchone()
        return dict(
            pla_id=pla_id
        )
    except Exception as e:
        print(e)
        return dict(customer=[])
@account_bp.route("/account", methods = ["POST"])
@token
def crtAccount():
    try:
        form = accForm()
        if request.method == "POST":
            accid = uuid.uuid4()
            accnickname = form.accnickname.data
            accprovider =form.accprovider.data
            accdatepay = form.accdatepay.data
            accemail = form.accemail.data
            accnumberphone = form.accnumberphone.data
            accpassword = form.accpassword.data
            plaid = form.plaid.data
            if not accnickname or not accdatepay or not accprovider or not plaid or not (accnumberphone or accemail):
                backup(form)
                flash("Ingrese toda la informacion requerida", "error")      
                return redirect(url_for("account.getAccount", pla_id = plaid))  
            if accemail:
                validate_email(accemail)
            if accnumberphone and not phonenumbers.is_valid_number(phonenumbers.parse(accnumberphone, "CO")):
                backup(form)
                flash("Telefono Invalido", "error")  
                return redirect(url_for("account.getAccount", pla_id = plaid)) 
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT acc_email FROM t_account WHERE acc_email = %s AND pla_id = %s", (accemail, plaid,))
            sql = cursor.fetchone()
            if accemail and sql:
                backup(form)
                flash("Correo duplicado en esta plataforma", "error")      
                return redirect(url_for("account.getAccount", pla_id = plaid))  
            cursor.execute("SELECT acc_nickname FROM t_account WHERE acc_nickname = %s AND pla_id = %s", (accnickname, plaid,))
            sql = cursor.fetchone()
            if sql:
                backup(form)
                flash("Apodo duplicado en esta plataforma", "error")
                return redirect(url_for("account.getAccount", pla_id = plaid))       
            cursor.execute("""INSERT INTO t_account (
                acc_id, 
                acc_nickname, 
                acc_provider, 
                acc_date_pay, 
                acc_email, 
                acc_number_phone, 
                acc_password, 
                acc_state,
                pla_id) 
                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s)""", (
                        accid, 
                        accnickname, 
                        accprovider, 
                        accdatepay, 
                        accemail, 
                        accnumberphone, 
                        accpassword,
                        'enable',
                        plaid,))
            cursor.connection.commit()
            flash("Registro Exitoso", "success")
            return redirect(url_for("account.getAccount", pla_id = plaid))
    except NumberParseException:
        backup(form)
        flash("Telefono Invalido", "error")  
        redirect(session.get('url_back_post'))
    except EmailNotValidError:
        backup(form)
        flash("Correo invalido", "error")
        return redirect(url_for("account.getAccount", pla_id = plaid))
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@account_bp.route("/account/<acc_id>", methods = ["POST"])
@token
def putAccount(acc_id):
    if request.referrer and '/account' in request.referrer:
        session.clear()
        session["url_back_post"] = request.referrer
    try:
        accnickname = (request.form["acc_nickname"]).strip()
        accprovider = (request.form["acc_provider"]).strip()
        accdatepay = (request.form["acc_date_pay"]).strip()
        accemail = (request.form["acc_email"]).strip()        
        accnumberphone = (request.form["acc_number_phone"]).strip()
        accpassword = (request.form["acc_password"]).strip()
        plaid = (request.form["pla_id"]).strip()
        if not accnickname or not accprovider or not accdatepay:
            flash("Ingrese toda la informacion requerida", "error")
            return redirect(session.get('url_back_post'))
        if accemail:
            validate_email(accemail) 
        if accnumberphone and not phonenumbers.is_valid_number(phonenumbers.parse(accnumberphone, "CO")):
            flash("Telefono Invalido", "error")  
            return  redirect(session.get('url_back_post')) 
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_account WHERE acc_id = %s", (acc_id,))
        data = cursor.fetchone()
        if not data:
            return render_template("404.html")
        cursor.execute("SELECT acc_email FROM t_account WHERE acc_email = %s AND pla_id = %s AND acc_id != %s", (accemail, plaid, acc_id,))
        sql = cursor.fetchone()
        if accemail and sql:
            flash("Correo duplicado en esta plataforma", "error")      
            return redirect(session.get('url_back_post')) 

        cursor.execute("SELECT acc_nickname FROM t_account WHERE acc_nickname = %s AND pla_id = %s AND acc_id != %s", (accnickname, plaid, acc_id,))
        sql = cursor.fetchone()
        if sql:
            flash("Apodo duplicado en esta plataforma", "error")
            return redirect(session.get('url_back_post'))     
        cursor.execute("""UPDATE t_account SET 
            acc_nickname     = %s, 
            acc_provider     = %s, 
            acc_date_pay     = %s, 
            acc_password     = %s,
            acc_email        = %s,
            acc_number_phone = %s
            WHERE acc_id     = %s""", (
                    accnickname, 
                    accprovider, 
                    accdatepay,
                    accpassword, 
                    accemail, 
                    accnumberphone, 
                    acc_id))
        cursor.connection.commit()
        flash("Actualizacion Exitosa", "success")
        return redirect(session.get('url_back_post'))
    
    except NumberParseException:
        flash("Telefono Invalido", "error")  
        redirect(session.get('url_back_post'))  
    except EmailNotValidError:
        flash("Correo invalido", "error")
        return redirect(session.get('url_back_post'))
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception:
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@account_bp.route("/account/state/<acc_id>")
@token
def putState(acc_id):
    if request.referrer and '/account' in request.referrer:
        session.clear()
        session["url_back_post"] = request.referrer
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT acc_state, pla_id FROM t_account WHERE acc_id = %s", (acc_id,))
        data = cursor.fetchone()
        if not data:
            return render_template("404.html")
        accstate = "disable" if data[0] == "enable" else "enable" 
        cursor.execute("""SELECT t_profile.pro_id FROM t_account 
                        JOIN t_profile ON t_account.acc_id = t_profile.acc_id
                        WHERE t_account.acc_id = %s""", (acc_id,))
        data = cursor.fetchall()
        for pro_id in data:
            cursor.execute("SELECT sal_state FROM t_sale WHERE pro_id = %s", (pro_id,))
            if cursor.fetchone():
                flash("Error al modificar estado de la cuenta", "info")
                return redirect(session.get('url_back_post'))
        for pro_id in data:
            cursor.execute("UPDATE t_profile SET pro_state = %s WHERE pro_id = %s", ('disable', pro_id,))
        cursor.execute("UPDATE t_account SET acc_state = %s WHERE acc_id = %s", (accstate, acc_id,))
        cursor.connection.commit()
        flash("Estado de cuenta mofidicado", "info")
        return redirect(session.get('url_back_post'))
    
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception:
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@account_bp.route("/account/<pla_id>")
@token
def getAccount(pla_id):
    try:
        accBackup = session.pop("accBackup", {})
        if accBackup.get('accdatepay'):
            accBackup['accdatepay'] = datetime.strptime(accBackup['accdatepay'], '%Y-%m-%d').date()
        form = accForm(data = accBackup)
        form.plaid.data = pla_id
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT pla_name FROM t_platform WHERE pla_id = %s",(pla_id,))
        pla_name = cursor.fetchone()
        cursor.execute("SELECT * FROM t_account JOIN t_platform ON t_account.pla_id = t_platform.pla_id WHERE t_platform.pla_id = %s ORDER BY t_account.acc_state DESC,  t_account.acc_nickname ASC", (pla_id,))
        account = cursor.fetchall()
        return render_template("account.html", account = account, form = form, pla_name = pla_name[0])
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html") 
