(function(ns) {
  // メインシーン
  tm.define('MainScene', {
    superClass: 'tm.app.Scene',
    
    // シーンを作るとき最初に呼ばれる
    init: function() {
      this.superInit();
      ns.app.background = '#000'; // 背景色
      
      this.innerWrapper = tm.display.CanvasElement(ns.wrapperWidth, ns.wrapperHeight)
        .addChildTo(this);
      
      this.bg = MySprite('bg', 1080, 1920, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.frame = MySprite('frame', 1080, 1920, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.header = MySprite('header', 1583, 734, -251, -536)
        .addChildTo(this.innerWrapper);
      
      this.btn_log = MySprite('btn_log', 384, 181, 24, 1274)
        .addChildTo(this.innerWrapper);
      
      this.massage = MySprite('message', 1472, 1873, -196, 1380)
        .addChildTo(this.innerWrapper);
      
      this.resize();
      
    },
    
    resize: function() {
      this.innerWrapper.setSize(ns.wrapperWidth, ns.wrapperHeight)
        .setPosition(ns.wrapperMarginRightLeft, ns.wrapperMarginTopBottom);
      
      this.children.each(function(c) {
        c.children.each(function(c2) {
          if (c2.resize)
          c2.resize();
        });
      });
      
      
    },
    
    // 毎フレームごとに呼ばれる
    update: function() {
      
    }, 
    
  });
  
  tm.define('MySprite', {
    superClass: 'tm.app.Sprite',
    
    init: function(sprite, width, height, x, y) {
      this.superInit(sprite, width, height);
      this.setOrigin(0, 0);
      
      this.dw = width;
      this.dh = height;
      this.dx = x;
      this.dy = y;
      
      this.resize();
    },
    
    resize: function () {
      this.setSize(this.dw * ns.wrapperSizeRatio, this.dh * ns.wrapperSizeRatio);
      this.setPosition(this.dx * ns.wrapperSizeRatio, this.dy * ns.wrapperSizeRatio);
    },
    
  });

})(game);
