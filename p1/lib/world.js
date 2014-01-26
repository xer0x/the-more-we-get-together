var util = require('util');
var checker = require('./checker');
var shapes = require('./shapes');

var width = 10;
var height = 11;
var defaultRoundLength = 4; // 33
var secondsForIntermission = 3; // 7
var secondsLeft;
var roundFinished = true;
var lastTickState = roundFinished;

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
  //console.log('checking %d,%d', _x, _y);
  if (_x < 0 || _x >= width) return false;
  if (_y < 0 || _y >= height) return false;
  return !grid[_x][_y];
}

function addPlayer(playerId, callback) {
  var position = getNewPosition();
  var player = {
    id: playerId,
    x: position.x,
    y: position.y,
    name: 'Winner' + ('' + Math.random()).substring(2,6),
    score: 0,
    shape: shapes.getPlayerShape(Object.keys(players).length)
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
    case 'SETNAME':
      var name = setName(playerId, command);
      if (name) {
        results.push(util.format('NAME %s %s', playerId, name));
      }
      break;
    default:
  }
  return results;
}

function setName(playerId, name) {
  var p = players[playerId];
  if (p && name) {
    p.name = name;
    return name;
  }
  return false;
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
  var p = players[playerId];
  var old = { x: p.x, y: p.y };
  var delta = deltas[direction];
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
  printScores();
  if (roundFinished !== lastTickState) {
    if (roundFinished) {
      messages.push('FINISHED %s', def);
    } else {
      messages.push('START %s', secondsLeft);
    }
  }
  lastTickState = roundFinished;
  var messages = [];
  return messages;
}

// print scores to server console
function printScores() {
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

function init() {
  makeGrid();
  reset();
}

function reset() {
  shapes.assignAllPlayerShapes(players);
  secondsLeft = defaultRoundLength;
  roundFinished = false;
  setTimeout(function() {
    roundFinished = true; // Next tick() will show intermission screen
    setTimeout(function() {
      reset(); // re-START the next round
    }, secondsForIntermission);
  }, secondsLeft * 1000);
}

reset(); // initialize

module.exports = {
  getGrid: getGrid,
  addPlayer: addPlayer,
  getPlayer: getPlayer,
  removePlayer: removePlayer,
  change: change,
  tick: tick,
  reset: reset,
  init: init
};
