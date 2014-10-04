(function(ns) {
  
  tm.main(function() {
    
    ns.app = tm.display.CanvasApp('#world'); // canvasのidを指定
    initWindow();
    
    ns.app.replaceScene(LoadingScene({
      assets: ns.ASSETS,
      nextScene: MainScene,
    }));
    
    ns.app.run();
    
  });
  
  function initWindow() {
    ns.app.resizeWindow(); // windowサイズに合わせて
    ns.app.fitWindow(); // canvasを画面サイズに合わせて等倍拡大縮小
  }

  window.onresize = initWindow;

})(game);
