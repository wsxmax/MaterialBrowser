vec3.rotate = function(receiving,source,axis,angle){
  console.log("reciving:",receiving,"  source: ",source,"  axis: ",axis,"  angel: ",angle);
  var a = vec3.create();
  vec3.normalize(a,axis);
  var p = vec3.create();
  vec3.scale(p,a,vec3.dot(a,source));
  var q = vec3.create();cursor.released;
  vec3.sub(q,source,p);
  if(vec3.len(q)!=0){
    var s = vec3.create();
    vec3.cross(s,a,source);
    vec3.normalize(s,s);
    vec3.scale(s,s,vec3.len(q));
    var out = p;
    var t = vec3.create();
    var u = vec3.create();
    vec3.scale(t,q,Math.cos(angle));
    vec3.scale(u,s,Math.sin(angle));
    vec3.add(out,out,t);
    vec3.add(out,out,u);
    receiving[0] = out[0];
    receiving[1] = out[1];
    receiving[2] = out[2];
    console.log("out vector is:::::",receiving);
    return(out);
  }else {
    receiving[0] = source[0];
    receiving[1] = source[1];
    receiving[2] = source[2];
    return source;
  }
}

var cursor = {
  keyDown : -1,
  keyDownCoord : [0,0],
  wheelDown : false,
  wheelDownCoord : vec2.create(),
  cursorCoord : vec2.create(),
  pressed : function(){},
  moved : function(){},
  released : function(){},
  rolled : function(){}
}

class camera {
  constructor (position, direction, upward, viewAngle, width, height, depth, length){
    this.position = position;
    this.direction = direction;
    vec3.normalize(this.direction,this.direction);
    this.upward = upward;
    vec3.normalize(this.upward,this.upward);
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.length = length;
    this.viewAngle = viewAngle;

    this.horizontalAxis = vec3.create();
    vec3.cross(this.horizontalAxis,this.direction,this.upward);
    vec3.normalize(this.horizontalAxis,this.horizontalAxis);
  }

  generateMatrixForSkybox(){
    var scaling = new Float32Array(16);
    mat4.identity(scaling);
    mat4.scale(scaling,scaling,[this.depth/Math.sqrt(3),this.depth/Math.sqrt(3),this.depth/Math.sqrt(3)]);
    var view  = new Float32Array(16);
    mat4.lookAt(view,[0,0,0],this.direction,this.upward);
    var project =  new Float32Array(16);
    mat4.perspective(project,glMatrix.toRadian(this.viewAngle),this.width/this.height,0.1,this.depth);
    var cameraMatrix = new Float32Array(16);
    mat4.multiply(cameraMatrix,project,view);
    mat4.multiply(cameraMatrix,cameraMatrix,scaling);
    return cameraMatrix;
  }


  generateMatrix (){
    var origin = vec3.create();
    var originVector = vec3.create();
    vec3.scale(originVector,this.direction,this.length);
    vec3.add(origin,this.position,originVector);
    var project = new Float32Array(16);
    mat4.perspective(project,glMatrix.toRadian(this.viewAngle),this.width/this.height,0.1,this.depth);
    var view = new Float32Array(16);
    mat4.lookAt(view,this.position,origin,this.upward);
    var cameraMatrix = new Float32Array(16);
    mat4.multiply(cameraMatrix,project,view);
    return cameraMatrix;
  }
  move (moveVector){
    console.log("adding this position",this.position,"and vector",moveVector);
    vec3.add(this.position,this.position,moveVector);
  }
  rotate (axis,angle){
    this.direction = vec3.rotate(this.direction,this.direction,axis,angle);
    vec3.normalize(this.direction,this.direction);
    this.upward = vec3.rotate(this.upward,this.upward,axis,angle);
    vec3.normalize(this.upward,this.upward);
    this.horizontalAxis = vec3.rotate(this.horizontalAxis,this.horizontalAxis,axis,angle);
    vec3.normalize(this.horizontalAxis,this.horizontalAxis);
  }
  zoom (distance){
    var zoomVector = vec3.create();
    vec3.scale(zoomVector,direction,distance);
    this.move(zoomVector);
  }

  rotateByCenter (axis,angle){
    this.rotate(axis,angle);
    this.position = vec3.rotate(this.position,this.position,axis,angle);
  }


  rotateByOrigin (axis,angle){
    var origin = vec3.create();
    var originVector = vec3.create();
    vec3.scale(originVector,this.direction,this.length);
    vec3.add(origin,this.position,originVector);
    this.rotate(axis,angle);
    vec3.scale(originVector,this.direction,this.length);
    vec3.sub(this.position,origin,originVector);
  }
}
//--------------------------------------------------------------------------
document.onmousemove = function(event){
  cursor.moved([event.clientX,event.clientY]);
}
document.ontouchmove = function(event){
  cursor.moved([event.touch[0].clientX,event.touch[0].clientY]);
}

document.onmousedown = function(event){
  cursor.pressed([event.clientX,event.clientY],event.button);
}

document.ontouchstart = function(event){
  cursor.pressed([event.touches[0].clientX,event.touches[0].clientY]);
}

document.onmouseup = function(event){
  cursor.released();
}
document.ontouchend = function(event){
  cursor.released();
}

document.onwheel = function(event){
  cursor.rolled(event.deltaY);
}
//---------------------------------------------------------------------------




//--------------------------------skybox definitions------------------------
