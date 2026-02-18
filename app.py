from flask import Flask
from flask_mysqldb import MySQL 
from config import config
from routes import routes
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)
app.config.from_object(config)
mysql = MySQL(app) 
app.mysql=mysql
routes(app)
app.secret_key = os.getenv("SECRET_KEY")


# Arrancar en la ruta ("http://127.0.0.1:6500")
app.run(debug=True, port=6500, host="0.0.0.0")