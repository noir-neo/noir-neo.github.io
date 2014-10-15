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
  
  var _toggleClickableTimer;
  function _nextByClick(p) {
    _hideClickableIcon();
    _next(p);
    clearTimeout(_toggleClickableTimer);
    _toggleClickableTimer = setTimeout(function() {
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
      _showClickableIcon();
    } else {
      _next({'val':p.val});
    }
    _saveData({
      'index':_index,
      'message': $('#message').html(),
      'textlog': $('#textlog').html(),
      'imglog': $('#imglog').html(),
    });
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
  
  var _showClickableIconTimer;
  function _showClickableIcon() {
    clearTimeout(_showClickableIconTimer);
    _showClickableIconTimer = setTimeout(function() {
      if (!canNext || !canNextOnClick || _index>=_texts.length)
        return;
      if (ns.app.currentScene.showClickableIcon)
        ns.app.currentScene.showClickableIcon();
      ns.text.isShowingClickableIcon = true;
    }, 3000);
    
  }
  function _hideClickableIcon() {
    if (ns.app.currentScene.hideClickableIcon)
      ns.app.currentScene.hideClickableIcon();
    ns.text.isShowingClickableIcon = false;
  };
  
  function _showImage(img_name) {
    
    if (ns.app.currentScene.showImage)
      ns.app.currentScene.showImage(img_name);
    
    var items = _loadData();
    var cImages = items.images ? items.images+','+img_name : img_name;
    _saveData({'images':cImages});
    
    /* なんかうまくいかない
    var has = false;
    $('#imglog').each(function() {
      if ($('li img', this).attr('title')==img_name) {
        has = true;
        return;
      }
    });
    if (has) return;
    */
    $('#imglog')
      .append($('<img>').attr({
        src: '/img/images/'+img_name+'_thumb.png',
        title: img_name,
        }).on('click', function() {
          ns.text.hideLogBox();
          ns.text.hideMessageBox();
          ns.app.pushScene(ImageScene(img_name));
    }));
  }
  
  function _hideImage(img_name) {
    if (ns.app.currentScene.hideImage)
      ns.app.currentScene.hideImage(img_name);
    
    var items = _loadData();
    var cImages = items.images.split(',');
    var nImages = '';
    for (var i=0; i < cImages.length; i++) {
      if (cImages[i] != img_name)
        nImages = nImages ? nImages+','+cImages[i] : cImages[i];
    }
    _saveData({'images':nImages});
    
  }
  
  function _scriptReplace(i_script) {
    return i_script.replace(/\[|\]/g, '').split(/\s/);
  }
  
  function _changeNeo(i_name) {
    if (ns.app.currentScene.changeNeo) {
      canNext = false;
      _saveData({'neo': i_name});
      ns.app.currentScene.changeNeo(i_name, function() {
          canNext = true;
          _next();
      }); 
      
    }
  }
  
  function _sleep() {
    if (ns.app.currentScene.sleep) {
      _saveData({isSleep: 'true'});
      canNext = false;
      ns.app.currentScene.sleep(function() {
          _saveData({isSleep: 'false'});
          canNext = true;
          _next();
      }); 
    }
  }
  
  function _showError() {
    if (ns.app.currentScene.showError)
      ns.app.currentScene.showError();
    var items = _loadData();
    var newError = items.error ? parseInt(items.error)+1 : 1;
    _saveData({error: newError});
  }
  
  function _hideError() {
    if (ns.app.currentScene.hideError)
      ns.app.currentScene.hideError();
    _saveData({error: 0});
  }
  
  function _end() {
    window.onbeforeunload = null;
    canNext=false;
    canNextOnClick=false;
    if (ns.app.currentScene.transmitNeo)
      ns.app.currentScene.transmitNeo();
    $('#message').children().remove();
    $('#textlog').append($('<li/>').append($('<p/>').text='Authentication key: mk913'));
    _saveData({isEnd:'true',neo:''});
  }
  
  function _runScript(i_script, i_val) {
    var s = _scriptReplace(i_script[0]);
    // console.log('script:'+s);
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

        case 'eof':
          _end();
          break;

        default:
          _logScriptError(s[0]);
          _next();
          break;
    }
  }
  
  function _pushInputArea(type, i_f) {
    _saveData({isInput:'true',inputType:type});
    $('#message').addClass('input');
    $('#message.input').css({
      'top': (ns.wrapperHeight*ns.canvasSizeRatio)*0.2+ns.wrapperMarginTopBottom+'px',
      'display': 'none'});
    var f = i_f || function() {
      _next();
    };
    var f1 = function() {
      _saveData({isInput:'false',inputType:null});
      $('#message.input').hide().removeClass('input').css('top', 'auto');
    };
    if (ns.app.currentScene.pushInputArea)
      ns.app.currentScene.pushInputArea(type, f, f1);
  }
  
  var _items;
  function _loadData() {
    var strage = window.localStorage;
    // TODO
    //strage.clear();
    var items = {};
    for (var i in strage) {
      try {
        items[i] = strage.getItem(i);
      } catch (e) {
        console.log(e);
      }
    }
    return items;
  }
  
  function _reversion(items) {
    if (items.index) {
      _index = items.index;
      if(items.message) {
        $('#message').html(items.message);
        _showClickableIcon();
      }
      if (items.textlog)
        $('#textlog').html(items.textlog);
      if (items.imglog) {
        $('#imglog').html(items.imglog);
        $('#imglog>img').on('click', function() {
          ns.text.hideLogBox();
          ns.text.hideMessageBox();
          ns.app.pushScene(ImageScene($(this).attr('title')));
        });
      }
      if (items.neo) {
        ns.app.currentScene.reversionNeo(items.neo);
      }
      if (items.images) {
        var cImages = items.images.split(',');
        for (var i=0; i < cImages.length; i++) {
          ns.app.currentScene.showImage(cImages[i]);
        }
      }
      if (items.error) {
        for (var i=0; i<parseInt(items.error); i++) {
          ns.app.currentScene.showError();
        }
      }
      if (items.isSleep=='true') {
        _sleep();
      }
      if (items.isInput=='true' && items.inputType) {
        _pushInputArea(items.inputType, function(){});
      }
      if (items.isEnd=='true') {
        window.onbeforeunload = null;
        canNext=false;
        canNextOnClick=false;
        ns.app.currentScene.showAuthenticationKey();
      }
    }
  }
  
  function _saveData(items) {
    if (!isLocalStorageSupported)
      return;
    var strage = window.localStorage;
    for (var i in items) {
      try {
        strage.setItem(i,items[i]);
      } catch (e) {
        console.log(e);
      }
    }
  }
  
  function isLocalStorageSupported() {
    if (!window.sessionStorage) return false;

    var testKey = 'test';
    try {
      window.sessionStorage.setItem(testKey, '1');
      window.sessionStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  var deleteCounter = 0;
  function _deleteData(isNow) {
    if (deleteCounter++ > 9 || isNow) {
      var strage = window.localStorage;
      try {
        strage.clear();
        alert('セーブデータを消去しました');
        window.onbeforeunload = null;
      } catch (e) {
        console.log(e);
      }
    }
  }
  
  ns.text = {
    
    isShowingClickableIcon: false,
  
    next: function(p) {
      _nextByClick(p);
    },
    
    loadSaveData: function(c) {
      _items = _loadData();
    },
    
    deleteData: function() {
      _deleteData();
    },
    
    textInit: function() {
      if (_items.index>0) {
        _reversion(_items);
      } else {
        _next();
      }
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
      $('#text').append('<div id="message"></div><div class="log"><ul id="textlog"></ul><div id="imglog"</div></div>');
      
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
      $('#imglog img').css({
        'width': imgH,
        'height': imgH,
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
