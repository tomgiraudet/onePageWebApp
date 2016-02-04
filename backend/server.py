from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello ! :)"


@app.route('/sign_in/<email>/<password>')
def sign_in(email, password='default'):
    return 'Hello ' + email + ' ' + password



@app.route('/sign_up/<email>/<password>/<firstname>/<familyname>/<gender>/<city>/<country>')
def sign_up(email, password, firstname, familyname, gender, city, country):
    return 'sign_up'


@app.route('/sign_out/<token>')
def sign_out(token):
    return 'sign_up'


@app.route('/change_password/<token>/<old>/<new>')
def change_password(token, old, new):
    return 'change_password'


@app.route('/get_user_data_by_token/<token>')
def get_user_data_by_token(token):
    return 'get user data by token'


@app.route('/get_user_data_by_email/<token>/<email>')
def get_user_data_by_email(token, email):
    return 'get user data by email'


@app.route('/get_user_messages_by_token/<token>')
def get_user_messages_by_token(token):
    return 'get user messages by token'


@app.route('/get_user_messages_by_email/<token>/<email>')
def get_user_messages_by_token(token, email):
    return 'get user messages by email'


@app.route('/post_message/<token>/<message>/<email>')
def post_message(token, message, email):
    return 'post message'




if __name__ == '__main__':
    app.run(debug=True)