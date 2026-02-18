from flask import Blueprint, redirect, request, flash, render_template, current_app, session, jsonify
from .auth import token
from MySQLdb import OperationalError, IntegrityError
from MySQLdb.cursors import DictCursor 
from .wtf import saleForm
import uuid
from datetime import datetime

sale_bp = Blueprint("sale", __name__, template_folder= "../layouts")

def backup(form):
    backup = form.data.copy()
    for k in ("saldatestart", "saldateend"):
        backup[k] = backup[k].strftime("%Y-%m-%d")
    session["saleBackup"] = backup


@sale_bp.context_processor
def lcl_Cst_Pla():
    try:
        cursor = current_app.mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT * FROM t_customer ORDER BY cst_name ASC")
        customers = cursor.fetchall()
        cursor.execute("SELECT pla_id, pla_name FROM t_platform ORDER BY pla_name ASC")
        platforms = cursor.fetchall()
        return dict(
            customer=customers,
            platform=platforms
        )
    except Exception as e:
        print(e)
        return dict(platform=[])



@sale_bp.route("/sale")
@token
def sale():
    try:
        form = saleForm()
        return render_template("sale.html", form = form)
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@sale_bp.route("/sale/<pla_id>")
@token
def getSale(pla_id):
    try:
        saleBackup = session.pop("saleBackup", {})
        if saleBackup.get('saldatestart') and saleBackup.get('saldateend'):
            saleBackup['saldatestart'] = datetime.strptime(saleBackup['saldatestart'], '%Y-%m-%d').date()
            saleBackup['saldateend'] = datetime.strptime(saleBackup['saldateend'], '%Y-%m-%d').date()
        
        form = saleForm(data=saleBackup)

        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_customer ORDER BY cst_name ASC")
        customers = cursor.fetchall()
        form.cstid.choices = [(cst[0], (f"{cst[1]}  {cst[2]} - {cst[3]}")) for cst in customers]
        cursor.execute("""SELECT t_account.acc_id, t_account.acc_email, 
                        t_profile.pro_id , t_profile.pro_profile, t_profile.pro_pin_profile, 
                        t_sale.sal_id, t_sale.sal_date_start, t_sale.sal_date_end, t_sale.sal_price, t_sale.sal_description, 
                        t_customer.cst_id, t_customer.cst_name, t_customer.cst_lastname, t_customer.cst_phone_number, t_account.acc_number_phone
                        FROM t_account 
                        INNER JOIN t_platform ON t_account.pla_id = t_platform.pla_id 
                        INNER JOIN t_profile ON t_account.acc_id = t_profile.acc_id
                        LEFT JOIN t_sale ON t_sale.pro_id = t_profile.pro_id
                        LEFT JOIN t_customer ON t_sale.cst_id = t_customer.cst_id
                        WHERE t_platform.pla_id = %s AND t_account.acc_state = %s 
                        ORDER BY t_account.acc_email ASC, t_profile.pro_profile ASC, t_sale.sal_date_end ASC""", (pla_id, 'enable'))
        data = [{
                "acc_id": x[0],
                "acc_email": x[1],
                "pro_id" : x[2],
                "pro_profile":x[3],
                "pro_pin_profile":x[4],
                "sal_id":x[5],
                "sal_date_start":x[6],
                "sal_date_end":x[7],
                "sal_price":int(x[8]) if x[8] else x[8],
                "sal_description":x[9],
                "cst_id":x[10],
                "cst_name":x[11],
                "cst_lastname":x[12],
                "cst_phone_number":x[13],
                "acc_number_phone":x[14]
            } for x in cursor.fetchall()]
        return render_template("sale.html", data = data, form = form)
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")


