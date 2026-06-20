from flask import Blueprint, redirect, request, flash, render_template, current_app, session, jsonify
from .utils.auth import token
from MySQLdb import OperationalError
from .utils.wtf import proForm
import uuid

profile_bp = Blueprint("profile", __name__, template_folder="../templates")

@profile_bp.route("/profile/<acc_id>")
@token
def getProfile(acc_id):
    if request.referrer and '/profile' not in request.referrer:
        session["url_back_get"] = request.referrer 
    try:
        proBackup = session.pop("proBackup", {})
        form = proForm(data = proBackup)
        form.accid.data = acc_id
        
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT acc_nickname FROM t_account WHERE acc_id = %s", (acc_id,))
        acc_name = cursor.fetchone()
        cursor.execute("SELECT t_profile.* FROM t_profile JOIN t_account ON t_profile.acc_id = t_account.acc_id  WHERE t_account.acc_id = %s ORDER BY t_profile.pro_profile ASC", (acc_id,))
        profile = cursor.fetchall()
        
        return render_template("profile.html", profile = profile, form = form, acc_name = acc_name[0])
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
    if request.referrer and '/profile' in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        form = proForm()
        form.prostate.data = 'enable' #solo es para que no arroje 'Not a valid choice'
        if form.validate_on_submit():
            proid = uuid.uuid4()
            proprofile =  (form.proprofile.data).strip()
            propin =  (form.propin.data).strip()
            accid = (form.accid.data).strip()

            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_profile WHERE pro_profile = %s AND acc_id = %s", (proprofile, accid,))
            if cursor.fetchone():
                session['proBackup'] = form.data
                flash("Perfil Duplicado", "error")  
                return redirect(session.get('url_back_post'))
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
                return redirect(session.get('url_back_post'))
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
            return redirect(session.get('url_back_post'))
        print(form.data)
        print(form.errors)
        session['proBackup'] = form.data
        flash("Ingrese toda la informaicon requerida", "error")  
        return redirect(session.get('url_back_post'))
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
        form = proForm()
        if form.validate_on_submit():
            proprofile =  (form.proprofile.data).strip()
            propin =  (form.propin.data).strip()
            accid = (form.accid.data).strip()
            prostate = (form.prostate.data).strip()
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_profile WHERE pro_id = %s", (pro_id,))
            if not cursor.fetchone():
                flash("Perfil no encontrado", "error")
                return redirect(session.get('url_back_post'))
            
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
        session['proBackup'] = form.data
        flash("Ingrese toda la informaicon requerida", "error")  
        return redirect(session.get('url_back_post'))
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@profile_bp.route("/profile/delete/<pro_id>")
def dltProfile(pro_id):
    if request.referrer and '/profile' in request.referrer:
        session["url_back_delete"] = request.referrer 
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_profile WHERE pro_id = %s", (pro_id,))
        if not cursor.fetchone():
            flash("Perfil no encontrado", "error")
            return render_template("404.html")
        cursor.execute("SELECT * FROM t_sale WHERE pro_id = %s AND sal_state = %s", (pro_id, 'active',))
        if cursor.fetchone():
            flash("Venta activa con este perfil","error")
            return redirect(session.get('url_back_delete'))
        cursor.execute("DELETE FROM t_profile WHERE pro_id = %s", (pro_id,))
        cursor.connection.commit()
        flash("Perfil Eliminado", "info")
        return redirect(session.get('url_back_delete'))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")
    
# =================================================== API PROFILES

@profile_bp.route("/get/profile/<acc_id>")
@token
def getApiProfile(acc_id):
    try:
        if acc_id:
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_profile WHERE acc_id = %s ORDER BY pro_profile ASC", (acc_id,))
            profile = cursor.fetchall()
            return [{
                "pro_id" : x[0],
                "pro_profile" : x[1],
                "pro_pin_profile" : x[3],
                "pro_state" : x[2],
                "acc_id" : x[4]
            }for x in profile]
        return jsonify({
                "error": "Cuenta no encontrada" 
            }), 404
    except OperationalError as e: 
        print("error en get", e)
        return jsonify({
            "status": "error",
            "mensaje": "Conexión fallida con la base de datos. Intenta más tarde."
        }), 500
    except Exception as e:
        print("error en get", e)
        return jsonify({
            "status": "error",
            "mensaje": "Ocurrió un error interno en el servidor. Intenta más tarde."
        }), 500

