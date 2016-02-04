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
    return 'Hello :' + result



if __name__ == '__main__':
    app.run(debug=True)