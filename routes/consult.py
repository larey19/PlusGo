from flask import Blueprint, current_app, redirect, request, flash, url_for, render_template, session
from MySQLdb import OperationalError
from .utils.consult import code
from .utils.auth import token
from .utils.wtf import csltForm


consult_bp = Blueprint("consult", __name__, template_folder="../templates")


@consult_bp.route("/consult")
def consult():
    try:
        csltBackup = session.pop("csltBackup", {})
        form = csltForm(data = csltBackup)
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT mng_email FROM t_manage WHERE mng_state = 'active' GROUP BY mng_email ORDER BY mng_email ASC")
        manage = cursor.fetchall()
        form.csltemail.choices = [(mng[0], mng[0]) for mng in manage]
        return render_template("consult.html", form = form)
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@consult_bp.route("/consult", methods=["POST"])
@token
def getConsult():
    try:
        form = csltForm()
        if request.method == "POST":
            csltemail = form.csltemail.data
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("""
                SELECT * FROM t_manage WHERE mng_email = %s AND mng_state = 'active'
            """, (csltemail,))
            data = cursor.fetchall()
            if not data:
                session["csltBackup"] = form.data
                flash("Correo no Registrado o Inactivo", "info")
                return redirect(url_for("consult.consult"))
            result = []
            for mng in data:
                for From in mng[4].split(", "):
                    rst = code((mng[1]).strip(),(mng[2]).strip(), (mng[3]).strip(), (From).strip())
                    for r in rst:
                        result.append(r)
            if result:
                flash("Consulta Exitosa", "succes")
                return render_template("consult.html", result = result, form = form)

            session["csltBackup"] = form.data
            flash("Ningun correo encontrado", "info")
            return redirect(url_for("consult.consult"))
        flash("Ingrese el correo", "error")
        session["csltBackup"] = form.data
        return redirect(url_for("consult.consult"))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")
