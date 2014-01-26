(function () {
  'use strict';
  var startBtn;
  var ready;
  var tmygt = window.tmygt || (window.tmygt = {});
  tmygt.Menu = function () {
    this.titleTxt = null;
	
  };

  tmygt.Menu.prototype = {
    
    create: function () {
	  ready = false;
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
      startBtn = document.getElementById("enterNameButton");
	  startBtn.addEventListener("click", this.processName);
      var splash = this.add.sprite(0,0,'splash'); 
	  splash.centerOn(window.innerWidth/2, window.innerHeight/2);
    },

    update: function () {
      if (ready) {
	    ready = false;
		var inputBox = document.getElementById("enterName");
		inputBox.style.display = "none";
		this.game.state.start('game');
		
	  }
    },
	
	processName: function (e) {
		var nameInput = document.getElementById("nameInput");
		var nameValue = nameInput.value;
		if (nameValue == "Enter Your Name..." || nameValue == "") nameValue = "Winner"; 
		sockjs.send("SETNAME " + nameValue);
		window.phaserGame.playerName = nameValue;
		ready = true;
	}
  };

}(this));

