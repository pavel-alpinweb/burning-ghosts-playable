import Phaser from "phaser";
import { GHOST_DISPLAY_WIDTH, GHOST_DISPLAY_HEIGHT, GHOST_SPEEDS } from "@/configs/gameplay.config.js";
import { playableComposition } from "@/compositions/Playable.composition.js";
import { resultsComposition } from "@/compositions/Results.composition.js";
import {particlesComposition} from "@/compositions/Particles.composition.js";
import {GHOST_VFX} from "@/configs/particles.config.js";

export const ghostComposition = {
    createGhost(scene, startPointsLayer, player = scene.player) {
        const { x: startPointX, y: startPointY } = startPointsLayer;
        const ghost = scene.physics.add.sprite(startPointX, startPointY, "ghost")
            .setOrigin(0.5, 1)
            .refreshBody();
        ghost.setDisplaySize(GHOST_DISPLAY_WIDTH, GHOST_DISPLAY_HEIGHT);
        ghost.aim = new Phaser.Math.Vector2(startPointX, startPointY);
        ghost.directionToAim = new Phaser.Math.Vector2();
        ghost.separationVector = new Phaser.Math.Vector2();
        ghost.speed = Phaser.Math.RND.pick(GHOST_SPEEDS);

        particlesComposition.initObjectVFX(scene, ghost, ["smoke", "fire"], GHOST_VFX);
        ghost.play("ghost");

        const targetPlayer = player || scene.player;
        if (targetPlayer) {
            scene.physics.add.overlap(ghost, targetPlayer, () => {
                playableComposition.freezeGamePlay(scene, false);
                resultsComposition.showModal(true, false);
            });
        }
        
        return ghost;
    },

    moveGhost(ghost, player) {
        calculateDirectionAndDistanceToAim(ghost, player);
        calculateStraightNormalizedVelocity(ghost);
        ghost.body.velocity.scale(ghost.speed);
        ghost.setFlipX(ghost.body.velocity.x < 0);
    }
};

function calculateDirectionAndDistanceToAim(ghost, aim) {
    ghost.directionToAim.set(aim.x - ghost.x, aim.y - ghost.y);
    ghost.distanceToAim = ghost.directionToAim.length();
}

function calculateStraightNormalizedVelocity(ghost) {
    ghost.body.velocity.copy(ghost.directionToAim).normalize();
}

