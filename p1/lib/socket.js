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
    conn.write(util.format('YOU %s', newPlayer.id));
    var spawnMessage = util.format('PLAYER %d,%d %s', newPlayer.x, newPlayer.y, newPlayer.id);
    conn.write(spawnMessage);
    broadcast(spawnMessage);
  });

  var readMessage = function(message) {
    if (!message || message.length <= 0) return; // skip
    // TODO ANTI-CHEAT: ack & refuse messages
    var results = world.change(conn.id, message);

    console.log(results);
    console.log('TODO broadcast results');
    // for each results -> broadcast
    //broadcast(message);
  }

  var closeConnection = function() {
    delete connections[conn.id];
    var player = world.getPlayer(conn.id);
    broadcast(util.format('DROP %d,%d %s', player.x, player.y, player.id));
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
