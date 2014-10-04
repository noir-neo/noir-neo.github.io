(function(ns) {
  /**
   * loadingScene デフォルトのものを改変
   */
  tm.define('LoadingScene', {
    superClass : 'tm.app.Scene',

    init : function(param) {
      this.superInit();
      
      ns.app.background = 'transparent'; // 背景色
      
      if (param.assets) {
        var loader = tm.asset.Loader();
        
        loader.onload = function() {
          this.tweener.clear().wait(2000).call( function() {
            console.log('test');
            if (param.nextScene) {
              this.app.replaceScene(param.nextScene());
            }
            var e = tm.event.Event("load");
            this.fire(e);
          }.bind(this));
        }.bind(this);

        loader.onprogress = function(e) {
          var event = tm.event.Event("progress");
          event.progress = e.progress;
          this.fire(event);
        }.bind(this);

        loader.load(param.assets);
      }
    },
  });
})(game);
