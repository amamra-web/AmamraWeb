//For testing and dev purpose only
var DEBUG = true;

// Application dependencies
var express = require('express');
var app = express();

var path = require('path');
var serv = require('http').Server(app);


//Application components
var routes = require('./routes');

// Set the port number
var port = process.env.PORT || 8880;

// View engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', routes);


serv.listen(port);
console.log("Server started.");

//setup Socket List
var SOCKET_LIST = {};

//var Instructor_LIST= {};


var User = function(){
    var self = {
        id:"",
        userType: ""

    }
    
    return self;
}
var Student = function(id){
    var self = User();
    self.id = id;
    self.userType = "Student";

    var super_update = self.update;
    self.update = function(){
        
    }

    Student.list[id] = self;
    return self;
}
Student.list = {};
Student.onConnect = function(socket){
    var student = Student(socket.id);
    if(DEBUG) console.log(socket.id + " Connected");
}
Student.onDisconnect = function(socket){
    if(DEBUG) console.log(socket.id + " Disconnected");
    delete Student.list[socket.id];
}
Student.update = function(){
    var pack = [];
    for(var i in Student.list){
        var student = Student.list[i];
        student.update();
        pack.push({
            id:student.id,
            userType:student.userType
        });    
    }
    return pack;
}
///User Management System
var USERS = {
    //username:password hardcoded
    "admin":"root",
    "stu1":"anna",
    "stu2":"bob",  
}
 
var isValidPassword = function(data,cb){
    setTimeout(function(){
        cb(USERS[data.username] === data.password);
    },10);
}
var isUsernameTaken = function(data,cb){
    setTimeout(function(){
        cb(USERS[data.username]);
    },10);
}
var addUser = function(data,cb){
    setTimeout(function(){
        USERS[data.username] = data.password;
        cb();
    },10);
}

//Socket IO
var io = require('socket.io')(serv,{});
var socketIndex = require('./public/js/socketIndex.js')
socketIndex.startCommunication(io);

setInterval(function(){
    var pack = {
        student:Student.update(),
    }
},1000/25);