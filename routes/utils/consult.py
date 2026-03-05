import imaplib
import email
import pytz
from datetime import datetime, timedelta

def code(account, imap, password, de):
    try:
        mail = imaplib.IMAP4_SSL(imap) #Indicamos el IMAP gmail, hotmail, etc.
        mail.login(account, password) #Nos logueamos con el correo y la clave de app
        mail.select('"[Gmail]/Todos"') #indicamos la carpeta en la que buscara correos, debe estar en el idioma correcto
        # ___________________________
        today = datetime.now(pytz.timezone("America/Bogota")).strftime("%d-%b-%Y")  #variable que obtendra la fecha actual
        From = f'(FROM "{de}" SINCE "{today}")' #From {netflix} SINCE {12 ene 2026}
        _, data = mail.search(None, From) #preparamos la consulta
        limite = datetime.now(pytz.timezone("America/Bogota")) - timedelta(minutes = 30) #limite que trae unicamente los que llegan en menos de 30 minutos
        # ___________________________

        correo = [] # aqui se guardaran todos los correos 
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
        return correo

    except Exception as e:
        return [e]