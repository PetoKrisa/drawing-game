import flask
from flask import Flask, render_template, request, Response, jsonify, send_file
import flask_socketio
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'UltraTitkosXd'
io = SocketIO(app)

@app.route('/static/<path>')
def staticPathFix(path):
    if('.js' in path):
        return send_file(f'./static/{path}', mimetype='application/javascript')
    else:
        return send_file(f'./static/{path}')
        

@app.route('/')
def index():
    return render_template('index.html')

@io.on('connect')
def ioConnect():
    print('socket connected')

if __name__ == '__main__':
    io.run(app=app, host='0.0.0.0', port=3000, debug=True)