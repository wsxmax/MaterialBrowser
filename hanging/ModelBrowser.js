var gltfURI = '/gltf/suzanne.gltf';
var vertexShaderURI = '/shaders/vertexShaderGLSL';
var fragmentShaderURI = '/shaders/fragmentShaderGLSL';
var mainCanvas = document.getElementById('mainCanvas');

var browserContext = null;
var sceneObject = null;
var load = function(){
  loadBrowser();
  loadScene(gltfURI);
}
var loadBrowser = function(){
  var vertexShaderSource = null;
  var fragmentShaderSource = null;
  LoadTextContent(vertexShaderURI+'?='+Math.random(),function(error,textData){
    if(!error){
      vertexShaderSource = textData;
      if(fragmentShaderSource) initBrowser(vertexShaderSource,fragmentShaderSource);
    }
    else console.log(error);
  });
  LoadTextContent(fragmentShaderURI+'?='+Math.random(),function(error,textData){
    if(!error){
      fragmentShaderSource = textData;
      if(vertexShaderSource) initBrowser(vertexShaderSource,fragmentShaderSource);
    }
    else console.log(error);
  });
}
var loadScene = function(url){
  var gltf = null;
  LoadJSONContent(url,function(error,jsonObject){
    gltf = jsonObject;
    if(!error) {
      var loading = 0;
      var bufferIndex = 0;
      while(bufferIndex<gltf.buffers.length){
        var index = bufferIndex;
        console.log('loading buffers');
        LoadBinaryBuffer(gltfURI.slice(0,gltfURI.lastIndexOf('/')+1)+gltf.buffers[index].uri,function(error,bufferData)
        {
          if(!error) {
            console.log('begin to load buffer'+index);
            gltf.buffers[index].data = bufferData;
            console.log('finished loading buffer'+index);
            loading = loading-1;
            if (loading==0) {
              sceneObject = gltf;
              if(browserContext) launchBrowser(browserContext,sceneObject);
            }
          }
          else console.log(error);
        });
        loading = loading+1;
        console.log('loading:'+ loading);
        bufferIndex = bufferIndex+1;
        console.log('bufferindex:'+bufferIndex);
      }
    }
    else console.log(error);
  });
}
var initBrowser = function(vertexShaderSource,fragmentShaderSource){
  console.log('initializing browser');
  var mainCanvas = document.getElementById('mainCanvas');
  mainCanvas.width = 1920;
  mainCanvas.height = 1080;
  var gl = mainCanvas.getContext("webgl")||mainCanvas.getContext("experimantal-webgl")||mainCanvas.getContext("moz-webgl")||mainCanvas.getContext("webkit-3d");
  if(gl){console.log('contex is created');}
  gl.clearColor(0,0,0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //
  //
  //shaders
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader,vertexShaderSource);
  gl.shaderSource(fragmentShader,fragmentShaderSource);
  gl.compileShader(vertexShader);
  console.log('vertexshader compiled');
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader)+'vertexshader compile error');
    gl.deleteShader(vertexShader);
    return null;
  }
  gl.compileShader(fragmentShader);
  console.log('fragementshader compiled');
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader)+'fragmentShader compile error'+fragmentShaderSource);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.program = gl.createProgram();
  gl.attachShader(gl.program,vertexShader);
  gl.attachShader(gl.program,fragmentShader);
  gl.linkProgram(gl.program);
  gl.useProgram(gl.program);
  gl.enable(gl.DEPTH_TEST);

  browserContext = gl;
  if(sceneObject) launchBrowser(browserContext,sceneObject);
}
var launchBrowser = function(gl,scene){
  console.log('launchBrowser');
  var bufferScene = function(scene){
    var bufferAlloc = function(scene){
      var bufferViewIndex = 0;
      while(bufferViewIndex<scene.bufferViews.length){
        switch (scene.bufferviews.target){
          case 34962:
          //set offset in Buffers
          scene.bufferViews[bufferViewIndex].indexInBuffer = arrayBufferData.length;
          //data goes to arrayBuffer
          arrayBufferData = arrayBufferData.contact(scene.buffers[scene.bufferViews[bufferViewIndex].buffer].data.slice(scene.bufferViews[bufferViewIndex].offset,scene.bufferViews[bufferViewIndex].offset+scene.bufferViews[bufferViewIndex].byteLength));
          break;
          case 34963:
          scene.bufferViews[bufferViewIndex].indexInBuffer = elementArrayBufferData.length;
          arrayBufferData = elementArrayBufferData.contact(scene.buffers[scene.bufferViews[bufferViewIndex].buffer].data.slice(scene.bufferViews[bufferViewIndex].offset,scene.bufferViews[bufferViewIndex].offset+scene.bufferViews[bufferViewIndex].byteLength));
        }
        bufferViewIndex += 1;
      }
    }
    var setBufferPointer = function(){
      var getAttributeNumber = function(type){
        switch(type){
          case "SCALAR" : return 1;
          case "VEC2" : return 2;
          case "VEC3" :return 3;
          case "VEC3" :return 4;
          default : return null;
        }//switch
      }
      var meshIndex = 0;
      while(meshIndex<scene.meshes.length){
        var primitiveIndex = 0;
        while(primitiveIndex<scene.meshes[meshIndex].primitives.length){
          //set fo every primitives the attribute refers to buffer date section
          var attributePointer = null;

          gl.vertexAttribPointer(
            PositionLocation,
            getAttributeNumber(scene.accessors[scene.meshes[]].type),
            5126,
            gl.FALSE,
            3*Float32Array.BYTES_PER_ELEMENT,
            0
          );

          primitiveIndex += 1;
        }
        meshIndex += 1;
      }
    }
    var vertexbuffer = gl.createBuffer();
    var indexbuffer = gl.createBuffer();
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  here form the data slices and correct the offset for buffers >>>>>>>>>>>>>>>>>>>>>>>>
    var arrayBufferData = null;
    var elementArrayBufferData = null;

    bufferAlloc(scene);

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexbuffer);
    gl.bufferData(gl.ARRAY_BUFFER,arrayBufferData,gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexbuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,elementArrayBufferData,gl.STATIC_DRAW);
    var PositionLocation = gl.getAttribLocation(gl.program,'vertPosition');
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //here's bufferview Parsing
    gl.enableVertexAttribArray(PositionLocation);
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  }
  var world = new Float32Array(16);
  var view = new Float32Array(16);
  var proj = new Float32Array(16);
  mat4.identity(world);
  mat4.lookAt(view,[0,0,-10],[0,0,1],[0,1,0]);
  mat4.perspective(proj,glMatrix.toRadian(90),mainCanvas.width/mainCanvas.height,0.1,1000);

  var worldMatrixLocation = gl.getUniformLocation(gl.program,'worldMatrix');
  var viewMatrixLocation = gl.getUniformLocation(gl.program,'viewMatrix');
  var projMatrixLocation = gl.getUniformLocation(gl.program,'projMatrix');

  gl.uniformMatrix4fv(worldMatrixLocation,gl.FALSE,world);
  gl.uniformMatrix4fv(viewMatrixLocation,gl.FALSW,view);
  gl.uniformMatrix4fv(projMatrixLocation,gl.FALSE,proj);

  if (scene) {
    bufferScene(scene);
  }

  var loop = function(){
    gl.clearColor(1,1,1,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    mat4.rotate(world,world,0.1,[0,1,0]);
    gl.uniformMatrix4fv(worldMatrixLocation,gl.FALSE,world);
    gl.drawElements(gl.TRIANGLES,11808,gl.UNSIGNED_SHORT,0);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

}
