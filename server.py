import flask
from flask import Flask, render_template, request, Response, jsonify, send_file
import flask_socketio
from flask_socketio import SocketIO, join_room, leave_room, rooms
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'UltraTitkosXd'
io = SocketIO(app)

gameRooms = []
letters = 'ABCDEFGHIJKLMNOPQRSTVWXYZ'
with open('wordbank.txt', 'r', encoding='utf-8') as wordsFile:
    wordBank = wordsFile.read().split('\n')

@app.route('/static/<path>')
def staticPathFix(path):
    if('.js' in path):
        return send_file(f'./static/{path}', mimetype='application/javascript')
    else:
        return send_file(f'./static/{path}')
        

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/createRoom')
def apiCreateRoom():
    randomId = ''
    for i in range(4):
        randomId = randomId + random.choice(letters)

    for i in range(len(gameRooms)):
        if(gameRooms[i]['code']==randomId):
            return Response(response=':(', status=500)

    gameRooms.append({'code': randomId, 'gameStarted': False, 'round':0, 'time': 80, 'guessed':0, 'players': [], 'canvas': [], 'word': ''})
    return jsonify({'code': randomId})

@app.route('/api/isRoomExists')
def apiIsRoomExists():
    code = request.args['code']
    exists = False
    for i in range(len(gameRooms)):
        if gameRooms[i]['code'] == code:
            exists = True
    if exists:
        return Response('ok', status=200)
    else:
        return Response('not found', status=404)
        

@io.on('connect')
def ioConnect():
    print('socket connected')

@io.on('disconnect')
def ioDisconnect():
    if len(rooms())>1:
        usersRoom = rooms()[-1]
        print(usersRoom)
    for i in range(len(gameRooms)):
            if gameRooms[i]['code'] == usersRoom:
                for p in range(len(gameRooms[i]['players'])):
                    if(gameRooms[i]['players'][p]['sid'] == request.sid):
                        gameRooms[i]['players'].pop(p)
                        io.emit('points', gameRooms[i], to=usersRoom)  
    print(gameRooms)

@io.on('joinRoomWithCode')
def joinRoomWithCode(data):
    if (len(rooms())<=1):
        join_room(data['code'])
        usersRoom = rooms()[-1]
        for i in range(len(gameRooms)):
            if gameRooms[i]['code'] == usersRoom:
                if len(gameRooms[i]['players']) == 0:
                    gameRooms[i]['players'].append({'sid': request.sid, 'username': data['username'], 'points': 0, 'canDraw': False, 'leader':True})
                else:
                    gameRooms[i]['players'].append({'sid': request.sid, 'username': data['username'], 'points': 0, 'canDraw': False, 'leader':False})
                io.emit('sendRoomdataToUser', gameRooms[i], to=usersRoom)
                io.emit('sendRoomdataToUser', gameRooms[i], to=usersRoom)

                break   
    print(gameRooms)

@io.on('sendUserdataToRoom')
def sendUserdataToRoom(data):
    pass

@io.on('leaveSocket')
def ioLeaveSocket(id):
    if len(rooms(id))>1:
        leave_room(id)

@io.on('userLeaveRoom')
def userLeaveRoom():
    usersRoom = rooms()[-1]
    print(f'-1: {usersRoom}')
    for i in range(len(gameRooms)):
        if gameRooms[i]['code'] == usersRoom:
            for x in range(len(gameRooms[i]['players'])):
                if gameRooms[i]['players'][x]['sid'] == request.sid:
                    gameRooms[i]['players'].pop(x)
                    io.emit('sendRoomdataToUser', gameRooms[i], to=usersRoom)
                    
            
            leaders = 0
            for p in range(len(gameRooms[i]['players'])):
                if gameRooms[i]['players'][p]['leader'] == True:
                    leaders+=1
                    print('leader found')
            if leaders<1:
                print('leader not found')
                io.emit('roomClosed', to=gameRooms[i]['code'])
                for p in gameRooms[i]['users']:
                    leave_room(gameRooms[i]['code'], p['sid'])
                gameRooms.pop(i)
    leave_room(usersRoom)
    print(gameRooms)

@io.on('start')
def ioStart():
    usersRoom = rooms()[-1]
    for i in range(len(gameRooms)):
        if gameRooms[i]['code'] == usersRoom:
            gameRooms[i]['gameStarted'] = True
            io.emit('start', gameRooms[i], to=usersRoom)

@io.on('nextRound')
def ioNextround():
    usersRoom = rooms()[-1]
    for i in range(len(gameRooms)):
        if gameRooms[i]['code'] == usersRoom:
            if gameRooms[i]['round'] > 0:
                io.emit('chat', {'msg': f'The word was: {gameRooms[i]["word"]}', 'color': 'orange', 'points': 0})

            gameRooms[i]['round'] +=1
            gameRooms[i]['word'] = random.choice(wordBank)
            gameRooms[i]['guessed'] = 0

            print(gameRooms[i]['players'])
            
            if(len(gameRooms[i]['players']) == gameRooms[i]['round']-1):
                io.emit('roomClosed', to=usersRoom)
                gameRooms[i]['round'] = 0
                gameRooms[i]['gameStarted'] = False
                gameRooms[i]['word'] = ''
                for p in gameRooms[i]['users']:
                    leave_room(gameRooms[i]['code'], p['sid'])
                gameRooms.pop(i)
                break
            
            for p in range(len(gameRooms[i]['players'])):
                gameRooms[i]['players'][p]['canDraw'] = False
            gameRooms[i]['players'][gameRooms[i]['round']-1]['canDraw'] = True
            
            io.emit('sendRoomdataToUser',  gameRooms[i], to=usersRoom)
            break

@io.on('draw')
def ioDraw(data):
    io.emit('draw', data, to=rooms()[-1])

@io.on('chat')
def ioChat(data):
    usersRoom = rooms()[-1]
    print(data)
    if(data['points']>0):
        for i in gameRooms:
            if(i['code'] == usersRoom):
                i['guessed'] += 1
                for p in i['players']:
                    if p['sid'] == request.sid:
                        p['points'] += data['points']
                        io.emit('points', i, to=usersRoom)

    
    io.emit('chat',data,to=usersRoom)
                    
if __name__ == '__main__':
    io.run(app=app, host='0.0.0.0', port=80, debug=True)    