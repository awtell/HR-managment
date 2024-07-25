from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import logging

app = Flask(__name__)

# Apply CORS settings to the /user route only
CORS(app, resources={r"/user/*": {"origins": "http://localhost:3000"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:charbel1@localhost/inetrn'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

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
    password = db.Column(db.String(50))

    def __init__(self, fName, lName, company, address, city, country, color, phone, password):
        self.fName = fName
        self.lName = lName
        self.company = company
        self.address = address
        self.city = city
        self.country = country
        self.color = color
        self.phone = phone
        self.password = password


class UsersSchema(ma.Schema):
    class Meta:
        fields = ('id', 'fName', 'lName', 'company', 'address',
                  'city', 'country', 'color', 'phone', 'password')


user_schema = UsersSchema()
users_schema = UsersSchema(many=True)


@app.route('/user', methods=['GET', 'POST'])
def handle_user():
    if request.method == 'POST':
        logging.debug("Received POST request")
        data = request.json
        logging.debug(f"Request data: {data}")
        fName = data.get('fName')
        lName = data.get('lName')
        company = data.get('company')
        address = data.get('address')
        city = data.get('city')
        country = data.get('country')
        color = data.get('color')
        phone = data.get('phone')
        password = data.get('password')

        if not all([fName, lName, company, address, city, country, color, phone, password]):
            logging.error("Missing data in the request")
            return jsonify({"error": "Missing data"}), 400

        new_user = Users(fName, lName, company, address,
                         city, country, color, phone, password)

        db.session.add(new_user)
        db.session.commit()

        logging.debug("User added successfully")

        return user_schema.jsonify(new_user), 201
    else:  # GET request
        logging.debug("Received GET request")
        all_users = Users.query.all()
        result = users_schema.dump(all_users)
        return jsonify(result)


@app.route('/user/<id>', methods=['DELETE'])
def delete_user(id):
    logging.debug("Received DELETE request")
    user = Users.query.get(id)
    if not user:
        logging.error("User not found")
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    logging.debug("User deleted successfully")
    return user_schema.jsonify(user)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
