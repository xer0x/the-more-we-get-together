var util = require('util');
var checker = require('./checker');

var width = 10;
var height = 11;

var players = {};
var grid = [];

function getGrid() {
  return {
    width: width,
    height: height,
    state: fetchState()
  };
}

function makeGrid() {
  grid = [];
  for (var x = 0; x < width; x++) {
    grid[x] = [];
    for (var y = 0; y < height; y++) {
      grid[x][y] = 0; //null;
    }
  }
}

// find a new spot with nobody on it
function getNewPosition() {
  var x, y;
  var placed = false;
  while (!placed) {
    x = Math.floor(Math.random() * width);
    y = Math.floor(Math.random() * height);
    placed = isEmptyPosition(x, y);
  }
  return {x: x, y: y};
}

function isEmptyPosition(_x, _y) {
  console.log('checking %d,%d', _x, _y);
  if (_x < 0 || _x >= width) return false;
  if (_y < 0 || _y >= height) return false;
  return !grid[_x][_y];
  /*
  for (var p in players) {
    if (p.x === _x || p.y === _y) {
      return false;
    }
  }
  return true;
  */
}

function addPlayer(playerId, callback) {
  var position = getNewPosition();
  var player = {
    id: playerId,
    x: position.x,
    y: position.y,
    name: 'Winner',
    score: 0,
    shape: 'square'
  };
  grid[player.x][player.y] = playerId;
  players[playerId] = player;
  if (callback) callback(player);
}

function getPlayer(playerId) {
  return players[playerId];
}

function removePlayer(playerId) {
  var p = players[playerId];
  grid[p.x][p.y] = 0; //null;
  delete players[playerId];
}

function change(playerId, command) {
  // do something
  var c = command.split(' ');
  var type = ('' + c[0]).toUpperCase();
  var results = [];
  switch(type) {
    case 'MOVE':
      console.log('MOVE %s', playerId);
      var positions = move(playerId, c[1]);
      var dest = util.format('%d,%d', positions.dest.x, positions.dest.y);
      var old = util.format('%d,%d', positions.old.x, positions.old.y);
      results.push(util.format('MOVE %s %s %s', old, dest, playerId));
      showGrid();
      break;
    default:
  }
  return results;
}

// return representation of grid
// Grid to JSON text
function fetchState() {
  return JSON.stringify(grid);
  //return '__D_,____,HH__,_X__'
}

function showGrid() {
  var output = '';
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      output += ' ' + (grid[x][y] ? 'O' : '_');
    }
    output += '\n';
  }
  console.log(output);
}

var deltas = {
  LEFT: [-1, 0],
  RIGHT: [1, 0],
  UP: [0, -1],
  DOWN: [0, 1]
};

function move(playerId, direction) {
  //console.log('MOVE ', direction);
  var p = players[playerId];
  var old = { x: p.x, y: p.y };
  var delta = deltas[direction];
/*
  if (position available) {
    p.x = n.x;
    p.y = n.y;
  }
*/
  var dest = { x: p.x + delta[0], y: p.y + delta[1] };
  if (isEmptyPosition(dest.x, dest.y)) {
    // do movement
    p.x = dest.x;
    p.y = dest.y;
    grid[old.x][old.y] = 0; //null;
    grid[dest.x][dest.y] = playerId;
    //console.log('TODO: FLAG DIRTY MAP x,y?')
  } else {
    dest = old;
  }
  return {old: old, dest: dest};
}

function tick() {
  // Does +1 to score if in their shape
  checker.checkShapes(players, grid);

  var playerIds = Object.keys(players);
  if (playerIds.length > 0) {
    console.log('Player scores');
    var p;
    for (var i=0; i < playerIds.length; i++) {
      p = players[playerIds[i]];
      console.log(util.format('%s  \t%d  \t%s', p.name, p.score, p.shape));
    }
  }
}

function reset() {
  makeGrid();
  console.log('TODO: put players back on grid positions?');
}

reset(); // initialize

module.exports = {
  getGrid: getGrid,
  addPlayer: addPlayer,
  getPlayer: getPlayer,
  removePlayer: removePlayer,
  change: change,
  tick: tick,
  reset: reset
};
