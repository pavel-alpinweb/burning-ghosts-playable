export const particlesComposition = {
  preloadParticlesTextures(scene, allVfxConfigs, assetOverrides = {}) {
    for (const textureConfig of allVfxConfigs.textures ?? []) {
      scene.load.image(
        textureConfig.key,
        assetOverrides[textureConfig.key] ?? textureConfig.filePath
      );
    }
  },

  /**
   * Инициализирует набор визуальных эффектов для объекта.
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.GameObject} object
   * @param {string[]} vfxKeys - массив ключей из particles.json (например, ['dust', 'fire'])
   * @param {Object} allVfxConfigs - объект со всеми конфигами из particles.json
   */
  initObjectVFX(scene, object, vfxKeys, allVfxConfigs) {
    if (!object.__activeVFX) object.__activeVFX = {};

    vfxKeys.forEach((key) => {
      const config = allVfxConfigs.VFX?.[key];
      if (config) {
        const emitter = createFollowParticlesEmitter(scene, object, config);
        object.__activeVFX[key] = emitter;
      }
    });
  },
  /**
   * Включает или выключает испускание частиц для всех эффектов объекта или конкретного ключа
   */
  setObjectVFXEmitting(object, isEmitting, key = null) {
    if (!object.__activeVFX) return;

    if (key) {
      const emitter = object.__activeVFX[key];
      if (emitter) emitter.emitting = isEmitting;
    } else {
      Object.values(object.__activeVFX).forEach((emitter) => {
        emitter.emitting = isEmitting;
      });
    }
  },
  /**
   * Удаляет конкретный эффект по ключу
   */
  removeVFXByKey(object, key) {
    const emitter = object.__activeVFX?.[key];
    if (emitter) {
      emitter.destroy();
      delete object.__activeVFX[key];
    }
  },

  /**
   * Полностью удаляет все визуальные эффекты объекта
   */
  clearAllObjectVFX(object) {
    if (!object.__activeVFX) return;

    Object.keys(object.__activeVFX).forEach((key) => {
      this.removeVFXByKey(object, key);
    });

    object.__activeVFX = {};
  },
};

function createFollowParticlesEmitter(scene, object, vfxConfig) {
  const actualTextureKey = resolveParticleTexture(scene, vfxConfig);
  const textureScale = getParticleTextureScale(scene, actualTextureKey, vfxConfig.particleSizePx);

  const {
    followOffsetX = 0,
    followOffsetYFactor = 0,
    depthOffset = 0,
    particleSizePx,
    textureKey,
    ...emitterConfig
  } = vfxConfig;

  const emitter = scene.add.particles(0, 0, actualTextureKey, {
    emitting: true,
    ...emitterConfig,
    scale: {
      start: (emitterConfig.scale?.start ?? 1) * textureScale,
      end: (emitterConfig.scale?.end ?? 1) * textureScale,
    },
  });

  emitter.setDepth(object.depth + depthOffset);

  // Корректный расчет смещения относительно центра объекта, игнорируя его origin
  const offsetX = Number(followOffsetX);
  const offsetY = object.displayHeight * (Number(followOffsetYFactor) + (object.originY - 0.5));

  emitter.startFollow(object, offsetX, offsetY);

  return emitter;
}

function resolveParticleTexture(scene, vfxConfig) {
  return vfxConfig.textureKey;
}

function getParticleTextureScale(scene, textureKey, particleSizePx) {
  if (!particleSizePx) return 1;

  const texture = scene.textures.get(textureKey);
  const sourceImage = texture?.getSourceImage?.();

  const width = sourceImage?.width ?? 0;
  const height = sourceImage?.height ?? 0;

  if (width <= 0 || height <= 0) return 1;

  return particleSizePx / Math.max(width, height);
}
