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

var mainProcess = new GameProcess(document)
mainProcess.setScreen(1)