@profile_bp.route("/create/profile/<acc_id>", methods = ["POST"])
@token
def crtApiProfile(acc_id):
    try:
        data = request.get_json(silent=True)  
        if data is None:
            return jsonify({"error": "Error en la formacion del JSON"}), 400
        if request.method == 'POST' and 'proprofile' in request.json and 'propin' in request.json:
            proid = uuid.uuid4()
            proprofile =  (request.json['proprofile']).strip()
            propin =  (request.json['propin']).strip()

            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT * FROM t_profile WHERE pro_profile = %s AND acc_id = %s", (proprofile, acc_id,))
            if cursor.fetchone():
                return jsonify({"error": "Perfil Duplicado"}), 409  
            
            cursor.execute("""SELECT t_platform.pla_profiles 
                                FROM t_platform 
                                JOIN t_account ON t_platform.pla_id = t_account.pla_id 
                                JOIN t_profile ON t_profile.acc_id = t_account.acc_id
                                WHERE t_account.acc_id = %s""",(acc_id,))
            profilesMax = cursor.fetchone()
            cursor.execute("""SELECT * FROM t_account 
                            JOIN t_profile ON t_account.acc_id = t_profile.acc_id 
                            WHERE t_profile.acc_id = %s""",(acc_id,))
            profilesData = cursor.fetchall()
            if profilesMax and profilesMax[0] <= len(profilesData):
                return jsonify({"error": "No se pueden crear mas perfiles"}), 400 
            
            
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
                    acc_id,))
            cursor.connection.commit()
            return jsonify({"success": "Registro Exitoso"}), 200
        return jsonify({"error": "Ingrese toda la informacion requerida"}), 401
    except OperationalError as e:
        print("error en crt", e)
        return jsonify({
            "status": "error",
            "mensaje": "Conexión fallida con la base de datos. Intenta más tarde."
        }), 500
    except Exception as e:
        print("error en crt", e)
        return jsonify({
            "status": "error",
            "mensaje": "Ocurrió un error interno en el servidor. Intenta más tarde."
        }), 500

@profile_bp.route("/update/profile/<pro_id>", methods = ["POST"])
@token
def updApiProfile(pro_id):
    try:
        data = request.get_json(silent=True)  
        if data is None:
            return jsonify({"error": "Error en la formacion del JSON"}), 400
        if request.method == 'POST' and 'proprofile' in request.json and 'propin' in request.json and 'prostate' in request.json and 'acc_id' in request.json:
            proprofile =  (request.json['proprofile']).strip()
            propin =  (request.json['propin']).strip()
            prostate =  (request.json['prostate']).strip()
            acc_id =  (request.json['acc_id']).strip()

            cursor = current_app.mysql.connection.cursor()

            if prostate not in ["enable", "disable", "pending"]:
                return jsonify({"error":"Estado Invalido"}), 409
            
            cursor.execute("SELECT * FROM t_profile WHERE  pro_id = %s", (pro_id,))
            if not cursor.fetchone():
                return jsonify({"error":"Perfil no encontrado"}), 404
            
            
            cursor.execute("SELECT * FROM t_profile WHERE pro_profile = %s AND pro_id != %s AND acc_id = %s", (proprofile, pro_id, acc_id,))
            if cursor.fetchone():
                return jsonify({"error": "Perfil Duplicado"}), 409  
            
            cursor.execute("SELECT * FROM t_sale WHERE pro_id = %s AND sal_state = %s", (pro_id, 'active',))
            if cursor.fetchone():
                return jsonify({"error":"Venta activa con este perfil"}), 422
            
            
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
            return jsonify({"success": "Actualizacion Exitosa"}), 200
        return jsonify({"error": "Ingrese toda la informacion requerida"}), 404
    except OperationalError as e:
        print("error en crt", e)
        return jsonify({
            "status": "error",
            "mensaje": "Conexión fallida con la base de datos. Intenta más tarde."
        }), 500
    except Exception as e:
        print("error en crt", e)
        return jsonify({
            "status": "error",
            "mensaje": "Ocurrió un error interno en el servidor. Intenta más tarde."
        }), 500

@profile_bp.route("/delete/profile/<pro_id>")
@token
def delApiProfile(pro_id):
    try:
        cursor = current_app.mysql.connection.cursor()
        
        cursor.execute("SELECT * FROM t_profile WHERE  pro_id = %s", (pro_id,))
        if not cursor.fetchone():
            return jsonify({"error":"Perfil no encontrado"}), 404
        
        
        cursor.execute("SELECT * FROM t_sale WHERE pro_id = %s AND sal_state = %s", (pro_id, 'active',))
        if cursor.fetchone():
            return jsonify({"error":"Venta activa con este perfil"}), 422
        
        
        cursor.execute("DELETE FROM t_profile WHERE pro_id = %s", (pro_id,))
        cursor.connection.commit()
        return jsonify({"info": "Perfil Eliminado"}), 200
    except OperationalError as e:
        print("error en crt", e)
        return jsonify({
            "status": "error",
            "mensaje": "Conexión fallida con la base de datos. Intenta más tarde."
        }), 500
    except Exception as e:
        print("error en crt", e)
        return jsonify({
            "status": "error",
            "mensaje": "Ocurrió un error interno en el servidor. Intenta más tarde."
        }), 500
