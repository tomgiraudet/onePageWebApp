from flask import Flask
from flask import request
import json
import database_helper
import os,binascii

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello ! :)"


# Authenticates the username by the provided password
# Tested : V
@app.route('/sign_in', methods=['POST'])
def sign_in():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        exist = database_helper.user_exists(email=email, password=password)
        if exist:
                return connect(email)
        else:
            return json.dumps({'success': False, 'message': 'User is not in the database', 'data': ''})
    else:
        return json.dumps({'success': False, 'message': 'Not a POST method', 'data': ''})


# Registers a user in the database.
# tested : V
@app.route('/sign_up', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        firstname = request.form['firstname']
        familyname = request.form['familyname']
        gender = request.form['gender']
        city = request.form['city']
        country = request.form['country']

        exists = database_helper.user_exists(email=email, password=password)
        if exists:
            return json.dumps({'success': False, 'message': 'User already exists', 'data': ''})
        else:
            result = json.loads(database_helper.insert_user(email, password, firstname, familyname, gender, city, country))
            # user added to the database
            if result['success']:
                return connect(email)
            # user hasn't been added
            else:
                return json.dumps({'success': False, 'message': result['message'], 'data': ''})
    else:
        return json.dumps({'success': False, 'message': 'Not a POST method', 'data': ''})


# Connect a user
# Tested : V
def connect(email):
    if not database_helper.user_logged(email):
        token = binascii.b2a_hex(os.urandom(15))
        logged = json.loads(database_helper.add_logged_user(token=token, email=email))
        if logged['success']:
            return json.dumps({'success': True, 'message': 'User is logged', 'data': token})
        else:
            return json.dumps({'success': False, 'message': logged['message'], 'data': ''})
    else:
        return json.dumps({'success': False, 'message': 'User already connected', 'data': ''})


# Signs out a user from the system
# Tested : V
@app.route('/sign_out/<token>')
def sign_out(token):
    logged = database_helper.user_logged_by_token(token=token)

    if logged:
        out = database_helper.sign_out(token=token)
        if out:
            return json.dumps({'success' : True, 'message': 'User unlogged'})
        else:
            return json.dumps({'success' : False, 'message': 'Failed to unlogged user'})
    else:
        return json.dumps({'success' : True, 'message': 'User already logged out or nonexistent'})


# Changes the password of the current user to a new one.
# Tested: V
@app.route('/change_password/<token>/<old>/<new>')
def change_password(token, old, new):
    # check if the user is logged
    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.change_password(token=token, old_password=old, new_password=new)
    else:
        return json.dumps({'success' : False, 'message': 'User not logged'})


# Retrieves the stored data for the user logged with the token
# Tested : V
@app.route('/get_user_data_by_token/<token>')
def get_user_data_by_token(token):
    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.get_user_data_by_token(token=token)
    else:
        return json.dumps({'success': False, 'message': 'User not logged', 'data': []})


# Retrieves the stored data for the user specified by the passed email address
# Tested : V
@app.route('/get_user_data_by_email/<token>/<email>')
def get_user_data_by_email(token, email):
    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.get_user_data_by_email(email=email)
    else:
        return json.dumps({'success': False, 'message': 'User not logged', 'data': []})


# Retrieves the stored messages for the user logged with the token
# Tested : V
@app.route('/get_user_messages_by_token/<token>')
def get_user_messages_by_token(token):
    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.get_user_messages_by_token(token=token)
    else:
        return json.dumps({'success': False, 'message': 'User not logged', 'data': []})


# Retrieves the stored messages for the user specified by the passed email address
# Tested : V
@app.route('/get_user_messages_by_email/<token>/<email>')
def get_user_messages_by_email(token, email):
    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.get_user_messages_by_email(email=email)
    else:
        return json.dumps({'success': False, 'message': 'User not logged', 'data': []})


# Tries to post a message to the wall of the user specified by the email address
# Tested : V
@app.route('/post_message/<token>/<message>/<email>')
def post_message(token, message, email):
    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        # user logged
        exists = database_helper.user_in_database(email=email)
        if exists:
            # target user exists
            return database_helper.post_message(token=token, message=message, email=email)
        else:
            return json.dumps({'success': False, 'message': 'User not in the database'})
    else:
        return json.dumps({'success': False, 'message': 'User not logged'})



if __name__ == '__main__':
    app.run(debug=True)