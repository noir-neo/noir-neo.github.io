(function(ns) {
  // メインシーン
  tm.define('ImageScene', {
    superClass: 'MyScene',
    
    // シーンを作るとき最初に呼ばれる
    init: function(img_name, dp) {
      this.superInit();
      
      this.bg = tm.display.Shape(0,0);//.addChildTo(this);
      this.bg.canvas.clearColor('rgba(0,0,0,0.83');
      this.bg.resize = function() {
        this.setSize(ns.app.width, ns.app.height)
        .setOrigin(0,0)
        .setPosition(0,0);
      };
      this.bg.onpointingend = function() {
        this.popImage();
      };
      this.addChildAt(this.bg, 0);
      
      this.img = MySprite(img_name, 470, 464, 35, 248)
        .addChildTo(this.innerWrapper);
      
      this.btn_close = MySprite('btn_close', 86, 86, 435, 231)
        .addChildTo(this.innerWrapper);
      
      this.dp = dp || {x:this.img.width*0.49+this.img.x, y: this.img.height*0.49+this.img.y,
                       width: this.img.width*0.01, height: this.img.height*0.01}

    },
    
    popImage: function(i_e) {
      ns.page.pop('image');
      var e = i_e || this;
      this.img
        .tweener.clear()
        .to({width: this.dp.width, height: this.dp.height, x: this.dp.x, y: this.dp.y}, 200, 'easeOutQuart').call(function() {
          e.app.popScene();
        });

    },
    
    onpointingendCustom: function(e, px, py) {
    
      if (this.btn_close.isHitPointRect(px, py) || !this.img.isHitPointRect(px, py)) {
        this.popImage(e);
      }
    },
    
    onenter: function() {
      ns.page.push('image', function() {this.popImage()}.bind(this));
      ns.text.hideMessageBox();
      this.resize();
      this.img
        .setPosition(this.dp.x, this.dp.y)
        .setSize(this.dp.width, this.dp.height)
        .tweener.clear()
        .to({width: this.img.dw*ns.wrapperSizeRatio, height: this.img.dh*ns.wrapperSizeRatio, x: this.img.dx*ns.wrapperSizeRatio, y: this.img.dy*ns.wrapperSizeRatio}, 200, 'easeInQuart');
    },
    
  });
  
  
})(game);
