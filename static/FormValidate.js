function validateLogin(){
    if(document.getElementById('username-input').value == ''){
        document.getElementById("create-room-button").disabled = true
        document.getElementById("join-room-button").disabled = true
    }
    
    else if(document.getElementById('username-input').value == '' && document.getElementById('room-code-input').value == ''){
        document.getElementById("create-room-button").disabled = true
        document.getElementById("join-room-button").disabled = true

    } else if(document.getElementById('username-input').value != '' && document.getElementById('room-code-input').value == ''){
        document.getElementById("create-room-button").disabled = false
        document.getElementById("join-room-button").disabled = true

    } else{
        document.getElementById("create-room-button").disabled = false
        document.getElementById("join-room-button").disabled = false

    }
}

validateLogin()