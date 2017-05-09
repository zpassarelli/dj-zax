$(document).ready(function(){

  var canvasReady = false;

  function createGrid(){
    $('.info').fadeOut(500);

    window.setTimeout(function(){
      $('#grid').slideDown('slow');
      $('#pause').slideDown('slow');
    },500);

    var canvas = document.getElementById('grid');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'cyan';
    ctx.fillRect(50,0,3,500);
    ctx.fillRect(150,0,3,500);
    ctx.fillRect(250,0,3,500);
    ctx.fillRect(350,0,3,500);

    ctx.fillStyle = '#00b0b0';
    ctx.fillRect(53,0,2,500);
    ctx.fillRect(153,0,2,500);
    ctx.fillRect(253,0,2,500);
    ctx.fillRect(353,0,2,500);

    ctx.fillStyle = 'white';
    ctx.fillRect(100,0,1,500);
    ctx.fillRect(200,0,1,500);
    ctx.fillRect(300,0,1,500);

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(0,430,400,30);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(0,429,400,31);

    ctx.font = '44px Share Tech Mono';
    ctx.strokeText('A',20,460);
    ctx.strokeText('S',120,460);
    ctx.strokeText('D',220,460);
    ctx.strokeText('F',320,460);

    canvasReady = true;

  }

  function pause(){
    var pauseState = $('#pause');
    if(pauseState.html() === 'play_arrow'){
      pauseState.html('pause');
      //pause game
    } else {
      pauseState.html('play_arrow');
      //resume game
    }
  }

  $('#play').click(function(event){
    event.preventDefault();

    // var selectedFile = document.getElementById('song').files[0];
    // console.log(selectedFile);

    createGrid();

    // var test = "./media/rules.mp3";
    // window.setTimeout(function(){
    //   $('body').prepend('<audio src='+test+' autoplay></audio>');
    // },5000);
  });

  $('body').keydown(function(event){
    if(canvasReady){
      if(event.keyCode === 32){ //spacebar
        pause();
      }
    }
  });

});
