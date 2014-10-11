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
  
  tm.define('ImageSprite', {
    superClass: 'MySprite',
    
    init: function(sprite, x, y, scale) {
      this.dscale = scale;
      this.superInit(sprite, 941, 928, x, y);
      this.setPosition(this.x+this.width*0.49, this.y+this.height*0.49)
        .setSize(this.width*0.01, this.height*0.01)
        .setAlpha(0.0);
    },
    
    show: function() {
      this.setAlpha(1.0);
      this.tweener.clear()
        .to({width: this.dw*ns.wrapperSizeRatio*this.dscale, height: this.dh*ns.wrapperSizeRatio*this.dscale, x: this.dx*ns.wrapperSizeRatio, y: this.dy*ns.wrapperSizeRatio}, 300, 'easeOutQuart');
    },
    
    hide: function() {
      this.tweener.clear()
        .to({scaleX: 0.01, scaleY: 0.01, x: this.x+this.width*0.49, y: this.y+this.height*0.49}, 300, 'easeInQuart').call(function(){
          this.remove();
          }.bind(this));
    },
    resize: function () {
      this.setSize(this.dw * ns.wrapperSizeRatio*this.dscale, this.dh * ns.wrapperSizeRatio*this.dscale);
      this.setPosition(this.dx * ns.wrapperSizeRatio, this.dy * ns.wrapperSizeRatio);
    },
  });
  
})(game);
