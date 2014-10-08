(function(ns) {
  // メインシーン
  tm.define('MainScene', {
    superClass: 'MyScene',
    
    // シーンを作るとき最初に呼ばれる
    init: function() {
      this.superInit();
      ns.app.background = '#000'; // 背景色
      
      var self = this;
      
      this.bg = MySprite('bg', 1080, 1920, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.neo = MySprite('neo', 1307, 1950, -110, 240)
        .addChildTo(this.innerWrapper);
      
      this.frame = MySprite('frame', 1080, 1920, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.header = MySprite('header', 1583, 734, -251, -500)
        .addChildTo(this.innerWrapper);
      
      this.btn_log = MySprite('btn_log', 384, 181, 26, 1268)
        .addChildTo(this.innerWrapper);
      
      this.message = MessageSprite()
        .addChildTo(this.innerWrapper);
      
    },
    
    onpointingendCustom: function(e, px, py) {
      if (this.btn_log.isHitPointRect(px, py)) {
        e.app.pushScene(LogScene());
      } else {
        ns.text.next();
      }
        
    },
    
    onenter: function() {
      this.resize();
      ns.text.showMessageBox();
    },
    
    pushInputArea: function(type, f, f1) {
      this.app.pushScene(InputScene(type, f, f1));
    },
    
    
  });
  
})(game);
