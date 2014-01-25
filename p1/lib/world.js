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
function getRandomPosition() {
  var x, y;
  var notPlaced = true;
  while (notPlaced) {
    x = Math.floor(Math.random() * width);
    y = Math.floor(Math.random() * height);
    notPlaced = 
  }
  return [];
}

function addPlayer(playerId, callback) {
  var player = {
    id: playerId,
    // TODO: check if another player is on this space
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
