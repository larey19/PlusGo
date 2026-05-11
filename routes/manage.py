from flask import Blueprint, current_app, redirect, request, flash, url_for, render_template, session
from MySQLdb import OperationalError
from .utils.auth import token
from .utils.wtf import mngForm
import uuid
from email_validator import validate_email,  EmailNotValidError

manage_bp = Blueprint("manage", __name__, template_folder="../templates")

@manage_bp.route("/manage")
@token
def getManage():
    try:
        mngBackup = session.pop("mngBackup", {})
        form = mngForm(data=mngBackup)
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT pla_name FROM t_platform ORDER BY pla_name ASC")
        platforms = cursor.fetchall()
        form.mngfrom.choices = [(pla[0].lower(), pla[0]) for pla in platforms]
        
        cursor.execute("SELECT acc_email FROM t_account  WHERE acc_email  LIKE '%gmail%' OR acc_email LIKE '%hotmail%' OR acc_email LIKE '%outlook%' OR acc_email LIKE '%icloud%' GROUP BY acc_email ORDER BY acc_email ASC")
        account = cursor.fetchall()
        form.mngemail.choices = [(acc[0], acc[0]) for acc in account]
        
        cursor.execute("""
                SELECT * FROM t_manage ORDER BY mng_email
            """)
        data =[{
            "mng_id" : mng[0],
            "mng_email" : mng[1],
            "mng_imap" : mng[2],
            "mng_password" : mng[3],
            "mng_from" : mng[4],
            "mng_state" : mng[5]
            }for mng in cursor.fetchall()]
        return render_template("manage.html", data = data, form = form)
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@manage_bp.route("/manage", methods= ["POST"])
def crtManage():                  
    try:
        form = mngForm()
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT pla_name FROM t_platform ORDER BY pla_name ASC")
        platforms = cursor.fetchall()
        form.mngfrom.choices = [(pla[0].lower(), pla[0]) for pla in platforms]
        
        
        cursor.execute("SELECT acc_email FROM t_account  WHERE acc_email  LIKE '%gmail%' OR acc_email LIKE '%hotmail%' OR acc_email LIKE '%outlook%' OR acc_email LIKE '%icloud%' GROUP BY acc_email ORDER BY acc_email ASC")
        account = cursor.fetchall()
        form.mngemail.choices = [(acc[0], acc[0]) for acc in account]

        if form.validate_on_submit():
            mngid = uuid.uuid4()
            mngemail = (form.mngemail.data).strip()
            mngimap = (form.mngimap.data).strip()
            mngpassword = ((form.mngpassword.data).strip().replace(" ", ""))
            mngfrom = form.mngfrom.data
            validate_email(mngemail)
            if len(mngpassword) > 16:
                session["mngBackup"] = form.data
                flash("Clave de App invalida", "error")
                return redirect(url_for("manage.getManage"))        
            cursor.execute("SELECT * FROM t_manage WHERE mng_email = %s", (mngemail,))
            if cursor.fetchone():
                session["mngBackup"] = form.data
                flash("Correo Duplicado", "error")
                return redirect(url_for("manage.getManage"))
            cursor.execute("""
                            INSERT INTO t_manage (mng_id, mng_email, mng_imap, mng_password, mng_from) VALUES
                            (%s,%s,%s,%s,%s)
                            """,(mngid, mngemail, mngimap, mngpassword, ", ".join(mngfrom)))
            cursor.connection.commit()
            flash ("Registro Exitoso", "success")
            return redirect(url_for("manage.getManage"))
        session["mngBackup"] = form.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(url_for("manage.getManage"))
    except EmailNotValidError:
        session["mngBackup"] = form.data
        flash("Correo invalido", "error")
        return redirect(url_for("manage.getManage"))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@manage_bp.route("/manage/<mng_id>", methods= ["POST"])
def putManage(mng_id):
    try:
        form = mngForm()
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT pla_name FROM t_platform ORDER BY pla_name ASC")
        platforms = cursor.fetchall()
        form.mngfrom.choices = [(pla[0].lower(), pla[0]) for pla in platforms]
        
        
        cursor.execute("SELECT acc_email FROM t_account  WHERE acc_email  LIKE '%gmail%' OR acc_email LIKE '%hotmail%' OR acc_email LIKE '%outlook%' OR acc_email LIKE '%icloud%' GROUP BY acc_email ORDER BY acc_email ASC")
        account = cursor.fetchall()
        form.mngemail.choices = [(acc[0], acc[0]) for acc in account]
        
        if request.method == "POST":
            mngemail = (form.mngemail.data).strip()
            mngimap = (form.mngimap.data).strip()
            mngfrom = form.mngfrom.data
            if not mngemail or not mngimap or not mngfrom:
                flash("Ingresa toda la información requerida", "error")
                return redirect(url_for("manage.getManage"))
            validate_email(mngemail)
            cursor.execute("SELECT * FROM t_manage WHERE mng_id = %s", (mng_id,))
            if not cursor.fetchone():
                flash("Correo no encontrado", "error")
                return redirect(url_for("manage.getManage"))
            cursor.execute("SELECT * FROM t_manage WHERE mng_email = %s AND mng_id != %s", (mngemail, mng_id,))
            if cursor.fetchone():
                flash("Correo Duplicado", "error")
                return redirect(url_for("manage.getManage"))
            cursor.execute("""
                            UPDATE t_manage SET mng_email = %s, mng_imap = %s, mng_from = %s WHERE mng_id = %s
                            """,(mngemail, mngimap, ", ".join(mngfrom), mng_id))
            cursor.connection.commit()
            flash ("Actualizacion Exitosa", "success")
            return redirect(url_for("manage.getManage"))
    except EmailNotValidError:
        flash("Correo invalido", "error")
        return redirect(url_for("manage.getManage"))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@manage_bp.route("/manage/password/<mng_id>", methods= ["POST"])
def putPassword(mng_id):
    try:
        form = mngForm()
        if request.method=="POST":
            mngpassword = ((form.mngpassword.data).strip().replace(" ", ""))
            if len(mngpassword) < 10:
                flash("Clave de App invalida", "error")
                return redirect(url_for("manage.getManage"))
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("""
                            UPDATE t_manage SET mng_password = %s WHERE mng_id = %s
                            """,(mngpassword, mng_id,))
            cursor.connection.commit()
            flash ("Clave Actualizada", "success")
            return redirect(url_for("manage.getManage"))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@manage_bp.route("/manage/state/<mng_state>/<mng_id>")
def putState(mng_state, mng_id):
    try:
        mng_state = 'active' if mng_state == 'inactive' else 'inactive'
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("""
                        UPDATE t_manage SET mng_state = %s WHERE mng_id = %s
                        """,(mng_state, mng_id,))
        cursor.connection.commit()
        flash ("Estado Actualizado Correctamente", "success")
        return redirect(url_for("manage.getManage"))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

