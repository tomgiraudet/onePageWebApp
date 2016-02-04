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