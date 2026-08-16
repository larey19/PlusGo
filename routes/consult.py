from flask import Blueprint, current_app, redirect, request, flash, url_for, render_template, session, abort
from MySQLdb import OperationalError
from .utils.consult import code
from .utils.auth import token, permission
from .utils.wtf import csltForm


consult_bp = Blueprint("consult", __name__, template_folder="../templates")


@consult_bp.route("/consult")
@token
@permission("codes.consult")
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
        return abort(500)

@consult_bp.route("/consult", methods=["POST"])
@token
@permission("codes.consult")
def getConsult():
    try:
        form = csltForm()
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT mng_email FROM t_manage WHERE mng_state = 'active' ORDER BY mng_email ASC")
        manage = cursor.fetchall()
        form.csltemail.choices = [(mng[0], mng[0]) for mng in manage]

        if form.validate_on_submit():
            csltemail = form.csltemail.data
            cursor.execute("""
                SELECT * FROM t_manage WHERE mng_email = %s AND mng_state = 'active'
            """, (csltemail,))
            data = cursor.fetchall()
            if not data:
                flash("Correo no Registrado o Inactivo", "info")
                return redirect(url_for("consult.consult"))

            result = []
            for mng in data:
                for From in mng[4].split(", "):
                    try:
                        rst = code(mng[1].strip(), mng[2].strip(), mng[3].strip(), From)
                        result.extend(rst)
                    except Exception as e:
                        flash("No se pudo conectar, revisar las credenciales", "error")
                        return redirect(url_for("consult.consult"))
            if result:
                result.sort(key=lambda r: r["FECHA"], reverse=True)
                result_json = [
                    {
                        "de": r["DE"].split(" ")[0],
                        "asunto" : r["ASUNTO"],
                        "fecha": r["FECHA"].strftime("%d/%m/%Y %H:%M"),
                        "cuerpo": r["CUERPO"],
                    }
                    for r in result
                ]
                
                session["csltBackup"] = form.data
                return render_template("consult.html", form=form, result=result_json)
            session["csltBackup"] = form.data
            flash("Ningún correo encontrado", "info")
            return redirect(url_for("consult.consult"))
        session["csltBackup"] = form.data
        flash("Selecciona un correo válido.", "info")
        return redirect(url_for("consult.consult"))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")