import binascii
import json
import os


from twidder import app
from flask import request

import database_helper

# Dictionnary with email-websocket of connected users
id_socket = {}

@app.route('/')
def index():
    return app.send_static_file('client.html')


# Connect to socket
@app.route("/connect_socket")
def connect_socket():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']

        connection_data = ws.receive()
        connection_id = json.loads(connection_data)
        email = connection_id['email']

        print("connection_data: "+str(connection_data))

        if not id_socket.has_key(str(email)):
            id_socket[str(email)] = ws
            print("socket: " + str(id_socket[str(email)]))
        else:
            return json.dumps({'success': False, 'message': 'User already logged', 'data': ''})

        # Active wait and listen on the socket
        while True:
            print("Waiting")
            msg = ws.receive()
            if msg == None:
                print('id_socket closing : ' + id_socket[str(email)])
                del id_socket[str(email)]
                ws.close()
                print('Websocket connection ended')
                return json.dumps({'success': True, 'message': 'Websocket connection ended', 'data': ''})

    else:
        return json.dumps({'success': False, 'message': 'Websocket not received', 'data': ''})


# Authenticates the username by the provided password
# Tested : V
@app.route('/sign_in', methods=['POST'])
def sign_in():
    if request.method == 'POST':

        data = request.json
        email = data['username']
        password = data['password']

        exist = database_helper.user_exists(email=email, password=password)
        if exist:
            if id_socket.has_key(str(email)):
                # Already connected on other device
                disconnect(email)
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
        email = request.json['email']
        password = request.json['password']
        firstname = request.json['firstname']
        familyname = request.json['familyname']
        gender = request.json['gender']
        city = request.json['city']
        country = request.json['country']

        exists = database_helper.user_exists(email=email, password=password)
        if exists:
            return json.dumps({'success': False, 'message': 'User already exists', 'data': ''})
        else:
            result = json.loads(
                database_helper.insert_user(email, password, firstname, familyname, gender, city, country))
            # user added to the database
            if result['success']:
                return connect(email)
            # user hasn't been added
            else:
                return json.dumps({'success': False, 'message': result['message'], 'data': ''})
    else:
        return json.dumps({'success': False, 'message': 'Not a POST method', 'data': ''})


# Disconnect a user
def disconnect(email):
    id_socket[str(email)].send(json.dumps({'success': False, 'message': "You've been logged out"}))
    database_helper.unlog_email(email)
    del id_socket[str(email)]
    return True


# Connect a user
# Tested : V
def connect(email):
    token = binascii.b2a_hex(os.urandom(15))
    logged = json.loads(database_helper.add_logged_user(token=token, email=email))
    if logged['success']:
        return json.dumps({'success': True, 'message': 'User is logged', 'data': token})
    else:
        return json.dumps({'success': False, 'message': logged['message'], 'data': ''})




# Signs out a user from the system
# Tested : V
@app.route('/sign_out', methods=['GET'])
def sign_out():
    print('Sign out')
    token = request.args.get('token', '')

    logged = database_helper.user_logged_by_token(token=token)

    if logged:
        print("Good if")
        email = database_helper.get_user_by_token(token)
        print("Email : " + str(email))
        del id_socket[str(email)]
        out = database_helper.sign_out(token=token)
        if out:
            # PROBLEM WITH THE EMAIL
            return json.dumps({'success' : True, 'message': 'User unlogged'})
        else:
            return json.dumps({'success' : False, 'message': 'Failed to unlogged user'})
    else:
        return json.dumps({'success' : True, 'message': 'User already logged out or nonexistent'})


# Changes the password of the current user to a new one.
# Tested: V
@app.route('/change_password', methods=['POST'])
def change_password():
    # check if the user is logged
    token = request.json['token']
    old = request.json['old']
    new = request.json['new']

    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.change_password(token=token, old_password=old, new_password=new)
    else:
        return json.dumps({'success' : False, 'message': 'User not logged'})


# Retrieves the stored data for the user logged with the token
# Tested : V
@app.route('/get_user_data_by_token', methods=['GET'])
def get_user_data_by_token():
    token = request.args.get('token', '')

    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.get_user_data_by_token(token=token)
    else:
        return json.dumps({'success': False, 'message': 'User not logged', 'data': []})


# Retrieves the stored data for the user specified by the passed email address
# Tested : V
@app.route('/get_user_data_by_email', methods=['GET'])
def get_user_data_by_email():
    token = request.args.get('token', '')
    email = request.args.get('email', '')

    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.get_user_data_by_email(email=email)
    else:
        return json.dumps({'success': False, 'message': 'User not logged', 'data': []})


# Retrieves the stored messages for the user logged with the token
# Tested : V
@app.route('/get_user_messages_by_token', methods=['GET'])
def get_user_messages_by_token():
    token = request.args.get('token', '')

    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.get_user_messages_by_token(token=token)
    else:
        return json.dumps({'success': False, 'message': 'User not logged', 'data': []})


# Retrieves the stored messages for the user specified by the passed email address
# Tested : V
@app.route('/get_user_messages_by_email', methods=['GET'])
def get_user_messages_by_email():
    token = request.args.get('token', '')
    email = request.args.get('email', '')

    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        return database_helper.get_user_messages_by_email(email=email)
    else:
        return json.dumps({'success': False, 'message': 'User not logged', 'data': []})


# Tries to post a message to the wall of the user specified by the email address
# Tested : V
@app.route('/post_message', methods=['POST'])
def post_message():
    token = request.json['token']
    message = request.json['message']
    email = request.json['email']


    logged = database_helper.user_logged_by_token(token=token)
    if logged:
        # user logged
        if not email == "":
            exists = database_helper.user_in_database(email=email)
            if exists:
                # target user exists
                return database_helper.post_message(token=token, message=message, email=email)
            else:
                return json.dumps({'success': False, 'message': 'User not in the database'})
        else:
            return database_helper.post_message(token=token, message=message, email=email)
    else:
        return json.dumps({'success': False, 'message': 'User not logged'})




#if __name__ == '__main__':
#    app.run(debug=True)