from flask_wtf import FlaskForm
from wtforms import StringField, DateField, IntegerField, TextAreaField, SelectField, HiddenField, PasswordField, SubmitField, EmailField, TelField
from wtforms.validators import DataRequired, NumberRange,length

class saleForm(FlaskForm):
    saldatestart = DateField(
        "Fecha inicio",
        validators=[DataRequired()]
    )

    saldateend = DateField(
        "Fecha fin",
        validators=[DataRequired()]
    )

    salprice = IntegerField(
        "Precio",
        validators=[NumberRange(min=1000), DataRequired()]
    )

    saldescription = TextAreaField(
        "Descripción"
    )

    cstid = SelectField(
        "Cliente",
        validators=[DataRequired()]
    )

    proid = HiddenField()

    submit = SubmitField("Guardar")

class cstForm(FlaskForm):
    cstname = StringField(
        "Nombre",
        validators=[DataRequired(), length(min=3)]
    )
    cstlastname = StringField(
        "Apellido",
        validators=[DataRequired(), length(min=3)]
    )
    cstphonenumber = StringField(
        "Telefono",
        validators=[DataRequired(), length(min=10, max=10)]
    )
    submit = SubmitField("Guardar")

class plaForm(FlaskForm):
    planame = StringField(
        "Plataforma",
        validators=[DataRequired(), length(min=3)]
    )
    plaprofiles = IntegerField(
        "Perfiles Max",
        validators=[DataRequired(), NumberRange(min=1, max=10)]
    )
    submit = SubmitField("Guardar")
    
class accForm(FlaskForm):
    accnickname = StringField(
        "Apodo",
        validators=[DataRequired(), length(min=3)]
    )
    accprovider = StringField(
        "proveedor",
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
        "Telefono"
    )
    accpassword = PasswordField(
        "Contraseña",
        validators=[length(min=6)]
    )
    plaid= HiddenField(
        
    )
    submit = SubmitField("Guardar")
    
class proForm(FlaskForm):
    proprofile = StringField(
        "Perfil",
        validators=[DataRequired()]
    )
    propin = StringField(
        "Pin",
        validators=[length(min=1, max=8)]
    )
    accid = HiddenField(
    )
    submit = SubmitField("Guardar")
    
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
    submit = SubmitField("Guardar")