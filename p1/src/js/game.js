(function () {
  'use strict';
  var gridWidth = 32;
  var gridHeight = 32;
  var cubeWidth = 64;
  var cubeHeight = 64;
  var cubeOffset = 11;
  var cursors;
  var player;
  var otherPlayers;
  var moveSpeed = 16;
  
  var tmygt = window.tmygt || (window.tmygt = {});
  
  tmygt.Game = function () {
	
  };

  tmygt.Game.prototype = {
    
    create: function () {
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
	  player = this.add.sprite(0, -cubeOffset, 'player');
	  player.xPos = 0;
	  player.yPos = 0;
	  player.inWorld = true;
	  this.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
	 
		this.input.mouse.mouseUpCallback = this.onMouseUp;
    },

    update: function () {
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
		if(player.xPos < gridWidth-1 && ang < 45 || ang >= 315) {
			player.xPos++;
			player.targetX = player.x + cubeWidth;
		} else if (player.yPos < gridHeight-1 && ang >= 45 && ang < 135) {
			player.yPos++;
			player.targetY = player.y + cubeHeight;
		} else if (player.xPos > 0 && ang >= 135 && ang < 225) {
			player.xPos--;
			player.targetX = player.x - cubeWidth;
		} else if (player.yPos > 0 && ang >= 225 && ang < 315) {
			player.yPos--;
			player.targetY = player.y - cubeHeight;
		}
    },
	
	addNPC: function() {
		var npc = this.add.sprite(0, 0, 'player');
	}

  };

}(this));


