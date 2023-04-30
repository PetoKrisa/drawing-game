import Room from "../static/Room.js"
export default class GameProcess{
    constructor(document){
        this.document = document
        this.Room = new Room(GameProcess)
        this.socket = new io()
        this.screens = {1: 'first-screen', 2: 'room-screen', 3: 'game-screen'}
        this.screen = 1
        this.username = null
    }

    setScreen(id){
        this.document.getElementById("")
    }
    
}