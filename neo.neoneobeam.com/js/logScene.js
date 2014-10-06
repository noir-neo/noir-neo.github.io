(function(ns) {
  // メインシーン
  tm.define('LogScene', {
    superClass: 'tm.app.Scene',
    
    // シーンを作るとき最初に呼ばれる
    init: function() {
      this.superInit();
      
      this.bg = tm.display.Shape(0,0).addChildTo(this);
      this.bg.canvas.clearColor('rgba(0,0,0,0.83');
      
      this.innerWrapper = tm.display.CanvasElement(ns.wrapperWidth, ns.wrapperHeight)
        .addChildTo(this);
      
      this.frame_log = MySprite('frame_log', 1080, 1920, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.btn_close = MySprite('btn_close', 87, 87, 865, 105)
        .addChildTo(this.innerWrapper);
      
      this.resize();
      
      console.log('btn x:'+this.btn_close.x+',y:'+this.btn_close.y);
      console.log('btn x:'+this.btn_close.width+',y:'+this.btn_close.height);
      
      this.on('pointingend', function(e) {
        var px = e.pointing.x/ns.canvasSizeRatio-ns.wrapperMarginRightLeft;
        var py = e.pointing.y/ns.canvasSizeRatio-ns.wrapperMarginTopBottom;
        
        console.log('x:'+px+',y:'+py);
        
        if (this.btn_close.isHitPointRect(px, py)) {
          e.app.popScene();
        }
        
      });
      
    },
    
    resize: function() {
      this.innerWrapper.setSize(ns.wrapperWidth, ns.wrapperHeight)
        .setPosition(ns.wrapperMarginRightLeft, ns.wrapperMarginTopBottom);
      this.bg.setSize(ns.app.width, ns.app.height)
        .setOrigin(0,0)
        .setPosition(0,0);
      
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
  
  
})(game);
