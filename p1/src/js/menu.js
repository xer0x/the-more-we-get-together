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

	  this.stage.backgroundColor="#FFFFFF";
      startBtn = document.getElementById("enterNameButton");
	    startBtn.addEventListener("click", this.processName);
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
