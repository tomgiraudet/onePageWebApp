from flask import g
import json
import sqlite3

DATABASE = '/Users/juliettegonzalez/PycharmProjects/onePageWebApp/backend/database.db'


def connect_db():
    return sqlite3.connect(DATABASE)


def close_db():
    get_db().close()


def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g._database = connect_db()
    return db


def user_exists(email, password):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email, password from users WHERE email='" + email + "' AND password='" + password +"'")
    close_db()
    if cursor.fetchone():
        return "true"
    else:
        return "false"


# Check if the user is already logged with email id
def user_logged(email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email from loggedUser WHERE email='" + email + "'")
    close_db()
    if cursor.fetchone():
        return "true"
    else:
        return "false"


# Check if the user is already logged with token id
def user_logged_by_token(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email from loggedUser WHERE token='" + token + "'")
    close_db()
    if cursor.fetchone():
        return "true"
    else:
        return "false"



def add_logged_user(token, email):
    db = get_db()
    try:
        db.execute("INSERT INTO loggedUser VALUES (?, ?)", (token, email))
        db.commit()
        close_db()
        return json.dumps({'success': 'true', 'message': 'User added in the logged database'})
    except sqlite3.OperationalError, msg:
        return json.dumps({'success': 'false', 'message': msg})



def insert_user(email, password, firstname, familyname, gender, city, country):
    db = get_db()
    try:
        db.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)", (email, password, firstname, familyname, gender, city, country))
        db.commit()
        close_db()
    except sqlite3.OperationalError, msg:
        return json.dumps({'success': 'false', 'message': msg})
    return json.dumps({'success': 'true', 'message': 'User added in the database'})


def sign_out(token):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE from loggedUser WHERE token='" + token + "'")
        db.commit()
        close_db()
        return 'true'
    except sqlite3.OperationalError, msg:
        return 'false'


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
        return json.dumps({'success': 'true', 'message': 'Password changed'})
    else:
        return json.dumps({'success': 'false', 'message': 'Wrong password'})



def get_user_data_by_token(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users INNER JOIN loggedUser ON users.email=loggedUser.email WHERE loggedUser.token ='"+ token +"'")
    user_data = cursor.fetchone()
    close_db()
    return json.dumps({'success': 'true', 'message': 'Data transfered', 'data': {'email': user_data[0], 'firstname': user_data[2], 'familyname': user_data[3], 'gender': user_data[4], 'city': user_data[5], 'country': user_data[6]}})



def get_user_data_by_email(email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from users WHERE email='" + email + "'")
    user_data = cursor.fetchone()
    close_db()
    return json.dumps({'success': 'true', 'message': 'Data transfered', 'data': {'email': user_data[0], 'firstname': user_data[2], 'familyname': user_data[3], 'gender': user_data[4], 'city': user_data[5], 'country': user_data[6]}})



def get_user_messages_by_token(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email FROM loggedUser WHERE token ='"+ token +"'")
    email = cursor.fetchone()[0]
    cursor.execute("SELECT fromEmail, content FROM messages WHERE toEmail ='"+ email +"'")
    users_messages = cursor.fetchall()

    for message in users_messages:
        post = json.dumps({'fromEmail' : message[0], 'content': message[1]})
        return post

''''
    if cursor.fetchone() :
        loggedUser = [dict(token=row[0], email=row[1]) for row in cursor.fetchall()]
        email = loggedUser[0]['email']
        cursor.execute("SELECT * from message WHERE fromEmail='" + email + "'")
        messages = [dict(id=row[0], fromEmail=row[1], toEmail=row[2], content=row[3]) for row in cursor.fetchall()]
        if messages.fetchone():
            messagesJson = json.dumps(messages, separators=(',', ':'), sort_keys=True)
            return json.dumps({'success': 'true', 'message': 'Messages transfered', 'data': messagesJson})
        else:
            return json.dumps({'success': 'false', 'message': 'No message found for this person', 'data': 'error'})
    else:
        return json.dumps({'success': 'false', 'message': 'User unknown', 'data' : 'error'})
        '''''


def get_user_messages_by_email(token, email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from loggedUser WHERE token='" + token + "'")

    if cursor.fetchone() :
        cursor.execute("SELECT * from message WHERE fromEmail='" + email + "'")
        messages = [dict(id=row[0], fromEmail=row[1], toEmail=row[2], content=row[3]) for row in cursor.fetchall()]
        if messages.fetchone():
            messagesJson = json.dumps(messages, separators=(',', ':'), sort_keys=True)
            return json.dumps({'success': 'true', 'message': 'Messages transfered', 'data': messagesJson})
        else:
            return json.dumps({'success': 'false', 'message': 'No message found for this person', 'data': 'error'})
    else:
        return json.dumps({'success': 'false', 'message': 'User unknown', 'data' : 'error'})



def post_message(token, message, email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from loggedUser WHERE token='" + token + "'")

    if cursor.fetchone() :
        #The user is connected
        loggedUser = [dict(token=row[0], email=row[1]) for row in cursor.fetchall()]
        _fromEmail = loggedUser[0]['email']

        cursor.execute("SELECT * from users WHERE email='" + email + "'")
        if cursor.fetchone() :
            #The targeted user exist
            cursor.execute("INSERT INTO messages (fromEmail, toEmail, content)VALUES (_fromEmail, email, message)")
            return json.dumps({'success': 'true', 'message': 'Message posted'})
        else:
            return json.dumps({'success': 'false', 'message': 'Targeted User unknown'})
    else:
        #User not connected
        return json.dumps({'success': 'false', 'message': 'User unknown'})
