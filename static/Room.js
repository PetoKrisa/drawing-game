import GameProcess from "./gameprocess.js"

export default class Room{
    constructor(GameProcess, socket){
        this.GameProcess = GameProcess
        this.socket = socket

        this.code = null
        this.players = []
        this.drawingPlayer = 0 //leaders can use
        this.gameStarted = false
        this.time = 0
        this.timer = setInterval(()=>{
            if(this.time>0){
                this.GameProcess.document.getElementById('timer').innerHTML = `${this.time}s`
                this.time--
            } else if (this.time==0 && this.gameStarted == true){
                if  (this.leader){
                    console.log('started new round')
                    this.socket.emit('nextRound')
                }
            }
        }, 1000)

        this.leader = false
        this.points = 0
        this.canDraw = false
        this.word = ''
        this.round = 0

        this.GameProcess.document.getElementById('join-room-button').addEventListener('click', (e)=>{
            if (this.GameProcess.document.getElementById('join-room-button').disabled == false){
                this.joinRoom(this.GameProcess.document.getElementById('room-code-input').value)
            }
        })

        this.socket.on('start', (data)=>{
            this.gameStarted = true
            this.GameProcess.setScreen(3)
            this.time = data['time']
            this.word = data['word']
            this.round = data['round']
            if(this.leader){
                console.log('started first round')
                this.socket.emit('nextRound')
            }
        })

        this.socket.on('sendRoomdataToUser', (data)=>{
            console.log(data)
            this.players = data['players']
            this.time = data['time']
            if(data['round']!=this.round){
                this.GameProcess.Canvas.clear()
                this.round = data['round']
            }
            document.getElementById('round').innerHTML = `Round ${this.round}/${this.players.length}`
            this.word = data['word']
            
            this.updatePlayerList()
            for(let i = 0; i < data['players'].length;i++){
                if(this.socket.id == data['players'][i]['sid'] && data['players'][i]['leader']){
                    this.leader = true
                }
                if(this.socket.id == data['players'][i]['sid'] && data['players'][i]['canDraw']){
                    this.canDraw = true
                    console.log('can draw changed to true')
                    console.log("candraw",this.canDraw)
                } else if(this.socket.id == data['players'][i]['sid'] && !data['players'][i]['canDraw']){
                    this.canDraw = false
                }
            }

            this.GameProcess.document.getElementById("word").innerText = ''
            if(this.canDraw){
                this.GameProcess.document.getElementById("word").innerText = this.word
            } else{
                let wordtmp = ''
                for(let i = 0; i < this.word.length; i++){
                    if(this.word[i]==' '){
                        wordtmp.concat(' ')
                    } else{
                        wordtmp.concat('_')
                    }
                }
            }

            if(data['players'].length>1 && this.leader){
                this.GameProcess.document.getElementById("room-start-button").disabled = false
            } else{
                this.GameProcess.document.getElementById("room-start-button").disabled = true
            }
        })

        this.socket.on('roomClosed', ()=>{
            alert('The original leader left, or the game has ended!')
            this.reset()
        })

    }

    updatePlayerList(){
        var list1 = document.getElementById("room-player-list")
        var list2 = document.getElementById("game-player-list")

        list1.innerHTML = ''
        list2.innerHTML = '<h1>Players</h1>'
        for(let i = 0; i < this.players.length; i++){
            list1.innerHTML = list1.innerHTML + `
            <p>${this.players[i]['username']}</p>
            `
            list2.innerHTML = list2.innerHTML + `
            <p>${this.players[i]['username']} - ${this.players[i]['score']}</p>
            `

        }
        if(this.players.length > 1 && this.leader){
            this.GameProcess.document.getElementById("room-start-button").disabled = false
        }
    }

    sendUserdataToRoom(){
        this.GameProcess.socket.emit('sendUserdataToRoom', {'username': this.GameProcess.username, 'points': 0})
    }

    createRoom(){
        fetch('/api/createRoom')
        .then(r=>r.json())
        .then(d=>{
            this.GameProcess.socket.emit('joinRoomWithCode', {'username': this.GameProcess.username, 'code':d['code']})
            this.code = d['code']
            this.GameProcess.setScreen(2)
            this.GameProcess.updateCode(this.code)
        }).catch(()=>{
            alert('Something went wrong! Try again!')
        })
    }

    leave(){
        this.GameProcess.socket.emit('userLeaveRoom')
        this.reset()

    }

    joinRoom(code){
        fetch(`/api/isRoomExists?code=${code}`).then(r=>{
            if(r.status == 200){
                this.GameProcess.socket.emit('joinRoomWithCode', {'username': this.GameProcess.username, 'code':code})
                this.code = code
                this.GameProcess.setScreen(2)
                this.GameProcess.updateCode(this.code)
            } else{
                alert('Room does not exist, or game has already been started!')
            }
            
        })
        .then(d=>{
           
        })
        .catch(()=>{
            alert('Something went wrong! Try again!')
        })
        
    }

    reset(){
        this.leader = false
        this.points = 0;
        this.timer = 0;
        this.players = [];
        this.round = 0;
        this.gameStarted = false
        this.GameProcess.Canvas.clear()
        this.GameProcess.setScreen(1)
        this.socket.emit('leaveSocket', this.socket.id)
    }

    start(){
        if(this.leader){
            this.GameProcess.socket.emit('start')
        }
    }
}