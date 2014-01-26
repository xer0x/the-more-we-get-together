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
      this.load.image('playerShadow', 'assets/sprites/tile_shadow.png');
      this.load.image('splash', 'assets/splash.jpg');
      this.load.image('coin', 'assets/sprites/coin.png');
      this.load.audio('happy1', 'assets/audio/mwgt_vo_gen_01.webm');
      this.load.audio('cheer1', 'assets/audio/mwgt_vo_groupcheer_02.webm');
      this.load.audio('surprise1', 'assets/audio/mwgt_vo_gen_19.webm');

/*
assets/audio/mwgt_vo_gen_01.webm
assets/audio/mwgt_vo_gen_02.webm
assets/audio/mwgt_vo_gen_03.webm
assets/audio/mwgt_vo_gen_04.webm
assets/audio/mwgt_vo_gen_05.webm
assets/audio/mwgt_vo_gen_06.webm
assets/audio/mwgt_vo_gen_07.webm
assets/audio/mwgt_vo_gen_08.webm
assets/audio/mwgt_vo_gen_09.webm
assets/audio/mwgt_vo_gen_10.webm
assets/audio/mwgt_vo_gen_11.webm
assets/audio/mwgt_vo_gen_12.webm
assets/audio/mwgt_vo_gen_13.webm
assets/audio/mwgt_vo_gen_14.webm
assets/audio/mwgt_vo_gen_15.webm
assets/audio/mwgt_vo_gen_16.webm
assets/audio/mwgt_vo_gen_17.webm
assets/audio/mwgt_vo_gen_18.webm
assets/audio/mwgt_vo_gen_19.webm
assets/audio/mwgt_vo_groupcheer_01.webm
assets/audio/mwgt_vo_groupcheer_02.webm
assets/audio/mwgt_vo_groupcheer_03.webm
*/
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
