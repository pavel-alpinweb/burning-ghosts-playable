export const dayPhases = Object.freeze({
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night",
});

export const calendarComposition = {
  initCalendar(calendarStore, timeConfig) {
    calendarStore.morningInMs = timeConfig.morningInMs;
    calendarStore.afternoonInMs = timeConfig.afternoonInMs;
    calendarStore.eveningInMs = timeConfig.eveningInMs;
    calendarStore.nightInMs = timeConfig.nightInMs;

    calendarStore.totalElapsedTimeInMs = getDayPhaseStartOffsetInMs(calendarStore, timeConfig.startDayPhase);
    calendarComposition.setCurrentTime(calendarStore, 0);
  },

  setCurrentTime(calendarStore, deltaTimeInMs) {
    calendarStore.totalElapsedTimeInMs += deltaTimeInMs;
    calendarStore.msSinceDayStart = calendarStore.totalElapsedTimeInMs % getTotalDayDurationInMs(calendarStore);
    calendarStore.totalDays = Math.floor(calendarStore.totalElapsedTimeInMs / getTotalDayDurationInMs(calendarStore));

    if (calendarStore.msSinceDayStart <= calendarStore.morningInMs) calendarStore.currentPhase = dayPhases.morning;
    else if (calendarStore.msSinceDayStart <= getFirstPartOfDayInMs(calendarStore)) calendarStore.currentPhase = dayPhases.afternoon;
    else if (calendarStore.msSinceDayStart <= getDaylightHoursInMs(calendarStore)) calendarStore.currentPhase = dayPhases.evening;
    else calendarStore.currentPhase = dayPhases.night;
  },

  isMorning(calendarStore) {
    return calendarStore.currentPhase === dayPhases.morning;
  },

  isAfternoon(calendarStore) {
    return calendarStore.currentPhase === dayPhases.afternoon;
  },

  isEvening(calendarStore) {
    return calendarStore.currentPhase === dayPhases.evening;
  },

  isNight(calendarStore) {
    return calendarStore.currentPhase === dayPhases.night;
  },

  getMsSincePhaseStart(calendarStore) {
    if (calendarComposition.isMorning(calendarStore)) return calendarStore.msSinceDayStart;
    else if (calendarComposition.isAfternoon(calendarStore)) return calendarStore.msSinceDayStart - calendarStore.morningInMs;
    else if (calendarComposition.isEvening(calendarStore)) return calendarStore.msSinceDayStart - getFirstPartOfDayInMs(calendarStore);
    else return calendarStore.msSinceDayStart - getDaylightHoursInMs(calendarStore);
  },

  getCurrentPhaseProgress(calendarStore) {
    if (calendarComposition.isMorning(calendarStore)) return calendarComposition.getMsSincePhaseStart(calendarStore) / calendarStore.morningInMs;
    else if (calendarComposition.isAfternoon(calendarStore)) return calendarComposition.getMsSincePhaseStart(calendarStore) / calendarStore.afternoonInMs;
    else if (calendarComposition.isEvening(calendarStore)) return calendarComposition.getMsSincePhaseStart(calendarStore) / calendarStore.eveningInMs;
    else return calendarComposition.getMsSincePhaseStart(calendarStore) / calendarStore.nightInMs;
  },
};

function getFirstPartOfDayInMs(calendarStore) {
  return calendarStore.morningInMs + calendarStore.afternoonInMs;
}

function getDaylightHoursInMs(calendarStore) {
  return calendarStore.morningInMs + calendarStore.afternoonInMs + calendarStore.eveningInMs;
}

function getTotalDayDurationInMs(calendarStore) {
  return calendarStore.morningInMs + calendarStore.afternoonInMs + calendarStore.eveningInMs + calendarStore.nightInMs;
}

function getDayPhaseStartOffsetInMs(calendarStore, dayPhase) {
  if (dayPhase === dayPhases.morning) return 0;
  else if (dayPhase === dayPhases.afternoon) return calendarStore.morningInMs + 1;
  else if (dayPhase === dayPhases.evening) return getFirstPartOfDayInMs(calendarStore) + 1;
  else return getDaylightHoursInMs(calendarStore) + 1;
}