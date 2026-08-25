export const tilemapComposition = {
  createObjectLayer(scene, map, layerName) {
    const objLayerMeta = map.getObjectLayer(layerName);
    const objLayer = scene.physics.add.staticGroup();
    objLayerMeta.objects.forEach(obj => {
      const imageName = extractPropertyValue(obj, "imageName");
      objLayer.get(obj.x + obj.width / 2, obj.y - obj.height / 2, imageName)
        .setSize(obj.width, obj.height);
    });
    return objLayer;
  },

  createTileLayer(map, tilesetName, layerId, collisionIndexes) {
    const tileset = map.addTilesetImage(tilesetName);
    const tileLayer = map.createLayer(layerId, [tileset]);
    map.setCollision(collisionIndexes);
    return tileLayer;
  }
};

function extractPropertyValue(tileMeta, propertyName) {
  return tileMeta?.properties.find(property => property.name === propertyName)?.value;
};