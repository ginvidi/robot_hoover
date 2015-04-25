$(document).ready(function () {

  //global var
  room_matrix = [];
  robotPosition = [];

  /*$( "#dimensionsX" ).focus(function() {
      $( "#dimensionsX" ).keypress(function( event ) {
        if($.isNumeric($('#dimensionsX').val())){
          $( ".x").css("border-color", "green");
          $( ".x").css("border-width", "3px");

        }
        else {
          $( ".x").css("border-color", "rgb(255, 42, 42)");
          $( ".x").css("border-width", "3px");


        }
      });
  });

    if($.isNumeric($('#dimensionsY').val())){
      $( ".y").css("border-color", "green");
      $( ".y").css("border-width", "3px");

    }
    else {
      $( ".y").css("border-color", "rgb(255, 42, 42)");
      $( ".y").css("border-width", "3px");


    }*/
    /* +++++++++ ++++++++++++++++++++Button state +++++++++++++++++++++++++++++++++++++++ */
    /*Disable Enable button next first table size
    $("#goSecond").prop("disabled",true);
    function checkSizeTable(inputSquareTable){

      $("#"+inputSquareTable).focusout(function() {


        if (($("#dimensionsX").val()>1)&&($("#dimensionsY").val()>1)){

          $("#goSecond").prop("disabled",false);

        }
      });
    }
    checkSizeTable("dimensionsX");
    checkSizeTable("dimensionsY");*/


    /*Disable Enable button next second patch of dirt*/
   $("#goThird").prop("disabled",true);




      /*$( "#roomFloor tr td" ).click(function() {
      console.log($( "#roomFloor tr").children().hasClass( "dirtyPatches" ));


      if ($( "#roomFloor tr").children().hasClass( "dirtyPatches" )){
        $("#goThird").prop("disabled",false);


      }
    })
    $( "#roomFloor tr td" ).click(function() {
      console.log($( "#roomFloor tr").children().hasClass( "dirtyPatches" ));


      if ($( "#roomFloor tr").children().hasClass( "dirtyPatches" )){
        $("#goForth").prop("disabled",false);


      }
    })*/
/* +++++++++ ++++++++++++++++++++CLICK FUNCTION +++++++++++++++++++++++++++++++++++++++ */
/*get h and w of the room*/
  $( "#goSecond" ).click(function() {

    /* ++++++++++++ DATA USER ++++  */
    /*room size*/
    roomW = $( "#dimensionsX").val();
    roomH = $( "#dimensionsY").val();

    //check user data
    if (!roomW || !roomW){
      $( ".errorMsgNullSize").fadeIn( "slow", function() {
        $(this).css("display", "block");
      });

      setTimeout(function() {
        $( ".errorMsg").fadeIn( "slow", function() {
          $(this).css("display", "block");
        });
      }, 500);
      $( ".errorMsgSmallRoom").css("display", "none");

      $( ".x").css("border-color", "rgb(255, 42, 42)");
      $( ".y").css("border-color", "rgb(255, 42, 42)");


    }

    else if((roomW<2) || (roomW<2)){
      $( ".errorMsgSmallRoom").fadeIn( "slow", function() {
        $(this).css("display", "block");
      });
      $( ".errorMsg").css("display", "none");
      $( ".errorMsgNullSize").css("display", "none");
      $( ".x").css("border-color", "rgb(255, 42, 42)");
      $( ".y").css("border-color", "rgb(255, 42, 42)");
    }

    else{
      $( "#FirsrStep").css("display", "none");
      $( "#SecondStep").css("display", "block");
      $( ".errorMsg").css("display", "none");
      $( ".errorMsgSmallRoom").css("display", "none");
      $( ".errorMsgNullSize").css("display", "none");
      $( ".x").css("border-color", "green");
      $( ".y").css("border-color", "green");


    }

    //create matrix
    room_matrix = generateRoom(roomH,roomW);

    //draw table

    createRoom (roomH,roomW);


  });

/* select robot square */
$( "#goThird" ).click(function() {

  /*change element style*/
  $( "#dirt").css("display", "none");
  $("#roomFloor").removeClass("dirtyPatchesCursor");
  $("#roomFloor").addClass("RobotCursor");
  $( "#Robot").css("display", "block");
  $('#goThird').attr('id', 'goForth');
  $('#btns2').css("display", "none");
  $('#btns3').css("display", "block");
});


/* give directions */
$( "#goForth" ).click(function() {

  if ($( "#roomFloor tr td" ).hasClass( "robotPosition" )){
    /*change element style*/

    $( "#SecondStep").css("display", "none");
    $( "#FirsrStep").css("display", "block");
    $( ".fisrtScreen").css("display", "none");
    $( ".fourthScreen").css("display", "block");
    $('#goForth').attr('id', 'goPlay');


  }
  else {
    console.log($( "#roomFloor tr td" ).hasClass( "robotPosition" ));
    //$('.whrRobot').modal(".whrRobot");
  }

});

/* See you moves on the table*/
$( "#goPlay" ).click(function() {


  /*change element style*/
  //get directionstring
  directions = $( "#usrMoves").val();
  if(directions != ""){
  $( "#SecondStep").css("display", "block");
  $( "#FirsrStep").css("display", "none");
  $("#roomFloor").removeClass("RobotCursor");
  $( "#Robot").css("display", "none");
  $( ".afterClean").css("display", "block");
  $('#btns2').css("display", "none");
  $('#btns3').css("display", "none");
  /*change the matrix with direction */
  clean(roomH, roomW, room_matrix, directions);
  }
  else{
    $( ".errorMsg1").css("display", "block");


  }
});







/*  ++++++++++++++++++++++++++++++++++++ FUNCTION +++++++++++++++++++++++++++++++++++++  */

/*Enable second and third botton function*/
function enableButton(className, buttonID){
  setTimeout(function() {
    if ($( "#roomFloor tr").children().hasClass(className)){
      $("#"+buttonID).prop("disabled",false);
      console.log(buttonID+" "+$( "#roomFloor tr").children().hasClass(className));
    }
    else {
      $("#"+buttonID).prop("disabled",true);

    }
  }, 500);
}


/*not allow to right different input in direction input*/
$('#usrMoves').keyup(function() {
  var $th = $(this);
  $th.val($th.val().replace(/[^NSWEnswe]/g,function(str){return '';}));
}).bind('paste',function(e) {
  setTimeout(function() {
    $('#usrMoves').val($('#usrMoves').val().replace(/[^NSWEnswe]/g,function(str){return '';}));
  },100);
});


/*Matrix*/

/*matrix generator function*/
function generateRoom(h,w){
  /*generate a empty clean room */
  roomSquare = [];
  for (var i=0; i < roomH ; i ++){
    roomSquare[i]=[];
    for (var j=0; j < roomW ; j ++ ){
      roomSquare[i][j]=0;
    }

  }
  return roomSquare;
}


/*change matrix with direction*/
function clean(h, w, room, directions){

    robCol = robotPosition[0];
    robRow = robotPosition[1];

    for (var i = 0; i < directions.length; i++) {

      direction = directions[i].toUpperCase();

      switch (direction) {
        case "S":
          room[robCol][robRow] = 0;
          if ( robRow < room[0].length -1 ){
            robRow++;
          }
        room[robCol][robRow] = 2;
        break;

        case "N":
          room[robCol][robRow] = 0;
          if ( robRow > 0){
            robRow--;
          }
        room[robCol][robRow] = 2;

        break;

        case "W":
          room[robCol][robRow] = 0;
          if ( robCol > 0 ){
            robCol--;
          }
        room[robCol][robRow] = 2;

        break;

        case "E":
          room[robCol][robRow] = 0;
          if ( robCol < room.length - 1){
            robCol++;
          }
        room[robCol][robRow] = 2;

        break;

      }

      fillRoom (room);
    }
}

/*fill the table*/
function fillRoom(myroom){


  jQuery.fn.getCell = function(c,r){
    return jQuery( this[0].rows[r].cells[c] );
  };

  for (var c = 0; c < myroom.length; c++) {


    for (var r = 0; r < myroom[c].length; r++) {

      if (myroom[c][r] == 2) {
        $('#roomFloor').getCell(c,r).addClass("robotPosition");
        $('#roomFloor').getCell(c,r).removeClass("dirtyPatches");

       // $('#roomFloor').getCell(c,r).css("border-radius","50%");


      }else if( myroom[c][r] == 1) {

        $('#roomFloor').getCell(c,r).addClass("dirtyPatches");

       // $('#roomFloor').getCell(c,r).css("background-color","black");
       // $('#roomFloor').getCell(c,r).css("border-radius","10%");
      } else if ( myroom[c][r] == 0) {

        $('#roomFloor').getCell(c,r).removeClass("robotPosition");
        $('#roomFloor').getCell(c,r).removeClass("dirtyPatches");


        $('#roomFloor').getCell(c,r).css("background-color","white");


      }


    }

  }

  leftDirty();
}


/*Count how many patche of dirt left*/
function leftDirty(){
  dirtSpotFounder = parseInt(0);

  for(var i= 0; i< room_matrix.length; i++){

    for (var j = 0; j < room_matrix[i].length; j++){
      if (room_matrix[i][j] == 1){
        dirtSpotFounder++;
      }
    }
  }
  if (dirtSpotFounder == 0){
    $(".allClean").css("display", "block");
    $(".notClean").css("display", "none");

  }
  else{
    $(".notClean").css("display", "block");

  }

  $(".afterClean h4 span").html(dirtSpotFounder);
}



/* Draw table*/

function createRoom (h,w){

  var cellW = 100/w;
  var cellH = 100/h;

  //console.log("h"+ h + "w" + w +"px " + px + "py " + py + "dirty"+ dirty + "cella" + cellW);
  $("#roomPlace").html('<table id= "roomFloor" class= "dirtyPatchesCursor" style  = "border: 2px solid green;" >');
  for (var i = 0; i < h; i++) {

    $("#roomPlace table").append('<tr class= "'+ i +'" style = "border: 0px solid transparent;" >');



    for (var j = 0; j < w; j++) {


      $("#roomPlace table ." + i).append('<td class="clear" style = "border: 0px solid black;" ></td>');
    }
    $("#roomPlace").append('</tr>');
  }

  $("#roomPlace").append('</table>');



  $("#roomPlace td").css( "width", cellW + "%");
  $("#roomPlace tr").css( "width", cellW + "%");
  $("#roomPlace tr").css( "hight", cellH + "%");


  /*get patches of dirt and robort position*/

  $( "#roomFloor tr td" ).click(function() {




    var col = $(this).parent().children().index($(this));
    var row = $(this).parent().parent().children().index($(this).parent());

    if($(".afterClean").is(":visible")){
      console.log("test");
      $( "#roomFloor tr td" ).click(function(event) {
        event.preventDefault();

      })


    }

    //draw dplatches of dirt
    else if($("#goThird").length)
    {
      // call the function to enable if there are dirty patches
      enableButton("dirtyPatches","goThird");


      $( this ).toggleClass( "dirtyPatches" );
      if(room_matrix[col][row] != 0) { room_matrix[col][row] = 1; }
      else { room_matrix[col][row] = 1; }

    }


    //draw robot
    else if($("#goForth").length){

      $( ".robotPosition" ).removeClass( "robotPosition" );
      $( this ).toggleClass( "robotPosition" );

      // clean matrix from previous robot (2)
      for(x=0;x<room_matrix.length;x++) {
        for(y=0;y<room_matrix[x].length;y++) {
          if(room_matrix[x][y] == 2) {
            room_matrix[x][y] = 0;
          }
        }
      }

      room_matrix[col][row] = 2;
      robotPosition = [col, row];

    }

  });


  };






});
