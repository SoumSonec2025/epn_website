import random
from mock_data import flash_infos, actualites, archives, evenements, about_sections, epns
from flask import Blueprint, render_template, redirect, url_for, flash, send_file
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Email
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

bp = Blueprint('main', __name__)

# Formulaire pour suggestions
class SuggestionForm(FlaskForm):
    name = StringField('Nom', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    subject = StringField('Sujet', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    submit = SubmitField('Soumettre')

# Génération de PDF pour les décrets
def generate_decret_pdf(epn):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.setFont("Helvetica", 16)
    p.drawString(100, 750, f"Décret de création - {epn['sigle']}")
    p.setFont("Helvetica", 12)
    p.drawString(100, 720, f"Nom : {epn['nom']}")
    p.drawString(100, 700, f"Sigle : {epn['sigle']}")
    p.drawString(100, 680, f"Tutelle : {epn['tutelle']}")
    p.drawString(100, 660, f"Catégorie : {epn['categorie']}")
    p.drawString(100, 640, f"Décret : {epn['decret']}")
    p.drawString(100, 620, f"Date de création : {epn['date_creation']}")
    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer

@bp.route('/')
def index():
    return render_template('index.html', actualites=actualites, flash_infos=flash_infos)

@bp.route('/about')
def about():
    return render_template('about.html', about_sections=about_sections, flash_infos=flash_infos)

@bp.route('/services')
def services():
    return render_template('services.html', flash_infos=flash_infos)

@bp.route('/epn_directory')
def epn_directory():
    return render_template('epn_directory.html', epns=epns, flash_infos=flash_infos)

@bp.route('/epn/<int:id>')
def epn_detail(id):
    epn = next((item for item in epns if item['id'] == id), None)
    if epn:
        return render_template('epn_detail.html', epn=epn, flash_infos=flash_infos)
    return render_template('404.html', flash_infos=flash_infos), 404

@bp.route('/epn/<int:id>/download_decret')
def download_decret(id):
    epn = next((item for item in epns if item['id'] == id), None)
    if epn:
        pdf_buffer = generate_decret_pdf(epn)
        return send_file(pdf_buffer, download_name=f"decret_{epn['sigle']}.pdf", as_attachment=True)
    return render_template('404.html', flash_infos=flash_infos), 404

@bp.route('/news')
def news():
    return render_template('news.html', actualites=actualites, flash_infos=flash_infos, archives=archives)

@bp.route('/news/<int:id>')
def news_detail(id):
    actualite = next((item for item in actualites if item['id'] == id), None)
    if actualite:
        return render_template('news_detail.html', actualite=actualite, flash_infos=flash_infos)
    return render_template('404.html', flash_infos=flash_infos), 404

@bp.route('/events')
def events():
    return render_template('events.html', evenements=evenements, flash_infos=flash_infos)

@bp.route('/events/<int:id>')
def event_detail(id):
    evenement = next((item for item in evenements if item['id'] == id), None)
    if evenement:
        return render_template('event_detail.html', evenement=evenement, flash_infos=flash_infos)
    return render_template('404.html', flash_infos=flash_infos), 404

@bp.route('/documents')
def documents():
    return render_template('documents.html', flash_infos=flash_infos, archives=archives)

@bp.route('/stats')
def stats():
    return render_template('stats.html', flash_infos=flash_infos)

@bp.route('/suggestions', methods=['GET', 'POST'])
def suggestions():
    form = SuggestionForm()
    if form.validate_on_submit():
        flash('Suggestion soumise avec succès !', 'success')
        return redirect(url_for('main.suggestions'))
    return render_template('suggestions.html', form=form, flash_infos=flash_infos)

@bp.route('/newsletter')
def newsletter():
    return render_template('newsletter.html', flash_infos=flash_infos)

@bp.route('/regulations')
def regulations():
    return render_template('regulations.html', flash_infos=flash_infos)

@bp.route('/intranet')
def intranet():
    # Mock EPN data (replace with actual database query)
    epns = [
        {'id': 1, 'nom': 'Agence Emploi Jeunes', 'sigle': 'AEJ', 'region': 'Abidjan'},
        {'id': 2, 'nom': 'Agence de Formation Professionnelle', 'sigle': 'AGEFOP', 'region': 'Yamoussoukro'},
        {'id': 3, 'nom': 'Agence Nationale de Gestion des Déchets', 'sigle': 'ANAGED', 'region': 'Abidjan'},
        {'id': 4, 'nom': 'Agence Nationale de Développement', 'sigle': 'ANDE', 'region': 'Bouaké'},
        {'id': 5, 'nom': 'Agence Nationale des Parcs', 'sigle': 'ANP', 'region': 'Korhogo'}
    ]

    # Generate random performance percentages for each EPN
    epns_with_performance = [(epn, random.randint(50, 100)) for epn in epns[:5]]

    # Mock flash infos (replace with actual data)
    flash_infos = [
        "Bienvenue sur l'Intranet DGEPN !",
        "Prochaine réunion prévue le 15/08/2025."
    ]

    return render_template('intranet.html', epns=epns, epns_with_performance=epns_with_performance,
                           flash_infos=flash_infos)

@bp.route('/login')
def login():
    return render_template('login.html', flash_infos=flash_infos)

@bp.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', flash_infos=flash_infos), 404