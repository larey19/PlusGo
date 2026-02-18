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
