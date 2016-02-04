from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello ! :)"

@app.route('/sign_in/<email>/<password>')
def sign_in(email, password='default'):
    return 'Hello ' + email + ' ' + password



if __name__ == '__main__':
    app.run(debug=True)