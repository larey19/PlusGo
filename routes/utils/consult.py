import imaplib
import email
import pytz
from email.header import decode_header
from datetime import datetime, timedelta
from bs4 import BeautifulSoup

def decodificar(valor):
    if not valor:
        return ""
    parts = decode_header(valor)
    return "".join(
        text.decode(cod or "utf-8", errors="ignore") if isinstance(text, bytes) else text
        for text, cod in parts
    )
def formatLinks(html):
    if not html:
        return html
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True):
        a["target"] = "_blank"
        a["rel"] = "noopener noreferrer"
    return str(soup)

def code(account, imap, password, de):
    mail = imaplib.IMAP4_SSL(imap)
    mail.login(account, password)
    mail.select('"[Gmail]/Todos"')

    today = datetime.now(pytz.timezone("America/Bogota")).strftime("%d-%b-%Y")
    limite = datetime.now(pytz.timezone("America/Bogota")) - timedelta(minutes=30)
    From = f'(FROM "{de}" SINCE "{today}")'
    _, data = mail.search(None, From)
    correo = []
    for num in data[0].split():
        _, msg_data = mail.fetch(num, "(BODY.PEEK[])")
        msg = email.message_from_bytes(msg_data[0][1])
        date = email.utils.parsedate_to_datetime(msg["Date"]).astimezone(pytz.timezone("America/Bogota"))
        if date < limite:
            continue

        body = ""
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/html":
                    body = part.get_payload(decode=True).decode(errors="ignore")
        else:
            body = msg.get_payload(decode=True).decode(errors="ignore")
        body = formatLinks(body)
        correo.append({
            "DE": decodificar(msg["From"]),
            "ASUNTO": decodificar(msg["Subject"]),
            "FECHA": date,
            "CUERPO": body
        })

    mail.close()
    mail.logout()
    return correo