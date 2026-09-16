from flask import Flask
from flask_mysqldb import MySQL 
from config import config
from routes import routes

app = Flask(__name__)
app.config.from_object(config)  
mysql = MySQL(app) 
app.mysql=mysql
app.secret_key=config.SECRET_KEY
routes(app)

app.run(debug=True, port=6500, host="0.0.0.0")
