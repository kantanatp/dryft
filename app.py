from flask import flash, Flask, jsonify, redirect, render_template, request, url_for, session
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename

from services.license_verification import LicenseVerificationService

import os

app = Flask(__name__)
app.secret_key = 'thisisthesecretkeyfornow'


verifier = LicenseVerificationService("esBHHXCPEZj3QNt0puCp", "k-fqyfn", "1")

def process_file(file_path):
    success, details = verifier.extract_details(file_path)
    formatted_output = []
    
    for label, value in details.items():
        if value is not None:
            formatted_output.append(f"{label}: {value}")
            
    if success:
        return True, formatted_output
    else:
        return False, None

#routes to pages
@app.route('/')
def login():
    return render_template('login.html')

@app.route('/register-passenger', methods=['GET', 'POST'])
def registerpassenger():
    return render_template('register-passenger.html')

@app.route('/register-driver', methods=['GET', 'POST'])
def registerdriver():
    return render_template('register-driver.html')

# Add configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'heic'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit the size of uploads to 16MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/driver-auth', methods=['GET'])
def driver_auth():
    return render_template('driver-auth.html')
    
@app.route('/driver-auth', methods=['POST'])
def handle_upload():
    if 'licenseFile' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'})
    file = request.files['licenseFile']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'})
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Process the file
        success, details = process_file(file_path)
        if success:
            # File processed successfully
            print(details)
            return jsonify({'success': True, 'message': 'Processing successful', 'details':  details})
        else:
            # File processing failed
            return jsonify({'success': False, 'message': 'Processing failed, upload another file'})
    else:
        return jsonify({'success': False, 'message': 'Invalid file format'})
        
@app.route('/main', methods=['GET', 'POST'])
def main():
    return render_template('main.html')


# runapp
if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)

# from flask import flash, Flask, redirect, render_template, request, url_for, session
# from flask_pymongo import PyMongo
# from flask_bcrypt import Bcrypt
# from bson.objectid import ObjectId
# from werkzeug.utils import secure_filename

# #import models
# from models.user import User
# from models.ride import Ride
# from models.transaction import Transaction
# from services.bidding_service import BiddingService
# from services.license_verification import LicenseVerification
# from services.notification_service import NotificationService
# from services.payment_service import PaymentService
# from utils.auth import auth_required
# from utils.database import get_db

# #routes
# from api.ride_routes import ride_routes
# from api.user_routes import user_routes

# import os

# app = Flask(__name__)
# app.secret_key = 'thisisthesecretkeyfornow'

# # Database
# app.config["MONGO_URI"] = "mongodb://localhost:27017/UserDB"
# mongo = PyMongo(app)
# bcrypt = Bcrypt(app)
# db = get_db()
# app.register_blueprint(ride_routes, url_prefix='/api/rides')
# app.register_blueprint(user_routes, url_prefix='/api/users')

# #routes to pages
# @app.route('/')
# def index():
#     return render_template('main.html')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         users = mongo.db.users
#         email = request.form['email']
#         user = users.find_one({'email': email})

#         if user and bcrypt.check_password_hash(user['password'], request.form['password']):
#             session['user'] = user['email']
#             flash('You were successfully logged in', category='success')
#             return redirect(url_for('index'))
#         else:
#             flash('Invalid email/password combination', category='error')

#     return render_template('login.html')

# @app.route('/register', methods=['GET', 'POST'])
# def register():
#     if request.method == 'POST':
#         users = mongo.db.users
#         existing_user = users.find_one({'email': request.form['email']})

#         if existing_user is None:
#             hashed_pw = bcrypt.generate_password_hash(request.form['password']).decode('utf-8')
#             users.insert_one({
#                 'name': request.form['name'],
#                 'email': request.form['email'],
#                 'password': hashed_pw
#             })
#             flash('Registration successful!', category='success')
#             return redirect(url_for('login'))
#         else:
#             flash('Email already exists.', category='error')

#     return render_template('register.html')

# @app.route('/booking')
# @auth_required
# def booking():
#     #booking logic
#     return render_template('booking.html')

# @app.route('/ride/<ride_id>')
# @auth_required
# def ride_detail(ride_id):
#     # ride logic
#     return render_template('ride.html', ride_id=ride_id)

# @app.errorhandler(500)
# def internal_error(error):
#     flash('An internal error occurred.', category='error')
#     return render_template('error.html'), 500

# @app.route('/profile', methods=['GET', 'POST'])
# @auth_required
# def profile():
#     # Profile logic
#     return render_template('profile.html')

# # Add configuration for file uploads
# UPLOAD_FOLDER = 'uploads'
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit the size of uploads to 16MB

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route('/upload-license', methods=['GET', 'POST'])
# @auth_required
# def upload_license():
#     if request.method == 'POST':
#         # Check if the post request has the file part
#         if 'license' not in request.files:
#             flash('No file part', category='error')
#             return redirect(request.url)
#         file = request.files['license']
#         # If the user does not select a file, the browser submits an
#         # empty file without a filename.
#         if file.filename == '':
#             flash('No selected file', category='error')
#             return redirect(request.url)
#         if file and allowed_file(file.filename):
#             filename = secure_filename(file.filename)
#             file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             file.save(file_path)
#             flash('File uploaded successfully', category='success')
#             # Here you can call your license verification service
#             # For example: LicenseVerification.verify(file_path)
#             return redirect(url_for('profile'))
#     # If it's a GET request or if the file upload failed
#     return render_template('upload_license.html')

# # runapp
# if __name__ == '__main__':
#     if not os.path.exists(UPLOAD_FOLDER):
#         os.makedirs(UPLOAD_FOLDER)
#     app.run(debug=True)
    
    
