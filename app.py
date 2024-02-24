from flask import Flask, render_template, request, redirect, url_for
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId
from flask import flash, session

#import models
from models.user import User
from models.ride import Ride
from models.transaction import Transaction
from services.bidding_service import BiddingService
from services.license_verification import LicenseVerification
from services.notification_service import NotificationService
from services.payment_service import PaymentService
from utils.auth import auth_required
from utils.database import get_db

#routes
from api.ride_routes import ride_routes
from api.user_routes import user_routes

app = Flask(__name__)
app.secret_key = 'thisisthesecretkeyfornow'

# Database
app.config["MONGO_URI"] = "mongodb://localhost:27017/UserDB"
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
db = get_db()
app.register_blueprint(ride_routes, url_prefix='/api/rides')
app.register_blueprint(user_routes, url_prefix='/api/users')

#routes to pages
@app.route('/')
def index():
    return render_template('main.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        users = mongo.db.users
        email = request.form['email']
        user = users.find_one({'email': email})

        if user and bcrypt.check_password_hash(user['password'], request.form['password']):
            session['user'] = user['email']
            flash('You were successfully logged in', category='success')
            return redirect(url_for('index'))
        else:
            flash('Invalid email/password combination', category='error')

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        users = mongo.db.users
        existing_user = users.find_one({'email': request.form['email']})

        if existing_user is None:
            hashed_pw = bcrypt.generate_password_hash(request.form['password']).decode('utf-8')
            users.insert_one({
                'name': request.form['name'],
                'email': request.form['email'],
                'password': hashed_pw
            })
            flash('Registration successful!', category='success')
            return redirect(url_for('login'))
        else:
            flash('Email already exists.', category='error')

    return render_template('register.html')

@app.route('/booking')
@auth_required
def booking():
    #booking logic
    return render_template('booking.html')

@app.route('/ride/<ride_id>')
@auth_required
def ride_detail(ride_id):
    # ride logic
    return render_template('ride.html', ride_id=ride_id)

@app.errorhandler(500)
def internal_error(error):
    flash('An internal error occurred.', category='error')
    return render_template('error.html'), 500

@app.route('/profile', methods=['GET', 'POST'])
@auth_required
def profile():
    # Profile logic
    return render_template('profile.html')

# runapp
if __name__ == '__main__':
    app.run(debug=True)