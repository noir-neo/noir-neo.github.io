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
      
      this.neo = MySprite('neo', 1307, 1950, -110, 240)
        .addChildTo(this.innerWrapper);
      
      this.frame = MySprite('frame', 1080, 1920, 0, 0)
        .addChildTo(this.innerWrapper);
      
      this.header = MySprite('header', 1583, 734, -251, -500)
        .addChildTo(this.innerWrapper);
      
      this.btn_log = MySprite('btn_log', 384, 181, 26, 1268)
        .addChildTo(this.innerWrapper);
      
      this.message = MessageSprite()
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
          e.app.pushScene(ImageScene(i));
          return;
        }
      }
      
        
      ns.text.next();
      
        
    },
    
    onenter: function() {
      this.resize();
      ns.text.showMessageBox();
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
    
    
  });
  
})(game);
