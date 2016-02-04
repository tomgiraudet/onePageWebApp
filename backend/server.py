from flask import Flask
import json
import database_helper
import os,binascii

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello ! :)"


@app.route('/sign_in/<email>/<password>')
def sign_in(email, password):
    #binascii.b2a_hex(os.urandom(15))
    result = database_helper.signin_user(email=email, password=password)
    success = 'true'

    return json.dumps({'success': success, 'message': 'Everything went great', 'data': result})



@app.route('/sign_up/<email>/<password>/<firstname>/<familyname>/<gender>/<city>/<country>')
def sign_up(email, password, firstname, familyname, gender, city, country):
    return 'sign_up'


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