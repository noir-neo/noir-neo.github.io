(function(ns) {
  // メインシーン
  tm.define('MyScene', {
    superClass: 'tm.app.Scene',
    
    // シーンを作るとき最初に呼ばれる
    init: function() {
      this.superInit();
      
      this.innerWrapper = tm.display.CanvasElement(ns.wrapperWidth, ns.wrapperHeight)
        .addChildTo(this);
      this.innerWrapper.resize = function() {
        this.setSize(ns.wrapperWidth, ns.wrapperHeight)
        .setPosition(ns.wrapperMarginRightLeft, ns.wrapperMarginTopBottom);
      };
      
    },
    
    onpointingend: function(e) {
        var px = e.pointing.x/ns.canvasSizeRatio-ns.wrapperMarginRightLeft;
        var py = e.pointing.y/ns.canvasSizeRatio-ns.wrapperMarginTopBottom;
        if (this.onpointingendCustom)
          this.onpointingendCustom(e, px, py);
    },
    
    onenter: function() {
      this.resize();
    },
    
    resize: function() {
      
      this.children.each(function(c) {
        if (c.resize)
          c.resize();
        c.children.each(function(c2) {
          if (c2.resize)
            c2.resize();
        });
      });
      
      
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
  
  tm.define('MessageSprite', {
    superClass: 'MySprite',
    
    init: function() {
      this.superInit('message', 1472, 1873, -196, 1365);
      this.y0 = this.dy;
      this.y1 = 40;
    },
    
  });
  
})(game);
