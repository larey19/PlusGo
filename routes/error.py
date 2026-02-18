from flask import Flask, Blueprint ,render_template
error_bp = Blueprint("error", __name__, template_folder= "../layouts")

@error_bp.app_errorhandler(404)
def error_page_404(error):
    return render_template("404.html")

@error_bp.app_errorhandler(500)
def error_page_500(error):
    return render_template("500.html")