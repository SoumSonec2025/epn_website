from flask import Flask
from flask_wtf.csrf import CSRFProtect


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialiser CSRF protection
    csrf = CSRFProtect(app)

    # Enregistrer les blueprints
    from app import routes
    app.register_blueprint(routes.bp)

    return app