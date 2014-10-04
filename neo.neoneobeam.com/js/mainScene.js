(function(ns) {
  // メインシーン
  tm.define('MainScene', {
    superClass: 'tm.app.Scene',
    
    // シーンを作るとき最初に呼ばれる
    init: function() {
      this.superInit();
      ns.app.background = '#000'; // 背景色
      
      
      
      this.frame = tm.app.Sprite('frame', ns.app.width, ns.app.height)
        .setPosition(ns.app.width/2, ns.app.height/2)
        .addChildTo(this);
      
    },
    
    resize: function() {
      
    },
    
    // 毎フレームごとに呼ばれる
    update: function() {
      
    }, 
    
  });

})(game);
