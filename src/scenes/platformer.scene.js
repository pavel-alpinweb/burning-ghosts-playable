import * as Phaser from "phaser";
import { sceneComposition } from "@/compositions/scene.composition.js";
import {playerComposition} from "@/compositions/Player.composition.js";
import {platformerComposition} from "@/compositions/Platformer.composition.js";
import { particlesComposition } from "@/compositions/Particles.composition.js";
import particlesConfig from "@/configs/particles.json";
import * as Config from "@/configs/gameplay.config.js";
import { EventBus } from "@/utils/utils.js";
import * as EventNames from "@/configs/eventNames.config.js";
import { audioComposition } from "@/compositions/Audio.composition.js";
import audioConfigs from "@/configs/audio.config.json";
import timeConfig from "@/configs/time.config.json";
import firebaseConfig from "@/configs/firebaseConfig.json";
import { dynamicLightingComposition } from "@/compositions/DynamicLighting.composition.js";
import { calendarComposition } from "@/compositions/Calendar.composition.js";
import { analyticsComposition } from "@/compositions/Analytics.composition.js";

export class PlatformerScene extends Phaser.Scene {
  constructor(playerStore, calendarStore) {
    super("MainScene");
    this.playerStore = playerStore;
    this.calendarStore = calendarStore;
  }

  preload() {
    sceneComposition.preload(this);

    platformerComposition.preloadLevel(this);
    playerComposition.preloadPlayerAnimation(this);
    audioComposition.preloadAudioFiles(this, audioConfigs);
    dynamicLightingComposition.preloadShaders(this);
    particlesComposition.preloadParticlesTextures(this, particlesConfig);
  }

  create() {
    const [camera, backgroundNear, backgroundFar] = platformerComposition.createParallaxImages(this);

    this.camera = camera;
    this.backgroundNear = backgroundNear;
    this.backgroundFar = backgroundFar;

    const [map, layer, doorLayer, heartLayer, bombLayer] = platformerComposition.createLevel(this);

    calendarComposition.initCalendar(this.calendarStore, timeConfig);

    this.userInput = playerComposition.createUserInput(this);
    playerComposition.preparePlayerAnimation(this);
    this.player = playerComposition.createPlayer(
      this,
      -1755,
      1706,
      Config.PLAYER_DISPLAY_WIDTH,
      Config.PLAYER_DISPLAY_HEIGHT,
      Config.PLAYER_PLATFORM_BODY_WIDTH,
      Config.PLAYER_PLATFORM_BODY_HEIGHT,
      Config.PLAYER_SPEED,
      Config.PLAYER_MAX_HEALTH
    );

    // Инициализируем пыль для игрока
    particlesComposition.initObjectVFX(this, this.player, ["dust"], particlesConfig);
    playerComposition.configureCameraFollow(this, this.player, this.cameras.main.width / 4, this.cameras.main.height / 4);
    this.physics.add.collider(this.player, layer);
    this.physics.add.overlap(this.player, doorLayer, () => {
      EventBus.emit(EventNames.GO_TO_TOPDOWN);
      analyticsComposition.log("next_scene", { nextScene: "Topdown" });
    });
    this.physics.add.collider(this.player, heartLayer, (player, heart) => {
      playerComposition.handleHeartCollision(this, player, heart, this.playerStore);
    });
    this.physics.add.collider(this.player, bombLayer, (player, bomb) => {
      playerComposition.handleBombCollision(this, player, bomb, this.playerStore);
    });

    audioComposition.createAudioForScene(this, audioConfigs);
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
    playerComposition.movePlayerOnPlatformers(this.player, this.userInput, this);
    platformerComposition.moveParallaxImages(this.camera, this.backgroundNear, this.backgroundFar, this);
    dynamicLightingComposition.updateAmbientLightPipeline(this.dayNightLightingPipeline, this.calendarStore.currentPhase, calendarComposition.getCurrentPhaseProgress(this.calendarStore));
  }
}
