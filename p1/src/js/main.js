window.onload = function () {
  'use strict';

  var game = new Phaser.Game(960, 640, Phaser.AUTO, 'tmygt');
  game.state.add('boot', tmygt.Boot);
  game.state.add('preloader', tmygt.Preloader);
  game.state.add('menu', tmygt.Menu);
  game.state.add('game', tmygt.Game);

  game.state.start('boot');
};
