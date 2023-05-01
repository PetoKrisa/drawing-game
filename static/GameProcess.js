import Room from "../static/Room.js"
import Canvas from "../static/Canvas.js"
export default class GameProcess{
    constructor(document){
        this.document = document

        this.socket = new io()
        this.screens = {1: 'first-screen', 2: 'room-screen', 3: 'game-screen'}
        this.screen = 1
        this.username = null
        this.Room = new Room(this, this.socket)
        this.Canvas = new Canvas(this, document.getElementById("main-canvas"))

        this.document.getElementById('create-room-button').addEventListener('click', (e)=>{
            if (this.document.getElementById('create-room-button').disabled == false){
                this.Room.createRoom()
            }
        })

        this.document.getElementById('username-input').addEventListener('input', (e)=>{
            this.username = this.document.getElementById('username-input').value
            console.log(this.username)
        })

        this.document.getElementById('room-leave-button').addEventListener('click', (e)=>{
            this.Room.leave()
        })
        this.document.getElementById('room-leave-button').addEventListener('click', (e)=>{
            this.Room.leave()
        })
    }

    setScreen(id){
        for(let i = 1; i <= 2; i++){
            this.document.getElementById(this.screens[i]).style.display = 'none'
        }
        this.document.getElementById(this.screens[id]).style.display = 'flex'
        if(id>1){
            this.document.getElementById("room-code").style.display = 'block'
        } else{
            this.document.getElementById("room-code").style.display = 'none'
        }
    } 

    updateCode(code){
        this.document.getElementById('room-code').innerText = code
    }
    
}