

function test(){
  $("#test_area").html("<h3>Good choice</h3>")
    
  if ($('#x').is(":checked"))
{
  $('#test_main').html("<h2>You chose x</h2>");
}
  else {
      $('#test_main').html("<h2>You chose o</h2>");
  }
}
  
  
$(".modal-wide").on("show.bs.modal", function() {
  var height = $(window).height() - 200;
  $(this).find(".modal-body").css("max-height", height);
});
 function form_submit() {
        document.getElementById("paymentitrform").submit();
   }  