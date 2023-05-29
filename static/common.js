import GameProcess from "./gameprocess.js"
var music = new Audio('../static/nintendo_ahh_bossanova.wav')
music.loop = true
music.volume = 0.5
const musicButton = document.getElementById("music-button")
musicButton.addEventListener('click',(e)=>{
    if(musicButton.dataset.music == 'off'){
        localStorage.setItem('music', 'on')
        music.play()
        musicButton.dataset.music = 'on'
        musicButton.classList.remove('sound-off')
        musicButton.classList.add('sound-on')
    } else if (musicButton.dataset.music =='on'){
        localStorage.setItem('music', 'off')
        music.pause()
        musicButton.dataset.music = 'off'
        musicButton.classList.remove('sound-on')
        musicButton.classList.add('sound-off')
    }
})
const tutorial = document.getElementById("tutorial-button")
const tutorialNext = document.getElementById("tutorial-next")
const tutorialH1 = document.getElementById("tutorial-h1")
const tutorialImg = document.getElementById("tutorial-img")

var tutorialIndex = 0;
tutorial.addEventListener('click',(e)=>{
    tutorialIndex = 1;
    tutorialImg.src = '/static/tutorial1.png'
    tutorialH1.innerText = "Enter a username, a room code, and join a room"
    document.getElementById("tutorial-dialog").showModal();
})

tutorialNext.addEventListener('click', (e)=>{
    tutorialIndex++
    if(tutorialIndex==2){
        tutorialImg.src = '/static/tutorial2.png'
        tutorialH1.innerText = "When you are drawing, you have to draw the prompt on the top of the screen. Draw With the left click..."
    } else  if(tutorialIndex==3){
        tutorialImg.src = '/static/tutorial3.png'
        tutorialH1.innerText = "...and erase with right click"
    }else  if(tutorialIndex==4){
        tutorialImg.src = '/static/tutorial4.png'
        tutorialH1.innerText = "Whey you are guessing, type your guess in the chat box on the right"
    } else if(tutorialIndex==5){
        document.getElementById("tutorial-dialog").close()
    }
})



var mainProcess = new GameProcess(document)
mainProcess.setScreen(1) //debug
mainProcess.Canvas.clear()

