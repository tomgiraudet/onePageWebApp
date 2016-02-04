from flask import Flask
import json
import database_helper
import os,binascii

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello ! :)"


#tested
@app.route('/sign_in/<email>/<password>')
def sign_in(email, password):
    result = database_helper.user_exists(email=email, password=password)
    if result == 'true':
        token = binascii.b2a_hex(os.urandom(15))
        return json.dumps({'success': 'true', 'message': 'User is in the database', 'data': token})
    else:
        return json.dumps({'success': 'false', 'message': 'User is not in the database', 'data': ''})


#tested
@app.route('/sign_up/<email>/<password>/<firstname>/<familyname>/<gender>/<city>/<country>')
def sign_up(email, password, firstname, familyname, gender, city, country):
    exists = database_helper.user_exists(email=email, password=password)
    if exists == 'true':
        return json.dumps({'success': 'false', 'message': 'User already exists', 'data': ''})
    else:
        password = str(password)
        result = json.loads(database_helper.insert_user(email, password, firstname, familyname, gender, city, country))
        if result['success']:
            return json.dumps({'success': 'true', 'message': result['message'], 'data': ''})
        else:
            return json.dumps({'success': 'false', 'message': result['message'], 'data': ''})


@app.route('/sign_out/<token>')
def sign_out(token):
    result = database_helper.sign_out(token=token)
    success = result.success
    if success:
        return json.dumps({'success' : success, 'message': 'User unlogged'})
    else:
        return json.dumps({'success' : success, 'message': 'Failed to unlogged user'})


@app.route('/change_password/<token>/<old>/<new>')
def change_password(token, old, new):
    return 'change_password'


@app.route('/get_user_data_by_token/<token>')
def get_user_data_by_token(token):
    return database_helper.get_user_data_by_token(token=token)


@app.route('/get_user_data_by_email/<token>/<email>')
def get_user_data_by_email(token, email):
    return database_helper.get_user_data_by_email(token=token, email=email)


@app.route('/get_user_messages_by_token/<token>')
def get_user_messages_by_token(token):
    return 'get user messages by token'


@app.route('/get_user_messages_by_email/<token>/<email>')
def get_user_messages_by_email(token, email):
    return 'get user messages by email'


@app.route('/post_message/<token>/<message>/<email>')
def post_message(token, message, email):
    return 'post message'



if __name__ == '__main__':
    app.run(debug=True)