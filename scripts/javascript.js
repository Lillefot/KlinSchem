$(function() {
  $("#extraHeader").click(function() {
    $("#extra").slideToggle();
  });

  $("#userSemester").change(function(){
    switch ($("#userSemester").val()){
      case "5":
        $("#t5Fields").show();
        $("#dateColumn").val('1');
        $("#timeColumn").val('2');
        $("#subjectColumn").val('3');
        $("#blockColumn").val('4');
        $("#locationColumn").val('5');
        $("#responsibleColumn").val('6');
        break;
      case "6":
        $("#t5Fields").hide();
        $("#dateColumn").val('1');
        $("#timeColumn").val('2');
        $("#subjectColumn").val('3');
        $("#blockColumn").val('6');
        $("#locationColumn").val('4');
        $("#responsibleColumn").val('5');
        break;
      default:
        $("#t5Fields").hide();
        break;
    }
  });

});
