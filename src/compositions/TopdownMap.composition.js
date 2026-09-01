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

    const groundLayer = tilemapComposition.createTileLayer(map, "floor-wall-roof", "ground_layer", [0]);
    const wallsLayer = tilemapComposition.createTileLayer(map, "floor-wall-roof", "walls_layer", [1]);
    const playerSpawnLayer = tilemapComposition.getFromObjectLayer(map, "spawns_layer", { name: "playerSpawn" });
    const ghostSpawnLayer = tilemapComposition.getFromObjectLayer(map, "spawns_layer", { name: "ghostSpawn" });

    return [map, groundLayer, playerSpawnLayer, wallsLayer, ghostSpawnLayer];
  }
};
