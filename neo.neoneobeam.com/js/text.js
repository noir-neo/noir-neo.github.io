(function(ns) {
  
  var _texts = null;
  var _index = 0;
  var canNextOnClick = true;
  var canNext = true;
    
  function _parseText(i_text) {
    return i_text.split(/\r\n|\r|\n|;/);
  }
  
  function _changeText(i_text) {
    
    $('#message').hide();
    $('#message').children().remove();
    
    var $nP = $('<p/>').text(i_text);
    
    $('#message').append($nP.clone(false));
    $('#message').fadeIn(200);
    
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
  
  function _nextByClick(p) {
    _next(p);
    setTimeout(function() {
        canNextOnClick = true;
      }, 500);
      canNextOnClick = false;

  }
  function _next(p) {
    if (!canNext || !canNextOnClick || _index>=_texts.length)
      return;
    var p = p || {};
    var ct;
    if (p && p.ct) {
      ct = p.ct;
    } else {
      ct = _getCurrentText();
    }
    
    if (ct.script) {
      _runScript(ct.script, p.val);
    } else if (ct.text) {
      _changeText(ct.text);
    } else {
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
  
  function _showImage(img_name) {
    
    if (ns.app.currentScene.showImage)
      ns.app.currentScene.showImage(img_name);
    
    $('#imglog').append($('<li/>')
      .append($('<img>').attr({
        src: '/img/images/'+img_name+'_thumb.png',
        title: img_name
        }).on('click', function() {
          ns.text.hideLogBox();
          ns.text.hideMessageBox();
          ns.app.pushScene(ImageScene(img_name));
    })));
  }
  
  function _hideImage(img_name) {
    if (ns.app.currentScene.hideImage)
      ns.app.currentScene.hideImage(img_name);
  }
  
  function _scriptReplace(i_script) {
    return i_script.replace(/\[|\]/g, '').split(/\s/);
  }
  
  function _changeNeo(i_name) {
    if (ns.app.currentScene.changeNeo) {
      canNext = false;
      ns.app.currentScene.changeNeo(i_name, function() {
          canNext = true;
          _next();
      }); 
    }
  }
  
  function _sleep() {
    if (ns.app.currentScene.sleep) {
      canNext = false;
      ns.app.currentScene.sleep(function() {
          canNext = true;
          _next();
      }); 
    }
  }
  
  function _showError() {
    if (ns.app.currentScene.showError)
      ns.app.currentScene.showError();
  }
  
  function _hideError() {
    if (ns.app.currentScene.hideError)
      ns.app.currentScene.hideError();
  }
  
  function _runScript(i_script, i_val) {
    var s = _scriptReplace(i_script[0]);
    console.log('script:'+s);
    switch (s[0]) {
        case 'neo': // NEOの差分
          _changeNeo(s[1]);
          break;

        case 'image': // 画像
          switch (s[1]) {
              case 'show':
                _showImage(s[2]);
                break;

              case 'del':
                _hideImage(s[2]);
                break;
          }
          _next();
          break;
        
        case 'error': // 画像
          switch (s[1]) {
              case 'show':
                _showError();
                break;

              case 'del':
                _hideError();
                break;
          }
          _next();
          break;
        
        case 'input': // 入力画面を開く
          _pushInputArea(s[1]);
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
          _sleep();
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
      'top': (ns.wrapperHeight*ns.canvasSizeRatio)*0.2+ns.wrapperMarginTopBottom+'px',
      'display': 'none'});
    if (ns.app.currentScene.pushInputArea)
      ns.app.currentScene.pushInputArea(type, function(t) {
        _next();
      }, function() {
        $('#message.input').hide().removeClass('input').css('top', 'auto');
      });
  }
  
  ns.text = {
  
    next: function(p) {
      _nextByClick(p);
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
      $('#text').append('<div id="message"></div><div class="log"><ul id="textlog"></ul><ul id="imglog"</ul></div>');
      
      $('#message').on('click', function() {
        if ($('#message').hasClass('input'))
          return;
        _nextByClick();
      });
      
    },

    resizeTextArea: function() {
      $('#message').css({
        'width': (ns.wrapperWidth*ns.canvasSizeRatio)*0.85+'px',
        'height': (ns.wrapperHeight*ns.canvasSizeRatio)*0.2+'px',
      });
      if ($('#message').hasClass('input')) {
        $('#message').css('top', (ns.wrapperHeight*ns.canvasSizeRatio)*0.2+ns.wrapperMarginTopBottom+'px');
      } else {
        $('#message').css('bottom', ns.wrapperMarginTopBottom+'px');
      }
      
      $('#textlog, #imglog').css({
        'width': (ns.wrapperWidth*ns.canvasSizeRatio)*0.85+'px',
        
      });
      $('#textlog').css({
        'height': (ns.wrapperHeight*ns.canvasSizeRatio)*0.65+'px',
        'top': (ns.wrapperHeight*ns.canvasSizeRatio)*0.14+ns.wrapperMarginTopBottom+'px',
      });
      var imgH = (ns.wrapperHeight*ns.canvasSizeRatio)*0.08+'px';
      $('#imglog').css({
        'height': imgH,
        'bottom': (ns.wrapperHeight*ns.canvasSizeRatio)*0.07+ns.wrapperMarginTopBottom+'px',
      });
      
    },

    showMessageBox: function() {
      $('.log').hide();
      $('#message').show();
    },
    
    hideMessageBox: function() {
      $('#message').hide();
    },
    
    showLogBox: function(t) {
      $('#message').hide();
      $('.log').fadeIn(t);
      var d_log = document.getElementById('textlog');
      d_log.scrollTop = d_log.scrollHeight;

    },
    
    hideLogBox: function() {
      $('.log').hide();
    },

  }

})(game);
