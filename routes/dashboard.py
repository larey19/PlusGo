from flask import Blueprint, redirect, request, flash, render_template, current_app
from .auth import token
import uuid
dashboard_bp = Blueprint("dashboard", __name__, template_folder= "../layouts")



@dashboard_bp.route("/")
@token
def dashboard():
    
    return render_template("index.html")
