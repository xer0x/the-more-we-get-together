(function () {
  'use strict';
  
  var tmygt = window.tmygt || (window.tmygt = {});

  tmygt.Boot = function () {};
  
  tmygt.Boot.prototype = {
    
    preload: function () {
      //this.load.image('preloader', 'assets/preloader.gif');
	  this.load.image('loaderFull', 'assets/preload_full.png');
	  this.load.image('loaderEmpty', 'assets/preload_empty.png');
    },

    create: function () {
	  
      
	  this.game.input.maxPointers = 2;
      // this.game.stage.disableVisibilityChange = true;
	  
      if (this.game.device.desktop) {
        this.game.stage.scale.pageAlignHorizontally = true;
      } else {
        this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
        this.game.stage.scale.minWidth =  480;
        this.game.stage.scale.minHeight = 260;
        this.game.stage.scale.maxWidth = 960;
        this.game.stage.scale.maxHeight = 640;
        this.game.stage.scale.forceLandscape = true;
        this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.setScreenSize(true);
		
      }
      this.game.state.start('preloader');
    }
  };


}(this));
