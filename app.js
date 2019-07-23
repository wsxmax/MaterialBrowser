const mainCanvas = document.getElementById('mainCanvas');
const huePickerCanvas = document.getElementById('huePicker');
const colorPickerCanvas = document.getElementById('colorPicker');
const roughnessSlider = document.getElementById('roughness');
const metalicSlider = document.getElementById('metalic');
const specularSlieder = document.getElementById('specular');
var hue = 0.0;
var color = [0.0,0.0];
mainCanvas.width = 1920;
mainCanvas.height = 1080;
const gl = makeContextForCanvas(mainCanvas);
const huePicker = makeContextForCanvas(huePickerCanvas);
const colorPicker = makeContextForCanvas(colorPickerCanvas);
var cursorOnCanvas = null;

var makeHuePicker = function(huePicker){
  var huePickerVertexArray = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
  ];
  const huePickerVertexBuffer = huePicker.createBuffer();
  huePicker.bindBuffer(huePicker.ARRAY_BUFFER,huePickerVertexBuffer);
  huePicker.bufferData(huePicker.ARRAY_BUFFER,new Float32Array(huePickerVertexArray),huePicker.STATIC_DRAW);
  huePicker.vertexArrayBuffer = huePickerVertexBuffer;
  console.log('not making sense');
  huePicker.makeProgramFromURI('/shaders/huePickerShaders/vertexShaderGLSL','/shaders/huePickerShaders/fragmentShaderGLSL',function(renderProgram){
    huePicker.bindBuffer(huePicker.ARRAY_BUFFER,huePickerVertexBuffer);
    huePicker.defaultProgram = renderProgram;
    console.log('whats wrong with the hue bar?',renderProgram);
    huePicker.useProgram(huePicker.defaultProgram);
    huePicker.vertexAttribPointer(
    huePicker.getAttribLocation(renderProgram,'POSITION'),
    2,
    huePicker.FLOAT,
    huePicker.FALSE,
    2*Float32Array.BYTES_PER_ELEMENT,
    0
  );
  huePicker.enableVertexAttribArray(huePicker.getAttribLocation(huePicker.defaultProgram,'POSITION'));
  huePicker.drawArrays(huePicker.TRIANGLES,0,6);
  huePicker.uniform1f(huePicker.getUniformLocation(huePicker.defaultProgram,'current_hue'),hue);
  huePicker.render = function(){
    huePicker.useProgram(huePicker.defaultProgram);
    huePicker.uniform1f(huePicker.getUniformLocation(huePicker.defaultProgram,'current_hue'),hue);
    huePicker.drawArrays(huePicker.TRIANGLES,0,6);
  }
  });
}

var makeColorPicker = function(colorPicker){
  var colorPickerVertexArray = [
    -1, -1,
    1, -1,
    -1,  1,
    -1,  1,
    1, -1,
    1,  1,
  ];
  const colorPickerVertexBuffer = colorPicker.createBuffer();
  colorPicker.bindBuffer(colorPicker.ARRAY_BUFFER,colorPickerVertexBuffer);
  colorPicker.bufferData(colorPicker.ARRAY_BUFFER,new Float32Array(colorPickerVertexArray),colorPicker.STATIC_DRAW);
  colorPicker.vertexArrayBuffer = colorPickerVertexBuffer;
  console.log('not making sense');
  colorPicker.makeProgramFromURI('/shaders/colorPickerShaders/vertexShaderGLSL','/shaders/colorPickerShaders/fragmentShaderGLSL',function(renderProgram){
    colorPicker.bindBuffer(colorPicker.ARRAY_BUFFER,colorPickerVertexBuffer);
    colorPicker.defaultProgram = renderProgram;
    console.log('whats wrong with the color bar?',renderProgram);
    colorPicker.useProgram(colorPicker.defaultProgram);
    colorPicker.vertexAttribPointer(
      colorPicker.getAttribLocation(renderProgram,'POSITION'),
      2,
      colorPicker.FLOAT,
      colorPicker.FALSE,
      2*Float32Array.BYTES_PER_ELEMENT,
      0
    );
    colorPicker.enableVertexAttribArray(colorPicker.getAttribLocation(colorPicker.defaultProgram,'POSITION'));
    colorPicker.drawArrays(colorPicker.TRIANGLES,0,6);
    colorPicker.currentColor = [0,0,0];
    colorPicker.uniform1f(colorPicker.getUniformLocation(colorPicker.defaultProgram,'current_hue'),hue);
    colorPicker.render = function(){
      colorPicker.useProgram(colorPicker.defaultProgram);
      colorPicker.uniform1f(colorPicker.getUniformLocation(colorPicker.defaultProgram,'current_hue'),hue);
      colorPicker.uniform2f(colorPicker.getUniformLocation(colorPicker.defaultProgram,'current_color_position'),color[0],color[1]);
      colorPicker.drawArrays(colorPicker.TRIANGLES,0,6);
    }
  });
}


