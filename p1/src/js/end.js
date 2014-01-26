(function () {
  'use strict';

  var tmygt = window.tmygt || (window.tmygt = {});

  tmygt.End = function () {
   
  };

  tmygt.End.prototype = {
    
    create: function () {
      this.stage.backgroundColor="#FFFFFF";
	  var text = this.add.text(this.world.centerX, this.world.centerY, "THIS IS THE END\nMY FRIEND", {
        font: "65px Arial",
        fill: "#555",
        align: "center"
      });

      text.anchor.setTo(0.5, 0.5);
    },

    update: function () {
		
    },
	
    onDown: function () {
      this.state.start('game');
    }
  };

}(this));

