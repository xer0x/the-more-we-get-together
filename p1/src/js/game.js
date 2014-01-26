(function () {
  'use strict';
  var grid;
  var gridWidth = 32;
  var gridHeight = 32;
  var cubeWidth = 64;
  var cubeHeight = 64;
  var cubeOffset = 0;
  var cubeOffsetY = 45;
  var cubeOffsetX = 28;
  var cursors;
  var player;
  var playerShadow;
  var playerShadowChange;
  var allPlayers;
  var moveSpeed = 8;
  var playerOneId = "";
  var builtGrid = false;
  var timeRemaining;
  var startTime;
  var timeCounter;
  var timerText;
  var scoreText;
  var scoreboard;
  var topScores;
  var scoreIcon;
  var started;
  var ended;
  var myShape;
  var coinGroup;
  var coinIndex;
  var tmygt = window.tmygt || (window.tmygt = {});
  var shapes = {
    loner : {
      shape : [
        ["X"]
      ]
    },
    minivBar : {
      shape : [
        ["X"],
        ["X"]
      ]
    },
    minihBar : {
      shape : [
        ["X","X"]
      ]
    },
    vBar : {
      shape : [
        ["X"],
        ["X"],
        ["X"]
      ]
    },
    hBlock : {
      shape : [
        ["X","X","X"],
        ["X","X","X"]
      ]
    },
    vBlock : {
      shape : [
        ["X","X"],
        ["X","X"],
        ["X","X"]
      ]
    },
    hBar : {
      shape : [
        ["X","X","X"]
      ]
    },
    square : {
      shape : [
        ["X","X"],
        ["X","X"],
      ]
    },
    leftL : {
      shape : [
        ["X","0"],
        ["X","0"],
        ["X","X"]
      ]
    },
    rightL : {
      shape : [
        ["0","X"],
        ["0","X"],
        ["X","X"]
      ]
    },
    x : {
      shape : [
        ["X","0","X"],
        ["0","X","0"],
        ["X","0","X"]
      ]
    },
    v : {
      shape : [
        ["X","0","X"],
        ["0","X","0"]
      ]
    },
    t : {
      shape : [
        ["X","X","X"],
        ["0","X","0"],
        ["0","X","0"]
      ]
    },
    tetris : {
      shape : [
        ["X","0"],
        ["X","X"],
        ["0","X"]
      ]
    },
    circle : {
      shape : [
        ["X","X","X"],
        ["X","0","X"],
        ["X","X","X"]
      ]
    },
    diamond : {
      shape : [
        ["0","X","0"],
        ["X","0","X"],
        ["0","X","0"]
      ]
    },
    cross : {
      shape : [
        ["0","X","0"],
        ["X","X","X"],
        ["0","X","0"]
      ]
    },
    boomerang : {
      shape : [
        ["X","X","X"],
        ["0","0","X"],
        ["0","0","X"]
      ]
    }
  }

  function isEmpty(xPos,yPos) {
	if (grid != null && grid[xPos][yPos] == 0) return true;
	else return false;
  }

  function sortDepths() {

		for (var j=0;j<gridHeight;j++) {

			for(var i=gridWidth-1;i>=0;i--) {
				//grid[i][j] = 0;
				if (grid[i][j] != 0) {
					var thisPlayer = grid[i][j];
					thisPlayer.bringToTop();
				}
			}
		}
	}

  tmygt.Game = function () {

  };


  tmygt.Game.prototype = {

    create: function () {
	  this.allPlayers = {};
	  topScores = [];
	  var nameText = document.getElementById("nameText");
	  nameText.innerHTML = "Hi, " + phaserGame.playerName + "!";
		phaserGame.sound.play('startGame1')

	  cursors = this.input.keyboard.createCursorKeys();

      this.input.mouse.mouseUpCallback = this.onMouseUp;

	  timerText = document.getElementById("timerText");
	  scoreText = document.getElementById("scoreText");
	  myShape = document.getElementById("myShape");
	  scoreboard = document.getElementById("scoreboard");
	  startTime = 5;
	  started = false;
	  coinGroup = [];
	  for (var i = 0; i < 50; i++)
		{
			var coin = this.add.sprite(0,0,'coin');
			coin.vy = 0;
			coin.life = 20;
			coinGroup.push(coin);
			coin.scaleVX = 0;
		}
	  coinIndex = 0;
	  
	  
    },
	start: function() {
		topScores = [];
		timeRemaining = startTime;
		started = true;
		ended = false;
		scoreboard.style.display = "none";

		var timeClock = function() {
			timeRemaining--;
			//console.log(timeRemaining + " seconds left");
			if (timeRemaining < 10 && timeRemaining >= 0) {
				timerText.innerHTML = ":0" + timeRemaining;
			} else {
				timerText.innerHTML = ":" + timeRemaining;
			}
			if (timeRemaining <= 0) {
				started = false;
				ended = true;
			} else {
				setTimeout(timeClock, 1000);
			}
		};
		timeClock();
	},
	end:function () {
		phaserGame.sound.play('cheer1')
		timeRemaining = 0;
		this.getTopScores();
		for (var i=0;i<coinGroup.length;i++) {
			var c = coinGroup[i];
			c.kill();
		}
		scoreboard.style.display = "block";
	},
  drawShape: function(shapeName){

    myShape.innerHTML = "";
    var shape = shapes[shapeName].shape;
    var tileSize = 30;
    var shapeWrapper = document.createElement("div");
    shapeWrapper.classList.add("shapeWrapper");

    for(var i = 0; i < shape.length; i++){
      var row = shape[i];
      for(var j = 0; j < row.length; j++){
        var tile = row[j];
        var tileEl = document.createElement("div");
        tileEl.classList.add("tile");
        tileEl.style.top = i * tileSize + "px";
        tileEl.style.width = tileSize + "px";
        tileEl.style.height = tileSize + "px";
        tileEl.style.left = j * tileSize + "px";
        if(tile == "X"){
          shapeWrapper.appendChild(tileEl);
        }
      }
    }

    shapeWrapper.style.height = tileSize * shape.length + "px";
    shapeWrapper.style.width = tileSize * shape[0].length + "px";
    //
    var shapesContainer = document.querySelector("#shapes");
    if(shapeName != "loner") {
      myShape.appendChild(shapeWrapper);
    }


  },
	processMessage: function (message) {

		var command = message.split(" ");
		//console.log(message);
		switch (command[0]) {
			case "PLAYER":
			var coords = command[1].split(",");
			var id = command[2];

			var newPlayer = this.createPlayer(id, coords[0], coords[1]);
			if (newPlayer.id == this.playerOneId) {
				player = newPlayer;
				this.camera.bounds = null;
				this.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
				this.setScore(newPlayer.id,0);
			}
			break;


			case "FINISHED":
			this.end();
			break;

			case "START":
			startTime = command[1];
			this.start();
			if (player != null) this.setScore(this.playerOneId, 0);
			break;

			case "GRID":
			var serverGrid = eval('('+command[3]+')');

			if(!builtGrid) {
				var w = command[1];
				var h = command[2];
				this.buildGrid(w,h, serverGrid);

			} else {
				this.checkGrid(serverGrid);
			}
			break;

			case "DROP":
			var coords = command[1].split(",");
			var playerToKill = this.getPlayerAt(coords[0], coords[1]);
			grid[playerToKill.xPos][playerToKill.yPos] = 0;
			playerToKill.kill();

			break;

			case "YOU":
			this.playerOneId = command[1];
			console.log("player one id is " + this.playerOneId);
			break;

			case "MOVE":
			var prevCoords = command[1];
			var newCoords = command[2];
			var id = command[3];
			var playerToMove = this.allPlayers[id];

			if (playerToMove != 0) {
				newCoords = newCoords.split(",");
				playerToMove.moveTo(newCoords[0],newCoords[1]);
			}

			break;

			case "SCORES":
			
			var totalScores = command.length-1;
			for (var i=1;i<=totalScores;i++) {
				var scoreData = command[i].split(",");
				var id = scoreData[0];
				var score = scoreData[1];
				this.setScore(id,score);
			}
			
			break;
			
			
			case "NAMES":
			
			var totalNames = command.length-1;
			for(var i = 1;i<=totalNames;i++) {
				var nameData = command[i].split(",");
				var id=nameData[0];
				var name = nameData[1];
				if(id != null && id != '' && name != '' && name != null) {
				  this.allPlayers[id].name = name;
				}
				
			}
			break;
			

			case "SHAPE":
        var shapeName = command[1];
        this.drawShape(shapeName);
			break;

			case "SHAPES":
			var totalShapeUpdates = command.length-1;
			for (var i = 1;i<=totalShapeUpdates;i++) {
				var shapeData = command[i].split(",");
				var id=shapeData[0];
				var shape = shapeData[1];
				if(id != null && id != '' && shape != '' && shape != null)
          this.drawShape(shape);

			}
			break;
			
			case "BING":
			var bings = command.length-1;
      for (var i = 1;i<=bings;i++) {
				var bingData = command[i].split(",");
				var id=bingData[0];
				var score = bingData[1];
				if(id != null && id != '' && score != '' && score != null)
					this.bingPlayer(id,score);
			}
			break;

			case "LEVELS":
        for(var i = 1; i < command.length; i++){
          var levelData = command[i].split(",");
          var playerID = levelData[0];
          var playerLevel = levelData[1];
          this.allPlayers[playerID].frame = Number(playerLevel);
        }
			break;

      case "COUNTDOWN":
        phaserGame.sound.play('surprise1')
        timeRemaining = 4;
      break;

		}

	},

	buildGrid:function(w,h,serverGrid) {
		grid  = [];
		gridWidth = w;
		gridHeight = h;
		var worldWidth = gridWidth * cubeWidth;
	    var worldHeight = gridHeight * cubeHeight;
		this.game.world.setBounds(0, 0, worldWidth, worldHeight);
		var backgroundGraphics = this.add.graphics(0,0);

		var g  = this.add.graphics(0, 0);

		g.beginFill("0x387525");
		g.drawRect( -15, worldHeight + 30, worldHeight - 30 , 10);
		g.beginFill("0xFFFFFF");
		g.drawRect(-30, -30, worldHeight, worldHeight + 60);

		g.lineStyle(2,0xd0dee9,1);

		// draw grid
		for (var i=0;i<=gridWidth;i++) {
			g.moveTo(i*cubeWidth,0);
			g.lineTo(i*cubeWidth,worldHeight);
			for(var j=0;j<= gridHeight;j++) {
				g.moveTo(0,j*cubeHeight);
				g.lineTo(worldWidth,j*cubeHeight);
			}
		}
		// populate grid
		for (var i=0;i<gridWidth;i++) {
			grid[i] = [];
			for(var j=0;j< gridHeight;j++) {
				grid[i][j] = 0;
				if (serverGrid[i][j] != 0) {
					this.createPlayer(serverGrid[i][j], i,j);
				}
			}
		}
		builtGrid = true;
		playerShadow = this.add.sprite(-1000,0,'playerShadow');
		this.add.tween(playerShadow).to( { alpha: .4 }, 200, Phaser.Easing.Linear.None, true, 0, 1000, true);
	},

	checkGrid: function (serverGrid) {
		for (var i=0;i<gridWidth;i++) {
			//grid[i] = [];
			for(var j=0;j< gridHeight;j++) {
				var serverNode = serverGrid[i][j];
				var localNode = grid[i][j];
				if (serverNode == 0 && localNode == 0) continue;
				if (serverNode != 0 && localNode == 0) {
					var playerId = serverNode[i][j];
					var playerToCorrect = this.allPlayers[playerId];
					playerToCorrect.moveTo(i,j);
					console.log("correcting player " + playerToCorrect.name);
				}
			}
		}
	},
	bingPlayer:function(id,score) {
		if(this.allPlayers != null) {
			phaserGame.sound.play('happy1')
			var playerToBing = this.allPlayers[id];
			this.setScore(id, score);
			//console.log("Bing this: " + playerToBing);
			var coin = coinGroup[coinIndex];
			coinIndex++;
			if (coinIndex >= coinGroup.length) coinIndex = 0;
        coin.bringToTop();
        coin.x = playerToBing.x+70;
        coin.y = playerToBing.y+25;
        coin.vy = -2;
        coin.life = 25;
        coin.revive();
	  }
	},
    update: function () {

		if (window.messages.length > 0) {
			this.processMessage(window.messages.shift());
		}


		if(started) {

			if (player != null) {
				if (player.targetX == null && player.targetY == null) {
          if (cursors.right.isDown) {
						player.moveRight();
					} else if (cursors.left.isDown) {
						player.moveLeft();
					} else if (cursors.down.isDown) {
						player.moveDown();
					} else if (cursors.up.isDown) {
						player.moveUp();
					}
				}
			}
			for(var p in this.allPlayers) {
				var thisPlayer = this.allPlayers[p];
				if (thisPlayer.targetY != null) {
					if (thisPlayer.targetY > thisPlayer.y) {
						thisPlayer.y += moveSpeed;
						if (thisPlayer.y >= thisPlayer.targetY) {
							thisPlayer.y = thisPlayer.targetY;
							thisPlayer.targetY = null;
						}
					} else if (thisPlayer.targetY < thisPlayer.y) {
						thisPlayer.y -= moveSpeed;
						if (thisPlayer.y <= thisPlayer.targetY) {
							thisPlayer.y = thisPlayer.targetY;
							thisPlayer.targetY = null;
						}
					}

				}

				if (thisPlayer.targetX != null) {
					if (thisPlayer.targetX > thisPlayer.x) {
						thisPlayer.x += moveSpeed;
						if (thisPlayer.x >= thisPlayer.targetX) {
							thisPlayer.x = thisPlayer.targetX;
							thisPlayer.targetX = null;
						}
					} else if (thisPlayer.targetX < thisPlayer.x) {
						thisPlayer.x -= moveSpeed;
						if (thisPlayer.x <= thisPlayer.targetX) {
							thisPlayer.x = thisPlayer.targetX;
							thisPlayer.targetX = null;
						}
					}
				}
			}
			if (player != null) {
				playerShadow.x = player.x+9;
				playerShadow.y = player.y+30;
			}

			for(var i=0;i<coinGroup.length;i++) {
				var c = coinGroup[i];

				c.y += c.vy;


				c.life--;
				if (c.life <0) {
					c.kill();
				}

			}

		}
    },

    onMouseUp: function (event) {

		if (player != null) {

			var dx = this.input.activePointer.worldX - player.x;
			var dy = this.input.activePointer.worldY - player.y;
			var ang =  Math.atan2(dy,dx) * (180/Math.PI);
			if (ang < 0) ang = 360 + ang;

			if(player.targetX == null && ang < 45 || ang >= 315) {
				player.moveRight();
			} else if (player.targetY == null &&  ang >= 45 && ang < 135) {
				player.moveDown();
			} else if (player.targetX == null &&  ang >= 135 && ang < 225) {
				player.moveLeft();
			} else if (player.targetY == null && ang >= 225 && ang < 315) {
				player.moveUp();
			}
		}
    },

	createPlayer: function(uid, xPosition, yPosition) {
		var newPlayer = this.add.sprite(0, 0, 'player');
		newPlayer.id = uid;
		newPlayer.xPos = xPosition;
		newPlayer.yPos = yPosition;

		newPlayer.x = xPosition * cubeWidth-cubeOffsetX;
		newPlayer.y = yPosition * cubeHeight-cubeOffset-cubeOffsetY;
		newPlayer.targetX = null;
		newPlayer.targetY = null;
		newPlayer.score = 0;
		newPlayer.totalScore = 0;
		newPlayer.inWorld = true;
		newPlayer.grid = grid;
		//newPlayer.frame = Math.floor(Math.random() * 14) + 1;
		newPlayer.frame = 0;
		newPlayer.moveRight = function () {
      phaserGame.sound.play('move1');
			if (this.xPos < gridWidth-1 && isEmpty(Number(this.xPos)+1,Number(this.yPos))) {

				grid[this.xPos][this.yPos] = 0;
				this.xPos++;
				grid[this.xPos][this.yPos] = this;
				this.targetX = this.x + cubeWidth;
				sockjs.send("MOVE RIGHT");
				sortDepths();
				return true;
			}

			return false;
		}

		newPlayer.moveLeft = function () {
      phaserGame.sound.play('move1');
			if(this.xPos > 0 && isEmpty(Number(this.xPos)-1,Number(this.yPos))) {
				grid[this.xPos][this.yPos] = 0;
				this.xPos--;
				grid[this.xPos][this.yPos] = this;
				this.targetX = this.x - cubeWidth;
				sockjs.send("MOVE LEFT");
				sortDepths();
				return true;
			}

			return false;
		}

		newPlayer.moveDown = function () {
      phaserGame.sound.play('move1');
      if(this.yPos < gridHeight-1  && isEmpty(Number(this.xPos),Number(this.yPos)+1)) {
				grid[this.xPos][this.yPos] = 0;
				this.yPos++;
				grid[this.xPos][this.yPos] = this;
				this.targetY = this.y + cubeHeight;
				sockjs.send("MOVE DOWN");
				sortDepths();
				return true;
			}

			return false;
		}

		newPlayer.moveUp = function () {
      phaserGame.sound.play('move1');
      if (this.yPos > 0 && isEmpty(Number(this.xPos),Number(this.yPos)-1)) {
				grid[this.xPos][this.yPos] = 0;
				this.yPos--;
				grid[this.xPos][this.yPos] = this;
				this.targetY = this.y - cubeHeight;
				sockjs.send("MOVE UP");
				sortDepths();
				return true;
			}
			return false;
		}

		newPlayer.moveTo = function(xPosition, yPosition) {

			this.targetY = yPosition*cubeHeight-cubeOffset-cubeOffsetY;
			this.targetX = xPosition*cubeWidth-cubeOffsetX;
			grid[this.xPos][this.yPos] = 0;
			this.xPos = xPosition;
			this.yPos = yPosition;
			grid[this.xPos][this.yPos] = this;
			sortDepths();
		}

		this.allPlayers[newPlayer.id] = newPlayer;
		grid[newPlayer.xPos][newPlayer.yPos] = newPlayer;
		return newPlayer;
	},

	setScore:function(id,score) {

		this.allPlayers[id].score = score;
		if (id == this.playerOneId) {
			scoreText.innerHTML = "Score: " + score;
		}
	},
	getPlayerAt:function(xPosition, yPosition) {
		return grid[xPosition][yPosition];
	},
	
	getTopScores:function () {
	  topScores = [];
	  
	  for(var p in this.allPlayers) {
		var thisPlayer = this.allPlayers[p];
		//thisPlayer.score = Math.floor(Math.random() * 100);
		topScores.push(thisPlayer);	
	  }
	  
	  var compare = function(a,b) {
		  if (Number(a.score) < Number(b.score))
			 return 1;
		  if (Number(a.score) > Number(b.score))
			return -1;
		  return 0;
		}
		
	  topScores.sort(compare);
		
	  for (var i=0;i<topScores.length;i++) {
	    if (i < 3) {
			var playerName = document.getElementById("playerName"+Number(i+1));
			playerName.innerHTML = " " +topScores[i].name;
			var playerScore = document.getElementById("playerScore"+Number(i+1));
			playerScore.innerHTML = " " +topScores[i].score;
		}
		
		if (topScores[i].id == this.playerOneId) {
			var p1place = document.getElementById("place");
			if (i == 0) p1place.innerHTML = "1st";
			else if (i == 1) p1place.innerHTML = "2nd";
			else if (i == 2) p1place.innerHTML = "3rd";
			else p1place.innerHTML = Number(i-1) + "th";
			var p1points = document.getElementById("points");
			p1points.innerHTML = topScores[i].score;
		}
	  }
	  
	  
	  
	 
	}
  };
}(this));


