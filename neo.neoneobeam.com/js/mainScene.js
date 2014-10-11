(function(ns) {
  // メインシーン
  tm.define('MainScene', {
    superClass: 'MyScene',
    
    // シーンを作るとき最初に呼ばれる
    init: function() {
      this.superInit();
      ns.app.background = '#000'; // 背景色
      
      var self = this;
      
      this.bg = MySprite('bg', 1080, 1920, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.neo = MySprite('neo', 1350, 1920, -135, 0)
        .addChildTo(this.innerWrapper)
        .setAlpha(0);
      
      this.frame = MySprite('frame', 1080, 1920, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.header = MySprite('header', 1583, 734, -251, -500)
        .addChildTo(this.innerWrapper);
      
      this.btn_log = MySprite('btn_log', 384, 181, 26, 1268)
        .addChildTo(this.innerWrapper);
      
      this.message = MySprite('message', 1472, 2915, -196, 1365)
        .addChildTo(this.innerWrapper);
      
      this.images = {};
      
      ns.text.next();
    },
    
    onpointingendCustom: function(e, px, py) {
      if (this.btn_log.isHitPointRect(px, py)) {
        e.app.pushScene(LogScene());
        return;
      }
      
      for (var i in this.images) {
        if (this.images[i].isHitPointRect(px, py)) {
          e.app.pushScene(ImageScene(i));
          return;
        }
      }
      
      if (this.btn_power) {
        if(this.btn_power.isHitPointRect(px, py)) {
          this.btn_power.onwakeup();
        }
        return;
      }
      
      ns.text.next();
    },
    
    onenter: function() {
      this.resize();
      ns.text.showMessageBox();
    },
    
    changeNeo: function(i_name, i_f) {
      var name = i_name || ''
      var f = i_f || function() {};
      
      // TODO: 差分
      
      
      if (this.neo.alpha != 1.0) {
        this.neo.tweener.clear()
          .fadeIn(1000)
          .wait(1000).call(f);
        return;
      }
      f();
      
    },
    
    sleep: function(i_f) {
      this.btn_power = MySprite('btn_power', 252, 297, 414, 190)
        .setAlpha(0)
        .addChildTo(this.innerWrapper);
      this.btn_power.onwakeup = function() {
        this.btn_power.tweener.clear().fadeIn(300).wait(500).call(function() {
          this.btn_power.remove();
          this.btn_power = null;
          i_f();
        }.bind(this));
      }.bind(this);
      var anim = function() {
        this.btn_power.tweener.clear().fadeIn(1000).wait(500).fadeOut(1000).wait(500).call(anim);
        }.bind(this);
      anim();
    },
    
    pushInputArea: function(type, f, f1) {
      this.app.pushScene(InputScene(type, f, f1));
    },
    
    showImage: function(img_name, p) {
      var positions = [{x: 60, y: 680}, {x: 560, y: 880}];
      var p = p || positions[Object.keys(this.images).length];
      var w = 941;
      var h = 928;
      while (1) {
        if (this.images[img_name]) {
          img_name+='1';
        } else {
          break;
        }
      }
      this.images[img_name] = ImageSprite(img_name, p.x, p.y, 0.5)
        .addChildTo(this.innerWrapper);
      this.images[img_name].show();
    },
    
    hideImage: function(img_name) {
      while (1) {
        if (this.images[img_name+'1']) {
          img_name+='1';
        } else {
          break;
        }
      }
      this.images[img_name].hide();
      delete this.images[img_name];
      
    },
    
    showError: function() {
      this.error = this.error || [];
      if (this.error.length === 0) {
        var newErrorMessage = MySprite('error_message', 1038, 237, 21, 200)
          .addChildTo(this.innerWrapper);
          newErrorMessage.tweener.clear().fadeIn(200);
        this.error.push(newErrorMessage);
      }
      
      var newErrorDialog = MySprite('error_dialog', 961, 715, 380*(this.error.length-1)+38, 150*(this.error.length-1)+280)
        .addChildTo(this.error[0]);
        newErrorDialog.tweener.clear().fadeIn(200);
      this.error.push(newErrorDialog);
      
      
        
    },
    
    hideError: function() {
      for (var i = 0; i < this.error.length; i++) {
        this.error[i].tweener.clear().fadeOut(200);
      }
      this.error[0].remove();
      this.error = null;
    },
    
    
  });
  
})(game);
