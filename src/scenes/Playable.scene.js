import Phaser from "phaser";
import { playableComposition } from "@/compositions/Playable.composition.js";
import { playerComposition } from "@/compositions/Player.composition.js";
import { topdownMapComposition } from "@/compositions/TopdownMap.composition.js";
import { audioComposition } from "@/compositions/Audio.composition.js";
import * as Config from "@/configs/gameplay.config.js";
import audioPlayableConfigs from "@/configs/audioPlayable.config.json";
import { particlesComposition } from "@/compositions/Particles.composition.js";
import particlesConfig from "@/configs/particles.json";
import { smoudComposition } from "@/compositions/Smoud.composition.js";
import { sceneComposition } from "@/compositions/scene.composition.js";

export default class PlayableScene extends Phaser.Scene {
  constructor() {
    super("PlayableScene");
  }

  create() {
    playableComposition.preparePlayerAnimations(this);
    const [map, groundLayer, doorLayer, heartLayer, bombLayer] = topdownMapComposition.createLevel(this);
    this.map = map;
    this.groundLayer = groundLayer;
    const playerPosition = playableComposition.findClosestGroundPosition(groundLayer, this.scale.width / 2, this.scale.height / 2);

    this.player = playerComposition.createPlayer(
      this,
      playerPosition.x,
      playerPosition.y,
      Config.PLAYER_DISPLAY_WIDTH,
      Config.PLAYER_DISPLAY_HEIGHT,
      Config.PLAYER_TOPDOWN_BODY_WIDTH,
      Config.PLAYER_TOPDOWN_BODY_HEIGHT,
      Config.PLAYER_SPEED,
      Config.PLAYER_MAX_HEALTH
    );
    playableComposition.updateHealthBar(this.player, "#health-bar");
    particlesComposition.initObjectVFX(this, this.player, ["dust"], particlesConfig);

    playerComposition.configureCameraFollow(this, this.player, this.cameras.main.width / 4, this.cameras.main.height / 4);

    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.overlap(this.player, heartLayer, (_player, heart) => {
      playableComposition.handleHeartCollision(this, this.player, heart, "#health-bar");
    });
    this.physics.add.overlap(this.player, bombLayer, (_player, bomb) => {
      playableComposition.handleBombCollision(this, this.player, bomb, "#health-bar");
    });

    this.input.on("pointerdown", (pointer) => {
      playerComposition.updatePlayerAimFromPointer(this, this.player, this.groundLayer, pointer);
    });

    audioComposition.createAudioForScene(this, audioPlayableConfigs);
    audioComposition.play(this, "mountains-sounds");
    playableComposition.freezeGamePlay(this);

    smoudComposition.onPause(() => {
      playableComposition.freezeGamePlay(this);
    });

    smoudComposition.onResume(async () => {
      await playableComposition.startGamePlay(this);
    });

    smoudComposition.onResize((width, height) => sceneComposition.handleResize(this, width, height));
  }

  update(time, delta) {
    const pointer = this.input.activePointer;

    if (pointer.isDown) {
      pointer.updateWorldPoint(this.cameras.main);
      playerComposition.updatePlayerAimFromPointer(this, this.player, this.groundLayer, pointer);
    }

    playerComposition.movePlayerOnTopDownWithMouse(this.player, this, delta);
  }
}
