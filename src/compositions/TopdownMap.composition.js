import {tilemapComposition } from "@/compositions/Tilemap.composition.js";

export const topdownMapComposition = {
  preloadLevel(scene) {
    scene.load.image("ground_tiles", "assets/levels/tiles/ground_tiles.jpg");
    scene.load.image("door", "assets/levels/tiles/door.png");
    scene.load.image("bomb", "assets/levels/tiles/bomb.png");
    scene.load.image("heart", "assets/levels/tiles/heart.png");
    scene.load.tilemapTiledJSON("topdown-tilemap", "assets/levels/tilemaps/topdown.json");
  },

  createLevel(scene) {
    const map = scene.make.tilemap({ key: "topdown-tilemap" });

    const groundLayer = tilemapComposition.createTileLayer(map, "ground_tiles", "ground_layer", [3]);
    const doorLayer = tilemapComposition.createObjectLayer(scene, map, "door_layer");
    const heartLayer = tilemapComposition.createObjectLayer(scene, map, "heart_layer");
    const bombLayer = tilemapComposition.createObjectLayer(scene, map, "bomb_layer");

    return [map, groundLayer, doorLayer, heartLayer, bombLayer];
  }
};
