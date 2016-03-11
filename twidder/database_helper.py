from flask import g
import json
import sqlite3

DATABASE = 'twidder/database.db'

def connect_db():
    return sqlite3.connect(DATABASE)


def close_db():
    get_db().close()


def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g._database = connect_db()
    return db


# Check if user with the email email is in the database
def user_in_database(email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email from users WHERE email='" + email + "'")
    close_db()
    if cursor.fetchone():
        return True
    else:
        return False


def user_exists(email, password):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email, password from users WHERE email='" + email + "' AND password='" + password +"'")
    close_db()
    if cursor.fetchone():
        return True
    else:
        return False


# Get user's email by token
def get_user_by_token(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email from loggedUser WHERE token='" + token + "'")
    email = cursor.fetchone()
    close_db()
    return email[0]


# Check if the user is already logged with email id
def user_logged(email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email from loggedUser WHERE email='" + email + "'")
    close_db()
    if cursor.fetchone():
        return True
    else:
        return False


# Unlog user with email
def unlog_email(email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE from loggedUser WHERE email='" + email + "'")
    db.commit()
    close_db()
    return True


# Check if the user is already logged with token id
def user_logged_by_token(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email from loggedUser WHERE token='" + token + "'")
    close_db()
    if cursor.fetchone():
        return True
    else:
        return False


def add_logged_user(token, email):
    db = get_db()
    try:
        db.execute("INSERT INTO loggedUser VALUES (?, ?)", (token, email))
        db.commit()
        close_db()
        return json.dumps({'success': True, 'message': 'User added in the logged database'})
    except sqlite3.OperationalError, msg:
        return json.dumps({'success': False, 'message': msg})


def insert_user(email, password, firstname, familyname, gender, city, country):
    db = get_db()
    try:
        db.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)", (email, password, firstname, familyname, gender, city, country))
        db.commit()
        close_db()
    except sqlite3.OperationalError, msg:
        return json.dumps({'success': False, 'message': msg})
    return json.dumps({'success': True, 'message': 'User added in the database'})


def sign_out(token):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE from loggedUser WHERE token='" + token + "'")
        db.commit()
        close_db()
        return True
    except sqlite3.OperationalError, msg:
        return False


# change password
def change_password(token, old_password, new_password):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT password FROM users INNER JOIN loggedUser ON users.email=loggedUser.email WHERE loggedUser.token ='"+ token +"'")
    db_password = cursor.fetchone()[0]
    cursor.execute("SELECT email FROM loggedUser WHERE token ='"+ token +"'")
    email = cursor.fetchone()[0]
    if db_password == old_password:
        cursor.execute("UPDATE users SET password='"+ new_password +"' WHERE email='"+ email +"'")
        db.commit()
        close_db()
        return json.dumps({'success': True, 'message': 'Password changed'})
    else:
        return json.dumps({'success': False, 'message': 'Wrong password'})



def get_user_data_by_token(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users INNER JOIN loggedUser ON users.email=loggedUser.email WHERE loggedUser.token ='"+ token +"'")
    user_data = cursor.fetchone()
    close_db()
    return json.dumps({'success': True, 'message': 'Data transfered', 'data': {'email': user_data[0], 'firstname': user_data[2], 'familyname': user_data[3], 'gender': user_data[4], 'city': user_data[5], 'country': user_data[6]}})



def get_user_data_by_email(email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from users WHERE email='" + email + "'")
    user_data = cursor.fetchone()
    close_db()
    return json.dumps({'success': True, 'message': 'Data transfered', 'data': {'email': user_data[0], 'firstname': user_data[2], 'familyname': user_data[3], 'gender': user_data[4], 'city': user_data[5], 'country': user_data[6]}})



def get_user_messages_by_token(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email FROM loggedUser WHERE token ='"+ token +"'")
    email = cursor.fetchone()[0]
    cursor.execute("SELECT fromEmail, content FROM messages WHERE toEmail ='" + email + "'")
    users_messages = cursor.fetchall()
    array_messages = []
    for message in users_messages:
        post = json.dumps({'fromEmail' : message[0], 'content': message[1]})
        array_messages.append(post)
    if len(array_messages) == 0:
        return json.dumps({'success': False, 'message': 'No message found for this person', 'data': []})
    else:
        return json.dumps({'success': True, 'message': 'Messages transfered', 'data': array_messages})



def get_user_messages_by_email(email):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT fromEmail, content from messages WHERE toEmail='" + email + "'")
    users_messages = cursor.fetchall()
    array_messages = []
    for message in users_messages:
        post = json.dumps({'fromEmail' : message[0], 'content': message[1]})
        array_messages.append(post)
    if len(array_messages) == 0:
        return json.dumps({'success': False, 'message': 'No message found for this person', 'data': []})
    else:
        return json.dumps({'success': True, 'message': 'Messages transfered', 'data': array_messages})


def post_message(token, message, email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email from loggedUser WHERE token='" + token + "'")
    fromEmail = cursor.fetchone()[0]
    if email == '':
        db.execute("INSERT INTO messages (fromEmail, toEmail, content) VALUES (?, ?, ?)", (fromEmail, fromEmail, message))
    else:
        db.execute("INSERT INTO messages (fromEmail, toEmail, content) VALUES (?, ?, ?)", (fromEmail, email, message))
    db.commit()
    return json.dumps({'success': True, 'message': 'Message posted'})


# GET LIVE DATA

# Getting number of post on one user's wall
def get_number_post(email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT COUNT(id) from messages WHERE toEmail='" + email + "'")
    number = cursor.fetchone()[0]
    return json.dumps({'success': True, 'message': 'Number of message found', 'data': number})


# Getting number of connected person
def get_number_connected_users():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT COUNT(email) from users")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(email) from loggedUser")
    number = cursor.fetchone()[0]

    result = float((number/total) * 100)
    return json.dumps({'success': True, 'message': 'Number of users found', 'data': result})