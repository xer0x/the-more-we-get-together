
var http = require('http');
var node_static = require('node-static');
var socket = require('./lib/socket');
var path = require('path');

var src = '/src';

// 2. Static files server
var static_directory = new node_static.Server(path.join(__dirname, src));

// 3. Usual http stuff
var server = http.createServer();
server.addListener('request', function(req, res) {
  static_directory.serve(req, res);
});
server.addListener('upgrade', function(req,res){
  res.end();
});

socket(server);

console.log(' [*] Listening on 0.0.0.0:9999' );
server.listen(9999, '0.0.0.0');
