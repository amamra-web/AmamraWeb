var socket = io();

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
    } else
        alert("Sign in unsuccessful.");
});
socket.on('signUpResponse',function(data){
    if(data.success){
        alert("Sign up successful.");
    } else
        alert("Sign up unsuccessful.");
});