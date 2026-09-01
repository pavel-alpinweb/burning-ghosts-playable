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
    scene.anims.create({
      key: "ghost",
      frames: scene.anims.generateFrameNames("ghost"),
      frameRate: 16,
      repeat: -1,
    });
  },

  preparePlayerAnimations(scene) {
    scene.anims.create({
      key: "player_wait",
      frames: scene.anims.generateFrameNames("player_wait"),
      frameRate: 16,
      repeat: -1,
    });
    scene.anims.create({
      key: "player_move",
      frames: scene.anims.generateFrameNames("player_move"),
      frameRate: 24,
      repeat: -1,
    });
  },

  freezeGamePlay(scene) {
    scene.physics.world.pause();
    scene.anims.pauseAll();
    audioComposition.updateGlobalVolume(scene, false);

    const splash = document.querySelector("#splash");

    if (splash) {
      splash.classList.add("is-ready");
      splash.setAttribute("role", "button");
      splash.setAttribute("aria-label", "Tap to move");
      splash.addEventListener("pointerdown", () => this.startGamePlay(scene), { once: true });
    } else {
      scene.input.once("pointerdown", () => this.startGamePlay(scene));
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

  updateHealthBar(player, element) {
    const healthBar = typeof element === "string" ? document.querySelector(element) : element;

    if (!healthBar) return;

    const maxHealth = Math.max(Number(player.maxHealth) || 0, 0);
    const currentHealth = Phaser.Math.Clamp(Number(player.currentHealth) || 0, 0, maxHealth);
    const healthPercentage = maxHealth > 0 ? (currentHealth / maxHealth) * 100 : 0;
    const color = healthPercentage >= 60 ? "#95c11f" : healthPercentage >= 40 ? "#ffff00" : "#8a0000";
    const icon = healthBar.querySelector(".health-bar__icon");
    const fuelBar = healthBar.querySelector(".health-bar__fuel-bar");

    if (icon) icon.style.color = color;
    if (fuelBar) {
      fuelBar.style.width = `${healthPercentage}%`;
      fuelBar.style.backgroundColor = color;
    }

    healthBar.setAttribute("aria-valuenow", String(currentHealth));
    healthBar.setAttribute("aria-valuemax", String(maxHealth));
  },
};
