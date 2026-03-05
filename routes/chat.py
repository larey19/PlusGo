from flask import Blueprint, jsonify, request, current_app, session
from openai import OpenAI
from dotenv import load_dotenv
import phonenumbers
from phonenumbers import NumberParseException
import uuid
import os

load_dotenv()

chat_bp = Blueprint("chat", __name__)

client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)


# ==================================================
# ========================= FUNCIONES BD
# ==================================================



# =========================
# VENTAS
# =========================
def getsaletoday():
    cursor = current_app.mysql.connection.cursor()
    cursor.execute("""
                    SELECT t_sale.sal_date_start, t_sale.sal_date_end, t_sale.sal_price, t_sale.sal_description,
                    t_customer.cst_name, t_customer.cst_lastname,
                    t_account.acc_email, t_platform.pla_name
                    FROM t_sale 
                    RIGHT JOIN t_customer ON t_customer.cst_id = t_sale.cst_id 
                    RIGHT JOIN t_profile ON t_sale.pro_id = t_profile.pro_id
                    RIGHT JOIN t_account ON t_account.acc_id = t_profile.acc_id
                    RIGHT JOIN t_platform ON t_platform.pla_id = t_account.pla_id
                    WHERE sal_date_end = CURDATE()
                    """)
    data = cursor.fetchall()
    cursor.close()
    return data

def getsaletomorrow():
    cursor = current_app.mysql.connection.cursor()
    cursor.execute("""
                    SELECT t_sale.sal_date_start, t_sale.sal_date_end, t_sale.sal_price, t_sale.sal_description,
                    t_customer.cst_name, t_customer.cst_lastname,
                    t_account.acc_email, t_platform.pla_name
                    FROM t_sale 
                    RIGHT JOIN t_customer ON t_customer.cst_id = t_sale.cst_id 
                    RIGHT JOIN t_profile ON t_sale.pro_id = t_profile.pro_id
                    RIGHT JOIN t_account ON t_account.acc_id = t_profile.acc_id
                    RIGHT JOIN t_platform ON t_platform.pla_id = t_account.pla_id
                    WHERE sal_date_end = CURDATE()
                    """)
    data = cursor.fetchall()
    cursor.close()
    return data

def getsaleExpired():
    cursor = current_app.mysql.connection.cursor()
    cursor.execute("""
                    SELECT t_sale.sal_date_start, t_sale.sal_date_end, t_sale.sal_price, t_sale.sal_description,
                    t_customer.cst_name, t_customer.cst_lastname,
                    t_account.acc_email, t_account.acc_number_phone, t_platform.pla_name
                    FROM t_sale 
                    RIGHT JOIN t_customer ON t_customer.cst_id = t_sale.cst_id 
                    RIGHT JOIN t_profile ON t_sale.pro_id = t_profile.pro_id
                    RIGHT JOIN t_account ON t_account.acc_id = t_profile.acc_id
                    RIGHT JOIN t_platform ON t_platform.pla_id = t_account.pla_id
                    WHERE sal_date_end < CURDATE()""")
    data = cursor.fetchall()
    cursor.close()
    return data

def formatsale(data):
    if not data:
        return "No hay resultados.\n"

    text = ""
    for row in data:
        text += (
            f"Cliente:{row[4]} {row[5]}\n"
            f"Cuenta: {row[6] if row[6] else row[7]}\n"
            f"Precio: {row[2]}\n"
            f"Inicio: {row[0]}\n"
            f"Fin:    {row[1]}\n"
            "----------------------\n"
        )
    return text

# =========================
# CLIENTES
# =========================
def getcustomer():
    cursor = current_app.mysql.connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM t_customer")
    data = cursor.fetchone()[0]
    cursor.close()
    return data
# =========================
# ACCOUNT
# =========================
def getaccounttoday():
    cursor = current_app.mysql.connection.cursor()
    cursor.execute("""
                    SELECT * FROM t_account JOIN t_platform ON t_account.pla_id = t_platform.pla_id WHERE t_account.acc_date_pay = CURDATE()
                    """)
    data = cursor.fetchall()
    cursor.close()
    return data
def getaccounttomorrow():
    cursor = current_app.mysql.connection.cursor()
    cursor.execute("""
                    SELECT * FROM t_account JOIN t_platform ON t_account.pla_id = t_platform.pla_id WHERE t_account.acc_date_pay = CURDATE() + 1
                    """)
    data = cursor.fetchall()
    cursor.close()
    return data
def getaccountexpired():
    cursor = current_app.mysql.connection.cursor()
    cursor.execute("""
                    SELECT * FROM t_account JOIN t_platform ON t_account.pla_id = t_platform.pla_id WHERE t_account.acc_date_pay < CURDATE()
                    """)
    data = cursor.fetchall()
    cursor.close()
    return data
def formataccount(data):
    if not data:
        return "No hay resultados.\n"

    text = ""
    for row in data:
        text += (
            f"Apodo:{row[1]}\n"
            f"Proveedor: {row[2]}\n"
            f"Correo o Telefono: {row[4] if row[4] else row[5]}\n"
            f"Fecha de pago: {row[3]}\n"
            "----------------------\n"
        )
    return text

# =========================
# MENU
# =========================

MENU = """
Menú PlusGo:

1. Consultar Ventas
2. Consultar Clientes
3. Consultar Cuentas

Escribe unicamente el número de la opción.
"""

MENUSALE = """
Elija la accion deseada:

1. Ventas que vencen Hoy
2. Ventas que vencen Mañana
3. Ventas Vencidas
4. Volver

Escribe unicamente el número de la opción.
"""

