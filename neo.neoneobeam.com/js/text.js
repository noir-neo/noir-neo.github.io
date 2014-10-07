(function(ns) {
  
  var _texts = null;
  var _index = 0;
    
  function _parseText(i_text) {
    return i_text.split(/\r\n|\r|\n|;/);
  }
  }
  
  ns.text = {
  
    texts: null,

    loadTextByTXT: function(i_path, callback) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = checkReadyState;
      xmlHttp.open("GET", i_path, false);
      xmlHttp.send(null);
      function checkReadyState() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          // サーバからのデータ受信が正常に完了
          _texts = _parseText(xmlHttp.responseText);
          callback();
        }
      };
    },
    
    makeTextArea: function() {
      $('#text').append('<div id="message"></div><ul id="log"></ul>')
      /*
      $('#message').on('click', function() {
        ns.text.next();
      });
      */
    },

    resizeTextArea: function() {
      var d_message = document.getElementById('message');
      d_message.style.width = (ns.wrapperWidth*ns.canvasSizeRatio)*0.85+'px';
      d_message.style.height = (ns.wrapperHeight*ns.canvasSizeRatio)*0.2+'px';

      var d_log = document.getElementById('log');
      d_log.style.width = (ns.wrapperWidth*ns.canvasSizeRatio)*0.85+'px';
      d_log.style.height = (ns.wrapperHeight*ns.canvasSizeRatio)*0.75+'px';
      d_log.style.top = (ns.wrapperHeight*ns.canvasSizeRatio)*0.15+'px';
    },

    showMessageBox: function() {
      document.getElementById('log').style.display = 'none';
      document.getElementById('message').style.display = 'block';
    },
    
    showLogBox: function() {
      document.getElementById('message').style.display = 'none';
      var d_log = document.getElementById('log');
      d_log.style.display = 'block';
      d_log.scrollTop = d_log.scrollHeight;
    },

  }

})(game);
