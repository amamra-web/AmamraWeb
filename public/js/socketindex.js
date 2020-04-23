var SOCKET_LIST = {};
var DEBUG = true;
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

module.exports = {
    startCommunication : function(io) {
        const comms = io.of("/communication");
        console.log("Socket Server Started");

        comms.on('connection', function(socket){
            socket.id = Math.random();
            SOCKET_LIST[socket.id] = socket;
            
            socket.on('signIn',function(data){
                isValidPassword(data,function(res){
                    if(res){
                        Student.onConnect(socket);
                        socket.emit('signInResponse',{success:true});
                    } else {
                        socket.emit('signInResponse',{success:false});         
                    }
                });
            });
            socket.on('signUp',function(data){
                isUsernameTaken(data,function(res){
                    if(res){
                        socket.emit('signUpResponse',{success:false});     
                    } else {
                        addUser(data,function(){
                            socket.emit('signUpResponse',{success:true});                  
                        });
                    }
                });    
            });
           
            socket.on('disconnect',function(){
                delete SOCKET_LIST[socket.id];
                Student.onDisconnect(socket);
            });
        
            socket.on('evalServer',function(data){
                if(!DEBUG)
                    return;
                var res = eval(data);
                socket.emit('evalAnswer',res);     
            });           
        });
    }
}


