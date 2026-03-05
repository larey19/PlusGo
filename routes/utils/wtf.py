from flask_wtf import FlaskForm
from wtforms import StringField, DateField, IntegerField, TextAreaField, SelectField, HiddenField, PasswordField, SubmitField, EmailField, TelField
from wtforms.validators import DataRequired, NumberRange,length

class loginForm(FlaskForm):
    user = StringField(
        "Usuario",
        validators = [DataRequired(), length(min=5, max=50)]
    )
    password = PasswordField(
        "Contraseña",
        validators=[DataRequired(), length(min=5)]
    )
    btnSubmit = SubmitField("Ingresar")

class saleForm(FlaskForm):
    saldatestart = DateField(
        "Fecha",
        validators=[DataRequired()]
    )

    saldateend = DateField(
        "Fecha fin",
        validators=[DataRequired()]
    )

    salprice = StringField(
        "Precio",
        validators=[DataRequired(), length(max=7)]
    )

    saldescription = TextAreaField(
        "Descripción"
    )

    cstid = SelectField(
        "Cliente",
        validators=[DataRequired()]
    )

    proid = HiddenField(validators=[DataRequired()])

    btnSubmit = SubmitField("Guardar")

class cstForm(FlaskForm):
    cstname = StringField(
        "Nombre",
        validators=[DataRequired(), length(min=3, max=50)]
    )
    cstlastname = StringField(
        "Apellido"
    )
    cstphonenumber = TelField(
        "Numero de Telefono"
    )
    btnSubmit = SubmitField("Guardar")

class plaForm(FlaskForm):
    planame = StringField(
        "Plataforma",
        validators=[DataRequired(), length(min=3)]
    )
    plaprofiles = IntegerField(
        "Perfiles Max",
        validators=[DataRequired(), NumberRange(min=1, max=10)]
    )
    btnSubmit = SubmitField("Guardar")

class accForm(FlaskForm):
    accnickname = StringField(
        "Apodo",
        validators=[DataRequired(), length(min=3)]
    )
    accprovider = StringField(
        "Proveedor",
        validators=[DataRequired(), length(min=3)]
    )
    accdatepay = DateField(
        "Fecha Pago",
        validators=[DataRequired()]
    )
    accemail = EmailField(
        "Correo"
    )
    accnumberphone = TelField(
        "Numero de celular"
    )
    accpassword = PasswordField(
        "Contraseña"
    )
    plaid= HiddenField(validators=[DataRequired()])
    btnSubmit = SubmitField("Guardar")

class proForm(FlaskForm):
    proprofile = StringField(
        "Perfil",
        validators=[DataRequired(), length(min=2)]
    )
    propin = StringField(
        "Pin"
    )
    accid = HiddenField(
        validators=[DataRequired()]
    )
    prostate = SelectField(
        "Estado",
        choices= [('enable', 'Disponible'), ('disable', 'No Disponible'), ('pending', 'Pendiente')]
    )
    btnSubmit = SubmitField("Guardar")

class mngForm(FlaskForm):
    mngemail = EmailField(
        "Correo",
        validators=[DataRequired()]
    )
    mngimap = StringField(
        "Imap",
        validators=[DataRequired(), length(min=10)]
    )
    mngpassword = PasswordField(
        "Clave de App",
        validators=[DataRequired(), length(min=16)]
    )
    mngfrom = StringField(
        "Remitente",
        validators=[DataRequired(), length(min=3)]
    )
    btnSubmit = SubmitField("Guardar")
