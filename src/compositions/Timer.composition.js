import {playableComposition} from "@/compositions/Playable.composition.js";
import {resultsComposition} from "@/compositions/Results.composition.js";

export const timerComposition = {
    elapsedTime: 0,
    isEnded: false,

    updateTime(deltaTime, fullTime, scene) {
        if (!fullTime || fullTime <= 0) return 0;

        this.elapsedTime += deltaTime;
        const remainingTime = Math.max(0, fullTime - this.elapsedTime);

        if (remainingTime <= 0 && !this.isEnded) {
            this.isEnded = true;
            if (scene) {
                playableComposition.freezeGamePlay(scene, false);
            }
            resultsComposition.showModal(true, true);
        }

        return Math.max(0, Math.min(100, (remainingTime / fullTime) * 100));
    },

    reset() {
        this.elapsedTime = 0;
        this.isEnded = false;
    },

    renderTimer(percent, element = "#time-progress") {
        const timeProgress = typeof element === "string" ? document.querySelector(element) : element;

        if (!timeProgress) return;

        const clampedPercent = Math.max(0, Math.min(100, Number(percent) || 0));
        const progress = clampedPercent / 100;
        const valueBar = timeProgress.querySelector(".time-progress__value");
        const fireIcon = timeProgress.querySelector(".time-progress__fire");

        if (valueBar) {
            valueBar.style.transform = `scaleX(${progress})`;
        }

        if (fireIcon) {
            fireIcon.style.left = `${(1 - progress) * 100}%`;
        }

        timeProgress.setAttribute("aria-valuenow", String(Math.round(clampedPercent)));
    },
};