$(function() {
  $('.radio input').change(function() {
    if ($(this).val() === 'y') {
      $(this).parents('.form').children('.hide').fadeIn();
    } else {
      $(this).parents('.form').children('.hide').fadeOut();
    }
  });
  
  var num = 0;
  var room = 4110;
  var option = 0;
  $('input[name=num_male], input[name=num_female]').each(function() {
    $(this).bind('keyup change', function() {
     num = (parseInt($('input[name="num_male"]').val(), 10)||0)+(parseInt($('input[name="num_female"]').val(), 10)||0);
      calSum();
    });
  });
  $('input[name=audio_visual]').change(function() {
    var $checked = $('input[name=audio_visual]:checked');
    option = 1000 * $checked.length;
    calSum();
  });
  function calSum() {
    $('span.sum').text(num*room+option);
  }
});