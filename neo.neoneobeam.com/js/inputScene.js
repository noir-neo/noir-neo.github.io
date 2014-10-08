(function(ns) {
  // メインシーン
  tm.define('InputScene', {
    superClass: 'MyScene',
    
    // シーンを作るとき最初に呼ばれる
    init: function(type, f, f1) {
      this.superInit();
      
      this.bg = tm.display.Shape(0,0);//.addChildTo(this);
      this.bg.canvas.clearColor('rgba(0,0,0,0.83');
      this.bg.resize = function() {
        this.setSize(ns.app.width, ns.app.height)
        .setOrigin(0,0)
        .setPosition(0,0);
      };
      this.addChildAt(this.bg, 0);
      
      this.message = MessageSprite().addChildTo(this.innerWrapper);
      
      this.uiWrapper = tm.display.CanvasElement(ns.wrapperWidth, ns.wrapperHeight)
        .setAlpha(0.0)
        .addChildTo(this);
      this.uiWrapper.resize = function() {
        this.setSize(ns.wrapperWidth, ns.wrapperHeight)
        .setPosition(ns.wrapperMarginRightLeft, ns.wrapperMarginTopBottom);
      };
      
      this.icon = MySprite('icon_question', 141, 141, 470, 140)
        .addChildTo(this.uiWrapper);
      
      this.f1 = f1;
      this.popUpMessage(f);
      
    },
    
    onpointingendCustom: function(e, px, py) {
      
      
      this.doneInput(e, 0)
      
    },
    
    doneInput: function(e, i_val) {
      this.f1();
      this.uiWrapper.tweener.clear().fadeOut(100)
        .call(function() {
          this.message.tweener.clear()
            .to({y: this.message.y0*ns.wrapperSizeRatio}, 500, 'easeInOutQuart')
            .call(function() {
              this.message.dy = this.message.y0;
              ns.text.next({'val':i_val});
              e.app.popScene();
            }.bind(this))}.bind(this));
      
    },
    
      
    popUpMessage: function(f) {
      this.message.tweener.clear()
        .to({y: this.message.y1*ns.wrapperSizeRatio}, 500, 'easeInOutQuart')
        .call(function() {
          this.message.dy = this.message.y1;
          this.uiWrapper.tweener.clear().fadeIn(300);
          f(300);
          }.bind(this));
    },
    
    
  });
  
  
})(game);
