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

module.exports = {
    startCommunication : function(io) {
        const comms = io.of("/communication");
        console.log("Socket Server Started");

        comms.on('connection', function(socket){
            socket.id = Math.random();
            SOCKET_LIST[socket.id] = socket;
            console.log("Someone has connected");

            //Triggers when a user joins a quiz
            socket.on('enable-quiz-up', function(pin) {
                //creates the socket channel
                if(pin) {
                    console.log(`Room ${pin} has been created, and host joined`);
                    socket.join(pin)
                } else {
                    console.log("Room PIN is undefined");
                }
            })

            socket.on('user-join-up', function(data) {
                //Emit down event to room  
                console.log(`User has joined room ${data.pin}`); 
                var clients = comms.in(data.pin).clients((err,clients) => {
                    if(err) throw error;
                    console.log('Number of users in room ' + data.pin + " " + clients)
                });
                socket.join(data.pin);         
            });

            //Handles the user requesting the current question
            socket.on('user-request-q-up', function(data){
                console.log('user-request-queue-up');
                console.log(data.pin);

                //Emit to host the question request
                comms.in(`${data.pin}`).emit('user-request-q-down', data);
            })

            //Handles the host response going to server
            socket.on('host-response-q-up', function(data) {
                console.log('host-response-q-up');
                
                //emit to student the current question
                comms.in(`${data.pin}`).emit('host-response-q-down');
            })

            //Handles the user submitting an answer
            socket.on('user-answer-up', function(data) {
                console.log('user-answer-up');

                //emit to host about the answer
                comms.in(`${data.pin}`).emit('user-answer-down');
            });

            // socket.on('host-next-question', function(data) {
            //     socket.in(data.pin).emit('nextQuestionDown');
            // });
           
            socket.on('disconnect',function(){
                console.log(`${SOCKET_LIST[socket.id]} has disconnected`);
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


