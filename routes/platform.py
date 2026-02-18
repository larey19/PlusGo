from flask import Blueprint, redirect, request, flash, render_template, current_app, session
from .auth import token
from MySQLdb import OperationalError, IntegrityError
from .wtf import plaForm
import uuid
platform_bp = Blueprint("platform", __name__, template_folder= "../layouts")

@platform_bp.route("/platform", methods = ["POST"])
@token
def crtPlatform():
    try:
        form = plaForm()
        if form.validate_on_submit():
            plaid = uuid.uuid4()
            planame = form.planame.data
            plaprofiles = form.plaprofiles.data
            
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("INSERT INTO t_platform (pla_id, pla_name, pla_profiles) VALUES (%s, %s, %s)", (plaid, planame, plaprofiles))
            cursor.connection.commit()
            flash ("Registro Exitoso", "success")
            return redirect("/platform")
    except IntegrityError:
        session['plaBackup'] = form.data
        flash("Plataforma Duplicada", "error")  
        return redirect("/platform")
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception:
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@platform_bp.route("/platform")
@token
def getPlatform():
    try:
        plaBackup = session.pop("plaBackup", {})
        form = plaForm(data = plaBackup)
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_platform ORDER BY pla_name ASC")
        platform = cursor.fetchall()
        return render_template("platform.html", platform = platform, form = form)
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception:
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@platform_bp.route("/platform/<pla_id>", methods = ["POST"])
@token
def putPlatform(pla_id):
    if request.method == "POST":
        try:
            planame = (request.form["pla_name"]).strip()
            plaprofiles = (request.form["pla_profiles"]).strip()            
            if not planame or not plaprofiles:
                flash("Ingresa toda la informacion", "error")
                return redirect("/platform")
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_platform WHERE pla_id = %s", (pla_id,))
            if not cursor.fetchone():
                return render_template("404.html")
            cursor.execute("UPDATE t_platform SET pla_name = %s, pla_profiles = %s WHERE pla_id = %s", (planame,plaprofiles, pla_id))
            cursor.connection.commit()
            flash ("Actualizacion Exitosa", "success")
            return redirect("/platform")
        except IntegrityError:
            flash("Plataforma Duplicada", "error")  
            return redirect("/platform")
        except OperationalError as e:
            print ("error ", e)
            flash("Conexion fallida, Intenta más tarde.", "error")
            return render_template("500.html")
        except Exception as e:
            print ("ERor ", e)
            flash("Ocurrio un error, Intenta más tarde.", "error")
            return render_template("500.html")
