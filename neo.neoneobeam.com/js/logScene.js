(function(ns) {
  // メインシーン
  tm.define('LogScene', {
    superClass: 'MyScene',
    
    // シーンを作るとき最初に呼ばれる
    init: function() {
      this.superInit();
      
      this.bg = tm.display.Shape(0,0);//.addChildTo(this);
      this.bg.canvas.clearColor('rgba(0,0,0,0.83');
      this.bg.resize = function() {
        this.setSize(ns.app.width, ns.app.height)
        .setOrigin(0,0)
        .setPosition(0,0);
      };
      this.addChildAt(this.bg, 0);
      
      this.frame_log = MySprite('frame_log', 1080, 1920, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.btn_close = MySprite('btn_close', 173, 173, 822, 62)
        .addChildTo(this.innerWrapper);

    },
    
    onpointingendCustom: function(e, px, py) {
      if (this.btn_close.isHitPointRect(px, py)) {
        ns.text.hideLogBox();
        
        this.innerWrapper
        .tweener.clear()
        .to({scaleX: 0.01, scaleY: 0.01, x: this.innerWrapper.width*0.49+this.innerWrapper.x, y: this.innerWrapper.height*0.49+this.innerWrapper.y}, 300, 'easeInOutQuart').call(function() {
          e.app.popScene();
        });
        
      }
    },
    
    onenter: function() {
      this.resize();
      ns.text.hideMessageBox();
      this.innerWrapper
        .setPosition(this.innerWrapper.width*0.49+this.innerWrapper.x, this.innerWrapper.height*0.49+this.innerWrapper.y)
        .setScale(0.01, 0.01)
        .tweener.clear()
        .to({scaleX: 1.0, scaleY: 1.0, x: ns.wrapperMarginRightLeft, y: ns.wrapperMarginTopBottom}, 300, 'easeInOutQuart').call(function() {
          ns.text.showLogBox(200);
        });
    },
    
  });
  
  
})(game);
