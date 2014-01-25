(function () {
  'use strict';
  var grid = [];
  var gridWidth = 32;
  var gridHeight = 32;
  var cubeWidth = 64;
  var cubeHeight = 64;
  var cubeOffset = 11;
  var cursors;
  var player;
  var allPlayers;
  var moveSpeed = 16;
  var playerOneId = "";
  
  var tmygt = window.tmygt || (window.tmygt = {});
  
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
	  this.input.mouse.mouseUpCallback = this.onMouseUp;
    },
	processMessage: function (message) {
		//console.log(e.data);
		
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
			this.buildGrid(w,h);
			break;
			
			case "DROP":
			var coords = command[1].split(",");
			
			case "YOU":
			this.playerOneId = command[1];
			console.log("player one id is " + this.playerOneId);
			break;
			
		}
	
	},
	
	buildGrid:function(w,h) {
		gridWidth = w;
		gridHeight = h;
		var worldWidth = gridWidth * cubeWidth;
	    var worldHeight = gridHeight * cubeHeight;
		this.game.world.setBounds(0, 0, worldWidth, worldHeight);
		
		var g  = this.add.graphics(0, 0);
		g.lineStyle(2,0xd0dee9,1);
	  
		  for (var i=0;i<=gridWidth;i++) {
			grid[i] = [];
			g.moveTo(i*cubeWidth,0);
			g.lineTo(i*cubeWidth,worldHeight);
			
			for(var j=0;j<= gridHeight;j++) {
				grid[i][j] = null;
				
				g.moveTo(0,j*cubeHeight);
				g.lineTo(worldWidth,j*cubeHeight);
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
			if (player.targetY != null) {
				if (player.targetY > player.y) {
					player.y += moveSpeed;
					if (player.y >= player.targetY) {
						player.y = player.targetY;
						player.targetY = null;
					} 
				} else if (player.targetY < player.y) {
					player.y -= moveSpeed;
					if (player.y <= player.targetY) {
						player.y = player.targetY;
						player.targetY = null;
					}
				}
				
			} else if (player.targetX != null) {
				if (player.targetX > player.x) {
					player.x += moveSpeed;
					if (player.x >= player.targetX) {
						player.x = player.targetX;
						player.targetX = null;
					} 
				} else if (player.targetX < player.x) {
					player.x -= moveSpeed;
					if (player.x <= player.targetX) {
						player.x = player.targetX;
						player.targetX = null;
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
		
		newPlayer.moveRight = function () {
			if (player.xPos < gridWidth-1) {
				this.xPos++;
				this.targetX = this.x + cubeWidth;
				sockjs.send("MOVE RIGHT");
				return true;
			}
			
			return false;
		}
		
		newPlayer.moveLeft = function () {
			if(player.xPos > 0) {
				this.xPos--;
				this.targetX = this.x - cubeWidth;
				sockjs.send("MOVE LEFT");
				return true;
			}
			
			return false;
		}
		
		newPlayer.moveDown = function () {
			if(player.yPos < gridHeight-1) {
				player.yPos++;
				player.targetY = player.y + cubeHeight;
				sockjs.send("MOVE UP");
				return true;
			}
			
			return false;
		}
		
		newPlayer.moveUp = function () {
			if (player.yPos > 0) {
				player.yPos--;
				player.targetY = player.y - cubeHeight;
				sockjs.send("MOVE DOWN");
				return true;
			}
			return false;
		}
		
		this.allPlayers[newPlayer.id] = newPlayer;
		return newPlayer;
	},
	
	getPlayerAt:function(xPosition, yPosition) {
		
	}

  };
  
  
}(this));


