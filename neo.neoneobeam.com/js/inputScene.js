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
      
      this.innerWrapper.dy = 0;
      this.innerWrapper.resize = function() {
        this.setSize(ns.wrapperWidth, ns.wrapperHeight)
        .setPosition(ns.wrapperMarginRightLeft, this.dy*ns.wrapperSizeRatio+ns.wrapperMarginTopBottom);
      };
      this.btn_log = MySprite('btn_log', 192, 90, 13, 634)
        .addChildTo(this.innerWrapper);
      
      this.message = MySprite('message', 736, 1458, -98, 682)
        .addChildTo(this.innerWrapper);
      
      // y:555以上
      this.input_field = MySprite('input_field', 408, 70, 164, 294).addChildTo(this.message);
      this.input_caret = MySprite('input_caret', 2, 45, 10, 12).addChildTo(this.input_field).setAlpha(0);
      this.input_caret.startAnim = function() {
        this.input_caret.isAnim = true;
        var anim = function() {
          if (this.input_caret.isAnim)
            this.input_caret.tweener.clear().fadeIn(10).wait(500).fadeOut(10).wait(500).call(anim);
        }.bind(this);
        anim();
      }.bind(this);
      
      // 
      this.frame_input = MySprite('frame_input', 486, 478, 125, 394).addChildTo(this.message);
      
      this.btn_num = [];
      this.btn_num[0] = MySprite('btn_0', 160, 118, 163, 359).addChildTo(this.frame_input);
      for (var i = 1; i < 10; i++) {
        this.btn_num[i] = MySprite('btn_'+i, 160, 118, 2+(i-1)%3*161, 2+Math.floor((i-1)/3)*119).addChildTo(this.frame_input);
      }
      
      this.btn_ok = MySprite('btn_ok', 160, 118, 2, 359).addChildTo(this.frame_input);
      this.btn_delete = MySprite('btn_delete', 160, 118, 325, 359).addChildTo(this.frame_input);
      
      this.icon = MySprite('icon_question', 70, 70, 235, 732)
        .addChildTo(this.innerWrapper)
        .setAlpha(0);
      
      this.f = f;
      this.f1 = f1;
      
    },
    
    input_val: '',
    oninput: function(val) {
      if (val === -1) {
        if (this.input_val) {
          this.input_val = this.input_val.slice(0, -1);
          this.input_field.removeChild(this.input_field.children.last);
          this.input_caret.x-=(27*ns.wrapperSizeRatio);
          this.input_caret.dx -= 27;
        }
      } else {
        this.input_val += val;
        MySprite('num_'+val, 27, 45, (this.input_caret.x/ns.wrapperSizeRatio), 12).addChildTo(this.input_field);
        this.input_caret.x+=(27*ns.wrapperSizeRatio);
        this.input_caret.dx += 27;
      }
    },
    
    onpointingendCustom: function(e, px, py) {
      
      py -= this.innerWrapper.y-ns.wrapperMarginTopBottom;
      
      if (this.btn_log.isHitPointRect(px, py)) {
        e.app.pushScene(LogScene());
        return;
      }
      
      px -= (this.message.x + this.frame_input.x);
      py -= (this.message.y + this.frame_input.y);
      
      for (var i=0; i < 10; i++) {
        if(this.btn_num[i].isHitPointRect(px, py)) {
          this.oninput(i);
        }
      }
      
      if(this.btn_delete.isHitPointRect(px, py)) {
        this.oninput(-1);
      }
      if(this.btn_ok.isHitPointRect(px, py)) {
        this.onpointingendCustom = function() {};
        this.doneInput(e, this.input_val);
      }
      
      
    },
    
    doneInput: function(e, i_val) {
      this.input_caret.isAnim = false;
      this.f1();
      this.icon.tweener.clear().fadeOut(100)
        .call(function() {
          this.innerWrapper.tweener.clear()
            .to({y: ns.wrapperMarginTopBottom}, 500, 'easeInOutQuart')
            .call(function() {
              e.app.popScene();  
              ns.text.next({'val':i_val});
              
            }.bind(this))}.bind(this));
      
    },
    
    onenter: function() {
      this.resize();
      this.popUpMessage(this.f);
      
      this.onenter = function() {
        this.resize();
        ns.text.showMessageBox();
      }.bind(this);

    },
    
      
    popUpMessage: function(f) {
      var ty = -625;
      this.innerWrapper.tweener.clear()
        .to({y: ty*ns.wrapperSizeRatio+ns.wrapperMarginTopBottom}, 500, 'easeInOutQuart')
        .call(function() {
          this.innerWrapper.dy = ty;
          this.icon.tweener.clear().fadeIn(200).wait(300).call(function() {
            this.input_caret.startAnim();
          }.bind(this));
          f();
          }.bind(this));
    },
    
    
  });
  
  
})(game);
