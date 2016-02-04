from flask import g
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

def signin_user(email, password):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT email, password from users WHERE email='" + email + "' AND password='" + password +"'")
    users = [dict(email=row[0], password=row[1]) for row in cursor.fetchall()]
    close_db()
    return users[0]['email'] + " password: " + users[0]['password']


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
        return json.dumps({'success': 'true', 'message': 'Data transfered', 'email': users[0]['email'], 'password': user[0]['password'], 'firstname': user[0]['firstname'], 'familyname': user[0]['familyname'], 'gender': user[0]['gender'], 'city': user[0]['city'], 'country': user[0]['country']})
    else:
        return json.dumps({'success': 'false', 'message': 'User unknown', 'email': 'error', 'password': 'error', 'firstname': 'error', 'familyname': 'error', 'gender': 'error', 'city': 'error', 'country': 'error'})


def get_user_data_by_email(token, email):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * from loggedUser WHERE token='" + token + "'")

    if cursor.fetchone() :
        loggedUser = [dict(token=row[0], email=row[1]) for row in cursor.fetchall()]
        cursor.execute("SELECT * from users WHERE email='" + email + "'")
        users = [dict(email=row[0], password=row[1], firstname=row[2], familyname=row[3], gender=row[4], city=row[5], country=row[6]) for row in cursor.fetchall()]
        close_db()
        return json.dumps({'success': 'true', 'message': 'Data transfered', 'email': users[0]['email'], 'password': user[0]['password'], 'firstname': user[0]['firstname'], 'familyname': user[0]['familyname'], 'gender': user[0]['gender'], 'city': user[0]['city'], 'country': user[0]['country']})
    else:
        return json.dumps({'success': 'false', 'message': 'User unknown', 'email': 'error', 'password': 'error', 'firstname': 'error', 'familyname': 'error', 'gender': 'error', 'city': 'error', 'country': 'error'})

