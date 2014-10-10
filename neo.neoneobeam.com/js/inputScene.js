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
      
      // y:555以上
      this.input_field = MySprite('input_field', 817, 140, 328, 680).addChildTo(this.message);
      this.input_caret = MySprite('input_caret', 5, 91, 20, 24).addChildTo(this.input_field).setAlpha(0);
      this.input_caret.startAnim = function() {
        this.input_caret.isAnim = true;
        var anim = function() {
          if (this.input_caret.isAnim)
            this.input_caret.tweener.clear().fadeIn(10).wait(500).fadeOut(10).wait(500).call(anim);
        }.bind(this);
        anim();
      }.bind(this);
      
      this.frame_input = MySprite('frame_input', 972, 957, 250, 880).addChildTo(this.message);
      
      this.btn_num = [];
      this.btn_num[0] = MySprite('btn_0', 320, 236, 326, 717).addChildTo(this.frame_input);
      for (var i = 1; i < 10; i++) {
        this.btn_num[i] = MySprite('btn_'+i, 320, 236, 4+(i-1)%3*322, 3+Math.floor((i-1)/3)*238).addChildTo(this.frame_input);
      }
      
      this.btn_ok = MySprite('btn_ok', 320, 236, 4, 717).addChildTo(this.frame_input);
      this.btn_delete = MySprite('btn_delete', 320, 236, 648, 717).addChildTo(this.frame_input);
      
      this.icon = MySprite('icon_question', 141, 141, 470, 140)
        .addChildTo(this.uiWrapper);
      
      this.f1 = f1;
      this.popUpMessage(f);
      
    },
    
    input_val: '',
    oninput: function(val) {
      if (val === -1) {
        if (this.input_val) {
          this.input_val = this.input_val.slice(0, -1);
          this.input_field.removeChild(this.input_field.children.last);
          this.input_caret.x-=(45*ns.wrapperSizeRatio);
        }
      } else {
        this.input_val += val;
        MySprite('num_'+val, 45, 90, (this.input_caret.x/ns.wrapperSizeRatio), 25).addChildTo(this.input_field);
        this.input_caret.x+=(45*ns.wrapperSizeRatio);
      }
      console.log();
    },
    
    onpointingendCustom: function(e, px, py) {
      
      
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
        this.doneInput(e, this.input_val)
      }
      
      
    },
    
    doneInput: function(e, i_val) {
      this.input_caret.isAnim = false;
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
          this.uiWrapper.tweener.clear().fadeIn(200).wait(300).call(function() {
            this.input_caret.startAnim();
          }.bind(this));
          f(300);
          }.bind(this));
    },
    
    
  });
  
  
})(game);
