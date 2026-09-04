import Phaser from "phaser";
import { playableComposition } from "@/compositions/Playable.composition.js";
import { playerComposition } from "@/compositions/Player.composition.js";
import { topdownMapComposition } from "@/compositions/TopdownMap.composition.js";
import { audioComposition } from "@/compositions/Audio.composition.js";
import { timerComposition } from "@/compositions/Timer.composition.js";
import * as Config from "@/configs/gameplay.config.js";
import audioPlayableConfigs from "@/configs/audioPlayable.config.json";
import { smoudComposition } from "@/compositions/Smoud.composition.js";
import { sceneComposition } from "@/compositions/scene.composition.js";
import { ghostComposition } from "@/compositions/Ghost.composition.js";
export default class PlayableScene extends Phaser.Scene {
  constructor() {
    super("PlayableScene");
    this.fullTime = Config.FULL_TIME;
  }

  create() {
    playableComposition.preparePlayerAnimations(this);
    playableComposition.prepareGhostAnimation(this);
    const [map, groundLayer, playerSpawnLayer, wallsLayer, ghostSpawnLayer] = topdownMapComposition.createLevel(this);
    this.map = map;
    this.groundLayer = groundLayer;

    this.player = playerComposition.createPlayer(
      this,
      playerSpawnLayer.x,
      playerSpawnLayer.y,
      Config.PLAYER_DISPLAY_WIDTH,
      Config.PLAYER_DISPLAY_HEIGHT,
      Config.PLAYER_TOPDOWN_BODY_WIDTH,
      Config.PLAYER_TOPDOWN_BODY_HEIGHT,
      Config.PLAYER_SPEED,
      Config.PLAYER_MAX_HEALTH
    );
    timerComposition.reset();
    timerComposition.renderTimer(100);

    playerComposition.configureCameraFollow(this, this.player, this.cameras.main.width / 4, this.cameras.main.height / 4, 0.7);

    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.collider(this.player, wallsLayer);

    this.input.on("pointerdown", (pointer) => {
      playerComposition.updatePlayerAimFromPointer(this, this.player, this.groundLayer, pointer);
    });

    this.ghost = ghostComposition.createGhost(this, ghostSpawnLayer, this.player);

    audioComposition.createAudioForScene(this, audioPlayableConfigs);
    audioComposition.play(this, "mountains-sounds");
    playableComposition.freezeGamePlay(this);
    playableComposition.restartGame(this);

    smoudComposition.onPause(() => {
      playableComposition.freezeGamePlay(this);
    });

    smoudComposition.onResume(async () => {
      await playableComposition.startGamePlay(this);
    });

    smoudComposition.onResize((width, height) => sceneComposition.handleResize(this, width, height));
  }

  update(time, delta) {
    const remainingPercent = timerComposition.updateTime(delta, this.fullTime, this);
    timerComposition.renderTimer(remainingPercent);

    const pointer = this.input.activePointer;

    if (pointer.isDown) {
      pointer.updateWorldPoint(this.cameras.main);
      playerComposition.updatePlayerAimFromPointer(this, this.player, this.groundLayer, pointer);
    }

    playerComposition.movePlayerOnTopDownWithMouse(this.player, this, delta);
    ghostComposition.moveGhost(this.ghost, this.player);
  }
}
