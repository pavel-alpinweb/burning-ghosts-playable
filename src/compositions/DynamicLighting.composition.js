import { dayPhases } from "@/compositions/Calendar.composition.js";

export const dynamicLightingComposition = {
  preloadShaders: function (scene) {
    scene.load.glsl("night", "shaders/day-night-lighting.glsl");
  },

  prepareAmbientLightPipeline: function (
    scene,
    morningPhaseTransitionFraction,
    afternoonPhaseTransitionFraction,
    eveningPhaseTransitionFraction,
    nightPhaseTransitionFraction,
    currentDayPhase,
    currentDayPhaseProgress
  ) {
    if (!scene.renderer.pipelines.has("night")) {
      const nightPipeline = new Phaser.Renderer.WebGL.Pipelines.PostFXPipeline({
        game: scene.game,
        renderTarget: true,
        fragShader: scene.cache.shader.get("night").fragmentSrc,
      });

      nightPipeline.morningPhaseTransitionFraction = morningPhaseTransitionFraction;
      nightPipeline.afternoonPhaseTransitionFraction = afternoonPhaseTransitionFraction;
      nightPipeline.eveningPhaseTransitionFraction = eveningPhaseTransitionFraction;
      nightPipeline.nightPhaseTransitionFraction = nightPhaseTransitionFraction;
      dynamicLightingComposition.updateAmbientLightPipeline(nightPipeline, currentDayPhase, currentDayPhaseProgress);

      nightPipeline.onPreRender = function () {
        this.set1i("uDayPhase", this.dayPhase);
        this.set1f("uIntensity", this.intensity);
      };
      scene.renderer.pipelines.addPostPipeline("night", function NightPipeline() {
        return nightPipeline;
      });
    }

    scene.cameras.main.setPostPipeline("night");
    return scene.renderer.pipelines.getPostPipeline("night");
  },

  updateAmbientLightPipeline: function (nightPipeline, currentDayPhase, currentDayPhaseProgress) {
    switch (currentDayPhase) {
      case dayPhases.morning:
        nightPipeline.dayPhase = 1;
        nightPipeline.intensity = Math.min(1, currentDayPhaseProgress / nightPipeline.morningPhaseTransitionFraction);
        break;
      case dayPhases.afternoon:
        nightPipeline.dayPhase = 2;
        nightPipeline.intensity = Math.min(1, currentDayPhaseProgress / nightPipeline.afternoonPhaseTransitionFraction);
        break;
      case dayPhases.evening:
        nightPipeline.dayPhase = 3;
        nightPipeline.intensity = Math.min(1, currentDayPhaseProgress / nightPipeline.eveningPhaseTransitionFraction);
        break;
      case dayPhases.night:
        nightPipeline.dayPhase = 4;
        nightPipeline.intensity = Math.min(1, currentDayPhaseProgress / nightPipeline.nightPhaseTransitionFraction);
        break;
    }
  },
};
