(function(ns) {
  
  tm.main(function() {
    document.getElementById('tmlib').textContent = '[DONE]';
    onload();
  });
  
  $(function() {
    $('#jquery').text('[DONE]');
    onload();
  });
  
  var waitCount = 2;
  function onload() {
    
    waitCount--;
        if (waitCount)
          return;
    
    ns.app = tm.display.CanvasApp('#world'); // canvasのidを指定
    
    ns.text.makeTextArea();
    
    initWindow();
    
    ns.app.replaceScene(LoadingScene({
      assets: ns.ASSETS,
      text: '/text/text.txt',
      nextScene: MainScene,
    }));
    
    //ns.app.fps = 1;
    ns.app.run();
    
  };
  
  function initWindow() {
    
    ns.canvasSizeRatio = 1/window.devicePixelRatio;
    var b = document.body;
    var d = document.documentElement;
    ns.app.resize(Math.max(b.clientWidth, b.scrollWidth, d.scrollWidth, d.clientWidth) / ns.canvasSizeRatio, 
                  Math.max(b.clientHeight, b.scrollHeight, d.scrollHeight, d.clientHeight) / ns.canvasSizeRatio); // windowサイズに合わせて
      //ns.app.fitWindow(); // canvasを画面サイズに合わせて等倍拡大縮小
      //ns.app.canvas.scale(1/window.devicePixelRatio, 1/window.devicePixelRatio);

    ns.wrapperWidth = ns.app.width;
    ns.wrapperHeight = ns.app.height;
    ns.wrapperMarginTopBottom = 0;
    ns.wrapperMarginRightLeft = 0;

    var screenRatio = ns.app.width/ns.app.height;
    if (screenRatio > ns.S_RATIO) {
      // 横にはみ出す
      ns.wrapperWidth = ns.app.height * ns.S_RATIO;
      ns.wrapperMarginRightLeft = (ns.app.width - ns.wrapperWidth) / 2;
    } else {
      // 縦にはみ出す
      ns.wrapperHeight = ns.app.width / ns.S_RATIO;
      ns.wrapperMarginTopBottom = (ns.app.height - ns.wrapperHeight) / 2;
    }

    ns.wrapperSizeRatio = ns.wrapperWidth / ns.DS_WIDTH;

    if (ns.app.currentScene.resize)
      ns.app.currentScene.resize();
    
    ns.text.resizeTextArea();
    
  }

  var timer;
  window.onresize = resizeWindow;
  function resizeWindow() {
    if (timer !== false)
      clearTimeout(timer);
    timer = setTimeout(function() {
      initWindow();
    }, 200);
  }
  
  var _onPopState = [];
  var isPopReady = false;
  
  ns.page = {
    push: function(hash, f) {
      isPopReady = false;
      location.hash = hash;
      _onPopState.push(f);
      isPopReady = true;
    },
    pop: function(hash) {
      console.log(_onPopState);
      _onPopState.splice(-1, 1);
      console.log(_onPopState);
    }
  }
  
  window.addEventListener('popstate', function (event) {
    if(isPopReady)
      _onPopState[_onPopState.length-1]();
  }, false);

})(game);
