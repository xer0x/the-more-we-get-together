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


      var nameInput = document.getElementById("nameInput");
      nameInput.focus();

      var self = this;

      nameInput.addEventListener("keydown",function(e){
        if(e.keyCode == 13){
          self.processName();
        }
      });

      window.volume = 1.1;
      window.bgMusic = phaserGame.sound.play('musicLoop_long', window.volume, true);

      this.stage.backgroundColor="#FFFFFF";
      startBtn = document.getElementById("enterNameButton");
      startBtn.onclick = this.processName;
	  
	  var entryForm = document.getElementById("enterName");
	  entryForm.style.display = "block";
	  
	  
	  
	   var nameui = document.getElementById("name-ui");
	  nameui.style.display = "block";
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
		nameInput.focus();
		var nameValue = nameInput.value;
		if (nameValue == "Enter Your Name..." || nameValue == "") nameValue = "Winner";
		sockjs.send("SETNAME " + nameValue);
		window.phaserGame.playerName = nameValue;
		ready = true;
	}
  };

}(this));
