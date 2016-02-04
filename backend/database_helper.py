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


def insert_user(email, password, firstname, familyname, gender, city, country):
    db = get_db()
    try:
        db.execute("INSERT INTO users VALUES (email, password, firstname, familyname, gender, city, country)")
        db.commit()
        close_db()
    except sqlite3.OperationalError, msg:
        return json.dumps({'success': 'false', 'message': msg})
    return json.dumps({'success': 'true', 'message': 'User added in the database'})


def sign_out(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from loggedUser WHERE token='" + token + "'")

    if cursor.fetchone() :
        cursor.execute("DELETE from loggedUser WHERE token='" + token + "'")
        return "true"
    else:
        return "false"


def get_user_data_by_token(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from loggedUser WHERE token='" + token + "'")

    if cursor.fetchone() :
        loggedUser = [dict(token=row[0], email=row[1]) for row in cursor.fetchall()]
        email = loggedUser[0]['email']
        cursor.execute("SELECT * from users WHERE email='" + email + "'")
        users = [dict(email=row[0], password=row[1], firstname=row[2], familyname=row[3], gender=row[4], city=row[5], country=row[6]) for row in cursor.fetchall()]
        close_db()
        return json.dumps({'success': 'true', 'message': 'Data transfered', 'data': {'email': users[0]['email'], 'password': user[0]['password'], 'firstname': user[0]['firstname'], 'familyname': user[0]['familyname'], 'gender': user[0]['gender'], 'city': user[0]['city'], 'country': user[0]['country']}})
    else:
        return json.dumps({'success': 'false', 'message': 'User unknown', 'data' : 'error'})


def get_user_data_by_email(token, email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from loggedUser WHERE token='" + token + "'")

    if cursor.fetchone() :
        cursor.execute("SELECT * from users WHERE email='" + email + "'")
        users = [dict(email=row[0], password=row[1], firstname=row[2], familyname=row[3], gender=row[4], city=row[5], country=row[6]) for row in cursor.fetchall()]
        close_db()
        return json.dumps({'success': 'true', 'message': 'Data transfered', 'data': {'email': users[0]['email'], 'password': user[0]['password'], 'firstname': user[0]['firstname'], 'familyname': user[0]['familyname'], 'gender': user[0]['gender'], 'city': user[0]['city'], 'country': user[0]['country']}})
    else:
        return json.dumps({'success': 'false', 'message': 'User unknown', 'data' : 'error'})


def get_user_messages_by_token(token):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from loggedUser WHERE token='" + token + "'")

    if cursor.fetchone() :
        loggedUser = [dict(token=row[0], email=row[1]) for row in cursor.fetchall()]
        email = loggedUser[0]['email']
        cursor.execute("SELECT * from message WHERE fromEmail='" + email + "'")
        messages = [dict(id=row[0], fromEmail=row[1], toEmail=row[2], content=row[3]) for row in cursor.fetchall()]
        if message.fetchone():
            messagesJson = json.dumps(messages, separators=(',', ':'), sort_keys=True)
            return json.dumps({'success': 'true', 'message': 'Messages transfered', 'data': messagesJson})
        else:
            return json.dumps({'success': 'false', 'message': 'No message found for this person', 'data': 'error'})
    else:
        return json.dumps({'success': 'false', 'message': 'User unknown', 'data' : 'error'})


def get_user_messages_by_email(token, email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from loggedUser WHERE token='" + token + "'")

    if cursor.fetchone() :
        cursor.execute("SELECT * from message WHERE fromEmail='" + email + "'")
        messages = [dict(id=row[0], fromEmail=row[1], toEmail=row[2], content=row[3]) for row in cursor.fetchall()]
        if message.fetchone():
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
