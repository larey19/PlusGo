from flask import Blueprint, redirect, flash, render_template, current_app, session, abort
from .utils.auth import token, permission
from MySQLdb import OperationalError, IntegrityError
from .utils.wtf import plaForm
import uuid
platform_bp = Blueprint("platform", __name__, template_folder= "../templates")



@platform_bp.route("/platform")
@token
@permission("platforms.view")
def getPlatform():
    try:
        plaBackup = session.pop("plaBackup", {})
        form = plaForm(data = plaBackup)
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_platform ORDER BY pla_name ASC")
        platform = cursor.fetchall()
        return render_template("platform.html", platform = platform, form = form)
    except OperationalError as e:
        print ("error en plataformas ", e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return abort(500)
    except Exception as e:
        print ("Error  en plataformas ", e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)

@platform_bp.route("/platform", methods = ["POST"])
@token
@permission("platforms.create")
def crtPlatform():
    try:
        form = plaForm()
        if form.validate_on_submit():
            plaid = uuid.uuid4()
            planame = (form.planame.data).strip()
            plaprofiles = form.plaprofiles.data
            plamessage = (form.plamessage.data).strip()
            
            if len(planame) > 50 or plaprofiles > 11 or len(plamessage) > 10000:
                session['plaBackup'] = form.data
                flash ("Supero Limite de caracteres", "error")
                return redirect("/platform")
            
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("INSERT INTO t_platform (pla_id, pla_name, pla_profiles, pla_message) VALUES (%s, %s, %s, %s)", (plaid, planame, plaprofiles, plamessage))
            cursor.connection.commit()
            flash ("Registro Exitoso", "success")
            return redirect("/platform")
    except IntegrityError:
        session['plaBackup'] = form.data
        flash("Plataforma Duplicada", "error")  
        return redirect("/platform")
    except OperationalError as e:
        print ("error en plataformas ", e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return abort(500)
    except Exception as e:
        print ("Error  en plataformas ", e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)


@platform_bp.route("/platform/<pla_id>", methods = ["POST"])
@token
@permission("platforms.edit")
def putPlatform(pla_id):
    try: 
        form = plaForm()
        if form.validate_on_submit():
            planame = (form.planame.data).strip()
            plaprofiles = form.plaprofiles.data
            plamessage = (form.plamessage.data).strip()
            
            if len(planame) > 50 or plaprofiles > 11 or len(plamessage) > 10000:
                flash ("Supero Limite de caracteres", "error")
                return redirect("/platform")
            
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_platform WHERE pla_id = %s", (pla_id,))
            if not cursor.fetchone():
                flash("Plataforma no Encontrada", "error")  
                return redirect("/platform")
            
            cursor.execute("""
                            SELECT count(p.pro_profile)
                            FROM t_account a
                            INNER JOIN t_profile p ON p.acc_id = a.acc_id 
                            WHERE a.pla_id = %s""", 
                            (pla_id,)
                        )
            for p in cursor.fetchall():
                if plaprofiles < p:
                    flash("Una o mas cuentas superan el limite de perfiles permitidos", "error")  
                    return redirect("/platform")
            
            cursor.execute("UPDATE t_platform SET pla_name = %s, pla_profiles = %s, pla_message = %s WHERE pla_id = %s", (planame,plaprofiles,plamessage, pla_id,))
            cursor.connection.commit()
            flash ("Actualizacion Exitosa", "success")
            return redirect("/platform")
        session["plaBackup"] = form.data
        flash("Ingresa toda la informacion", "error")
        return redirect("/platform")
    except IntegrityError:
        session["plaBackup"] = form.data
        flash("Plataforma Duplicada", "error")  
        return redirect("/platform")
    except OperationalError as e:
        print ("error en plataformas ", e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return abort(500)
    except Exception as e:
        print ("Error  en plataformas ", e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)
