//-----------------------------------------------------------view control handle-----------------------------------------------------------------------------------
var cursorOnAnything = false;
  cursor.pressed = function(position,key){
    if(!cursorOnAnything){
    cursor.keyDown = key;
    console.log("cursor presseddd",key);
    console.log("position is ", position);
    vec3.copy(ghostCamera.position,mainCamera.position);
    vec3.copy(ghostCamera.direction,mainCamera.direction);
    vec3.copy(ghostCamera.upward,mainCamera.upward);
    vec3.copy(ghostCamera.horizontalAxis,mainCamera.horizontalAxis);
    vec2.copy(cursor.keyDownCoord,position);
  }else if(cursorOnCanvas == 1||((position[0]>huePickerCanvas.getBoundingClientRect().left&&position[0]<huePickerCanvas.getBoundingClientRect().left+300)&&(position[1]>huePickerCanvas.getBoundingClientRect().top&&position[0]<huePickerCanvas.getBoundingClientRect().top+20))){
    console.log('returning incorrect hue value:');
    const x = position[0] - huePickerCanvas.getBoundingClientRect().left;
    hue = x/150.0-1.0;
    cursor.keyDown = 10;
  } else if(cursorOnCanvas == 2||((position[0]>colorPickerCanvas.getBoundingClientRect().left&&position[0]<colorPickerCanvas.getBoundingClientRect().left+300)&&(position[1]>colorPickerCanvas.getBoundingClientRect().top&&position[0]<colorPickerCanvas.getBoundingClientRect().top+300))){
    cursor.keyDown =20;
    const x = position[0] - colorPickerCanvas.getBoundingClientRect().left;
    const y = position[1] - colorPickerCanvas.getBoundingClientRect().top;
    color = [x/150.0-1.0,y/150.0-1.0];
  }
  }
  cursor.released = function(){
    cursor.keyDown = -1;
    cursor.keyDownCoord = [0,0];
  }
  cursor.moved = function(position){
    if(cursor.keyDown == 10){
        console.log('returning incorrect hue value:');
        const x = position[0] - huePickerCanvas.getBoundingClientRect().left;
        hue = x/150.0-1;
        if (hue<-1) hue=-0.999;
        if (hue>1) hue =0.999;
    }
    else if(cursor.keyDown == 20){
      const x = position[0] - colorPickerCanvas.getBoundingClientRect().left;
      const y = position[1] - colorPickerCanvas.getBoundingClientRect().top;
      color = [x/150.0-1.0,y/150.0-1.0];
      if (color[0]<-1) color[0]=-0.999;
      if (color[0]>1) color[0] = 0.999;
      if (color[1]<-1) color[1]=-0.999;
      if (color[1]>1) color[1] = 0.999;
    }
    var drag = [position[0]-cursor.keyDownCoord[0],position[1]-cursor.keyDownCoord[1]];
    switch(cursor.keyDown){
      case 0:  {
        console.log("should start dragging!!!!!!!!!!!!!");
        var dist = vec3.len(mainCamera.position);
        vec3.rotate(mainCamera.direction,ghostCamera.direction,[0,1,0],-drag[0]/100);
        vec3.rotate(mainCamera.horizontalAxis,ghostCamera.horizontalAxis,[0,1,0],-drag[0]/100);
        vec3.rotate(mainCamera.upward,ghostCamera.upward,[0,1,0],-drag[0]/100);
        vec3.rotate(mainCamera.direction,mainCamera.direction,mainCamera.horizontalAxis,-drag[1]/100);
        vec3.rotate(mainCamera.upward,mainCamera.upward,mainCamera.horizontalAxis,-drag[1]/100);
        mainCamera.position = vec3.scale(mainCamera.position,mainCamera.direction,-dist);
        break;
      }
      case 1: {
        var h = vec3.create();
        var v = vec3.create();
        var shift = vec3.create();
        vec3.scale(h,ghostCamera.horizontalAxis,-drag[0]/100);
        vec3.scale(v,ghostCamera.upward,drag[1]/100);
        vec3.add(shift,h,v);
        vec3.add(mainCamera.position,ghostCamera.position,shift);
        break;
      }
      default :

    }
  }
  cursor.rolled = function(dist){
    var v = vec3.create();
    vec3.scale(v,mainCamera.direction,dist/5);
    mainCamera.move(v);
    console.log('scrolleddd:::',dist);
  }
//----------------------------------------------------------------------\viee control handle--------------------------------------------
