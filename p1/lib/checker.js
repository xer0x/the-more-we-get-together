var shapes = require('./shapes')

function checkShapes(players, gameBoard) {
  //For every player
  for (var key in players) {
    var player = players[key];

    // Checks the board for this players shape
    var shapeWinners = checkShape(gameBoard, shapes[player.shape]) || [];

    // Checks if this player was among the people that made the shape
    for (var i = 0; i < shapeWinners.length; i++){
      var shapeY = shapeWinners[i][0];
      var shapeX = shapeWinners[i][1];
      if (shapeY == player.y && shapeX == player.x){
        //If they were, POINTS!
        player.score = parseInt(player.score) + 1;
      }
    }
  }
  return players;
}

//Pass it the gameboard and shapes;
function checkShape(gameBoard, shape){

  var rowCount = gameBoard.length;
  var rowLength = gameBoard[0].length;
  var winners = [];
  var shapeWinners = [];

  //Checks each tile in the gameboard
  for (var i = 0; i < rowCount; i++) {
    var row = gameBoard[i];
    for (var j = 0; j < rowLength; j++) {
      var space = row[j];
      if (space == "X"){
        var blam = checkTile(shape, i, j, gameBoard);
        if (blam){
          winners.push(blam);
        }
      }
    }
  }

  for (var i = 0; i < winners.length; i++) {
    for (var j = 0; j < winners[i].length; j++) {
      shapeWinners.push(winners[i][j]);
    }
  }

  if (shapeWinners.length > 0) {
    return shapeWinners;
  }

}


//Checks if this tile was in this shape
function checkTile(shape, y, x, gameBoard) {

  var rowCount = gameBoard.length;
  var rowLength = gameBoard[0].length;
  var winners = [];
  var shapeRowCount = shape.length;
  var shapeRowLength = shape[0].length;
  var xOffset = shapeRowCount;
  var yOffset = shapeRowLength;
  var tileCount = 0;
  var matchCount = 0;
  var winners = [];

  for (var i = 0; i < shapeRowCount; i++) {
    var shapeRow = shape[i];

    for (var j = 0; j < shapeRowLength; j++){
      var tile = shapeRow[j];
      if (tile == "X"){
        tileCount++;
        if (i < yOffset ){
          yOffset = i;
          xOffset = j;
        }
      }
    }
  }

  var xStart = x - xOffset;
  var yStart = y - yOffset;

  // Iterate over the shape again
  for (var i = 0; i < shapeRowCount; i++) {
    var shapeRow = shape[i];

    for (var j = 0; j < shapeRowLength; j++){

      var tile = shapeRow[j];

      if (tile == "X"){
        var checkX = j + xStart;
        var checkY = i + yStart;

        if (checkY < rowCount && checkX < rowLength) {
          if (gameBoard[checkY][checkX] == "X") {
            winners.push([checkY, checkX]);
            matchCount++;
          }
        }
      }
    }
  }

  if (tileCount == matchCount) {
    // The tile made a shape!
    return winners;
  }

}

function buildBoard(gridSize, players){
  var gameBoard = new Array(gridSize);
  for (var i = 0; i < gridSize; i++){
    gameBoard[i] = new Array(gridSize);
  }
  for (var key in players) {
    var player = players[key];
    gameBoard[player.y][player.x] = "X";
  }
  return gameBoard;
}

function drawBoard(gameBoard){
  var output = '';
  for (var i = 0; i < gameBoard.length; i++) {
    var row = gameBoard[i];
    for (var j = 0; j < gameBoard[0].length; j++) {
      var space = row[j] || "_";
      output += ' ' + space;
    }
    output += '\n';
  }
  console.log(output)
}

function test() {

  var players = {
    1 : {
      name: "jim",
      x : 1,
      y : 1,
      shape : "vBar",
      score : 0
    },
    2 : {
      name : "bob",
      x : 1,
      y : 2,
      shape : "vBar",
      score: 0
    },
    3 : {
      name : "steve",
      x : 1,
      y : 3,
      shape : "square",
      score: 0
    }
  }

  var grid = buildBoard(16, players);
  drawBoard(grid);
  var results = checkShapes(players, grid);
  console.log(results);
}

test();

module.exports = {checkShapes: checkShapes};
