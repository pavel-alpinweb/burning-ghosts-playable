export const backgroundComposition = {
  preloadBackgroundImage(scene) {
    scene.load.image("background_grass", "assets/img/background/grass_tile.jpg");
  },

  createBackgroundImage(scene, width, height) {
    return scene.add.tileSprite(0, 0, width, height, "background_grass")
      .setOrigin(0, 0)
      .setScrollFactor(0);
  },

  moveBackground(camera, background) {
    background.tilePositionX = camera.scrollX;
    background.tilePositionY = camera.scrollY;
  }
};