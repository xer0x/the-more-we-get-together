(function () {
  'use strict';
  var gridWidth = 32;
  var gridHeight = 32;
  var cubeWidth = 64;
  var cubeHeight = 64;
  var cubeOffset = 11;
  var cursors;
  var player;
  var allPlayers;
  var moveSpeed = 16;
  
  var tmygt = window.tmygt || (window.tmygt = {});
  
  tmygt.Game = function () {
  
  };

  tmygt.Game.prototype = {
    
    create: function () {
	  //sockjs.onmessage = this.processMessage;
	  window.messages = []; // clear out socks message queue
	  cursors = this.input.keyboard.createCursorKeys();
	  var worldWidth = gridWidth * cubeWidth;
	  var worldHeight = gridHeight * cubeHeight;
	  this.stage.backgroundColor = "#FFFFFF";
	  this.game.world.setBounds(0, 0, worldWidth, worldHeight);
      
	   this.camera.bounds = null;
	  
      var g  = this.add.graphics(0, 0);
	  g.lineStyle(2,0xd0dee9,1);
	  
	  for (var i=0;i<=gridHeight;i++) {
		g.moveTo(0,i*cubeHeight);
		g.lineTo(worldWidth,i*cubeHeight);
		
		for(var j=0;j<= gridWidth;j++) {
			g.moveTo(j*cubeWidth,0);
			g.lineTo(j*cubeWidth,worldHeight);
		}
		
	  }
	  
	  player = this.createPlayer(0,0);
	  allPlayers = [];
	  
	  this.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
	  this.input.mouse.mouseUpCallback = this.onMouseUp;
	  
    },

    update: function () {
	
		if (window.messages.length > 0) {
			//console.log(window.messages.pop());
			this.processMessage(window.messages.pop());
		}
		
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
		
		
    },
	
    onMouseUp: function (event) {
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
    },
	
	processMessage: function (message) {
		//console.log(e.data);
		
		var command = message.split(" ");
		
		switch (command[0]) {
			case "PLAYER":
			var coords = command[1].split(",");
			this.createPlayer(coords[0], coords[1]);
			break;
		}
	
	},
	
	createPlayer: function(xPosition, yPosition) {
		var newPlayer = this.add.sprite(0, 0, 'player');
		newPlayer.xPos = xPosition;
		newPlayer.yPos = yPosition;
		newPlayer.x = xPosition * cubeWidth;
		newPlayer.y = yPosition * cubeHeight-cubeOffset;
		newPlayer.targetX = null;
		newPlayer.targetY = null;
		newPlayer.inWorld = true;
		console.log(newPlayer);
		newPlayer.moveRight = function () {
			if (player.xPos < gridWidth-1) {
				this.xPos++;
				this.targetX = this.x + cubeWidth;
				//sockjs.send("moving right");
				return true;
			}
			
			return false;
		}
		
		newPlayer.moveLeft = function () {
			if(player.xPos > 0) {
				this.xPos--;
				this.targetX = this.x - cubeWidth;
				//sockjs.send("moving left");
				return true;
			}
			
			return false;
		}
		
		newPlayer.moveDown = function () {
			if(player.yPos < gridHeight-1) {
				player.yPos++;
				player.targetY = player.y + cubeHeight;
				//sockjs.send("moving down");
				return true;
			}
			
			return false;
		}
		
		newPlayer.moveUp = function () {
			if (player.yPos > 0) {
				player.yPos--;
				player.targetY = player.y - cubeHeight;
				//sockjs.send("moving up");
				return true;
			}
			return false;
		}
		
		return newPlayer;
	}

  };
  
  
}(this));


