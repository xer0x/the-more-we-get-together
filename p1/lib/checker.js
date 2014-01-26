var shapes = require('./shapes').shapes;
var empty = 0;
var occupied = "X";

function checkShapes(players, gameBoard) {

  var simpleBoard = translateBoard(gameBoard);

  //drawBoard(gameBoard);   // original
  //drawBoard(simpleBoard); // flipped X/Y

  //For every player
  for (var key in players) {
    var player = players[key];
    if (player.shape == 'loner') continue; // loners don't score

    // Checks the board for this players shape
    var shapeWinners = checkShape(simpleBoard, shapes[player.shape]) || [];

    // Checks if this player was among the people that made the shape
    for (var i = 0; i < shapeWinners.length; i++){
      var shapeY = shapeWinners[i][0];
      var shapeX = shapeWinners[i][1];
      if (shapeY == player.y && shapeX == player.x){
        //If they were, POINTS!
        // console.log(player.name + ' POINTS!!!!')
        player.score = Number(player.score) + 1;
      }
    }
  }
  //console.log(players)
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
      if (space == occupied){
        var blam = checkTile(shape.shape, i, j, gameBoard);
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
      if (tile == occupied){
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

      if (tile == occupied){
        var checkX = j + xStart;
        var checkY = i + yStart;

        if (checkY < rowCount && checkX < rowLength) {
          if (gameBoard[checkY][checkX] == occupied) {
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
    gameBoard[player.x][player.y] = occupied;
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
  // console.log(output)
}

// flip X & Y access and clone
function translateBoard(board) {
  var width = board.length;
  var height = board[0].length;
  // Create new board with X/Y flipped
  var newBoard = [];
  for (var i=0; i < height; i++) {
    newBoard[i] = [];
  }
  newBoard[i] = [];
  // Copy pixels into flipped board
  for (var i=0; i < width; i++) {
    for (var j=0; j < height; j++) {
      if (board[i][j]) {
        newBoard[j][i] = occupied;
      } else {
        newBoard[j][i] = empty;
      }
    }
  }
  return newBoard;
}

function test() {

  var players = {
    1 : {
      name: "jim",
      x : 0,
      y : 0,
      shape : "simple",
      score : 0
    },
    2 : {
      name : "bob",
      x : 1,
      y : 0,
      shape : "simple",
      score: 0
    },
    3 : {
      name : "steve",
      x : 5,
      y : 3,
      shape : "square",
      score: 0
    },
    4 : {
      name : "ste33ve",
      x : 4,
      y : 3,
      shape : "square",
      score: 0
    },
    5 : {
      name : "sadsad",
      x : 6,
      y : 3,
      shape : "square",
      score: 0
    }
  }

  var grid = buildBoard(16, players);
  drawBoard(grid);
  assignAllPlayerShapes(players);
  console.log("players");

  // var results = checkShapes(players, grid);
  // console.log(results);
}

// test();

module.exports = {checkShapes: checkShapes};
