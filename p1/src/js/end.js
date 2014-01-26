(function () {
  'use strict';
  var endText;
  var tmygt = window.tmygt || (window.tmygt = {});
  var readyToRestart;
  
  tmygt.End = function () {
   
  };

  tmygt.End.prototype = {
    
    create: function () {
      this.stage.backgroundColor="#FFFFFF";
	  endText = this.add.text(this.world.centerX, this.world.centerY, "THIS IS THE END\nMY FRIEND", {
        font: "65px Arial",
        fill: "#555",
        align: "center"
      });

      endText.anchor.setTo(0.5, 0.5);
	  //this.input.mouse.onMouseUp = this.restartGame;
	  //this.input.onDown = this.onDown;
    },

    update: function () {
		if (window.messages.length > 0) {
			this.processMessage(window.messages.shift());
		}
    },
	processMessage:function(message) {
		var command = message.split(" ");
		switch (command[0]) {
			
			
		}
	}
  };

}(this));

