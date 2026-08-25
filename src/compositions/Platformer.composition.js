import {tilemapComposition } from "@/compositions/Tilemap.composition.js";

export const platformerComposition = {
  preloadLevel(scene) {
    scene.load.image("platform", "assets/levels/tiles/platform.png");
    scene.load.image("door2", "assets/levels/tiles/door2.png");
    scene.load.image("bomb", "assets/levels/tiles/bomb.png");
    scene.load.image("heart", "assets/levels/tiles/heart.png");
    scene.load.tilemapTiledJSON("platformer-tilemap", "assets/levels/tilemaps/platformer.json");
    scene.load.image('mountBack', 'assets/img/background/mount-back.png');
    scene.load.image('mountFront', 'assets/img/background/mount-front.png');
  },

  createLevel(scene) {
    const map = scene.make.tilemap({ key: "platformer-tilemap" });

    const layer = tilemapComposition.createTileLayer(map, "platform", "Platforms", [1]);
    const doorLayer = tilemapComposition.createObjectLayer(scene, map, "object_layer");
    const heartLayer = tilemapComposition.createObjectLayer(scene, map, "heart_layer");
    const bombLayer = tilemapComposition.createObjectLayer(scene, map, "bomb_layer");

    return [map, layer, doorLayer, heartLayer, bombLayer];
  },
  createParallaxImages(scene) {
    const camera = scene.cameras.main;

    const backgroundFar = scene.add.image(-1755, 1706, 'mountBack')
      .setOrigin(0.5, 0.04)
      .setScrollFactor(0);

    const backgroundNear = scene.add.image(-1755, 1706, 'mountFront')
      .setOrigin(0.9, -2)
      .setScrollFactor(0);

      return [camera, backgroundNear, backgroundFar];
  },
  moveParallaxImages(camera, backgroundNear, backgroundFar, scene) {
    const scrollX = camera.scrollX;
    const scrollY = camera.scrollY;

    backgroundFar.setPosition(-scrollX * 0.3, scene.scale.height - scrollY * 0.3);
    backgroundNear.setPosition(-scrollX * 0.6, scene.scale.height - scrollY * 0.6);
  },
};
