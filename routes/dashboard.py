from flask import Blueprint, flash, render_template, current_app
import json
from .auth import token
from MySQLdb import OperationalError
from datetime import datetime
dashboard_bp = Blueprint("dashboard", __name__, template_folder= "../layouts")

@dashboard_bp.route("/")
@token
def dashboard():
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("SELECT t_platform.pla_id, t_platform.pla_name,  t_account.acc_nickname, t_account.acc_date_pay FROM t_account JOIN t_platform ON t_account.pla_id = t_platform.pla_id WHERE t_account.acc_state = 'enable' ORDER BY t_account.acc_date_pay ASC")
        account = cursor.fetchall()
        
        cursor.execute("""
                        SELECT t_customer.cst_name, t_customer.cst_lastname, t_sale.sal_date_end, t_account.acc_email, t_account.acc_number_phone, t_platform.pla_name, t_profile.pro_profile, t_platform.pla_id
                        FROM t_account 
                            JOIN t_platform ON t_account.pla_id = t_platform.pla_id 
                            JOIN t_profile ON t_account.acc_id = t_profile.acc_id
                            JOIN t_sale ON t_sale.pro_id = t_profile.pro_id
                            JOIN t_customer ON t_sale.cst_id = t_customer.cst_id
                        WHERE t_account.acc_state = 'enable' 
                        ORDER BY t_sale.sal_date_end ASC""")
        sale = cursor.fetchall()
        
        cursor.execute("""
                SELECT 
                DATE_FORMAT(trg_date, '%Y-%m') AS mes,
                    SUM(CASE WHEN trg_action LIKE '%registro%' THEN 1 ELSE 0 END) - 
                    SUM(CASE WHEN trg_action LIKE '%elimino%' THEN 1 ELSE 0 END) AS diferencia
                FROM trg_sale
                WHERE trg_action LIKE '%registro%' OR trg_action LIKE '%elimino%'
                GROUP BY mes
                ORDER BY mes
                """)
        trgsale = cursor.fetchall()
        meses = []
        totalsale = []

        for row in trgsale:
            fecha = datetime.strptime(row[0], "%Y-%m")
            mes_txt = fecha.strftime("%b %Y")   # Ene 2025
            meses.append(mes_txt)
            totalsale.append(int(row[1]))
        
        cursor.execute("""
                        SELECT t_platform.pla_name, COUNT(*) AS total
                        FROM t_account 
                            JOIN t_platform ON t_account.pla_id = t_platform.pla_id 
                            JOIN t_profile ON t_account.acc_id = t_profile.acc_id
                            JOIN t_sale ON t_sale.pro_id = t_profile.pro_id 
                        GROUP BY t_platform.pla_name
                        """)
        platformSale = cursor.fetchall()
        plaName = []
        plaSale = []
        
        for row in platformSale:
            plaName.append(row[0])
            plaSale.append(row[1])
            
        cursor.execute("SELECT trg_action, trg_date, cst_name, cst_lastname, sal_price FROM trg_sale ORDER BY trg_date DESC")
        UltSale = [{
            "trg_action": trg[0],
            "trg_date" : trg[1],
            "sal_price": int(trg[4]),
            "cst_name":trg[2],
            "cst_lastname":trg[3]
        } for trg in cursor.fetchall()]

        return render_template("index.html", 
                                account = account, 
                                sale = sale, 
                                meses=json.dumps(meses), 
                                totalsale=json.dumps(totalsale), 
                                plaName = json.dumps(plaName), 
                                plaSale = json.dumps(plaSale),
                                UltSale = UltSale)
    except OperationalError:
        flash("Conexion fallida, Intenta más tarde.", "error")
        return render_template("500.html")
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return render_template("500.html") 


