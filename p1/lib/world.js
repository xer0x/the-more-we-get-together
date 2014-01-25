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
      grid[x][y] = null;
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
    placed = checkPosition(x, y);
  }
  function checkPosition(_x, _y) {
    for (var p in players) {
      if (p.x === _x || p.y === _y) {
        return false;
      }
    }
    return true;
  }
  return {x: x, y: y};
}

function addPlayer(playerId, callback) {
  var position = getNewPosition();
  var player = {
    id: playerId,
    x: position.x,
    y: position.y,
    shape: 'L'
  };
  players[playerId] = player;
  if (callback) callback(player);
}

function getPlayer(playerId) {
  return players[playerId];
}

function removePlayer(playerId) {
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

      break;
    default:
  }
}

// return representation of grid
// HAPPY SAD
// location of players
function fetchState() {
  return '__D_,____,HH__,_X__'
}

var deltas = {
  LEFT: [-1, 0],
  RIGHT: [1, 0],
  UP: [0, -1],
  DOWN: [0, 1]
};

function move(playerId, direction) {
  var p = players[playerId];
  var oldXY = { x: p.x, y: p.y };
  var delta = deltas[direction];
/*
  if (position available) {
    p.x = n.x;
    p.y = n.y;
  }
*/
  var newXY = { x: p.x + delta[0], y: p.y + delta[1] };
  return {old: oldXY, new: newXY};
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
  reset: reset
};
