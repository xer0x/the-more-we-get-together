var width = 10;
var height = 11;

var players = {};

function getGrid() {
  return {
    width: width,
    height: height,
    state: fetchState()
  };
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
}

// return representation of grid
// HAPPY SAD
// location of players
function fetchState() {
  return '__D_,____,HH__,_X__'
}

module.exports = {
  getGrid: getGrid,
  addPlayer: addPlayer,
  getPlayer: getPlayer,
  removePlayer: removePlayer,
  change: change
};
