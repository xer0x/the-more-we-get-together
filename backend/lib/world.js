var width = 10;
var height = 11;

function getGrid() {
  return {
    width: width,
    height: height,
    state: fetchState()
  };
}

function addPlayer(playerId, callback) {
  var player = {
    id: playerId,
    // TODO: check if another player is on this space
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
    shape: 'L'
  };
  if (callback) callback(player);
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
  change: change
};
