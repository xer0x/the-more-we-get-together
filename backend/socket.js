/*
*
* Connections get a shape
*
* Connection IDs with messages & state
*/

var sockjs = require('sockjs');
var util = require('util');
var world = require('./lib/world');

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};

function socket(server) {
  var sockjs_socket = sockjs.createServer(sockjs_opts);
  sockjs_socket.on('connection', listener);
  sockjs_socket.installHandlers(server, {prefix:'/echo'});
}

function listener(conn) {
  var grid = world.getGrid();
  conn.write(['GRID', grid.width, grid.height, grid.state].join(' '));
  world.addPlayer(conn.id, function(newPlayer) {
    conn.write('PLAYER A 1,1');
  });
  var readMessage = function(message) {
    if (!message || message.length <= 0) return; // skip
    // TODO ANTI-CHEAT: ack & refuse messages
    world.change(conn.id, message);
    conn.write('ACK');
    conn.write('TODO broadcast move to other players');
    //conn.write(world.changes);
  }
  conn.on('data', readMessage);

  // TODO broadcast updates when world changes
}

module.exports = socket;
