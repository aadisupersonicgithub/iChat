// IMP NOTE nodeServer alag website hai, and hamari client website (ie html, client.js) alag hai..though we can connec them ..which we will see in client side
// This is node server while will handle socket io connections
// socket.io server will listen incoming events
// module we installed just, any port let 8000 in socket.io, it attaches itself to a http instance

const io = require('socket.io')(8000);
const users = {};

// io.on is socketIO instance which will listen to many socket connections eg rohan, aadi, harry, divya 
// socket.on is an connection itself, and sends event to io.on ofc, which io.on will handle 

io.on('connection', socket => {

    // console.log("In here");
    // user-joined is custom event which we listening, we will emit it 
    // socket.on handles what happens with a particular connection
    // server will listen incoming events  

    socket.on('new-user-joined', name => {

        // console.log('hi by server')
        // provide new user (ie name (eg aadi)) a unique id 
        users[socket.id] = name;

        // will tell others (exc aadi) that aadi joined, we will handle user-joined event on client side 
        socket.broadcast.emit('user-joined', name);

    });


    // agar 'send' event hai // to bakiyo ko receive kara do 
    socket.on('send', message => {

        const msg = { message: message, name: users[socket.id] };
        socket.broadcast.emit('receive', msg);
    });

    // NOTE user-joined,new-user-joined, send, receive ..etc these all are custom events made by us, NOT inbuilt 
    // when disconnect inbuilt event 'disconnect'

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});

