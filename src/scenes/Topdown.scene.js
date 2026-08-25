import * as Phaser from "phaser";
import {playerComposition} from "@/compositions/Player.composition.js";
import {sceneComposition} from "@/compositions/scene.composition.js";
import {backgroundComposition} from "@/compositions/Background.composition.js";
import {topdownMapComposition} from "@/compositions/TopdownMap.composition.js";
import {EventBus} from "@/utils/utils.js";
import * as Config from "@/configs/gameplay.config.js";
import * as EventNames from "@/configs/eventNames.config.js";
import audioConfigs from "@/configs/audio.config.json";
import timeConfig from "@/configs/time.config.json";
import firebaseConfig from "@/configs/firebaseConfig.json";
import { audioComposition } from "@/compositions/Audio.composition.js";
import { dynamicLightingComposition } from "@/compositions/DynamicLighting.composition.js";
import {calendarComposition} from "@/compositions/Calendar.composition.js";
import {particlesComposition} from "@/compositions/Particles.composition.js";
import particlesConfig from "@/configs/particles.json";
import { analyticsComposition } from "@/compositions/Analytics.composition.js";

export class TopdownScene extends Phaser.Scene {
  constructor(playerStore, calendarStore) {
    super("MainScene");
    this.playerStore = playerStore;
    this.calendarStore = calendarStore;
  }

  preload() {
    sceneComposition.preload(this);
    playerComposition.preloadPlayerAnimation(this);
    backgroundComposition.preloadBackgroundImage(this);
    topdownMapComposition.preloadLevel(this);
    audioComposition.preloadAudioFiles(this, audioConfigs);
    dynamicLightingComposition.preloadShaders(this);
    particlesComposition.preloadParticlesTextures(this, particlesConfig);
  }

  create() {
    this.background = backgroundComposition.createBackgroundImage(this, this.cameras.main.width, this.cameras.main.height);
    const [map, groundLayer, doorLayer, heartLayer, bombLayer] = topdownMapComposition.createLevel(this);

    calendarComposition.initCalendar(this.calendarStore, timeConfig);

    this.userInput = playerComposition.createUserInput(this);

    playerComposition.preparePlayerAnimation(this);
    this.player = playerComposition.createPlayer(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      Config.PLAYER_DISPLAY_WIDTH,
      Config.PLAYER_DISPLAY_HEIGHT,
      Config.PLAYER_TOPDOWN_BODY_WIDTH,
      Config.PLAYER_TOPDOWN_BODY_HEIGHT,
      Config.PLAYER_SPEED,
      Config.PLAYER_MAX_HEALTH
    );

    particlesComposition.initObjectVFX(this, this.player, ["dust"], particlesConfig);

    playerComposition.configureCameraFollow(this, this.player, this.cameras.main.width / 4, this.cameras.main.height / 4);

    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.overlap(this.player, doorLayer, () => {
      EventBus.emit(EventNames.GO_TO_PLATFORM);
      analyticsComposition.log("next_scene", { nextScene: "Platformer" });
    });
    this.physics.add.collider(this.player, heartLayer, (player, heart) => {
      playerComposition.handleHeartCollision(this, player, heart, this.playerStore);
    });
    this.physics.add.collider(this.player, bombLayer, (player, bomb) => {
      playerComposition.handleBombCollision(this, player, bomb, this.playerStore);
    });

    audioComposition.createAudioForScene(this, audioConfigs);
    audioComposition.play(this, "mountains-sounds");
    audioComposition.updateGlobalVolume(this, this.playerStore.isPlaySound);

    this.dayNightLightingPipeline = dynamicLightingComposition.prepareAmbientLightPipeline(
      this,
      timeConfig.morningPhaseTransitionFraction,
      timeConfig.afternoonPhaseTransitionFraction,
      timeConfig.eveningPhaseTransitionFraction,
      timeConfig.nightPhaseTransitionFraction,
      this.calendarStore.currentPhase,
      calendarComposition.getCurrentPhaseProgress(this.calendarStore)
    );

    analyticsComposition.createAnalytics(firebaseConfig);
  }

  update(time, delta) {
    calendarComposition.setCurrentTime(this.calendarStore, delta);
    audioComposition.updateGlobalVolume(this, this.playerStore.isPlaySound);
    playerComposition.movePlayerOnTopDown(this.player, this.userInput, this);
    backgroundComposition.moveBackground(this.cameras.main, this.background);
    dynamicLightingComposition.updateAmbientLightPipeline(this.dayNightLightingPipeline, this.calendarStore.currentPhase, calendarComposition.getCurrentPhaseProgress(this.calendarStore));
  }
}
