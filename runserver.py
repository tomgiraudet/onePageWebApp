from gevent.wsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from twidder import app

http_server = WSGIServer(("", 5000), app, handler_class=WebSocketHandler)
app.debug = True
http_server.serve_forever()