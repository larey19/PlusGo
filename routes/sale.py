from flask import Blueprint, redirect, request, flash, render_template, current_app, session, abort
from .utils.auth import token
from MySQLdb import OperationalError, IntegrityError
from MySQLdb.cursors import DictCursor 
from .utils.wtf import saleForm
import uuid
from datetime import datetime, date
import re
import pytz

sale_bp = Blueprint("sale", __name__, template_folder= "../templates")

# def session["saleBackup"] = form.data:

#     backup = form.data.copy()
#     for k in ("saldatestart", "saldateend"):
#         try:
#             backup[k] = backup[k].strftime("%Y-%m-%d")
#         except Exception:
#             session["saleBackup"] = backup
#             return session["saleBackup"]
#     session["saleBackup"] = backup


@sale_bp.context_processor
def lcl_Cst_Pla():
    try:
        cursor = current_app.mysql.connection.cursor(DictCursor)
        cursor.execute("""
                        SELECT t_platform.pla_id, t_platform.pla_name 
                            FROM t_platform 
                        JOIN t_account ON t_account.pla_id = t_platform.pla_id
                        WHERE t_account.acc_state = 'enable'
                        GROUP BY t_platform.pla_id
                        ORDER BY t_platform.pla_name ASC
                    """)
        platforms = cursor.fetchall()
        return dict(
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
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html")

@sale_bp.route("/sale/<pla_id>")
@token
def getSale(pla_id):
    try:
        # si viene de un error del CREAR convierte la fecha a formato date 
        saleBackup = session.pop("saleBackup", {})
        # if saleBackup.get('saldatestart') and saleBackup.get('saldateend'):
        #     saleBackup['saldatestart'] = datetime.strptime(saleBackup['saldatestart'], '%Y-%m-%d').date()
        #     saleBackup['saldateend'] = datetime.strptime(saleBackup['saldateend'], '%Y-%m-%d').date()
        
        # cargamos la informacion que tenia el formulario de crear al momento del error
        form = saleForm(data=saleBackup)
        
        # asignamos los clientes al select
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_customer ORDER BY cst_name ASC")
        customers = cursor.fetchall()
        form.cstid.choices = [(cst[0], (f"{cst[1] if cst[1] else 'Sin nombre'}  {cst[2] if cst[2] else ''} - {f'({cst[3][:3]}) {cst[3][3:6]}-{cst[3][6:]}' if cst[3] and len(cst[3]) == 10 else 'Sin Numero'}")) for cst in customers]
        # consulta para las ventas
        cursor.execute("""
            SELECT
                -- ACCOUNT
                a.acc_id,
                a.acc_email,
                a.acc_number_phone,
                a.acc_password,
                a.acc_user,

                -- PROFILE
                p.pro_id,
                p.pro_profile,
                p.pro_pin_profile,
                p.pro_state,

                -- SALE
                s.sal_id,
                s.sal_date_start,
                s.sal_date_end,
                s.sal_price,
                s.sal_description,
                s.sal_state,

                -- CUSTOMER
                c.cst_id,
                c.cst_name,
                c.cst_lastname,
                c.cst_phone_number,

                -- PLATFORM
                pl.pla_message

            FROM t_account AS a

            INNER JOIN t_platform AS pl
                ON a.pla_id = pl.pla_id

            INNER JOIN t_profile AS p
                ON a.acc_id = p.acc_id

            LEFT JOIN t_sale AS s
                ON s.pro_id = p.pro_id

            LEFT JOIN t_customer AS c
                ON s.cst_id = c.cst_id

            WHERE pl.pla_id = %s
            AND a.acc_state = %s

            ORDER BY
                a.acc_email ASC,
                p.pro_profile ASC,
                s.sal_date_end ASC
        """, (pla_id, 'enable'))

        data = [{
            # ACCOUNT
            "acc_id": x[0],
            "acc_email": x[1],
            "acc_number_phone": x[2],
            "acc_password": x[3],
            "acc_user": x[4],

            # PROFILE
            "pro_id": x[5],
            "pro_profile": x[6],
            "pro_pin_profile": x[7],
            "pro_state": x[8],

            # SALE
            "sal_id": x[9],
            "sal_date_start": x[10],
            "sal_date_end": x[11],
            "sal_price": x[12],
            "sal_description": x[13],
            "sal_state": x[14],
            "sal_days_enables": max((x[11] - datetime.now(pytz.timezone("America/Bogota")).date().today()).days, 0) if x[11] else None,

            # CUSTOMER
            "cst_id": x[15],
            "cst_name": x[16],
            "cst_lastname": x[17],
            "cst_phone_number": x[18],

            # PLATFORM
            "pla_message": (
                x[19]
                .replace(
                    '{tittle_add}',
                    'GARANTIA '
                    if re.search(
                        r'\b(gta|grta|garantia|garanti|garant)\b',
                        x[13] if x[13] else ''
                    )
                    else ''
                )
                .replace(
                    '{account}',
                    x[1] if x[1] else (
                        x[4] if x[4] else x[0]
                    )
                )
                .replace(
                    '{password}',
                    x[3] if x[3] else 'Sin Contraseña'
                )
                .replace(
                    '{profile}',
                    x[6] if x[6] else 'Sin Perfil'
                )
                .replace(
                    '{pin}',
                    x[7] if x[7] else 'Sin Pin'
                )
                .replace(
                    '{date}',
                    x[11].strftime("%d/%m")
                    if x[11]
                    else 'Sin Fecha'
                )
                if x[19]
                else ''
            )
        } for x in cursor.fetchall()]
     
    # consulta para el name de la plataforma
        cursor.execute("SELECT pla_name FROM t_platform WHERE pla_id = %s",(pla_id,))
        plaName = cursor.fetchone()
        
        # renderizamos html y enviamos la info
        return render_template("sale.html", 
                                data = data, 
                                form = form,
                                plaName = plaName[0])
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
    # GUARDAMOS LA URL 
    if request.referrer and '/sale' in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        form = saleForm()
        # asignamos los clientes al select
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_customer ORDER BY cst_name ASC")
        customers = cursor.fetchall()
        form.cstid.choices = [(cst[0], (f"{cst[1] if cst[1] else 'Sin nombre'}  {cst[2] if cst[2] else ''} - {f'{cst[3][:3]} {cst[3][3:6]}-{cst[3][6:]}' if cst[3] and len(cst[3]) == 10 else 'Sin Numero'}")) for cst in customers]
        
        # VALIDAMOS QUE SEA POST Y QUE SE ENVIE LA INFO REQ 
        if form.validate_on_submit():
            salid = uuid.uuid4()
            saldates = (form.saldate.data).strip().split(" - ")
            salprice = (form.salprice.data).strip().replace(',','').replace('.','')
            saldescription = (form.saldescription.data).strip()
            cstid = (form.cstid.data).strip()
            proid = (form.proid.data).strip()
            salstate = (form.salstate.data).strip()
            propin = (form.propin.data).strip() if form.propin.data else form.propin.data
            
            
            
            # BLOCK DE VALIDACIONES            
            if propin and not propin.isdigit():
                flash("Pin Invalido", "error")
                return redirect(session.get('url_back_post'))
            
            if salstate not in ["active", "pending"]:
                session["saleBackup"] = form.data
                flash("Estado Invalido", "error")
                return redirect(session.get('url_back_post'))
            
            
            if datetime.strptime(saldates[0], '%d/%m/%Y').date() and datetime.strptime(saldates[1], '%d/%m/%Y').date():
                saldates[0] = datetime.strptime(saldates[0], '%d/%m/%Y').date()
                saldates[1] = datetime.strptime(saldates[1], '%d/%m/%Y').date()
            else:
                session['saleBackup'] = form.data
                flash("Fechas Invalidas", "error")  
                return  redirect(session.get("url_back_post"))
            
            if saldates[0] >= saldates[1]:
                session["saleBackup"] = form.data
                flash("Fecha Fin Invalida", "error")
                return redirect(session.get('url_back_post'))
            
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("SELECT pro_state FROM t_profile WHERE pro_id = %s", (proid,))
            prostate = cursor.fetchone()
            if prostate[0] == "disable" or  prostate[0] == "pending":
                session["saleBackup"] = form.data
                flash("Perfil No Disponible", "error")
                return redirect(session.get('url_back_post'))
            
            sql = f"UPDATE t_profile SET pro_state = %s {',pro_pin_profile = %s' if propin else ''} WHERE pro_id = %s"
            if propin:
                cursor.execute(sql,('disable', propin, proid,))
            else:
                cursor.execute(sql,('disable', proid,))
            
            # QUERY DE REGISTRO
            cursor.execute("""INSERT INTO t_sale 
                            (sal_id, sal_date_start, sal_date_end, sal_price, sal_description, sal_state, cst_id, pro_id) 
                            VALUES 
                            (%s, %s, %s, %s, %s, %s, %s, %s)""", 
                            (salid, saldates[0], saldates[1], salprice, saldescription, salstate, cstid, proid,))
            cursor.connection.commit()
            flash ("Registro Exitoso", "success")
            
            # REDIRECCIONA A LA URL QUE GUARDO 
            return redirect(session.get('url_back_post'))
        
        # SI NO CUMPLIO CON EL METODO O FALTA INFO REQ
        print(form.errors)
        session["saleBackup"] = form.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    except IntegrityError as e:
        print(e)
        session["saleBackup"] = form.data
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
    # GUARDAMOS URL
    if request.referrer and '/sale' in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        # ASIGNAMOS LOS CLIENTES AL SELECT
        form = saleForm() 
        
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT * FROM t_customer ORDER BY cst_name ASC")
        customers = cursor.fetchall()
        form.cstid.choices = [(cst[0], (f"{cst[1] if cst[1] else 'Sin nombre'}  {cst[2] if cst[2] else ''} - {f'{cst[3][:3]} {cst[3][3:6]}-{cst[3][6:]}' if cst[3] and len(cst[3]) == 10 else 'Sin Numero'}")) for cst in customers]

        # valida que se este enviando metodo e info req
        if form.validate_on_submit():
            saldates = (form.saldate.data).strip().split(" - ")
            salprice = (form.salprice.data).strip().replace(',','').replace('.','')
            propin = (form.propin.data).strip() if form.propin.data else form.propin.data
            saldescription = (form.saldescription.data).strip()
            cstid = (form.cstid.data).strip()
            proid = (form.proid.data).strip()
            propin = (form.propin.data).strip() if form.propin.data else form.propin.data
            salstate = (form.salstate.data).strip()
            
            # BLOCK DE VALIDACIONES
            if propin and propin and not propin.isdigit():
                flash("Pin Invalido", "error")
                return redirect(session.get('url_back_post'))
            
            if salstate not in ["active", "pending"]:
                session["saleBackup"] = form.data
                flash("Estado Invalido", "error")
                return redirect(session.get('url_back_post'))
            
            if datetime.strptime(saldates[0], '%d/%m/%Y').date() and datetime.strptime(saldates[1], '%d/%m/%Y').date():
                saldates[0] = datetime.strptime(saldates[0], '%d/%m/%Y').date()
                saldates[1] = datetime.strptime(saldates[1], '%d/%m/%Y').date()
            else:
                session['saleBackup'] = form.data
                flash("Fechas Invalidas", "error")  
                return  redirect(session.get("url_back_post"))
            
            if saldates[0] >= saldates[1]:
                session["saleBackup"] = form.data
                flash("Fecha Fin Invalida", "error")
                return redirect(session.get('url_back_post'))
            
            
            cursor = current_app.mysql.connection.cursor()
            cursor.execute("""SELECT t_sale.sal_id, t_sale.sal_state, t_profile.pro_state 
                            FROM t_sale 
                            JOIN t_profile ON t_sale.pro_id = t_profile.pro_id 
                            WHERE sal_id = %s""", (sal_id,))
            state = cursor.fetchone()
            
            if state and (state[2] == "disable" and sal_id != state[0]):
                flash("Esta venta no se puede Actualizar", "error")
                return redirect(session.get('url_back_post'))
            
            # QUERY DE UPDATE
            cursor.execute("""UPDATE t_sale 
                            SET sal_date_start = %s, sal_date_end = %s, sal_price = %s, sal_description = %s, cst_id = %s, sal_state = %s 
                            WHERE sal_id = %s""", 
                            (saldates[0], saldates[1], salprice, saldescription, cstid, salstate, sal_id,))
            if propin:
                cursor.execute("UPDATE t_profile SET pro_pin_profile = %s WHERE pro_id = %s",(propin, proid,))
            cursor.connection.commit()
            flash ("Venta Actualizada", "success")
            
            # REDIRECT A LA URL GUARDADA 
            return redirect(session.get('url_back_post'))
        
        # SI NO ENVIO EL METODO CORRECTO O LA INFO REQ 
        print(form.errors)
        session["saleBackup"] = form.data
        flash("Ingresa toda la información requerida", "error")
        return redirect(session.get("url_back_post"))
    except IntegrityError as e:
        print(e)
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
            return abort(404)
        cursor.execute("DELETE FROM t_sale WHERE sal_id = %s", (sal_id,))
        cursor.execute("UPDATE t_profile SET pro_state = %s WHERE pro_id = %s", ("enable", data[1],))
        cursor.connection.commit()
        flash("Venta Eliminada", "Info")
        return redirect(session.get('url_back_post'))
    except IntegrityError as e:
        print(e)
        flash("Error al registrar Venta", "error")  
        return redirect(session.get('url_back_post'))
    except OperationalError as e:
        print(e)
        # flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html") 