@sale_bp.route("/sale", methods = ["POST"])
@token
def crtSale():
    if request.referrer and '/sale' in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_customer ORDER BY cst_name ASC")
        customers = cursor.fetchall()
        form = saleForm()
        form.cstid.choices = [(cst[0], (f"{cst[1]}  {cst[2]}")) for cst in customers]
        if request.method== "POST":
            salid = uuid.uuid4()
            saldatestart = form.saldatestart.data
            saldateend = form.saldateend.data
            salprice = request.form.get('salprice').replace('.','')
            saldescription = form.saldescription.data
            cstid = form.cstid.data
            proid = form.proid.data
            if saldateend <= saldatestart:
                backup(form)
                flash("Fecha Fin Invalida", "error")
                return redirect(session.get('url_back_post'))
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT pro_state FROM t_profile WHERE pro_id = %s", (proid,))
            prostate = cursor.fetchone()
            if prostate[0] == "disable" or  prostate[0] == "pending":
                backup(form)
                flash("Perfil No Disponible", "error")
                return redirect(session.get('url_back_post'))
            cursor.execute("INSERT INTO t_sale (sal_id, sal_date_start, sal_date_end, sal_price, sal_description, sal_state, cst_id, pro_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (salid, saldatestart, saldateend, salprice, saldescription, 'active', cstid, proid,))
            cursor.execute("UPDATE t_profile SET pro_state = %s WHERE pro_id = %s", ('disable', proid,))
            cursor.connection.commit()
            flash ("Registro Exitoso", "success")
            return redirect(session.get('url_back_post'))
        backup(form)
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    except IntegrityError as e:
        print(e)
        backup(form)
        flash("Error al registrar Venta", "error")  
        return redirect(session.get('url_back_post'))
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")


@sale_bp.route("/sale/<sal_id>", methods = ["POST"])
@token
def putSale(sal_id):
    if request.referrer and '/sale' in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        saldatestart = (request.form["sal_date_start"]).strip()
        saldateend = (request.form["sal_date_end"]).strip()
        salprice = (request.form["sal_price"]).strip()
        saldescription = (request.form["sal_description"]).strip()
        cstid = (request.form["cst_id"]).strip()
        if not saldatestart or not saldateend or not salprice or not cstid:
            flash("Ingresa toda la informacion requerida", "error")
            return redirect(session.get('url_back_post'))
        if saldateend < saldatestart:
            flash("Fecha Fin Invalida", "error")
            return redirect(session.get('url_back_post'))
        if len(salprice) <= 3:
            flash("Precio Invalido", "error")
            return redirect(session.get('url_back_post'))
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT t_sale.sal_id, t_sale.sal_state, t_profile.pro_state FROM t_sale JOIN t_profile ON t_sale.pro_id = t_profile.pro_id WHERE sal_id = %s", (sal_id,))
        state = cursor.fetchone()
        if state and (state[1] == "expired") or ((state[2] == "disable" or  state[2] == "pending") and sal_id != state[0]):
            flash("Esta venta no se puede Actualizar", "error")
            return redirect(session.get('url_back_post'))
        cursor.execute("UPDATE t_sale SET sal_date_start = %s, sal_date_end = %s, sal_price = %s, sal_description = %s, cst_id = %s WHERE sal_id = %s", (saldatestart, saldateend, salprice, saldescription, cstid, sal_id,))
        cursor.connection.commit()
        flash ("Venta Actualizada", "success")
        return redirect(session.get('url_back_post'))
    except IntegrityError:
        flash("Plataforma Duplicada", "error")  
        return redirect(session.get('url_back_post'))
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@sale_bp.route("/sale/state/<sal_id>")
@token
def putState(sal_id):
    if request.referrer and '/sale' in request.referrer:
        session["url_back_post"] = request.referrer
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT sal_state, pro_id FROM t_sale WHERE sal_id = %s", (sal_id,))
        data = cursor.fetchone()
        if not data:
            flash("No se puede editar", "error")  
            return redirect(session.get('url_back_post'))
        if data and data[0] == "expired":   
            flash("Esta venta no se puede Actualizar", "error")
            return redirect(session.get('url_back_post'))
        cursor.execute("DELETE FROM t_sale WHERE sal_id = %s", (sal_id,))
        cursor.execute("UPDATE t_profile SET pro_state = %s WHERE pro_id = %s", ("enable", data[1],))
        cursor.connection.commit()
        flash("Venta Desactiva y Eliminada", "Info")
        return redirect(session.get('url_back_post'))
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception:
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html") 