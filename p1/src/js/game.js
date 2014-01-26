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
  var started;
  var ended;

  var tmygt = window.tmygt || (window.tmygt = {});

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

	  var nameText = document.getElementById("nameText");
	  nameText.innerHTML = "Hi, " + phaserGame.playerName + "!";
      //process initial messages
	  while(window.messages.length > 0) {
		this.processMessage(window.messages.shift());
	  }

	  cursors = this.input.keyboard.createCursorKeys();

      this.camera.bounds = null;
	  this.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
	  this.input.mouse.mouseUpCallback = this.onMouseUp;

	  timerText = document.getElementById("timerText");
	  scoreText = document.getElementById("scoreText");

	  startTime = 5;
	  started = false;

    },
	start: function() {
		timeRemaining = startTime;
		timeCounter = timeRemaining * this.time.fps;
		started = true;
	},
	processMessage: function (message) {

		var command = message.split(" ");

		switch (command[0]) {
			case "PLAYER":
			var coords = command[1].split(",");
			var id = command[2];

			var newPlayer = this.createPlayer(id, coords[0], coords[1]);
			if (newPlayer.id == this.playerOneId) {
				player = newPlayer;
			}
			break;

			case "START":
			startTime = command[1];
			this.start();
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
		this.add.tween(playerShadow).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
	},

	checkGrid: function (serverGrid) {
		for (var i=0;i<gridWidth;i++) {
			//grid[i] = [];
			for(var j=0;j< gridHeight;j++) {
				var serverNode = serverGrid[i][j];
				var localNode = grid[i][j];
				if (serverNode == 0 && localNode == 0) return;
				if (serverNode != 0 && localNode == 0) {
					var playerId = serverNode[i][j];
					var playerToCorrect = this.allPlayers[playerId];
					playerToCorrect.moveTo(i,j);
				}
			}
		}
	},

    update: function () {

		if(started) {

			timeCounter++ ;
			if (timeCounter > this.time.fps) {
				timeCounter = 0;
				timeRemaining--;

				//console.log(timeRemaining + " seconds left");
				timerText.innerHTML = "Time: " + timeRemaining;
				if(timeRemaining <= 0) {
					started = false;
					ended = true;
					builtGrid = false;
					this.game.state.start('end');
				}
			}

		}

		if (window.messages.length > 0) {
			this.processMessage(window.messages.shift());
		}

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
		newPlayer.score;
		newPlayer.inWorld = true;
		newPlayer.grid = grid;
		newPlayer.frame = Math.floor(Math.random() * 14) + 1;
		newPlayer.moveRight = function () {

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

	getPlayerAt:function(xPosition, yPosition) {
		return grid[xPosition][yPosition];
	}
  };
}(this));


