var vec2 = {
  create : function(){
    return[0,0];
  },
  add : function(out,a,b){
    out = [a[0]+b[0],a[1]+b[1]];
    return out;
  },
  sub : function(out,a,b){
    out = [a[0]-b[0],a[1]-b[1]];
    return out;
  },
  dot :function(a,b){
    var out = [a[0]*b[0],a[1]*b[1]];
    return out;
  },
  cross :function(out,a,b){
    out = a[0]*b[1]-a[1]*b[0];
    return out;
  },
  scale :function(out,a,b){
    out = [b*a[0],b*a[1]];
    return out;
  }
}
var vec3 = {
  create : function(){
    return[0,0,0];
  },
  add : function(out,a,b){
    out = [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
    return out;
  },
  sub : function(out,a,b){
    out = [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
    return out;
  },
  dot : function(a,b){
    var out = [a[0]*b[0],a[1]*b[1],a[2]*b[2]];
    return out;
  },
  cross : function(out,a,b){
    out = [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    return out;
  },
  scale : function(out,a,b){
    out = [b*a[0],b*a[1],b*a[2]];
    return out;
  },
  abs : function(a){
    return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);
  },
  normalize : function(out,a){
    out = vec3.create();
    vec3.scale(out,a,1/vec3.abs(a));
    return out;
  }
}

var mat4 = {
  create : function(){
    return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
  },
  identity : function(a){
    a = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
  },
  multiply : function(out,a,b){
    for(var line = 0; line < 4; line++){
      for(var column = 0; column < 4; column++){
        out = a[line*4]*b[column]+a[line*4+1]*b[column+4]+a[line*4+2]*b[column+8]+a[line*4+3]*b[column+12];
        return out;
      }
    }
  }
}
