import { sdk } from "@smoud/playable-sdk";

if (typeof window !== "undefined" && typeof window.AD_NETWORK === "undefined" && typeof AD_NETWORK === "undefined") {
  window.AD_NETWORK = "generic";
}

export const smoudComposition = {
  init(onReady) {
    try {
      sdk.init((width, height) => {
        onReady(width, height);
      });
    } catch (error) {
      console.warn("[Smoud] SDK init failed, running fallback mode:", error);
      if (typeof onReady === "function") {
        onReady(window.innerWidth, window.innerHeight);
      }
    }
  },

  start() {
    try {
      sdk.start();
    } catch (e) {
      console.warn("[Smoud] start failed:", e);
    }
  },

  finish() {
    try {
      sdk.finish();
    } catch (e) {
      console.warn("[Smoud] finish failed:", e);
    }
  },

  install() {
    try {
      sdk.install();
    } catch (e) {
      console.warn("[Smoud] install failed:", e);
    }
  },

  retry() {
    try {
      sdk.retry();
    } catch (e) {
      console.warn("[Smoud] retry failed:", e);
    }
  },

  onInteraction(callback) {
    try {
      sdk.on("interaction", callback);
    } catch (e) {
      console.warn("[Smoud] onInteraction failed:", e);
    }
  },

  onceInteraction(callback) {
    try {
      sdk.once("interaction", callback);
    } catch (e) {
      console.warn("[Smoud] onceInteraction failed:", e);
    }
  },

  onPause(callback) {
    try {
      sdk.on("pause", callback);
    } catch (e) {
      console.warn("[Smoud] onPause failed:", e);
    }
  },

  onResume(callback) {
    try {
      sdk.on("resume", callback);
    } catch (e) {
      console.warn("[Smoud] onResume failed:", e);
    }
  },

  onResize(callback) {
    let sdkSubscribed = false;

    try {
      sdk.on("resize", (width, height) => {
        sdkSubscribed = true;
        callback(width, height);
      });
    } catch (e) {
      console.warn("[Smoud] onResize failed, fallback to window resize:", e);
    }

    if (typeof window !== "undefined") {
      const handleWindowResize = () => {
        callback(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleWindowResize);
      window.addEventListener("orientationchange", handleWindowResize);
    }
  },

  onVolume(callback) {
    try {
      sdk.on("volume", callback);
    } catch (e) {
      console.warn("[Smoud] onVolume failed:", e);
    }
  },
};