huePicker.clearColor(1.0,1.0,1.0,1.0);
huePicker.clear(huePicker.COLOR_BUFFER_BIT);
makeHuePicker(huePicker);

colorPicker.clearColor(1.0,1.0,1.0,1.0);
colorPicker.clear(colorPicker.COLOR_BUFFER_BIT);
makeColorPicker(colorPicker);

var programReady = false;
var mainScene = null;
keyDownCoord : vec2.create();
var sceneReady = false;
var rebindingNeeded = true;


function broswerStart(){
  console.log("browser onload");




  roughnessSlider.onmouseover = function(){
    cursorOnAnything = true;
  }
  roughnessSlider.onmouseleave = function(){
    cursorOnAnything = false;
  }
  metalicSlider.onmouseover = function(){
    cursorOnAnything = true;
  }
  metalicSlider.onmouseleave = function(){
    cursorOnAnything = false;
  }
  specularSlieder.onmouseover = function(){
    cursorOnAnything = true;
  }
  specularSlieder.onmouseleave = function(){
    cursorOnAnything = false;
  }

  colorPickerCanvas.onmouseover = function(){
    cursorOnAnything = true;
    cursorOnCanvas = 2;
  }

  colorPickerCanvas.onmouseleave = function(){
    cursorOnAnything = false;
    cursorOnCanvas = 0;
  }

  huePickerCanvas.onmouseover = function(){
    cursorOnCanvas = 1;
    cursorOnAnything =true;
  }

  huePickerCanvas.onmouseleave = function(){
    cursorOnCanvas = 0;
    cursorOnAnything = false;
  }

  mainCamera = new camera([0,0,-10],[0,0,1],[0,1,0],90,mainCanvas.width,mainCanvas.height,1000,10);
  ghostCamera = new camera([0,0,-10],[0,0,1],[0,1,0],90,mainCanvas.width,mainCanvas.height,1000,10);


  var matrix = new Float32Array(16);
  mat4.identity(matrix);






  //--------------------------------------------------------------------loop functions definition------------------------------------

    var beginLoop = function(){
      //render(matrix);
      console.log("should have rendered one time");
      requestAnimationFrame(loop);
    }

    var loop = function(){
      if(huePicker.render != null){
        huePicker.render();
      }
      if(colorPicker.render != null){
        colorPicker.render();
      }



      gl.clearColor(0,0,1,1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.clear(gl.DEPTH_BUFFER_BIT);

      gl.uniform1f(gl.getUniformLocation(gl.defaultProgram,'roughness'),roughnessSlider.value*0.01);
      gl.uniform1f(gl.getUniformLocation(gl.defaultProgram,'current_hue'),hue);
      gl.uniform2fv(gl.getUniformLocation(gl.defaultProgram,'current_color_position'),color);
      gl.uniform1f(gl.getUniformLocation(gl.defaultProgram,'metalic'),metalicSlider.value*0.01);
      gl.uniform1f(gl.getUniformLocation(gl.defaultProgram,'specular'),specularSlieder.value*0.01);

      gl.renderScene(mainScene,mainCamera,matrix);
      requestAnimationFrame(loop);
    }
//-------------------------------------------------------/loop function definitions-----------------------------------------------

//-----------------------------------------------------main process in order-----------------------------------------------------
    gl.makeProgramFromURI('/shaders/defaultShaders/vertexShaderGLSL','/shaders/defaultShaders/fragmentShaderGLSL',function(renderProgram){
      gl.defaultProgram = renderProgram;
      programReady = true;
      if (sceneReady) gl.prepareForRender(mainScene,beginLoop);
    });

    loadGltfFile('/gltf/suzanne.gltf',function(jsonObject){
      const gltfObject = jsonObject;
      mainScene = gltfObject.scenes[gltfObject.scene];
      console.log('scene loaded:');
      console.log(mainScene);
      gltfObject.loadImagesFromPath(gltfObject.originalPath);
      gltfObject.loadBufferFromPath(gltfObject.originalPath,function(){
        mainScene.skybox = new skybox('/skybox/cubeTextures/left.jpg',
        '/skybox/cubeTextures/right.jpg',
        '/skybox/cubeTextures/top.jpg',
        '/skybox/cubeTextures/bottom.jpg',
        '/skybox/cubeTextures/front.jpg',
        '/skybox/cubeTextures/back.jpg');
        gl.bufferObject(gltfObject);
        sceneReady = true;
        if (programReady) gl.prepareForRender(mainScene,beginLoop);
      });
    });
  }
