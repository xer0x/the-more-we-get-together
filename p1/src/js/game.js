(function () {
  'use strict';
  var grid;
  var gridWidth = 32;
  var gridHeight = 32;
  var cubeWidth = 64;
  var cubeHeight = 64;
  var cubeOffset = 11;
  var cursors;
  var player;
  var allPlayers;
  var moveSpeed = 8;
  var playerOneId = "";
  
  var tmygt = window.tmygt || (window.tmygt = {});
  
  
  function isEmpty(xPos,yPos) {
	if (grid[xPos][yPos] == 0) return true;
	else return false;
  }
  tmygt.Game = function () {
  
  };

  
  tmygt.Game.prototype = {
    
    create: function () {
	  this.allPlayers = {};
	  	  
	  //sockjs.onmessage = this.processMessage;
	  //window.messages = []; // clear out socks message queue
	  //process initial messages
	  while(window.messages.length > 0) {
		this.processMessage(window.messages.shift());
	  }
	  
	  cursors = this.input.keyboard.createCursorKeys();
	  
      this.camera.bounds = null;
	  //this.buildGrid(32,32);
	  
	  //player = this.createPlayer("player1_id",0,0);
	  this.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
	  //this.input.mouse.mouseUpCallback = this.onMouseUp;
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
			
			case "GRID":
			var w = command[1];
			var h = command[2];
			var serverGrid = eval('('+command[3]+')');
			
			this.buildGrid(w,h, serverGrid);
			break;
			
			case "DROP":
			var coords = command[1].split(",");
			var playerToKill = this.getPlayerAt(coords[0], coords[1]);
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
			console.log("lets move " + playerToMove);
			
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
		var g  = this.add.graphics(0, 0);
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
		
	},
	
    update: function () {
		
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
		
    },
	
    onMouseUp: function (event) {
		
		if (player != null) {
			
			var dx = this.input.activePointer.worldX - player.x;
			var dy = this.input.activePointer.worldY - player.y;
			var ang =  Math.atan2(dy,dx) * (180/Math.PI);
			if (ang < 0) ang = 360 + ang;
			
			if(ang < 45 || ang >= 315) {
				player.moveRight();
			} else if ( ang >= 45 && ang < 135) {
				player.moveDown();
			} else if ( ang >= 135 && ang < 225) {
				player.moveLeft();
			} else if (ang >= 225 && ang < 315) {
				player.moveUp();
			}
		}
    },
	
	createPlayer: function(uid, xPosition, yPosition) {
		var newPlayer = this.add.sprite(0, 0, 'player');
		newPlayer.id = uid;
		newPlayer.xPos = xPosition;
		newPlayer.yPos = yPosition;
		
		newPlayer.x = xPosition * cubeWidth;
		newPlayer.y = yPosition * cubeHeight-cubeOffset;
		newPlayer.targetX = null;
		newPlayer.targetY = null;
		newPlayer.score;
		newPlayer.inWorld = true;
		newPlayer.grid = grid;
		
		newPlayer.moveRight = function () {
			
			if (this.xPos < gridWidth-1 && isEmpty(this.xPos+1,this.yPos)) {
				
				grid[this.xPos][this.yPos] = 0;
				this.xPos++;
				grid[this.xPos][this.yPos] = this;
				this.targetX = this.x + cubeWidth;
				sockjs.send("MOVE RIGHT");
				return true;
			}
			
			return false;
		}
		
		newPlayer.moveLeft = function () {
			if(this.xPos > 0 && isEmpty(this.xPos-1,this.yPos)) {
				grid[this.xPos][this.yPos] = 0;
				this.xPos--;
				grid[this.xPos][this.yPos] = this;
				this.targetX = this.x - cubeWidth;
				sockjs.send("MOVE LEFT");
				return true;
			}
			
			return false;
		}
		
		newPlayer.moveDown = function () {
			if(this.yPos < gridHeight-1  && isEmpty(this.xPos,this.yPos+1)) {
				grid[this.xPos][this.yPos] = 0;
				this.yPos++;
				grid[this.xPos][this.yPos] = this;
				this.targetY = this.y + cubeHeight;
				sockjs.send("MOVE DOWN");
				return true;
			}
			
			return false;
		}
		
		newPlayer.moveUp = function () {
			if (this.yPos > 0 && isEmpty(this.xPos,this.yPos-1)) {
				grid[this.xPos][this.yPos] = 0;
				this.yPos--;
				grid[this.xPos][this.yPos] = this;
				this.targetY = this.y - cubeHeight;
				sockjs.send("MOVE UP");
				return true;
			}
			return false;
		}
		
		newPlayer.moveTo = function(xPosition, yPosition) {
			
			this.targetY = yPosition*cubeHeight-cubeOffset;
			this.targetX = xPosition*cubeWidth;
			
			grid[this.xPos][this.yPos] = 0;
			this.xPos = xPosition;
			this.yPos = yPosition;
			grid[this.xPos][this.yPos] = this;
			
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


