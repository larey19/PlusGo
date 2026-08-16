from flask import Blueprint, render_template, flash, current_app, session, abort
import json
from .utils.auth import token
from .utils.wtf import userPasswordForm
from MySQLdb import OperationalError 

dashboard_bp = Blueprint("dashboard", __name__, template_folder= "../templates")

@dashboard_bp.route("/")
@token
def dashboard():
    try:
        PasswordForm = userPasswordForm()
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("""
                        SELECT t_platform.pla_id, t_platform.pla_name,  t_account.acc_nickname, t_account.acc_date_pay 
                        FROM t_account 
                            JOIN t_platform ON t_account.pla_id = t_platform.pla_id 
                        WHERE t_account.acc_state = 'enable' AND t_account.acc_date_pay <= DATE(UTC_TIMESTAMP() - INTERVAL 5 HOUR) + INTERVAL 3 DAY
                        ORDER BY t_account.acc_date_pay ASC""")
        account = cursor.fetchall() #Cuentas por vencer o vencidas
        
        cursor.execute("""
                        SELECT t_customer.cst_name, t_customer.cst_lastname, t_sale.sal_date_end, t_account.acc_email, t_account.acc_number_phone, t_platform.pla_name, t_profile.pro_profile, t_platform.pla_id, t_account.acc_user, t_sale.sal_price, t_sale.sal_date_start
                        FROM t_account 
                            JOIN t_platform ON t_account.pla_id = t_platform.pla_id 
                            JOIN t_profile ON t_account.acc_id = t_profile.acc_id
                            JOIN t_sale ON t_sale.pro_id = t_profile.pro_id
                            JOIN t_customer ON t_sale.cst_id = t_customer.cst_id
                        WHERE t_account.acc_state = 'enable' AND t_sale.sal_date_end <= DATE(UTC_TIMESTAMP() - INTERVAL 5 HOUR) + INTERVAL 3 DAY
                        ORDER BY t_sale.sal_date_end ASC
                        """)
        sale = cursor.fetchall() #Ventas por vencer o vencidas
        
        cursor.execute("""
                SELECT 
                    DATE_FORMAT(trg_date, '%b %Y') AS mes, 
                    COUNT(*) as total
                FROM trg_sale trg
                WHERE trg_action LIKE '%registro%' 
                    AND sal_description NOT REGEXP 'gta|grta|garanti|garant|garantia'
                    AND NOT EXISTS (
                        SELECT 1
                        FROM trg_sale trg2
                        WHERE trg2.sal_id = trg.sal_id 
                        AND trg2.trg_action LIKE '%elimino%' 
                        AND DATE(trg2.trg_date) = DATE(trg.trg_date) 
                    )
                GROUP BY mes
                """)
        trgsale = cursor.fetchall() #total de ventas registradas por mes
        meses = []
        totalsale = []
        for row in trgsale: 
            meses.append(row[0])
            totalsale.append(int(row[1]))   
        
        cursor.execute("""
                        SELECT t_platform.pla_name, COUNT(*) AS total
                        FROM t_account 
                            JOIN t_platform ON t_account.pla_id = t_platform.pla_id 
                            JOIN t_profile ON t_account.acc_id = t_profile.acc_id
                            JOIN t_sale ON t_sale.pro_id = t_profile.pro_id
                        GROUP BY t_platform.pla_name
                        """)
        platformSale = cursor.fetchall() #total de cada plataforma vendida
        plaName = []
        plaSale = []
        for row in platformSale:
            plaName.append(row[0])
            plaSale.append(row[1])
            
        cursor.execute("""
                        SELECT trg_action, trg_date, cst_name, cst_lastname, sal_price, acc_email, acc_number_phone, acc_user 
                        FROM trg_sale 
                        ORDER BY trg_date DESC LIMIT 5
                        """) 
        UltSale = [{
            "trg_action": trg[0],
            "trg_date" : trg[1],
            "sal_price": trg[4],
            "cst_name":trg[2],
            "cst_lastname":trg[3],
            "acc_email": trg[5],
            "acc_number_phone": trg[6],
            "acc_user": trg[7]
        } for trg in cursor.fetchall()] #obtener los ult 5 registros
        
        cursor.execute("""
                        SELECT COUNT(DISTINCT cst_id) FROM t_sale
                        """)#clientes activos en plusgo
        total_customer = cursor.fetchone()
        
        cursor.execute("""
                        SELECT COUNT(*) 
                            FROM t_profile 
                            JOIN t_account 
                            ON t_profile.acc_id = t_account.acc_id 
                        WHERE pro_state in ('enable', 'pending')
                        AND acc_state = 'enable'
                        """)#PERFILES SIN VENDER en plusgo
        total_profiles_enable = cursor.fetchone()
        
        cursor.execute("""
                        SELECT COUNT(*) FROM t_account WHERE acc_state = 'enable'
                        """)#CUENTAS ACTIVAS en plusgo
        total_account_enable = cursor.fetchone()
        
        cursor.execute("""
                        SELECT COUNT(*) FROM t_sale 
                        """)#total de ventas 
        total_sale =  cursor.fetchone()
        
        cursor.execute("""
                        SELECT COUNT(*)
                        FROM trg_sale
                        WHERE DATE(TRG_DATE) = DATE(UTC_TIMESTAMP() - INTERVAL 5 HOUR) 
                            AND trg_action LIKE '%registro%' 
                            AND sal_description NOT REGEXP 'gta|grta|garanti|garant|garantia'
                            AND NOT EXISTS (
                                SELECT 3
                                FROM trg_sale trg2
                                WHERE trg2.sal_id = sal_id 
                                AND trg2.trg_action LIKE '%elimino%' 
                                AND DATE(trg2.trg_date = DATE(UTC_TIMESTAMP() - INTERVAL 5 HOUR)) = DATE(trg_date = DATE(UTC_TIMESTAMP() - INTERVAL 5 HOUR) ) 
                            )
                        """)#total de ventas hoy
        total_sale_today = cursor.fetchone()        
                
        cursor.execute("""
                        SELECT COUNT(*) 
                        FROM trg_sale 
                        WHERE DATE(TRG_DATE) = DATE(UTC_TIMESTAMP() - INTERVAL 5 HOUR)-1 
                            AND trg_action LIKE '%registro%' 
                            AND sal_description NOT REGEXP 'gta|grta|garanti|garant|garantia'
                            AND NOT EXISTS (
                                SELECT 3
                                FROM trg_sale trg2
                                WHERE trg2.sal_id = sal_id 
                                AND trg2.trg_action LIKE '%elimino%' 
                                AND DATE(trg2.trg_date = DATE(UTC_TIMESTAMP() - INTERVAL 5 HOUR)-1) = DATE(trg_date = DATE(UTC_TIMESTAMP() - INTERVAL 5 HOUR)-1 ) 
                            )
                        """)#total de ventas ayer
        total_sale_yesterday = cursor.fetchone()
        
        cursor.execute("""
                        SELECT COUNT(*) 
                        FROM trg_sale 
                        WHERE trg_action LIKE '%registro%' 
                            AND sal_description NOT REGEXP 'gta|grta|garanti|garant|garantia' 
                            AND YEARWEEK(TRG_DATE - INTERVAL 5 HOUR, 1) = YEARWEEK(UTC_TIMESTAMP() - INTERVAL 5 HOUR, 1)
                            AND NOT EXISTS (
                                SELECT 3
                                FROM trg_sale trg2
                                WHERE trg2.sal_id = sal_id 
                                AND trg2.trg_action LIKE '%elimino%' 
                                AND DATE(YEARWEEK(trg2.trg_date - INTERVAL 5 HOUR, 1) = YEARWEEK(UTC_TIMESTAMP() - INTERVAL 5 HOUR, 1)) = (YEARWEEK(TRG_DATE - INTERVAL 5 HOUR, 1) = YEARWEEK(UTC_TIMESTAMP() - INTERVAL 5 HOUR, 1) )
                            )
                        """)#total de ventas semana  
        total_sale_weekly = cursor.fetchone() 
        
        cursor.execute("""
                        SELECT u.user_name, u.user_lastname, r.rol_name, u.user_id
                        FROM  t_user_role ur
                            INNER JOIN t_role r ON r.rol_id = ur.rol_id
                            INNER JOIN t_user u ON u.user_id = ur.user_id
                        WHERE u.user_id = %s
                        """, (session.get("user_id"),))
        user = cursor.fetchone()

        return render_template("dashboard.html",
                                    account = account, 
                                    sale = sale, 
                                    meses=json.dumps(meses), 
                                    totalsale=json.dumps(totalsale), 
                                    plaName = json.dumps(plaName), 
                                    plaSale = json.dumps(plaSale),
                                    UltSale = UltSale,
                                    total_customer = total_customer,
                                    total_profiles_enable = total_profiles_enable,
                                    total_account_enable = total_account_enable,
                                    total_sale = total_sale,
                                    total_sale_today = total_sale_today,
                                    total_sale_yesterday = total_sale_yesterday,
                                    total_sale_weekly = total_sale_weekly,
                                    user = user,
                                    PasswordForm = PasswordForm
                                    )
    except OperationalError as e:
        print(e)
        flash("Conexion fallida, Intenta más tarde.", "error")
        return abort(500)
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)
