export default class Canvas{
    constructor(GameProcess, canvas){
        this.GameProcess = GameProcess
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')

        this.width = this.canvas.width
        this.height = this.canvas.height

        console.log(this.height, this.width)

        this.isClick = false
        this.isRClick = false

        this.actions = []

        this.canvas.addEventListener('mousedown', (e)=>{
            if(this.GameProcess.canDraw()){
            var rect = this.canvas.getBoundingClientRect()
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height; 

            if(e.button == 0){
                this.isClick = true
                console.log('down', this.isClick)
                this.ctx.beginPath();
                this.ctx.arc((e.clientX-rect.left)*scaleX, (e.clientY-rect.top)*scaleY, 7   , 0, 2 * Math.PI);
                this.ctx.fill();


            } else if(e.button == 2){
                this.isRClick = true
                this.ctx.clearRect((e.clientX-rect.left)*scaleX-10, (e.clientY-rect.top)*scaleY-10, 20, 20);

                console.log('right down', this.isRClick)
            }
        }
        })

        this.GameProcess.document.addEventListener('contextmenu',(e)=>{
            e.preventDefault();
        })

        this.canvas.addEventListener('mousemove', (e)=>{
            if(this.GameProcess.canDraw()){
                var rect = this.canvas.getBoundingClientRect()
                var scaleX = canvas.width / rect.width;
                var scaleY = canvas.height / rect.height; 
                
                if(this.isClick){
                    console.log('drawing')
                    
                    this.ctx.beginPath();
                    this.ctx.arc((e.clientX-rect.left)*scaleX, (e.clientY-rect.top)*scaleY, 7, 0, 2 * Math.PI);
                    this.ctx.fill();
                } else if (this.isRClick){

                    this.ctx.clearRect((e.clientX-rect.left)*scaleX-10, (e.clientY-rect.top)*scaleY-10, 20, 20);
                    console.log('erasing')
                }
            }

        })
        this.canvas.addEventListener('mouseup', (e)=>{
            if(e.button == 0){
                this.isClick = false
                console.log('up', this.isClick)
            } else if(e.button == 2){
                this.isRClick = false
                console.log('right up', this.isRClick)
            }
        })

        this.canvas.addEventListener('mouseleave', (e)=>{
            this.isClick = false;
            this.isRClick = false;
        })
    }

    clear(){
        this.ctx.clearRect(0,0,this.width, this.height)
        this.actions = []
    }

    bordcastAction(action){
        
    }
}