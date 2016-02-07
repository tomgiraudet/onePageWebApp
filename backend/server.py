from flask import Flask
import json
import database_helper
import os,binascii

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello ! :)"


# Authenticates the username by the provided password
# Tested : V
@app.route('/sign_in/<email>/<password>')
def sign_in(email, password):
    result = database_helper.user_exists(email=email, password=password)
    if result == 'true':
            return connect(email)
    else:
        return json.dumps({'success': 'false', 'message': 'User is not in the database', 'data': ''})


# Registers a user in the database.
# tested : V
@app.route('/sign_up/<email>/<password>/<firstname>/<familyname>/<gender>/<city>/<country>')
def sign_up(email, password, firstname, familyname, gender, city, country):
    exists = database_helper.user_exists(email=email, password=password)
    if exists == 'true':
        return json.dumps({'success': 'false', 'message': 'User already exists', 'data': ''})
    else:
        result = json.loads(database_helper.insert_user(email, password, firstname, familyname, gender, city, country))
        # user added to the database
        if result['success'] == 'true':
            return connect(email)
        # user hasn't been added
        else:
            return json.dumps({'success': 'false', 'message': result['message'], 'data': ''})


# Connect a user
# Tested : V
def connect(email):
    if database_helper.user_logged(email) == 'false':
        token = binascii.b2a_hex(os.urandom(15))
        logged = json.loads(database_helper.add_logged_user(token=token, email=email))
        if logged['success'] == 'true':
            return json.dumps({'success': 'true', 'message': 'User is logged', 'data': token})
        else:
            return json.dumps({'success': 'false', 'message': logged['message'], 'data': ''})
    else:
        return json.dumps({'success': 'false', 'message': 'User already connected', 'data': ''})


# Signs out a user from the system
# Tested : V
@app.route('/sign_out/<token>')
def sign_out(token):
    logged = database_helper.user_logged_by_token(token=token)

    if logged == 'true':
        out = database_helper.sign_out(token=token)
        if out == 'true':
            return json.dumps({'success' : 'true', 'message': 'User unlogged'})
        else:
            return json.dumps({'success' : 'false', 'message': 'Failed to unlogged user'})
    else:
        return json.dumps({'success' : 'true', 'message': 'User already logged out or nonexistent'})


# Changes the password of the current user to a new one.
# A VERIFIER: rend wrong parfois alors que le mot de passe change
@app.route('/change_password/<token>/<old>/<new>')
def change_password(token, old, new):
    # check if the user is logged
    logged = database_helper.user_logged_by_token(token=token)
    if logged == 'true':
        return database_helper.change_password(token=token, old_password=old, new_password=new)
    else:
        return json.dumps({'success' : 'false', 'message': 'User not logged'})


# Retrieves the stored data for the user logged with the token
# Tested : V
@app.route('/get_user_data_by_token/<token>')
def get_user_data_by_token(token):
    logged = database_helper.user_logged_by_token(token=token)
    if logged == 'true':
        return database_helper.get_user_data_by_token(token=token)
    else:
        return json.dumps({'success': 'false', 'message': 'User not logged', 'data': []})


# Retrieves the stored data for the user specified by the passed email address
# Tested : V
@app.route('/get_user_data_by_email/<token>/<email>')
def get_user_data_by_email(token, email):
    logged = database_helper.user_logged_by_token(token=token)
    if logged == 'true':
        return database_helper.get_user_data_by_email(email=email)
    else:
        return json.dumps({'success': 'false', 'message': 'User not logged', 'data': []})


# Retrieves the stored messages for the user logged with the token
# Tested :
@app.route('/get_user_messages_by_token/<token>')
def get_user_messages_by_token(token):
    logged = database_helper.user_logged_by_token(token=token)
    if logged == 'true':
        return database_helper.get_user_messages_by_token(token=token)
    else:
        return json.dumps({'success': 'false', 'message': 'User not logged', 'data': []})


@app.route('/get_user_messages_by_email/<token>/<email>')
def get_user_messages_by_email(token, email):
    return database_helper.get_user_messages_by_email(token=token, email=email)


@app.route('/post_message/<token>/<message>/<email>')
def post_message(token, message, email):
    return database_helper.post_message(token=token, message=message, email=email)



if __name__ == '__main__':
    app.run(debug=True)