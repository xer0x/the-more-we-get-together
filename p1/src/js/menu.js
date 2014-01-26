(function () {
  'use strict';

  var tmygt = window.tmygt || (window.tmygt = {});

  tmygt.Menu = function () {
    this.titleTxt = null;
  };

  tmygt.Menu.prototype = {
    
    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;

	  this.stage.backgroundColor="#FFFFFF";
      var text = this.add.text(this.world.centerX, this.world.centerY, "The More We\nGet Together", {
        font: "65px Arial",
        fill: "#555",
        align: "center"
      });
	      
	  text.x -= text.width/2;
	  text.y -= text.height/2;
      this.input.onDown.add(this.onDown, this);
    },

    update: function () {
    
    },

    onDown: function () {
      this.game.state.start('game');
    }
  };

}(this));

