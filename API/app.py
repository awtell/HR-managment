from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
import logging
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:charbel1@localhost/inetrn'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

db = SQLAlchemy(app)
ma = Marshmallow(app)
jwt = JWTManager(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fName = db.Column(db.String(50))
    lName = db.Column(db.String(50))
    company = db.Column(db.String(50))
    address = db.Column(db.String(50))
    city = db.Column(db.String(50))
    country = db.Column(db.String(50))
    color = db.Column(db.String(50))
    phone = db.Column(db.String(50))
    password = db.Column(db.String(255))
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(50), default='user')

    def __init__(self, fName, lName, company, address, city, country, color, phone, password, email, role='user'):
        self.fName = fName
        self.lName = lName
        self.company = company
        self.address = address
        self.city = city
        self.country = country
        self.color = color
        self.phone = phone
        self.password = generate_password_hash(password)
        self.email = email
        self.role = role


class Admins(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password = generate_password_hash(password)


class UsersSchema(ma.Schema):
    class Meta:
        fields = ('id', 'fName', 'lName', 'company', 'address',
                  'city', 'country', 'color', 'phone', 'password', 'email', 'role')


class AdminsSchema(ma.Schema):
    class Meta:
        fields = ('id', 'email', 'password')


user_schema = UsersSchema()
users_schema = UsersSchema(many=True)
admin_schema = AdminsSchema()
admins_schema = AdminsSchema(many=True)


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400

    email = data.get('email')
    password = data.get('password')

    user = Users.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(
            identity={'email': user.email, 'role': user.role})
        return jsonify({"access_token": access_token, "user_type": "user", "role": user.role}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400

    email = data.get('email')
    password = data.get('password')

    admin = Admins.query.filter_by(email=email).first()

    if admin and check_password_hash(admin.password, password):
        access_token = create_access_token(
            identity={'email': admin.email, 'role': 'admin'})
        return jsonify({"access_token": access_token, "user_type": "admin", "role": "admin"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


@app.route('/admin', methods=['POST'])
def create_admin():
    email = request.json['email']
    password = request.json['password']
    new_admin = Admins(email, password)
    db.session.add(new_admin)
    db.session.commit()
    return admin_schema.jsonify(new_admin)


@app.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_identity = get_jwt_identity()
    email = current_user_identity.get('email')
    role = current_user_identity.get('role')

    user = Users.query.filter_by(email=email).first()

    if user:
        return jsonify({
            "id": user.id,
            "email": user.email,
            "role": role
        }), 200
    else:
        return jsonify({"error": "User not found"}), 404


@app.route('/user', methods=['GET', 'POST'])
@jwt_required()
def handle_user():
    current_user = get_jwt_identity()
    limit = request.args.get('limit', default=10, type=int)
    if request.method == 'POST':
        data = request.json
        app.logger.debug(f"Incoming data: {data}")

        required_fields = ['fName', 'lName', 'company', 'address',
                           'city', 'country', 'color', 'phone', 'password', 'email', 'role']
        missing_fields = [
            field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({"error": "Missing data", "missing_fields": missing_fields}), 400

        try:
            new_user = Users(
                fName=data['fName'], lName=data['lName'], company=data['company'],
                address=data['address'], city=data['city'], country=data['country'],
                color=data['color'], phone=data['phone'], password=data['password'],
                email=data['email'], role=data['role']
            )

            db.session.add(new_user)
            db.session.commit()

            return user_schema.jsonify(new_user), 201
        except Exception as e:
            app.logger.error(f"Error: {str(e)}")
            return jsonify({"error": "Database error", "details": str(e)}), 500

    else:  # GET request
        if current_user:
            all_users = Users.query.all()
            result = users_schema.dump(all_users)
            return jsonify(result)
        else:
            return jsonify({"message": "Unauthorized"}), 401


@app.route('/user/<id>', methods=['DELETE', 'PUT'])
@jwt_required()
def handle_user_id(id):
    user = Users.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return user_schema.jsonify(user)

    elif request.method == 'PUT':
        data = request.json

        for key in data:
            if hasattr(user, key):
                setattr(user, key, data[key])

        try:
            db.session.commit()
            return user_schema.jsonify(user)
        except Exception as e:
            return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
