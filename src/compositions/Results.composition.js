export const resultsComposition = {
    showModal(isGameOver, isWin = false) {
        const modal = document.querySelector("#game-result-modal");
        if (!modal) return;

        modal.classList.toggle("is-hidden", !isGameOver);

        if (!isGameOver) return;

        const title = modal.querySelector("#game-result-title");
        const winImg = modal.querySelector("#game-result-img-win");
        const loseImg = modal.querySelector("#game-result-img-lose");

        if (title) {
            title.textContent = isWin ? "Ты выжил!" : "Ты погиб!";
        }

        if (winImg) {
            winImg.classList.toggle("is-hidden", !isWin);
        }

        if (loseImg) {
            loseImg.classList.toggle("is-hidden", isWin);
        }
    },
};