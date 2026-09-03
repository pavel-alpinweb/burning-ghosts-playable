export const timerComposition = {
    elapsedTime: 0,

    updateTime(deltaTime, fullTime) {
        if (!fullTime || fullTime <= 0) return 0;

        this.elapsedTime += deltaTime;
        const remainingTime = Math.max(0, fullTime - this.elapsedTime);

        return Math.max(0, Math.min(100, (remainingTime / fullTime) * 100));
    },

    reset() {
        this.elapsedTime = 0;
    },

    renderTimer(percent) {

    },
};