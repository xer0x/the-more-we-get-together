(function () {
  'use strict';
  var gridWidth = 32;
  var gridHeight = 32;
  var cubeWidth = 32;
  var cubeHeight = 32;
  var cursors;
  var player;
  var otherPlayers;
  var moveSpeed = 8;
  
  var tmygt = window.tmygt || (window.tmygt = {});
  
  tmygt.Game = function () {
	
  };

  tmygt.Game.prototype = {
    
    create: function () {
	  cursors = this.input.keyboard.createCursorKeys();
	  var worldWidth = gridWidth * cubeWidth;
	  var worldHeight = gridHeight * cubeHeight;
	  
	  this.game.world.setBounds(0, 0, worldWidth, worldHeight);
      player = this.add.sprite(0, 0, 'player');
	  this.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
	  this.camera.bounds = null;
	  
      var g  = this.add.graphics(0, 0);
	  g.lineStyle(1,0xFFFFFF,1);
	  
	  for (var i=0;i<=gridHeight;i++) {
		g.moveTo(0,i*cubeHeight);
		g.lineTo(worldWidth,i*cubeHeight);
		
		for(var j=0;j<= gridWidth;j++) {
			g.moveTo(j*cubeWidth,0);
			g.lineTo(j*cubeWidth,worldHeight);
		}
		
	  }
	  
		this.input.mouse.mouseUpCallback = this.onMouseUp;
    },

    update: function () {
		//this.camera.x = player.x - this.camera.width / 2;
		//this.camera.y = player.y - this.camera.height /2 ;
		
    },

    onMouseUp: function (event) {
		var dx = this.input.activePointer.worldX - player.x;
		var dy = this.input.activePointer.worldY - player.y;
		var ang =  Math.atan2(dy,dx) * (180/Math.PI);
		if (ang < 0) ang = 360 + ang;
		if(ang < 45 || ang >= 315) {
			player.vx = moveSpeed;
			
		} else if (ang >= 45 && ang < 135) {
			player.vy = moveSpeed
		} else if (ang >= 135 && ang < 225) {
			player.vx = -moveSpeed;
		} else if (ang >= 225 && ang < 315) {
			player.vy = -moveSpeed;
		}
    }

  };

}(this));


