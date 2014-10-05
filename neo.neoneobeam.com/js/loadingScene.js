(function(ns) {
  /**
   * loadingScene デフォルトのものを改変
   */
  tm.define('LoadingScene', {
    superClass : 'tm.app.Scene',

    init : function(param) {
      this.superInit();
      
      ns.app.background = 'transparent'; // 背景色
      
      var waitCount = 0;
      if (param.assets) waitCount++;
      if (param.text) waitCount++;
      
      var self = this;
      function onload() {
        waitCount--;
        if (waitCount)
          return;
        
        self.tweener.clear().wait(200).call( function() {
            if (param.nextScene) {
              document.body.removeChild(document.getElementById('initializing'));
              self.app.replaceScene(param.nextScene());
            }
            var e = tm.event.Event("load");
            self.fire(e);
          });
      }
      
      if (param.assets) {
        var loader = tm.asset.Loader();
        
        loader.onload = onload();

        loader.onprogress = function(e) {
          var event = tm.event.Event("progress");
          event.progress = e.progress;
          this.fire(event);
        }.bind(this);

        loader.load(param.assets);
      }
      
      if (param.text) {
        ns.loadTextByTXT(param.text, function() {
          onload();
        });
      }
      
    },
    
  });
})(game);
