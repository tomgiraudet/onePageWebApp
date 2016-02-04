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
