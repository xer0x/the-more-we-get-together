(function () {
  'use strict';
  
  var tmygt = window.tmygt || (window.tmygt = {});

  tmygt.Preloader = function () {
    this.asset = null;
    this.ready = false;
  };

  tmygt.Preloader.prototype = {
    
    preload: function () {
      this.asset = this.add.sprite(320, 240, 'preloader');
      this.asset.anchor.setTo(0.5, 0.5);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      //this.load.image('player', 'assets/sprites/blue_happy_64.png');
      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
	  this.load.spritesheet('player', 'assets/sprites/tile_sprites.png', 120, 110, 14);

    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

}(this));
