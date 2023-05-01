import GameProcess from "./gameprocess.js"

export default class Room{
    constructor(GameProcess, socket){
        this.GameProcess = GameProcess
        this.code = null
        this.players = []
        this.gameStarted = false
        this.timer = 0
        this.leader = false
        this.points = 0
        this.socket = socket

        this.GameProcess.document.getElementById('join-room-button').addEventListener('click', (e)=>{
            if (this.GameProcess.document.getElementById('join-room-button').disabled == false){
                this.joinRoom(this.GameProcess.document.getElementById('room-code-input').value)
            }
        })

        this.socket.on('sendRoomdataToUser', (data)=>{
            this.players = data['players']
            this.timer = data['time']
            this.updatePlayerList()
            for(let i = 0; i < data['players'];i++){
                if(this.socket.id == data['players'][i]['sid'] &&  data['players'][i]['leader']){
                    console.log('im a leader')
                }
            }
        })

        this.socket.on('roomClosed', ()=>{
            this.reset()
        })
    }

    updatePlayerList(){
        var list1 = document.getElementById("room-player-list")
        list1.innerHTML = ''
        for(let i = 0; i < this.players.length; i++){
            list1.innerHTML = list1.innerHTML + `
            <p>${this.players[i]['username']}</p>
            `
        }
        if(this.players.length > 1 && this.leader == true){
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
            
            console.log('room found')
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
        this.GameProcess.setScreen(1)

    }
}