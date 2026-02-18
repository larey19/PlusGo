from flask import Blueprint, redirect, request, flash, render_template, current_app, session, url_for
from .auth import token
from MySQLdb import OperationalError
from .wtf import proForm
import uuid

profile_bp = Blueprint("profile", __name__, template_folder="../layouts")


@profile_bp.route("/profile/<acc_id>")
@token
def getProfile(acc_id):
    if request.referrer and '/profile' not in request.referrer:
        session.clear()
        session["url_back_get"] = request.referrer 
    try:
        proBackup = session.pop("proBackup", {})
        form = proForm(data = proBackup)
        form.accid.data = acc_id
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT t_profile.* FROM t_profile JOIN t_account ON t_profile.acc_id = t_account.acc_id  WHERE t_account.acc_id = %s ORDER BY t_profile.pro_profile ASC", (acc_id,))
        profile = cursor.fetchall()
        return render_template("profile.html", profile = profile, form = form)
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@profile_bp.route("/profile", methods = ["POST"])
@token
def crtProfile():
    if request.referrer and '/profile' not in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        form = proForm()
        if request.method == "POST":
            proid = uuid.uuid4()
            proprofile =  form.proprofile.data
            propin =  form.propin.data
            accid = form.accid.data
            if not proprofile or not accid:
                session['proBackup'] = form.data
                flash("Ingrese toda la informaicon requerida", "error")  
                return redirect(url_for("profile.getProfile", acc_id = accid))
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_profile WHERE pro_profile = %s AND acc_id = %s", (proprofile, accid,))
            if cursor.fetchone():
                session['proBackup'] = form.data
                flash("Perfil Duplicado", "error")  
                return redirect(url_for("profile.getProfile", acc_id = accid))
            cursor.execute("""SELECT t_platform.pla_profiles 
                                FROM t_platform 
                                JOIN t_account ON t_platform.pla_id = t_account.pla_id 
                                JOIN t_profile ON t_profile.acc_id = t_account.acc_id
                                WHERE t_account.acc_id = %s""",(accid,))
            profilesMax = cursor.fetchone()
            cursor.execute("SELECT * FROM t_account JOIN t_profile ON t_account.acc_id = t_profile.acc_id WHERE t_profile.acc_id = %s",(accid,))
            profilesData = cursor.fetchall()
            if profilesMax and profilesMax[0] <= len(profilesData):
                session['proBackup'] = form.data
                flash("No se pueden agregar más perfiles", "error")  
                return redirect(url_for("profile.getProfile", acc_id = accid))
            cursor.execute("""INSERT INTO t_profile (
                pro_id,
                pro_profile, 
                pro_state, 
                pro_pin_profile,
                acc_id) 
                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s)""",
                    (proid,
                    proprofile,
                    'enable',
                    propin,
                    accid,))
            cursor.connection.commit()
            flash("Registro Exitoso", "success")
            return redirect(url_for("profile.getProfile", acc_id = accid))
    except OperationalError as e:
        print("error ", e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as Error:
        print(Error)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")
 
@profile_bp.route("/profile/<pro_id>", methods = ["POST"])
@token
def putProfile(pro_id):
    if request.referrer and '/profile' in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        proprofile = (request.form["pro_profile"]).strip()
        propin   = (request.form["pro_pin_profile"]).strip()
        prostate = (request.form["pro_state"]).strip()
        accid = (request.form["acc_id"]).strip()
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_profile WHERE pro_id = %s", (pro_id,))
        if not cursor.fetchone():
            return render_template("404.html")
        
        if prostate not in ["enable", "disable", "pending"]:
            flash("Estado Invalido","error")
            return redirect(session.get('url_back_post'))
        
        cursor.execute("SELECT * FROM t_sale WHERE pro_id = %s AND sal_state = %s", (pro_id, 'active',))
        if cursor.fetchone():
            flash("Venta activa con este perfil","error")
            return redirect(session.get('url_back_post'))

        
        cursor.execute("SELECT * FROM t_profile WHERE pro_profile = %s AND pro_id != %s AND acc_id = %s", (proprofile, pro_id, accid,))
        if cursor.fetchone():
            flash("Perfil Duplicado", "Error")  
            return redirect(session.get('url_back_post'))

        cursor.execute("""UPDATE t_profile SET
            pro_profile =  %s, 
            pro_state = %s,
            pro_pin_profile =  %s
            WHERE pro_id = %s""",
                (proprofile,
                prostate,
                propin,
                pro_id,))
        cursor.connection.commit()
        flash("Perfil Actualizado", "success")
        return redirect(session.get('url_back_post'))
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception:
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")