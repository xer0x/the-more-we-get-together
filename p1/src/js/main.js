var phaserGame;


window.onload = function () {
  'use strict';
  
  phaserGame = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'gamediv', null, true);
  phaserGame.state.add('boot', tmygt.Boot);
  phaserGame.state.add('preloader', tmygt.Preloader);
  phaserGame.state.add('menu', tmygt.Menu);
  phaserGame.state.add('game', tmygt.Game);
  phaserGame.state.add('end', tmygt.End);
  phaserGame.state.start('boot');
  //phaserGame.playerName = "";
};
	