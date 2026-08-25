import Phaser from "phaser";
import { EventBus } from "@/utils/utils";
import * as EventNames from "@/configs/eventNames.config.js";
import { playerComposition } from "@/compositions/Player.composition.js";

const resizingScenes = new WeakSet();

export const sceneComposition = {
  preload(scene) {
    scene.load.on("progress", (value) => {
      EventBus.emit(EventNames.PRELOADING_PROGRESS, value);
    });

    scene.load.on("complete", () => {
      EventBus.emit(EventNames.COMPLETE_PRELOADING, true);
    });
  },

  handleResize(scene, width, height) {
    if (resizingScenes.has(scene)) return;

    const fallbackWidth = typeof window === "undefined" ? scene.scale.parentSize.width : window.innerWidth;
    const fallbackHeight = typeof window === "undefined" ? scene.scale.parentSize.height : window.innerHeight;
    const newWidth = Number.isFinite(width) && width > 0 ? width : fallbackWidth;
    const newHeight = Number.isFinite(height) && height > 0 ? height : fallbackHeight;
    const parentSize = scene.scale.parentSize;

    resizingScenes.add(scene);

    try {
      if (parentSize.width !== newWidth || parentSize.height !== newHeight) {
        if (scene.scale.scaleMode === Phaser.Scale.RESIZE) {
          // Keep the parent and game sizes in sync before emitting a single
          // resize event. CameraManager needs the previous game size in order
          // to recognize and resize the default full-screen camera.
          parentSize.setSize(newWidth, newHeight);
          scene.scale.resize(newWidth, newHeight);
        } else {
          // FIT and the other managed modes must keep their logical game size.
          scene.scale.setParentSize(newWidth, newHeight);
        }
      }

      if (scene.player) {
        const camera = scene.cameras.main;

        playerComposition.configureCameraFollow(scene, scene.player, camera.width / 4, camera.height / 4);
        camera.centerOn(scene.player.x, scene.player.y);
      }
    } finally {
      resizingScenes.delete(scene);
    }
  },
};
