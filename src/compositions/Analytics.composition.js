import { initializeApp } from "firebase/app";

export const analyticsComposition = {
  analytics: null,
  debugMode: true,

  createAnalytics(firebaseConfig) {
    if (!analyticsComposition.analytics) {
      const app = initializeApp(firebaseConfig);

      /*
      * Если у пользователя включен блокировщик рекламы, то загрузить аналитику не получится.
      * Если при этом использовать статический импорт, в момент отладки приложения (npm run dev)
      * сайт просто не загрузится и вместо игры будет белый экран.
       */
      import("firebase/analytics")
        .then(({ getAnalytics, isSupported, logEvent }) => {
          // Проверяем поддержку для приватных окон и старых браузеров
          return isSupported().then((supported) => {
            if (supported) {
              analyticsComposition.analytics = getAnalytics(app);
              analyticsComposition.logEventFn = logEvent;
            }
          });
        })
        .catch((error) => {
          console.warn("Fail to load Firebase Analytics:", error.message);
        });
    }
  },

  log(eventName, eventParams) {
    if (analyticsComposition.analytics) {
      eventParams.debug_mode = analyticsComposition.debugMode;
      analyticsComposition.logEventFn(analyticsComposition.analytics, eventName, eventParams);
    }
  }
};