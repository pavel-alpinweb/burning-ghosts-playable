import { defineStore } from "pinia";
import { PLAYER_CURRENT_HEALTH } from "@/configs/gameplay.config.js";

export const usePlayer = defineStore("player", {
  state: () => ({
    currentHealth: PLAYER_CURRENT_HEALTH,
    isPlaySound: true,
  }),
  actions: {
    increase(value, maxHealth) {
      this.currentHealth = Math.min(maxHealth, this.currentHealth + value);
    },
    decrease(value) {
      this.currentHealth = Math.max(0, this.currentHealth - value);
    }
  }
});