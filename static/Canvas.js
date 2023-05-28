export default class Canvas{
    constructor(GameProcess, socket, canvas){
        this.GameProcess = GameProcess
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')

        this.socket = socket

        this.width = this.canvas.width
        this.height = this.canvas.height

        console.log(this.height, this.width)

        this.isClick = false
        this.isRClick = false

        this.actions = []

        this.color = 'black'
        this.lineWidth = 6

        this.canvas.addEventListener('mousedown', (e)=>{
            
            if(this.GameProcess.canDraw()){
            var rect = this.canvas.getBoundingClientRect()
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height; 
            
            

            if(e.button == 0){
                this.isClick = true
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color
                this.ctx.arc((e.clientX-rect.left)*scaleX, (e.clientY-rect.top)*scaleY, this.lineWidth, 0, 2 * Math.PI);
                this.ctx.fill();
                this.socket.emit('draw', {'mode':1,'width':this.lineWidth, 'color':this.color, 'x':(e.clientX-rect.left)*scaleX, 'y':(e.clientY-rect.top)*scaleY})

            } else if(e.button == 2){
                this.isRClick = true
                this.ctx.clearRect((e.clientX-rect.left)*scaleX-(this.lineWidth*3/2), (e.clientY-rect.top)*scaleY-(this.lineWidth*3/2), this.lineWidth*3, this.lineWidth*3);
                this.socket.emit('draw', {'mode':2,'width':this.lineWidth*3, 'color':this.color, 'x':(e.clientX-rect.left)*scaleX-(this.lineWidth*3/2), 'y':(e.clientY-rect.top)*scaleY-(this.lineWidth*3/2)})

            }
        }
        })

        this.GameProcess.document.addEventListener('contextmenu',(e)=>{
            e.preventDefault();
        })

        this.canvas.addEventListener('mousemove', (e)=>{
            if(this.GameProcess.canDraw()){
                console.log('drawing')
                var rect = this.canvas.getBoundingClientRect()
                var scaleX = canvas.width / rect.width;
                var scaleY = canvas.height / rect.height; 
                
                if(this.isClick){
                    console.log('drawing')
                    this.ctx.fillStyle = this.color
                    this.ctx.beginPath();
                    this.ctx.arc((e.clientX-rect.left)*scaleX, (e.clientY-rect.top)*scaleY, this.lineWidth, 0, 2 * Math.PI);
                    this.ctx.fill();
                    this.socket.emit('draw', {'mode':1,'width':this.lineWidth, 'color':this.color, 'x':(e.clientX-rect.left)*scaleX, 'y':(e.clientY-rect.top)*scaleY})

                } else if (this.isRClick){
                    this.ctx.clearRect((e.clientX-rect.left)*scaleX-(this.lineWidth*3/2), (e.clientY-rect.top)*scaleY-(this.lineWidth*3/2), this.lineWidth*3, this.lineWidth*3);
                    console.log('erasing')
                    this.socket.emit('draw', {'mode':2,'width':this.lineWidth*3, 'color':this.color, 'x':(e.clientX-rect.left)*scaleX-(this.lineWidth*3/2), 'y':(e.clientY-rect.top)*scaleY-(this.lineWidth*3/2)})

                }
            }

        })
        this.canvas.addEventListener('mouseup', (e)=>{
            if(e.button == 0){
                this.isClick = false
            } else if(e.button == 2){
                this.isRClick = false
            }
        })

        this.canvas.addEventListener('mouseleave', (e)=>{
            this.isClick = false;
            this.isRClick = false;
        })

        this.socket.on('draw', (data)=>{
            console.log('draw event')
            if(!this.canDraw){
                if(data['mode']==1){
                    this.ctx.fillStyle = data['color']
                    this.ctx.beginPath();
                    this.ctx.arc(data['x'], data['y'], data['width'], 0, 2 * Math.PI);
                    this.ctx.fill();
                } else if(data['mode']==2){
                    this.ctx.clearRect(data['x'], data['y'], data['width'], data['width']);

                }
            }
        })
    }

    clear(){
        this.ctx.clearRect(0,0,this.width, this.height)
        this.actions = []
    }

    bordcastAction(action){
        
    }
}