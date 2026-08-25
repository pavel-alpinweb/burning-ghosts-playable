import { defineStore } from "pinia";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    morningInMs: 0,
    afternoonInMs: 0,
    eveningInMs: 0,
    nightInMs: 0,

    totalElapsedTimeInMs: 0,
    msSinceDayStart: 0,
    totalDays: 0,
    currentPhase: "",
  }),
  actions: {},
});
