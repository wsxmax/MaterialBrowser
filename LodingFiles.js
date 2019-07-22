var LoadTextContent = function(url,callback){
  var request = new XMLHttpRequest();
  request.open('GET',url,true);
  request.onload = function(){
    if(request.status >=200 && request.status < 300){
      console.log("textContentLoaded:"+url);
      callback(null,request.responseText);
    } else {
      callback('error:' + request.status);
    }
  }
  request.send();
}

var LoadJSONContent = function(url,callback){
  LoadTextContent(url,function(error,textContent){
    if (!error) callback(null,JSON.parse(textContent));
    else callback(error);
  });
}

var LoadBinaryBuffer = function(url,callback){
  var request = new XMLHttpRequest();
  request.open('GET',url,true);
  request.responseType = "blob";
  request.onload = function(){
    var reader =  new FileReader();
    reader.onload = function(){
      callback(null,reader.result);
    }
    if(request.status >=200 && request.status < 300){
      console.log("textContentLoaded:"+url);
      reader.readAsArrayBuffer(request.response);
    }else {
      callback('error'+request.status);
    }
  };
  request.send();
}

var LoadBinaryBufferToObject = function(url,bufferObject,callback){
  LoadBinaryBuffer(url,function(error,data){
    if(!error) {
      bufferObject.data = data;
      callback(null);
    }
    else callback(error);
  })
}
