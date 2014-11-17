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

    var isAnimating = false;

    var PAGE_ID = [
    '#home', '#works', '#profile',
  ];
    // 現在のページ
    var currentPage = 0;

    init();

    function init() {
      initNav();
      changePageByUri();

    }

    function initNav() {
      for (var i = 0; i < 3; i++) {
        $('nav>ul>li').eq(i).rotate({
          angle: -120 * i,
          center: ['50%', '0'],
        });
      }
      $('nav').rotate({
        angle: currentAngle,
        center: ['50%', '50%'],
      });
    }

    /**
     * idからページ遷移
     * @param {Object} target_id
     */
    function changePageById(target_id) {
      var target_index = PAGE_ID.indexOf(target_id);
      if (target_index !== -1) {
        var ra = target_index - currentPage;
        if (ra === 0) 
          return;
        if (ra === 2)
          ra = -1;
        if (ra === -2)
          ra = 1;
        currentPage = (currentPage + ra + 3) % 3;
        changePage(target_index, ra);
      }
    }

    /**
     * 回転してページ遷移
     * @param {Object} ra
     */
    function changePage(target_index, ra) {
      if (ra !== 0) {
        isAnimating = true;
        currentAngle += ra * 120;

        $('body').css('background', PAGE_BG[target_index]);
        $('.page').hide();
        
        anim('nav', currentAngle, 300, function () {
          $(PAGE_ID[target_index]).fadeIn(200, $.easing.easeOutQuart);
        });

      }
    }

    function openWorksDetail(target) {
      $('#works_'+target).addClass('active');
    }

    function closeWorksDetail(target) {
      $('.works_item').removeClass('active');
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
    function anim(selector, angle, duration, callbackFunc) {
      $(selector).rotate({
        animateTo: angle,
        //center : center,
        duration: duration,
        easing: $.easing.easeInOutQuart,
        callback: callbackFunc,
      });
    }

    function changePageByUri() {
      var hash = location.hash.split('-');
      console.log(hash);
      if (hash[0] !== '') {
        changePageById(hash[0]);
        closeWorksDetail();
        if (hash[0] === '#works' && hash[1] !== '') {
          openWorksDetail(hash[1]);
        }
      }
    };

    /*
     * 戻るボタンによる#からのページ遷移
     */
    window.addEventListener('popstate', function (event) {
      changePageByUri();
    }, false);

  });

})(name);