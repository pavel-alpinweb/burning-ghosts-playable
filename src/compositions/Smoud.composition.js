import { sdk } from "@smoud/playable-sdk";

function getAdNetwork() {
  if (typeof AD_NETWORK !== "undefined") return AD_NETWORK;
  if (typeof window !== "undefined" && typeof window.AD_NETWORK !== "undefined") return window.AD_NETWORK;
  return "generic";
}

function getStoreUrl() {
  if (typeof STORE_URL !== "undefined" && STORE_URL) return STORE_URL;
  return "";
}

if (typeof window !== "undefined") {
  window.AD_NETWORK = String(getAdNetwork()).toLowerCase();
}

export const smoudComposition = {
  init(onReady) {
    let initialized = false;

    const safeReady = (width, height) => {
      if (initialized) return;
      initialized = true;
      if (typeof onReady === "function") {
        onReady(width || window.innerWidth, height || window.innerHeight);
      }
    };

    try {
      sdk.init((width, height) => {
        safeReady(width, height);
      });
    } catch (error) {
      console.warn("[Smoud] SDK init failed, running fallback mode:", error);
      safeReady(window.innerWidth, window.innerHeight);
    }

    setTimeout(() => {
      safeReady(window.innerWidth, window.innerHeight);
    }, 300);
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
      const adNetwork = String(getAdNetwork()).toLowerCase();
      const storeUrl = getStoreUrl();

      if (typeof window !== "undefined") {
        window.AD_NETWORK = adNetwork;
      }

      if (adNetwork === "google" && typeof window !== "undefined" && window.ExitApi && typeof window.ExitApi.exit === "function") {
        window.ExitApi.exit();
        return;
      }

      if (typeof window !== "undefined" && window.mraid && typeof window.mraid.open === "function") {
        window.mraid.open(storeUrl);
        return;
      }

      sdk.install();

      if (typeof window !== "undefined" && storeUrl && (!window.mraid || typeof window.mraid.open !== "function")) {
        window.open(storeUrl, "_blank", "noopener,noreferrer");
      }
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
