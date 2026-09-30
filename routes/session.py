from flask import Blueprint, redirect, request, flash, render_template, current_app, session, url_for, abort, g
from .utils.auth import token

session_bp = Blueprint("session", __name__, template_folder= "../templates")

@session_bp.route("/session") 
@token
def getSessions():
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("""
                        SELECT ses_id,ses_user_id,ses_token,ses_device,ses_browser,ses_os,ses_ip,ses_user_agent,ses_created_at,ses_last_activity,ses_closed_at,ses_state
                        FROM t_sessions
                        WHERE ses_user_id = %s
                            AND ses_state = 'active'
                        ORDER BY ses_last_activity DESC                        
                        """, (g.user_id,))
        sessions = cursor.fetchall()
        # print(sessions[0])
        return render_template("session.html", sessions = sessions)
    except Exception as e:
        print("error en sesion", e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)
    
@session_bp.route("/session/<ses_id>") 
@token
def putSession(ses_id):
    # GUARDAMOS LA URL 
    if request.referrer and '/session' in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("""
                        UPDATE t_sessions
                        SET ses_state = 'closed',
                            ses_closed_at = NOW()
                        WHERE ses_id = %s
                        """, (ses_id,))
        cursor.connection.commit()
        flash("Se cerro la sesión del dispositivo", "success")
        return redirect(session.get("url_back_post"))
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)

@session_bp.route("/sessions/<ses_user_id>") 
@token
def putSessions(ses_user_id):
    # GUARDAMOS LA URL 
    if request.referrer and '/session' in request.referrer:
        session["url_back_post"] = request.referrer 
    try:
        cursor = current_app.mysql.connection.cursor()
        cursor.execute("""
                        UPDATE t_sessions
                        SET ses_state = 'closed',
                            ses_closed_at = NOW()
                        WHERE ses_user_id = %s 
                            AND ses_state = 'active'
                        """, (ses_user_id,))
        cursor.connection.commit()
        return redirect(session.get("url_back_post"))
    except Exception as e:
        print(e)
        flash("Ocurrio un error, Intenta más tarde.", "error")
        return abort(500)