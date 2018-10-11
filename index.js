var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os');
var neti = os.networkInterfaces();
var ip = require('ip');
var path = require('path');
var initValue = 0;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/presenter', function(req, res) {
    res.sendFile(__dirname + '/presenter.html');
});

app.get('/control', function(req, res) {
    res.sendFile(__dirname + '/control.html');
});

app.get('/ping.html', function(req, res) {
    res.sendFile(null);
})
app.get('/utils.js', function(req, res) {
    res.sendFile(__dirname + '/utils.js');
})

io.on('connection', function(socket) {
    socket.emit('gauge datapush', initValue);
    console.log('a client connected');

    socket.on('disconnect', function() {
        console.log('user disconneted. bye!');
    })
    socket.on('gauge datapush', function(msg) {
        console.log('sending out datapush: ' + msg);
        socket.emit('gauge datapush', msg);
        socket.broadcast.emit('gauge datapush', msg);
        initValue = msg;
    })
})

http.listen(800, function() {
    console.log('listening on ' + ip.address() + ':800');
});
