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
      // this.load.audio('happy1', 'assets/audio/mwgt_vo_gen_01.webm');
      this.load.audio('cheer1', 'assets/audio/mwgt_vo_groupcheer_02.webm');
      this.load.audio('surprise1', 'assets/audio/mwgt_vo_gen_19.webm');
      this.load.audio('move1', 'assets/audio/move.mp3');
      this.load.audio('happy1', 'assets/audio/mario_coin.wav');

/*
      this.load.audio('happy2', 'assets/audio/mwgt_vo_gen_02.webm');
      this.load.audio('happy3', 'assets/audio/mwgt_vo_gen_03.webm');
      this.load.audio('happy4', 'assets/audio/mwgt_vo_gen_04.webm');
      this.load.audio('happy5', 'assets/audio/mwgt_vo_gen_05.webm');
      this.load.audio('happy6', 'assets/audio/mwgt_vo_gen_06.webm');
      this.load.audio('happy7', 'assets/audio/mwgt_vo_gen_07.webm');
      this.load.audio('happy8', 'assets/audio/mwgt_vo_gen_08.webm');
      this.load.audio('happy9', 'assets/audio/mwgt_vo_gen_09.webm');
      this.load.audio('happy10', 'assets/audio/mwgt_vo_gen_10.webm');
      this.load.audio('happy11', 'assets/audio/mwgt_vo_gen_11.webm');
      this.load.audio('happy12', 'assets/audio/mwgt_vo_gen_12.webm');
      this.load.audio('happy13', 'assets/audio/mwgt_vo_gen_13.webm');
      this.load.audio('happy14', 'assets/audio/mwgt_vo_gen_14.webm');
      this.load.audio('happy15', 'assets/audio/mwgt_vo_gen_15.webm');
      this.load.audio('happy16', 'assets/audio/mwgt_vo_gen_16.webm');
      this.load.audio('happy17', 'assets/audio/mwgt_vo_gen_17.webm');
      this.load.audio('happy18', 'assets/audio/mwgt_vo_gen_18.webm');
      this.load.audio('happy19', 'assets/audio/mwgt_vo_gen_19.webm');
      this.load.audio('cheer1', 'assets/audio/mwgt_vo_groupcheer_01.webm');
      this.load.audio('cheer2', 'assets/audio/mwgt_vo_groupcheer_02.webm');
      this.load.audio('cheer3', 'assets/audio/mwgt_vo_groupcheer_03.webm');
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
