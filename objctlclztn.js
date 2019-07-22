
var makeMaterialLocal = function(materialObject,primitiveObject,gltfObject){
  if(materialObject.hasOwnProperty('pbrMetallicRoughness')){
    var keys = Object.keys(materialObject.pbrMetallicRoughness);
    materialObject.uniforms = {};
    for(var uniformIndex = 0; uniformIndex < keys.length; uniformIndex ++){
      if(materialObject.pbrMetallicRoughness[keys[uniformIndex]].hasOwnProperty('index')){
        const textureIndex = materialObject.pbrMetallicRoughness[keys[uniformIndex]].index;
        if(!materialObject.pbrMetallicRoughness[keys[uniformIndex]].hasOwnProperty('textCoord')){
          materialObject.pbrMetallicRoughness[keys[uniformIndex]].textCoord = 0;
        }
        var textCoordIndex =  "TEXCOORD_".concat(materialObject.pbrMetallicRoughness[keys[uniformIndex]].textCoord);
        console.log('here comes texcoordinex',textCoordIndex);
        materialObject.pbrMetallicRoughness[keys[uniformIndex]].textureCoordAccessor = gltfObject.accessors[primitiveObject.attributes[textCoordIndex]];
        console.log('here commt texture index',textureIndex);
        makeTextureLocal(gltfObject.textures[textureIndex]);
        materialObject.uniforms[keys[uniformIndex]] = gltfObject.textures[textureIndex];
        if(!materialObject.uniforms[keys[uniformIndex]].hasOwnProperty('textureImage')){
          materialObject.uniforms[keys[uniformIndex]].textureImage = new Image();
        }
        console.log('should have textureObject returned',gltfObject.textures[textureIndex]);
      }
      else{
        materialObject.uniforms[keys[uniformIndex]] = materialObject.pbrMetallicRoughness[keys[uniformIndex]];
      }
    }
  }
  console.log('made material', materialObject.name,' local: ',materialObject);
}

var makeAccessorLocal = function(accessorObject, gltfObject){
  accessorObject.bufferViewObject = gltfObject.bufferViews[accessorObject.bufferView];
}

var makePrimitiveLocal = function(primitiveObject,gltfObject){
  primitiveObject.indicesAccessor = gltfObject.accessors[primitiveObject.indices];
  const propertyNameList = Object.keys(primitiveObject.attributes);
  console.log(propertyNameList);
  primitiveObject.attributes.attributeAccessors = [];
  for (var attributeIndex = 0; attributeIndex < propertyNameList.length;attributeIndex ++){
    console.log("key: ",propertyNameList[attributeIndex],"\nvalue: ",gltfObject.accessors[primitiveObject.attributes[propertyNameList[attributeIndex]]]);
    primitiveObject.attributes.attributeAccessors[propertyNameList[attributeIndex]] = gltfObject.accessors[primitiveObject.attributes[propertyNameList[attributeIndex]]];
  }
  primitiveObject.materialObject = gltfObject.materials[primitiveObject.material];
  makeMaterialLocal(primitiveObject.materialObject,primitiveObject,gltfObject);
  console.log("attributes Localization-----------------------------\n",primitiveObject.attributes.attributeAccessors);
}
var makeMeshLocal = function(meshObject,gltfObject){
  for (var primitiveIndex = 0;primitiveIndex < meshObject.primitives.length;primitiveIndex++){
    makePrimitiveLocal(meshObject.primitives[primitiveIndex],gltfObject);
  }
}

var makeNodeLocal = function(nodeObject,gltfObject){
  if(nodeObject.hasOwnProperty('mesh')){
    nodeObject.meshObject = gltfObject.meshes[nodeObject.mesh];
    makeMeshLocal(gltfObject.meshes[nodeObject.mesh],gltfObject);
  }
  if (nodeObject.hasOwnProperty('children')){
    nodeObject.childrenObjects = [];
    for(var childIndex = 0;childIndex<nodeObject.children.length;childIndex++){
      childrenObjects.push(gltfObject.nodes[nodeObject.children[childIndex]]);
      makeNodeLocal(gltfObject.nodes[nodeObject.children[childIndex]],gltfObject);
    }
  }
}

function makeSceneLocal(sceneObject,gltfObject){
  sceneObject.nodeObject = [];
  sceneObject.sceneMatrix = new Float32Array(16);
  mat4.identity(sceneObject.sceneMatrix);
  sceneObject.skybox = null;
  for (var nodeIndex = 0; nodeIndex < sceneObject.nodes.length;nodeIndex++){
    sceneObject.nodeObject.push(gltfObject.nodes[sceneObject.nodes[nodeIndex]]);
    makeNodeLocal(gltfObject.nodes[sceneObject.nodes[nodeIndex]],gltfObject);
  }
}

var makeTextureLocal = function(textureObject){
  textureObject.textureImage = new Image();
  textureObject.refreshTexture = function(){}
  textureObject.load = false;
}

var makeObjectLocal = function(gltfObject){
  gltfObject.worldMatrix = new Float32Array(16);
  mat4.identity(gltfObject.worldMatrix);
  for (var sceneIndex = 0;sceneIndex < gltfObject.scenes.length;sceneIndex++){
    makeSceneLocal(gltfObject.scenes[sceneIndex],gltfObject);
  }
  for (var accessorIndex = 0;accessorIndex < gltfObject.accessors.length;accessorIndex++){
    makeAccessorLocal(gltfObject.accessors[accessorIndex],gltfObject);
  }
}
