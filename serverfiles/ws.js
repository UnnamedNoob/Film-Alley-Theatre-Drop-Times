// create a baisc websocket server using socketio and create a channel for all clients

function init(server){
    const io = require('socket.io')(server);
    io.on('connection', function(socket) {
        console.log('a user connected');
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
    })
}

export default {init}