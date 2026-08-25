export const audioComposition = {
  preloadAudioFiles(scene, audioConfigs) {
    for (const audioConfig of audioConfigs) {
      scene.load.audio(audioConfig.key, audioConfig.filePath);
    }
  },

  createAudioForScene(scene, audioConfigs) {
    for (const audioConfig of audioConfigs) {
      scene.sound.add(audioConfig.key, audioConfig);
    }

    scene.events.once("shutdown", () => scene.sound.stopAll());
  },

  play(scene, key, audioOptions) {
    if (!key) throw new Error("audioComposition.play(): key is required");

    let sound = scene.sound.get(key);
    if (!sound) throw new Error(`audioComposition.play(): sound with key '${key}' not found. Did you call createAudioForScene()?`);

    if (audioOptions && (!sound.isPlaying || !audioOptions.ignoreIfPlaying)) {
      sound.play(audioOptions);
    } else if (!sound.isPlaying || !sound.config.ignoreIfPlaying) {
      sound.play();
    }
  },

  stop(scene, key) {
    const sound = scene.sound.get(key);
    if (sound && sound.isPlaying) {
      sound.stop();
    }
  },

  updateGlobalVolume(scene, isPlaySound) {
    if (scene.sound.mute === isPlaySound) {
      scene.sound.mute = !isPlaySound;
    }
  },
};