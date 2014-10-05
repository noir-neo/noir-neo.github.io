(function(ns) {
  // メインシーン
  tm.define('MainScene', {
    superClass: 'tm.app.Scene',
    
    // シーンを作るとき最初に呼ばれる
    init: function() {
      this.superInit();
      ns.app.background = '#000'; // 背景色
      
      this.wrapper = tm.app.Shape(ns.wrapperWidth, ns.wrapperHeight)
        .setOrigin(0, 0)
        .addChildTo(this);
      
      this.frame = tm.app.Sprite('frame', ns.wrapperWidth, ns.wrapperHeight)
        .setOrigin(0, 0)
        .setPosition(0, 0)
        .addChildTo(this.wrapper);
      
      
      
      this.resize();
      
    },
    
    resize: function() {
      this.wrapper.setSize(ns.wrapperWidth, ns.wrapperHeight)
        .setPosition(ns.wrapperMarginRightLeft, ns.wrapperMarginTopBottom);
      this.frame.setSize(ns.wrapperWidth, ns.wrapperHeight);
    },
    
    // 毎フレームごとに呼ばれる
    update: function() {
      
    }, 
    
  });

})(game);
