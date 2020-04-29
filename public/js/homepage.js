var socket = io('http://localhost:8880/communication');

//sign
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');
var testButton = document.getElementById('testSocket');

signDivSignIn.onclick = function(){
    socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
}
signDivSignUp.onclick = function(){
    socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value});
}

testButton.onclick = function(){
    socket.broadcast.emit('hello');
}

socket.on('helloBack', function(data) {
    console.log('helloBack is hit');
    alert(data);
})

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
