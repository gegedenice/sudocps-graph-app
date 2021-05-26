function getDataEncoded(jsonData){
    var formBody = [];
    for (var property in jsonData) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(jsonData[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

function renameKey(obj){
    if (obj["titre"]) {
        obj["name"] = obj["titre"]; 
        return obj
    }
    if (obj["etab"]) {
        obj["name"] = obj["etab"]; 
        return obj
    }
    else {
        return obj
    }
}