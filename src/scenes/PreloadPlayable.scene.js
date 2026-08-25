import Phaser from "phaser";
import { playableComposition } from "@/compositions/Playable.composition.js";
import { audioComposition } from "@/compositions/Audio.composition.js";
import audioPlayableConfigs from "@/configs/audioPlayable.config.json";
import explosionAudio from "@public/assets/audio/explosion.mp3";
import glitterAudio from "@public/assets/audio/glitter.mp3";
import mountainsAudio from "@public/assets/audio/mountains-sounds-min.mp3";
import playerWaitAudio from "@public/assets/audio/idle-sound.mp3";
import playerMoveAudio from "@public/assets/audio/move-sound.mp3";
import { particlesComposition } from "@/compositions/Particles.composition.js";
import { smoudComposition } from "@/compositions/Smoud.composition.js";
import particlesConfig from "@/configs/particles.json";
import smokePuffParticle from "@public/assets/vfx/smoke-puff.png";

const audioAssets = {
  explosion: explosionAudio,
  glitter: glitterAudio,
  "mountains-sounds": mountainsAudio,
  "player-wait": playerWaitAudio,
  "player-move": playerMoveAudio,
};

export default class PreloadScenePlayable extends Phaser.Scene {
  constructor() {
    super("PreloadScenePlayable");
  }

  preload() {
    playableComposition.preloadPlayerAnimation(this);
    playableComposition.preloadLevel(this);
    const audioConfigs = audioPlayableConfigs.map((config) => ({
      ...config,
      filePath: audioAssets[config.key],
    }));

    audioComposition.preloadAudioFiles(this, audioConfigs);
    particlesComposition.preloadParticlesTextures(this, particlesConfig, {
      "smoke-puff-particle": smokePuffParticle,
    });
  }

  create() {
    this.scene.start("PlayableScene");
    smoudComposition.start();
  }
}
