var name = name || {};
(function (ns) {
  $(function () {

    var COLOR = {
      white: '#ecf0f1',
      red: '#e74c3c',
      blue: '#2980b9',
    };
    var PAGE_BG = [COLOR.white, COLOR.blue, COLOR.red];

    // 現在の角度
    var currentAngle = 0;

    var PAGE_ID = [
      '#home', '#works', '#profile',
    ];
    // 現在のページ
    var currentPage = 0;

    /**
     * idからページ遷移
     * @param {Object} target_id
     */
    function changePageById(target_id, callback) {
      callback = callback || function(){};
      $('body').removeClass();
      $('body').addClass(target_id);
      
      var target_index = PAGE_ID.indexOf('#'+target_id);
      if (target_index !== -1) {
        var ra = target_index - currentPage;
        if (ra === 2)
          ra = -1;
        if (ra === -2)
          ra = 1;
        currentPage = (currentPage + ra + 3) % 3;
        changePage(target_index, ra, callback);
      }
    }

    /**
     * 回転してページ遷移
     * @param {Object} ra
     */
    function changePage(target_index, ra, callback) {
      smoothScrollTo(PAGE_ID[target_index]);
      if (ra !== 0) {
        currentAngle += ra * 120;
        $('.page').hide();
        animationRotate('.main-nav', currentAngle, 300, function () {
          $(PAGE_ID[target_index]).fadeIn(200, $.easing.easeOutQuart);
          callback();
        });
      }
    }

    function smoothScrollTo(target) {
      $('html, body').animate({
        scrollTop: $(target).offset().top
      }, 300, $.easing.easeInOutQuart);
    }

    function scrollToWorks(target) {
      if (!$('body').hasClass('works')) {
        changePageById('works', function(){return scrollToWorks(target);});
        return;
      }
      smoothScrollTo('#works-'+target);
    }

    /**
     * 回転の中心点を返します
     * @return 回転の中心点とtopからの距離
     */
    function getdy() {
      var w = $(window).width();
      return Math.floor(Math.sqrt(3) * w / 6);
    }

    /**
     * 回転する背景の円の半径を返します
     * @return 半径
     */
    function getr() {
      var w = $(window).width();
      var h = $(window).height();
      var dy = getdy();
      return Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h + dy, 2));
    }


    /**
     * 回転アニメーション
     * @param {Object} selector
     * @param {Object} color
     * @param {object} center
     * @param {Object} callbackFunc
     */
    function animationRotate(selector, angle, duration, callbackFunc) {
      $(selector).rotate({
        animateTo: angle,
        //center : center,
        duration: duration,
        easing: $.easing.easeInOutQuart,
        callback: callbackFunc,
      });
    }

    function changePageByUri() {
      var params = {};
      var queryStrings = window.location.hash.substring(1);
      var regex = /([^&=]+)=([^&]*)/g;
      var m;
      while(m = regex.exec(queryStrings)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
      if (params['page']) {
        changePageById(params['page']);
      }
      if (params['works']) {
        scrollToWorks(params['works']);
      }
    };

    function init() {
      changePageByUri(true);
      
      /*
       * 戻るボタンによる#からのページ遷移
       */
      window.addEventListener('popstate', function (event) {
        changePageByUri();
      }, false);
      
      $('a[href*=#]').click(function() {
        return true;
      });
      
      $('.swipebox').swipebox();
      
      FastClick.attach(document.body);
    }
    init();

  });

})(name);