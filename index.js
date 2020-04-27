const express = require("express");
const path = require("path");
const socketio = require('socket.io');

const pug = require('pug');

const { api, port } = require('./config');

const app = express();



app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'images')))
// console.log(__dirname);

app.use((req, res, next) => {
    res.locals.api = api;
    next();
})

app.get('/', (req, res) => {
    res.render('landing-page');
});

app.get("/sign-up", (req, res) => {
    // res.sendFile(path.join(__dirname, "public") + '/sign-in.html');
    res.render('sign-in')
})

app.get("/log-in", (req, res) => {
    // res.sendFile(path.join(__dirname, "public") + '/sign-in.html');
    res.render('log-in')
})

app.get('/home', (req, res) => {
    res.render('chat')
})
// const port = 4000;


const server = app.listen(port, () => console.log(`Listening on port:${port}`));

const io = socketio(server);

io.on('connection', (socket) => {
    // console.log('a user connected');
    socket.on('disconnect', () => {
        // console.log('user disconnected');
    });

    // Receives message event
    socket.on('message', (msgObj) => {

        // Sends message to all clients in certain channel (ChatId)
        io.in(`${msgObj.ChatId}`).emit('message', msgObj);


    })

    socket.on('join channel', (channel) => {
        socket.join(channel);
    })

    socket.on('leave channel', (channel) => {
        socket.leave(channel);
    })

    socket.on('join server', (server) => {
        // console.log('joining server ' + server);
        socket.join(server);

    })

    socket.on('leave server', (server) => {
        // console.log('leaving server ' + server);
        socket.leave(server);
    })

    socket.on('add channel', (addedChannel) => {
        // console.log('adding channel');
        io.in(`${addedChannel.ServerId}`).emit('add channel', addedChannel);
    })

    socket.on('delete channel', (deleteObject) => {
        const { channelId, serverId } = deleteObject;

        io.in(`${serverId}`).emit('delete channel', channelId);
    })

    socket.on('user joins server', (joinObject) => {

        const { username, joinServerId, UserId } = joinObject;

        socket.in(`${joinServerId}`).broadcast.emit('user joins server', { username, UserId });
    })

    socket.on('user leaves server', (leaveObject) => {
        const { userId, serverId } = leaveObject;

        socket.in(`${serverId}`).broadcast.emit('user leaves server', userId);
    })

});
