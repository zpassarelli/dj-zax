$(document).ready(function(){

  var inputReady = false;
  var pauseState = false;
  var status = $('#status');
  var ctx = document.getElementById('grid').getContext('2d');
  var cty = document.getElementById('grid2').getContext('2d');
  var ctz = document.getElementById('grid3').getContext('2d');
  var raf;

  var note_img = new Image();
  note_img.src = './media/note.png';
  var hit_img = new Image();
  hit_img.src = './media/hit.png';

  var Note = function(x){
    this.x = x;
    this.y = 0;
    this.img = note_img;
    this.velocity = 5;
  };

  Note.prototype.drawme = function(){
    cty.drawImage(this.img,this.x,this.y);
  };
  var note1 = new Note(5);

  function createGrid(){
    $('.info').fadeOut(500);

    window.setTimeout(function(){
      $('#grid').slideDown('slow');
      $('#pause').slideDown('slow');
    },500);

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
  }

  function message(code){
    switch(code){
      case 'pause':
        status.css('color','gray');
        status.html('PAUSE');
        break;
      case 'perfect':
        status.css('color','gold');
        status.html('PERFECT');
        window.setTimeout(function(){
          status.html('');
        },1000);
        break;
      case 'great':
        status.css('color','lime');
        status.html('GREAT');
        window.setTimeout(function(){
          status.html('');
        },1000);
        break;
      case 'good':
        status.css('color','orange');
        status.html('GOOD');
        window.setTimeout(function(){
          status.html('');
        },1000);
        break;
      case 'no':
        status.css('color','red');
        status.html('OH NO');
        window.setTimeout(function(){
          status.html('');
        },1000);
        break;
      case 'count':
        window.setTimeout(function(){
          status.html('3');
          window.setTimeout(function(){
            status.html('2');
            window.setTimeout(function(){
              status.html('1');
              window.setTimeout(function(){
                status.html('');
              },1000);
            },1000);
          },1000);
        },1000);
        break;
      default:
        status.css('color','pink');
        status.html('');
        break;
    }
  }

  function animate() {
    cty.clearRect(note1.x-5,note1.y-5,100,50);
    note1.drawme();
    note1.y += note1.velocity;

    if(note1.y === 500){
      message('no');
    }

    raf = window.requestAnimationFrame(animate);
  }

  function pause(){
    if(pauseState){
      raf = window.requestAnimationFrame(animate);
      pauseState = false;
      message('');
      //document.getElementById('bgvid').play();
    } else {
      window.cancelAnimationFrame(raf);
      pauseState = true;
      message('pause');
      //document.getElementById('bgvid').pause();
    }
  }

  $('#play').click(function(event){
    event.preventDefault();

    // var selectedFile = document.getElementById('song').files[0];
    // console.log(selectedFile);

    createGrid();
    message('count');
    var test;
    // test = "./media/rules.mp3";
    window.setTimeout(function(){
      $('body').prepend('<audio src='+test+' autoplay></audio>');
      inputReady = true;
      animate();
    },5000);
  });

  $(window).keydown(function(event){
    if(inputReady){
      if(event.keyCode == '32'){ //spacebar
        event.preventDefault();
        pause();
      }
      if(event.keyCode == '65'){ //A
        console.log(note1.y);
        window.clearInterval(time1);
        ctz.clearRect(0,430,100,30);
        ctz.drawImage(hit_img,-5,430,110,30);
        var time1 = window.setTimeout(function(){
          ctz.clearRect(0,430,100,30);
        },200);
      }
      if(event.keyCode == '83'){ //S
        window.clearInterval(time2);
        ctz.clearRect(100,430,100,30);
        ctz.drawImage(hit_img,95,430,110,30);
        var time2 = window.setTimeout(function(){
          ctz.clearRect(100,430,100,30);
        },200);
      }
      if(event.keyCode == '68'){ //D
        window.clearInterval(time3);
        ctz.clearRect(200,430,100,30);
        ctz.drawImage(hit_img,195,430,110,30);
        var time3 = window.setTimeout(function(){
          ctz.clearRect(200,430,100,30);
        },200);
      }
      if(event.keyCode == '70'){ //F
        window.clearInterval(time4);
        ctz.clearRect(300,430,100,30);
        ctz.drawImage(hit_img,295,430,110,30);
        var time4 = window.setTimeout(function(){
          ctz.clearRect(300,430,100,30);
        },200);
      }
    }
  });

});
