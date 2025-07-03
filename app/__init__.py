import os
from flask_login import LoginManager
from flask import Flask
from flask_wtf.csrf import CSRFProtect



def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'epn_website')

    # Initialiser CSRF protection
    csrf = CSRFProtect(app)

    # Configuration Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'main.login'

    # Mock utilisateur (à remplacer par une vraie logique d'authentification)
    @login_manager.user_loader
    def load_user(user_id):
        class MockUser:
            def __init__(self, id, name):
                self.id = id
                self.name = name
                self.is_authenticated = True
                self.is_active = True
                self.is_anonymous = False

            def get_id(self):
                return self.id

        return MockUser(user_id, "Utilisateur Test")

    # Enregistrer les blueprints
    from app import routes
    app.register_blueprint(routes.bp)

    return app