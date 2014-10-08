(function(ns) {
  
  var _texts = null;
  var _index = 0;
    
  function _parseText(i_text) {
    return i_text.split(/\r\n|\r|\n|;/);
  }
  
  function _changeText(i_text) {
    
    $('#message').children().remove();
    
    var $nP = $('<p/>').text(i_text);
    
    $('#message').append($nP.clone(false));
    
    $('#textlog').append($('<li/>').append($nP.clone(false)));
  }
  
  function _logScriptError(i_s) {
    console.log('text script error: '+i_s+' is undefined. line: '+_index);
  }
  
  function _getCurrentText(i) {
    if (_index>=_texts.length)
      return;
    
    if(i)
      _index += i;

    var currentText = _texts[_index++];

    var pattern = /\[(.*?)\]/g;
    var script = currentText.match(pattern);
    var text = currentText.replace(pattern, '');
    return {'script':script, 'text':text};
  }
  
  function _next(p) {
    var p = p || {};
    var ct;
    if (p && p.ct) {
      ct = p.ct;
    } else {
      ct = _getCurrentText();
    }
    if(!ct)
      return;
    
    if (ct.script) {
      _runScript(ct.script, p.val);
    } else if (ct.text) {
      _changeText(ct.text);
    } else {
      // 空行であると判断…
      _next({'val':p.val});
    }

  }
  
  function _skipTextTo(to_s, i) {
    while(1) {
      var ct = _getCurrentText(i=='reverse' ? -2 : 0);
      if (ct.script) {
        var s = _scriptReplace(ct.script[0]);
        if (s[0].match(to_s)) {
          _next({'ct':ct});
          break;
        }
      }
    }
  }
  
  function _scriptReplace(i_script) {
    return i_script.replace(/\[|\]/g, '').split(/\s/);
  }
  
  function _runScript(i_script, i_val) {
    var s = _scriptReplace(i_script[0]);
    console.log('script:'+s);
    switch (s[0]) {
        case 'neo': // NEOの差分
          _next();
          break;

        case 'image': // 画像
          switch (s[1]) {
              case 'show':
                // TODO:
                break;

              case 'del':
                // TODO:
                break;
          }
          _next();
          break;

        case 'input': // 入力画面を開く
          // TODO:
          _pushInputArea(s[1]);
          _next();
          break;

        case 'case': // 入力された値に一致すると発火
          if (s[1] == i_val) {
            _next();
          } else {
            _skipTextTo(/case|default|endcase/);
          }
          break;

        case 'default': // caseどれにも一致しなかった場合発火
            _next();
          break;

        case 'skipto':
          _skipTextTo(s[1]);
          break;

        case 'backto':
          _skipTextTo(s[1], 'reverse');
          break;

        case 'sleep': // スリープモードになっておでこタップされるまで待機
          // TODO:
          
          break;

        default:
          _logScriptError(s[0]);
          _next();
          break;
    }
  }
  
  function _pushInputArea(type) {
    $('#message').addClass('input');
    $('#message.input').css({
      'top': (ns.wrapperHeight*ns.canvasSizeRatio)*0.16+ns.wrapperMarginTopBottom+'px',
      'display': 'none'});
    if (ns.app.currentScene.pushInputArea)
      ns.app.currentScene.pushInputArea(type, function(t) {
        $('#message.input').fadeIn(t);
      }, function() {
        $('#message.input').hide().removeClass('input').css('top', 'auto');
        
      });
  }
  
  ns.text = {
  
    next: function(p) {
      _next(p);
    },

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
      $('#text').append('<div id="message"></div><ul id="textlog" class="log"></ul><ul id="imglog" class="log"></ul>')
      
      $('#message').on('click', function() {
        if ($('#message').hasClass('input'))
          return;
        _next();
      });
      
    },

    resizeTextArea: function() {
      var d_message = document.getElementById('message');
      d_message.style.width = (ns.wrapperWidth*ns.canvasSizeRatio)*0.85+'px';
      d_message.style.height = (ns.wrapperHeight*ns.canvasSizeRatio)*0.2+'px';
      if ($('#message').hasClass('input'))
        $('#message').css('top', (ns.wrapperHeight*ns.canvasSizeRatio)*0.15+ns.wrapperMarginTopBottom+'px');

      $('.log').css({
        'width': (ns.wrapperWidth*ns.canvasSizeRatio)*0.85+'px',
        
      });
      $('#textlog').css({
        'height': (ns.wrapperHeight*ns.canvasSizeRatio)*0.6+'px',
        'top': (ns.wrapperHeight*ns.canvasSizeRatio)*0.14+ns.wrapperMarginTopBottom+'px',
      });
      $('#imglog').css({
        'height': (ns.wrapperHeight*ns.canvasSizeRatio)*0.05+'px',
        'bottom': (ns.wrapperHeight*ns.canvasSizeRatio)*0.1+ns.wrapperMarginTopBottom+'px',
      });
      
    },

    showMessageBox: function() {
      $('.log').hide();
      $('#message').show();
    },
    
    showLogBox: function() {
      $('#message').hide();
      $('.log').show();
      var d_log = document.getElementById('textlog');
      d_log.scrollTop = d_log.scrollHeight;

    },

  }

})(game);
