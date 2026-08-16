from flask import Blueprint, render_template, request, redirect

error_bp = Blueprint("error", __name__)

@error_bp.app_errorhandler(404)
def error_404(error):
    return render_template("404.html")

@error_bp.app_errorhandler(500)
def error_500(error):
    return render_template("500.html")

@error_bp.app_errorhandler(403)
def error_403(error):
    return render_template("403.html")