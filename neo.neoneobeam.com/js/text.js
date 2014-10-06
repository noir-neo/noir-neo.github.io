(function(ns) {
  
  function parseText(i_text) {
    return i_text.split(/\r\n|\r|\n/);
  }
  
  ns.texts;
  
  ns.loadTextByTXT = function(i_path, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = checkReadyState;
    xmlHttp.open("GET", i_path, false);
    xmlHttp.send(null);
    function checkReadyState() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        // サーバからのデータ受信が正常に完了
        ns.texts = parseText(xmlHttp.responseText);
        callback();
      }
    };
  }
  
  
  

})(game);
