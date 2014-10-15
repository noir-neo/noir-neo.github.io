(function(ns) {
  // メインシーン
  tm.define('MainScene', {
    superClass: 'MyScene',
    
    // シーンを作るとき最初に呼ばれる
    init: function() {
      this.superInit();
      ns.app.background = '#000'; // 背景色
      
      var self = this;
      
      this.bg = MySprite('bg', 540, 960, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.neo = MySprite('neo_serious', 675, 960, -67, 0)
        .addChildTo(this.innerWrapper)
        .setAlpha(0);
      this.neo.changeImage = function(img) {
        if (img)
          this.neo.image = 'neo_'+img;
      }.bind(this);
      
      this.frame = MySprite('frame', 540, 960, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.header = MySprite('header', 791, 367, -126, -250)
        .addChildTo(this.innerWrapper);
      
      this.btn_log = MySprite('btn_log', 192, 90, 13, 634)
        .addChildTo(this.innerWrapper);
      
      this.message = MySprite('message', 736, 1458, -98, 682)
        .addChildTo(this.innerWrapper);
      
      this.clickableIcon = MySprite('clickable_icon', 48, 48, 478, 906)
        .setAlpha(0)
        .addChildTo(this.innerWrapper);
      
      this.images = {};
      
    },
    
    onpointingendCustom: function(e, px, py) {
      if (this.btn_log.isHitPointRect(px, py)) {
        e.app.pushScene(LogScene());
        return;
      }
      
      for (var i in this.images) {
        if (this.images[i].isHitPointRect(px, py)) {
          e.app.pushScene(ImageScene(i, {x:this.images[i].x,y:this.images[i].y,width:this.images[i].width,height:this.images[i].height}));
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
      ns.text.textInit();
      
      var onenter = function() {
        this.resize();
        ns.text.showMessageBox();
        if (ns.text.isShowingClickableIcon)
          this.showClickableIcon();
      }.bind(this);
      onenter();
      this.onenter = onenter;
    },
    
    reversionNeo: function(i_name) {
      this.neo.setAlpha(1);
      this.neo.changeImage(i_name);
    },
    changeNeo: function(i_name, i_f) {
      var f = i_f || function() {};
      
      this.neo.changeImage(i_name);
      
      if (this.neo.alpha != 1.0) {
        this.neo.tweener.clear()
          .fadeIn(1000)
          .wait(1000).call(f);
        return;
      }
      f();
      
    },
    
    sleep: function(i_f) {
      this.btn_power = MySprite('btn_power', 126, 148, 207, 105)
        .setAlpha(0)
        .addChildTo(this.innerWrapper);
      this.btn_power.onwakeup = function() {
        this.btn_power.tweener.clear().fadeIn(300).wait(300).call(function() {
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
      var positions = [{x: 30, y: 340}, {x: 280, y: 440}];
      var p = p || positions[Object.keys(this.images).length%2];
      var w = 470;
      var h = 464;
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
      if (!this.images[img_name])
        return;
      this.images[img_name].hide();
      delete this.images[img_name];
      
    },
    
    showError: function() {
      this.error = this.error || [];
      if (this.error.length === 0) {
        var newErrorMessage = MySprite('error_message', 519, 118, 10, 100)
          .addChildTo(this.innerWrapper);
          newErrorMessage.tweener.clear().fadeIn(200);
        this.error.push(newErrorMessage);
      }
      
      var newErrorDialog = MySprite('error_dialog', 480, 357, 190*(this.error.length-1)+30, 75*(this.error.length-1)+140)
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
    
    showAuthenticationKey: function() {
      this.transmission = MySprite('transmission_dialog', 480, 357, 30, 245)
          .setAlpha(0)
          .addChildTo(this.innerWrapper);
        this.transmission.tweener.clear()
          .fadeIn(200);
    },
    transmitNeo: function() {
      this.neo.tweener.clear()
          .fadeOut(1000).wait(1000).call(function() {
        this.showAuthenticationKey();
      }.bind(this));
    },
    
    showClickableIcon: function() {
      this.clickableIcon.setAlpha(1)
        .setOrigin(0.5, 0.5)
        .setRotation(0);
      var rotation = function() {
        this.clickableIcon.tweener.clear().to({rotation: this.clickableIcon.rotation+360}, 1500).call(rotation);
      }.bind(this);
      rotation();
    },
    hideClickableIcon: function() {
      this.clickableIcon.setAlpha(0);
    },
    
    
  });
  
})(game);