MENUCUSTOMER = """
Elija la accion deseada:

1. Cuantos clientes registrados
4. Volver

Escribe unicamente el número de la opción.
"""

MENUACCOUNT = """
Elija la accion deseada:

1. Cuentas que vencen Hoy
2. Cuentas que vencen Mañana
3. Cuentas Vencidas
4. Volver

Escribe unicamente el número de la opción.
"""

# =========================
# RUTA CHAT
# =========================

def create_customer(name, lastname, phone):
    cst_id = uuid.uuid4()
    if phone and len(phone) > 10 or len(phone) < 10 or not phonenumbers.is_valid_number(phonenumbers.parse(phone, "CO")):
        return {
        "status": "error",
        "message": "Telefono Invalido"
    }
    cursor = current_app.mysql.connection.cursor()
    cursor.execute("SELECT * FROM t_customer WHERE cst_phone_number = %s", (phone,))
    if phone and cursor.fetchone():
        return {
        "status": "error",
        "message": "Telefono Duplicado"
    }
    cursor.execute("""
        INSERT INTO t_customer (cst_id, cst_name, cst_lastname, cst_phone_number)
        VALUES (%s, %s, %s, %s)
    """, (cst_id, name, lastname, phone))
    

    current_app.mysql.connection.commit()
    cursor.close()

    return {
        "status": "success",
        "message": f"Cliente {name} {lastname} registrado correctamente"
    }

tools = [
    {
        "type": "function",
        "function": {
            "name": "create_customer",
            "description": "Registrar un cliente nuevo en el sistema",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Nombre del cliente"
                    },
                    "lastname": {
                        "type": "string",
                        "description": "Apellido del cliente"
                    },
                    "phone": {
                        "type": "string",
                        "description": "Número de teléfono"
                    }
                },
                "required": ["name", "lastname", "phone"]
            }
        }
    }
]
@chat_bp.route("/chat", methods=["POST"])
def chat():
        data = request.get_json(silent=True)
        if data is None:
            return jsonify({"error": "Error en JSON"}), 400
        message = str(data.get("message", "")).strip()
        # Si no envía nada → mostrar menú
        if not session.get("menu") and not message:
            return jsonify({"Chat Go": MENU}), 200


        # =============================================
        # ====================OPCIONES → SECCIONES 
        # =============================================

        if not session.get("menu") and message == "1":
            session["menu"] = "sale"
            return jsonify({"Chat Go": MENUSALE}), 200
        if not session.get("menu") and message == "2":
            session["menu"] = "customer"
            return jsonify({"Chat Go": MENUCUSTOMER}), 200
        if not session.get("menu") and message == "3":
            session["menu"] = "account"
            return jsonify({"Chat Go": MENUSALE}), 200

        # =============================
        # MENU VENTAS
        # =============================
        if session.get("menu") == "sale":
            if message == "1":
                data = getsaletoday()
                text = formatsale(data)
                return jsonify({
                    "response": f"Ventas que vencen hoy:\n\n{text}\n{MENUSALE}"
                }), 200

            if message == "2":
                data = getsaletomorrow()
                text = formatsale(data)
                return jsonify({
                    "response": f"Ventas que vencen mañana:\n\n{text}\n{MENUSALE}"
                }), 200

            if message == "3":
                data = getsaleExpired()
                text = formatsale(data)
                return jsonify({
                    "response": f"Ventas vencidas:\n\n{text}\n{MENUSALE}"
                }), 200

            if message == "4":
                session.pop("menu", None)
                return jsonify({"Chat Go": MENU}), 200
        # =========================
        # MENU CLIENTES
        # =========================
        if session.get("menu") == "customer":
            if message == "1":
                data = getcustomer()
                prompt = f"Clientes registrados en plataforma:\n\nUn total: {data}\n{MENUCUSTOMER}"
                return jsonify({"response": prompt}), 200
            if message == "2":
                session.pop("menu", None)
                return jsonify({"Chat Go": MENU}), 200
            
        # =========================
        # MENU CUENTAS
        # =========================
        if session.get("menu") == "account":
            if message == "1":
                data = getaccounttoday()
                text = formataccount(data)
                return jsonify({
                    "response": f"Cuentas que vencen hoy:\n\n{text}\n{MENUSALE}"
                }), 200

            if message == "2":
                data = getaccounttomorrow()
                text = formataccount(data)
                return jsonify({
                    "response": f"Cuentas que vencen mañana:\n\n{text}\n{MENUSALE}"
                }), 200

            if message == "3":
                data = getaccountexpired()
                text = formataccount(data)
                return jsonify({
                    "response": f"Cuentas vencidas:\n\n{text}\n{MENUSALE}"
                }), 200

            if message == "4":
                session.pop("menu", None)
                return jsonify({"Chat Go": MENU}), 200
# =========================
# FUNCTION CALLING IA
# =========================

        try:

            ai = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un asistente para un sistema de ventas. "
                                "Si el usuario quiere registrar un cliente debes usar la función create_customer."
                    },
                    {"role": "user", "content": message},
                ],
                tools=tools,
                tool_choice="auto"
            )

            msg = ai.choices[0].message

            # Si el modelo quiere ejecutar función
            if msg.tool_calls:

                tool_call = msg.tool_calls[0]
                function_name = tool_call.function.name

                import json
                args = json.loads(tool_call.function.arguments)

                if function_name == "create_customer":
                    result = create_customer(**args)

                    return jsonify({
                        "response": result["message"]
                    }), 200

            # Si no llamó función → respuesta normal IA
            return jsonify({
                "response": msg.content
            }), 200

        except Exception as e:
            return jsonify({
                "response": f"Error: {str(e)}"
            }), 500

