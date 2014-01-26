var players = {
  1 : {
    name: "jim",
    xPos : 1,
    yPos : 1,
    shape : "vBar",
    score : 0
  },
  2 : {
    name : "bob",
    xPos : 1,
    yPos : 2,
    shape : "vBar",
    score: 0
  },
  3 : {
    name : "steve",
    xPos : 1,
    yPos : 3,
    shape : "square",
    score: 0
  }
}

$(document).ready(function(){

  buildBoard(32);   //Generates the fake board and adds the players to it as Xs
  drawBoard();      //Draws it on the page for fun

  //For every player
  for (var key in players) {
    var player = players[key];

    // Checks the board for this players shape
    var shapeWinners = checkShape(gameBoard,shapes[player.shape]) || [];

    // Checks if this player was among the people that made the shape
    for(var i = 0; i < shapeWinners.length; i++){
      var shapeY = shapeWinners[i][0];
      var shapeX = shapeWinners[i][1];
      if(shapeY == player.yPos && shapeX == player.xPos){
        //If they were, POINTS!
        player.score = parseInt(player.score) + 1;
      }
    }
  }

  console.log(players)

});

//Pass it the gameboard and shapes;
function checkShape(gameBoard,shape){

  var rowCount = gameBoard.length;
  var rowLength = gameBoard[0].length;
  var winners = [];
  var shapeWinners = [];

  //Checks each tile in the gameboard
  for (var i = 0; i < rowCount; i++) {
    var row = gameBoard[i];
    for (var j = 0; j < rowLength; j++) {
      var space = row[j];
      if(space == "X"){
        var blam = checkTile(shape,i,j);
        if(blam){
          winners.push(blam);
        }
      }
    }
  }

  for(var i = 0; i < winners.length; i++) {
    for(var j = 0; j < winners[i].length; j++) {
      shapeWinners.push(winners[i][j]);
    }
  }

  if(shapeWinners.length > 0) {
    return shapeWinners;
  }

}


//Checks if this tile was in this shape
function checkTile(shape,y,x) {

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
      if(tile == "X"){
        tileCount++;
        if(i < yOffset ){
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

      if(tile == "X"){
        var checkX = j + xStart;
        var checkY = i + yStart;

        if(checkY < rowCount && checkX < rowLength) {
          if(gameBoard[checkY][checkX] == "X"){
            winners.push([checkY,checkX]);
            matchCount++;
          }
        }
      }
    }
  }

  if(tileCount == matchCount) {
    // The tile made a shape!
    return winners;
  }

}

function buildBoard(gridSize){
  gameBoard = new Array(gridSize);
  for (var i = 0; i < gridSize; i++){
    gameBoard[i] = new Array(gridSize);
  }
  for (var key in players) {
    var player = players[key];
    gameBoard[player.yPos][player.xPos] = "<span class='playa'>X</span>";
  }
}

function drawBoard(){
  var display = $("#board");
  display.html("");
  for (var i = 0; i < gameBoard.length; i++) {
    var row = gameBoard[i];
    for (var j = 0; j < gameBoard[0].length; j++) {
      var space = row[j] || "0";
      display.html(display.html() + space); //draw the row
    }
    display.html(display.html() + "<br>"); // add a space
  }
}
