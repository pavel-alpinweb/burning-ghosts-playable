import Phaser from "phaser";
import { audioComposition } from "@/compositions/Audio.composition.js";
import playerWaitPNG from "@public/assets/animation/16x/idle.png";
import playerWaitJSON from "@public/assets/animation/16x/idle.json";
import playerMovePNG from "@public/assets/animation/16x/run.png";
import playerMoveJSON from "@public/assets/animation/16x/run.json";
import groundTiles from "@public/assets/levels/tiles/ground_tiles.jpg";
import door from "@public/assets/levels/tiles/door.png";
import bomb from "@public/assets/levels/tiles/bomb.png";
import heart from "@public/assets/levels/tiles/heart.png";
import topdownTilemap from "@public/assets/levels/tilemaps/topdown.json";
import { BOMB_DAMAGE, HEAL_VALUE } from "@/configs/gameplay.config.js";
import { smoudComposition } from "@/compositions/Smoud.composition.js";

export const playableComposition = {
  preloadPlayerAnimation(scene) {
    scene.load.atlas("player_wait", playerWaitPNG, playerWaitJSON);
    scene.load.atlas("player_move", playerMovePNG, playerMoveJSON);
  },

  preloadLevel(scene) {
    scene.load.image("ground_tiles", groundTiles);
    scene.load.image("door", door);
    scene.load.image("bomb", bomb);
    scene.load.image("heart", heart);
    scene.load.tilemapTiledJSON("topdown-tilemap", topdownTilemap);
  },

  preparePlayerAnimations(scene) {
    scene.anims.create({
      key: "player_wait",
      frames: scene.anims.generateFrameNames("player_wait"),
      frameRate: 24,
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

  findClosestGroundPosition(groundLayer, targetX, targetY) {
    let closestTile = null;
    let closestDistance = Infinity;

    groundLayer.forEachTile((tile) => {
      const isGround = tile.index === 1 || tile.index === 2;
      const isWater = groundLayer.getTileAt(tile.x, tile.y)?.index === 3;

      if (!isGround || isWater) return;

      const distance = Phaser.Math.Distance.Squared(targetX, targetY, tile.getCenterX(), tile.getCenterY());

      if (distance < closestDistance) {
        closestTile = tile;
        closestDistance = distance;
      }
    });

    if (!closestTile) {
      throw new Error("Unable to find a ground tile for the player spawn point");
    }

    return {
      x: closestTile.getCenterX(),
      y: closestTile.getCenterY(),
    };
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

  handleHeartCollision(scene, player, heart, healthBarSelector) {
    player.currentHealth = Math.min(player.maxHealth, player.currentHealth + HEAL_VALUE);
    heart.setActive(false).setVisible(false);
    heart.body.enable = false;
    audioComposition.play(scene, "glitter");
    this.updateHealthBar(player, healthBarSelector);
    smoudComposition.onceInteraction(() => {
      console.log("[Playable] Heart interaction triggered", player.currentHealth);
    });
  },

  handleBombCollision(scene, player, bomb, healthBarSelector) {
    player.currentHealth = Math.max(0, player.currentHealth - BOMB_DAMAGE);
    bomb.setActive(false).setVisible(false);
    bomb.body.enable = false;
    audioComposition.play(scene, "explosion");
    this.updateHealthBar(player, healthBarSelector);
    smoudComposition.onceInteraction(() => {
      console.log("[Playable] Bomb interaction triggered", player.currentHealth);
    });
  },
};
