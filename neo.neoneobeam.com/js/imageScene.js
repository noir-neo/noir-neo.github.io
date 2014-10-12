(function(ns) {
  // メインシーン
  tm.define('ImageScene', {
    superClass: 'MyScene',
    
    // シーンを作るとき最初に呼ばれる
    init: function(img_name) {
      this.superInit();
      
      this.bg = tm.display.Shape(0,0);//.addChildTo(this);
      this.bg.canvas.clearColor('rgba(0,0,0,0.83');
      this.bg.resize = function() {
        this.setSize(ns.app.width, ns.app.height)
        .setOrigin(0,0)
        .setPosition(0,0);
      };
      this.addChildAt(this.bg, 0);
      
      this.img = MySprite(img_name, 941, 928, 69, 496)
        .addChildTo(this.innerWrapper);
      
      this.btn_close = MySprite('btn_close', 173, 173, 870, 463)
        .addChildTo(this.innerWrapper);

    },
    
    onpointingendCustom: function(e, px, py) {
      var pop = function() {
        this.innerWrapper
        .tweener.clear()
        .to({scaleX: 0.01, scaleY: 0.01, x: this.innerWrapper.width*0.49+this.innerWrapper.x, y: this.innerWrapper.height*0.49+this.innerWrapper.y}, 300, 'easeOutQuart').call(function() {
          e.app.popScene();
        });
      }.bind(this);
      
      if (this.btn_close.isHitPointRect(px, py) || !this.img.isHitPointRect(px, py)) {
        pop();
      }
    },
    
    onenter: function() {
      ns.text.hideMessageBox();
      this.resize();
      this.innerWrapper
        .setPosition(this.innerWrapper.width*0.49+this.innerWrapper.x, this.innerWrapper.height*0.49+this.innerWrapper.y)
        .setScale(0.01, 0.01)
        .tweener.clear()
        .to({scaleX: 1.0, scaleY: 1.0, x: ns.wrapperMarginRightLeft, y: ns.wrapperMarginTopBottom}, 300, 'easeInQuart');
    },
    
  });
  
  
})(game);
