from .login import login_bp
from .dashboard import dashboard_bp
from .platform import platform_bp
from .account import account_bp
from .profile import profile_bp
from .sale import sale_bp
from .customer import customer_bp
from .local import local_bp
from .trigger import trigger_bp
from .manage import manage_bp
from .error import error_bp

def routes (app):
    app.register_blueprint(login_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(platform_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(account_bp)
    app.register_blueprint(sale_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(local_bp)
    app.register_blueprint(trigger_bp)
    app.register_blueprint(manage_bp) 
    app.register_blueprint(error_bp)