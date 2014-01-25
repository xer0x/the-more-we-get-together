/*
*
* Connections get a shape
*
* Connection IDs with messages & state
*/

var sockjs = require('sockjs');
var util = require('util');
var world = require('./world');

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};

var connections = {};

function socket(server) {
  var sockjs_socket = sockjs.createServer(sockjs_opts);
  sockjs_socket.on('connection', listener);
  sockjs_socket.installHandlers(server, {prefix:'/echo'});
}

function listener(conn) {
  console.log('    [+] open %s', conn.id);
  connections[conn.id] = conn;

  var grid = world.getGrid();
  conn.write(['GRID', grid.width, grid.height, grid.state].join(' '));

  world.addPlayer(conn.id, function(newPlayer) {
    conn.write('PLAYER A 1,1');
  });

  var readMessage = function(message) {
    if (!message || message.length <= 0) return; // skip
    // TODO ANTI-CHEAT: ack & refuse messages
    world.change(conn.id, message);
    broadcast(message);
  }

  var closeConnection = function() {
    delete connections[conn.id];
    var player = world.getPlayer(conn.id);
    broadcast('DROP player');
    world.removePlayer(conn.id);
    console.log('    [-] closed %s', conn.id);
  }

  function broadcast(message) {
    for (var id in connections) {
      if (id !== conn.id) {
        connections[id].write(message);
      }
    }
  }

  conn.on('data', readMessage);
  conn.on('close', closeConnection)
}

module.exports = socket;
