import Phaser from "phaser";
import PreloadScenePlayable from "@/scenes/PreloadPlayable.scene.js";
import PlayableScene from "@/scenes/Playable.scene.js";
import { smoudComposition } from "@/compositions/Smoud.composition.js";

const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 1280;

smoudComposition.init((width, height) => {
  const gameWidth = width || window.innerWidth || DEFAULT_WIDTH;
  const gameHeight = height || window.innerHeight || DEFAULT_HEIGHT;

  new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: "#00bfdf",
    scene: [PreloadScenePlayable, PlayableScene],
    scale: {
      width: gameWidth,
      height: gameHeight,
      mode: Phaser.Scale.RESIZE,
      parent: "game",
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      },
    },
  });
});
