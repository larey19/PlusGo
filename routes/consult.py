import imaplib
import email
import pytz
from datetime import datetime, timedelta
import locale
locale.setlocale(locale.LC_TIME, 'en_US.UTF-8') 

def code(account, imap, password, de):
    print(f"\n📧 Revisando: {account} {de}")
    try:
        mail = imaplib.IMAP4_SSL(imap)
        mail.login(account, password)
        mail.select('"[Gmail]/Todos"')
        # ___________________________
        today = datetime.now(pytz.timezone("America/Bogota")).strftime("%d-%b-%Y")
        From = f'(FROM "{de}" SINCE "{today}")'
        _, data = mail.search(None, From)
        limite = datetime.now(pytz.timezone("America/Bogota")) - timedelta(minutes = 30)
        # ___________________________

        correo = []
        for num in data[0].split():
            _, msg_data = mail.fetch(num, '(RFC822)')
            msg = email.message_from_bytes(msg_data[0][1])
            fecha = email.utils.parsedate_to_datetime(msg["Date"]).astimezone(pytz.timezone("America/Bogota"))
            if fecha < limite:
                continue
            
            cuerpo = ""
            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == "text/html":
                        cuerpo = part.get_payload(decode=True).decode(errors="ignore")
            else:
                cuerpo = msg.get_payload(decode=True).decode(errors="ignore")
            correo.append({
                        "DE":msg["From"],
                        "ASUNTO": msg["Subject"],
                        "FECHA": fecha,
                        "CUERPO" : cuerpo
                    })
        mail.logout()
        print("guardao")
        return correo

    except Exception as e:
        return {"error": f"{e}"}