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
        
        ns.text.loadSaveData();
        $('#memory').text('[DONE]');
        
        clearInterval(ns.loadingTimer);
        
        // TODO wait長く
        var waittime = 1000;
        $('#initializing').append('<p>INIT: Entering runlevel: 3</p><p><br></p><p id="startingneo">STARTING N.E.O. 9000</p>');
        self.tweener.clear().wait(waittime)
          .call(function() {$('#startingneo').append('.')}).wait(waittime)
          .call(function() {$('#startingneo').append('.')}).wait(waittime)
          .call(function() {$('#startingneo').append('.')}).wait(waittime)
          .call( function() {
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
        
        loader.onload = function() {
          $('#assets').text('[DONE]');
          onload();
        }
        loader.onprogress = function(e) {
          var event = tm.event.Event("progress");
          event.progress = e.progress;
          this.fire(event);
        }.bind(this);

        loader.load(param.assets);
      }
      
      if (param.text) {
        ns.text.loadTextByTXT(param.text, function() {
          $('#txt').text('[DONE]');
          onload();
        });
      }
      
    },
    
  });
})(game);
