var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const shortid = require('shortid');
const session = require('express-session');

var {
    boarSize,
    players,
    newPlayer,
} = require("./RoomSettings")

var rooms = [];

//middlewares
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'pasmfjueyhasnn5nasldjiywe7s',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}))



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connect', (socket) => {
    //cuando se conecta alguien
    console.log(`connected ${socket.id}`)
        //se envian las salas disponibles
    socket.emit('initGame', { rooms })
        //hacemos ping a los clientes
        //setTimeout(sendHeartbeat, 8000);

    socket.on('setPing', function() {
        socket.emit('setPong', { rooms });
    });

    //cuando se crea una nueva sala
    socket.on('newRoom', () => {
        //se genrea un nombre aleatorio para la sala
        var newRoomId = shortid.generate()
            //se agrega la sala al arrglo de salas con el id generado y otro array para los jugadores de esa sala
        rooms.push({ id: newRoomId, players: [] })
            //se anucncian los cambios al cliente
        socket.emit('setNewRoom', { newRoomId, rooms })
    })

    socket.on('joinRoom', (idRoom) => {
        console.log(`conectado a la sala ${idRoom}`)
            //adicionamos la sala por su id a las salas del socket
        socket.join(idRoom);
        //avisamos a todos los que estan el la sala que hay un usuario nuevo
        io.sockets.in(idRoom).emit('alertNewUser', `Un nuevo usuario se ha conectado: ${socket.id}`)
            //capturamos el indice de la sala en el array de salas para modificar solo esa en el cliente
        var index = rooms.findIndex(room => room.id == idRoom)
            //agregamos el usuario que solicitó agregarse a la sala en el arreglo de jugadores de la sala
        rooms[index].players.push(newPlayer(socket.id, idRoom))
            //informamos al cliente de los cambios
        socket.emit('setRoomActive', { idRoom, rooms, index });
    })

    //hacer un disparo
    socket.on('shot', (cell) => {
        rooms[cell.index].players[cell.i].board[cell.x][cell.y] = 1
        socket.emit('repaint', { room: rooms[cell.index], index: cell.index })
    })

    socket.on('disconnect', (data) => {
        /*if (data.roomSelected != '') {
            console.log(`El usuario ${data.playerId} ha abandonado la sala`)
            var index = rooms.findIndex(room => room.id == data.roomSelected)
            console.log(rooms, data.roomSelected, data.playerId)
                //rooms[index].players.filter(player => player.id != data.playerId);
                //io.sockets.in(idRoom).emit('alertNewUser', `Un nuevo usuario se ha conectado: ${socket.id}`)
        }*/
    })

    /*socket.on('pong', (data) => {
        console.log("Pong received from client");
    });

    function sendHeartbeat() {
        setTimeout(sendHeartbeat, 8000);
        io.sockets.emit('ping', { beat: 1 });
    }*/

    /*
    socket.on('joinRoom', (idRoom) => {
        console.log(`conectado a la sala ${idRoom}`)
        socket.join(idRoom);
        io.sockets.in(idRoom).emit('alertNewUser', `Un nuevo usuario se ha conectado: ${socket.id}`)
        var index = rooms.findIndex(room => room.id == idRoom)
        var room = rooms[index].players.push(newPlayer(socket.id))
        socket.emit('setRoomActive', { idRoom, room, index });
    })

    socket.emit('setRooms', rooms)
        /*socket.join('room_1');

        io.to('room_1').emit('Bienvenida', 'Saludos a todos');*/

    /*console.log('a user connected');

    socket.on('disconnect', () => {
        //playersId = playersId.filter(id => id != socket.id)
        console.log('user disconnected');
    });

    (playersId.length != 0) ? (
        playersId.forEach(
            p => p.idPlayer != socket.id ? playersId.push(socket.id) : console.log('exist')
        )) : playersId.push(socket.id)


    //Iniciar juego
    io.emit('startGame', initGame(socket.id));

    //resetear juego
    socket.on('reset', () => {
        playersId = []
        socket.emit('repaint', initGame(socket.id))
    })*/
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});