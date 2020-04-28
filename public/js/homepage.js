var socket = io('http://localhost:8880/communication');

//sign
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

signDivSignIn.onclick = function(){
    socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
}
signDivSignUp.onclick = function(){
    socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value});
}

socket.on('signInResponse',function(data){
    if(data.success){
        signDiv.style.display = 'none';
        portalDiv.style.display = 'inline-block';
        alert("Sign up successful.");
    } else
        alert("Sign in unsuccessful.");
});
socket.on('signUpResponse',function(data){
    if(data.success){
        alert("Sign up successful.");
    } else
        alert("Sign up unsuccessful.");
});

socket.on('create-room', function(data) {
    //Emit down event to room
    if(data.pin) {
        console.log(`Room ${data.pin} has been created, and host joined`);
        socket.join(data.pin);
    } else {
        console.log("Room PIN is undefined");
    }
});

//Triggers when a user joins a room
socket.on('user-join-up', function(data) {
    //Emit down event to room  
    console.log(`User has joined room ${data.pin}`); 
    var clients = comms.in(data.pin).clients((err,clients) => {
        if(err) throw error;
        console.log('Number of users in room ' + data.pin + " " + clients)
    });
    socket.join(data.pin);         
});

socket.on('userAnswerUp', function(data) {
    if(data) {
        alert('user has answered');
    } else {
        alert('something went wrong');
    }
    socket.emit('userAnswerDown')
});

socket.on('nextQuestionUp', function(data) {
    socket.in(data.pin).emit('nextQuestionDown');
});

socket.on('')