import Phaser from "phaser";
import { audioComposition } from "@/compositions/Audio.composition.js";
import playerWaitPNG from "@public/assets/animation/player/player-idle.png";
import playerWaitJSON from "@public/assets/animation/player/player-idle.json";
import playerMovePNG from "@public/assets/animation/player/player-run.png";
import playerMoveJSON from "@public/assets/animation/player/player-run.json";
import ghostGhostPNG from "@public/assets/animation/ghost/trainer-hunt.png";
import ghostGhostJSON from "@public/assets/animation/ghost/trainer-hunt.json";
import floor from "@public/assets/levels/tiles/floor-wall-roof.png";
import topdownTilemap from "@public/assets/levels/tilemaps/topdown.json";
import smoke from "@public/assets/vfx/smoke-puff.png";
import fire from "@public/assets/vfx/yellow.png";
import { resultsComposition } from "@/compositions/Results.composition.js";
import { smoudComposition } from "@/compositions/Smoud.composition.js";

export const playableComposition = {
  preloadPlayerAnimation(scene) {
    scene.load.atlas("player_wait", playerWaitPNG, playerWaitJSON);
    scene.load.atlas("player_move", playerMovePNG, playerMoveJSON);
  },

  preloadGhostAnimation(scene) {
    scene.load.atlas("ghost", ghostGhostPNG, ghostGhostJSON);
  },

  preloadLevel(scene) {
    scene.load.image("floor-wall-roof", floor);
    scene.load.tilemapTiledJSON("topdown-tilemap", topdownTilemap);
  },

  preloadParticlesTextures(scene) {
    scene.load.image("smoke-puff-particle", smoke);
    scene.load.image("fire-particle", fire);
  },

  prepareGhostAnimation(scene) {
    if (!scene.anims.exists("ghost")) {
      scene.anims.create({
        key: "ghost",
        frames: scene.anims.generateFrameNames("ghost"),
        frameRate: 16,
        repeat: -1,
      });
    }
  },

  preparePlayerAnimations(scene) {
    if (!scene.anims.exists("player_wait")) {
      scene.anims.create({
        key: "player_wait",
        frames: scene.anims.generateFrameNames("player_wait"),
        frameRate: 16,
        repeat: -1,
      });
    }
    if (!scene.anims.exists("player_move")) {
      scene.anims.create({
        key: "player_move",
        frames: scene.anims.generateFrameNames("player_move"),
        frameRate: 24,
        repeat: -1,
      });
    }
  },

  freezeGamePlay(scene, canResume = true) {
    const splash = document.querySelector("#splash");

    if (canResume && !splash) {
      scene.physics.world.resume();
      scene.anims.resumeAll();
      return;
    }

    scene.physics.world.pause();
    scene.anims.pauseAll();
    audioComposition.updateGlobalVolume(scene, false);

    if (splash) {
      splash.classList.add("is-ready");
      splash.setAttribute("role", "button");
      splash.setAttribute("aria-label", "Tap to move");
      if (canResume) {
        splash.addEventListener("pointerdown", () => this.startGamePlay(scene), { once: true });
      }
    }

    scene.scene.pause();
  },

  async startGamePlay(scene) {
    const audioContext = scene.sound.context;

    if (audioContext?.state === "suspended") {
      await audioContext.resume();
    }

    audioComposition.updateGlobalVolume(scene, true);
    scene.physics.world.resume();
    scene.anims.resumeAll();
    scene.scene.resume();
    document.querySelector("#splash")?.remove();
  },

  bindCta() {
    const cta = document.querySelector("#game-result-link");
    if (!cta) return;

    cta.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      smoudComposition.install();
    });
  },

  restartGame(scene) {
    const btn = document.querySelector("#game-result-btn");
    if (!btn) return;

    btn.onclick = () => {
      resultsComposition.showModal(false);
      scene.physics.world.resume();
      scene.anims.resumeAll();
      scene.scene.resume();
      scene.scene.restart();
    };
  },
};
