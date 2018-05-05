var fs = require('fs');
var http = require('http');
var cors = require('cors')

var express = require('express');
var app = express();
app.use(cors())
app.use(express.static(__dirname ));
var server = http.createServer(app);
var BinaryServer = require('binaryjs').BinaryServer;
var BinaryClient = require('binaryjs').BinaryClient;

var bs = BinaryServer({server: server});
bs.on('connection', function(client){
  client.on('stream', function(stream, meta){
    var file = fs.createWriteStream(__dirname + meta.name);
    stream.pipe(file);
    stream.on('data', function(data){
      stream.write({rx: data.length / meta.size});
    });
  });
});

server.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000');