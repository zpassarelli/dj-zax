$(document).ready(function(){

  var inputReady = false;
  var hitsReady = false;
  var notPaused = true;
  var statusReset = 0;

  var score = $('#score');
  var status = $('#status');

  var ctx = document.getElementById('grid').getContext('2d'); //Background layer context
  var cty = document.getElementById('grid2').getContext('2d'); //Note layer context
  var ctz = document.getElementById('grid3').getContext('2d'); //Hit layer context

  var raf; //Request Animation Frame variable
  var gameLoop;
  var interval = 490;
  var startTime;
  var pausedTime;
  var remainingTime;

  var noteArray = []; //Queues all notes that need to be animated
  var activeArray = []; //Holds all notes currently animating

  var hit_img = new Image();
  hit_img.src = './media/hit.png';

  var Note = function(x){
    this.x = x;
    this.y = 0;
    this.color = 'cyan';
    this.stroke = 'white';
    this.velocity = 4; //note speed
    this.active = false; //flag for hit checking
    this.notHit = true; //flag for missed note
  };

  Note.prototype.drawNote = function(){
    cty.clearRect(this.x-5, this.y-10,100,50);
    cty.fillStyle = this.color;
    cty.fillRect(this.x,this.y,90,30);
    cty.strokeStyle = this.stroke;
    cty.strokeRect(this.x,this.y,90,30);
  };

  function noteGenerator(length){
    for(var i = 0; i < length; i++){
      noteArray[i] = Math.floor(Math.random()*4);
    }
  }

  function createGrid(){ //Animate and draw background

    $('.info').fadeOut(500); //Hide info

    window.setTimeout(function(){
      $('#grid').slideDown(500); //Show game grid
      score.fadeIn(500); //Show score
      window.setTimeout(function(){
        hitsReady = true; //its pizza time
      },500);
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

    ctx.font = 'italic 44px Share Tech Mono';
    ctx.strokeText('A',20,460);
    ctx.strokeText('S',120,460);
    ctx.strokeText('D',220,460);
    ctx.strokeText('F',320,460);
  }

  function message(code){ //Change status display
    statusReset = 2;
    switch(code){
      case 'finish':
        status.css('color','gold');
        status.html('FINISH');
        break;
      case 'pause':
        statusReset = 0;
        status.css('color','gray');
        status.html('PAUSE');
        break;
      case 'perfect':
        status.css('color','gold');
        status.html('PERFECT');
        break;
      case 'great':
        status.css('color','lime');
        status.html('GREAT');
        break;
      case 'good':
        status.css('color','orange');
        status.html('GOOD');
        break;
      case 'early':
        status.css('color','silver');
        status.html('EARLY');
        break;
      case 'no':
        status.css('color','red');
        status.html('OH NO');
        break;
      case 'count':
        window.setTimeout(function(){
          status.html('3');
          window.setTimeout(function(){
            status.html('2');
            window.setTimeout(function(){
              status.html('1');
              window.setTimeout(function(){
                status.html('START');
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

  function checkHit(x){ //Check if hit collided with note
    var cnh;
    for(var i in activeArray){
      if(activeArray[i].active && activeArray[i].notHit){
        cnh = activeArray[i];
      }
    }
    if(cnh === undefined){
      return;
    }

    var data = cty.getImageData((x*100)+5,418,1,54).data.filter(function(val,i){
      return i%4 === 0;
    });
    if(data[0] > 0 && data[23] === 0){
      message('early');
      cnh.color = 'silver';
      cnh.stroke = 'cyan';
      cnh.notHit = false;
    } else if(data[15] > 0 && data[37] > 0){
      score.html(parseInt(score.html(),10)+1000);
      message('perfect');
      cnh.color = 'gold';
      cnh.stroke = 'cyan';
      cnh.notHit = false;
    } else if((data[8] > 0 && data[30] > 0)||(data[23] > 0 && data[45] > 0)){
      score.html(parseInt(score.html(),10)+500);
      message('great');
      cnh.color = 'lime';
      cnh.stroke = 'cyan';
      cnh.notHit = false;
    } else if((data[1] > 0 && data[22] > 0)||(data[30] > 0 && data[52] > 0)){
      score.html(parseInt(score.html(),10)+300);
      message('good');
      cnh.color = 'orange';
      cnh.stroke = 'cyan';
      cnh.notHit = false;
    }
  }

  function sunnyGardenSunday(){
    startTime = new Date().getMilliseconds();
    if(noteArray.length){
      activeArray.push(noteArray.shift());
    }

    if(noteArray.length === 0 && activeArray.length === 0){
      window.cancelAnimationFrame(raf);
      if(score.html() < 0){
        message('no');
      }else{
        message('finish');
      }
      $('#grid').fadeOut(2000);
      $('#endScore').fadeIn(2000);
      inputReady = false;
      hitsReady = false;
      window.clearInterval(gameLoop);
    }

    if(statusReset > 0){
      statusReset--;
    }
    if(statusReset === 0){
      status.html('');
    }
  }

  function animate() { //Animates notes in active array
    raf = window.requestAnimationFrame(animate); //Animation Frame recursion

    for(var i = 0; i < activeArray.length; i++){
      var cn = activeArray[i];
      cn.drawNote();
      cn.y += cn.velocity;
      if(cn.y > 400 && cn.y < 460){
        cn.active = true;
      }
      if(cn.y >= 460 && cn.notHit){
        cn.color = '#00b0b0';
      }
      if(cn.y >= 500){
        if(cn.notHit){
          score.html(parseInt(score.html(),10)-500);
        }
        activeArray.shift();
        cty.clearRect(cn.x-5,480,100,20);
      }
    }
  }

  function pause(){ //Pause and unpause game
    if(notPaused){
      window.clearInterval(gameLoop);
      pausedTime = Math.abs(startTime - new Date().getMilliseconds());
      remainingTime = interval - pausedTime;
      console.log("start: "+startTime+" paused: "+pausedTime+" remain: "+remainingTime);
      window.cancelAnimationFrame(raf);
      notPaused = false; //Game is now not notPaused, therefore paused
      message('pause');
      document.getElementById('music').pause();
      document.getElementById('bgvid').pause();
    } else {
      gameLoop = setTimeout(function(){
        sunnyGardenSunday();
        gameLoop = setInterval(sunnyGardenSunday,interval);
      },remainingTime);

      raf = window.requestAnimationFrame(animate);
      notPaused = true;
      message('');
      document.getElementById('music').play();
      document.getElementById('bgvid').play();
    }
  }

  $('#start').click(function(event){ //Initialize and start game
    event.preventDefault();

    // var selectedFile = document.getElementById('song').files[0];
    // console.log(selectedFile);
    //var test = "./media/rules.mp3";

    createGrid();

    noteGenerator(275);
    noteArray = noteArray.map(function(val){ //Convert chewed data to notes
      return new Note((val*100)+5);
    });

    message('count'); //Countdown to start

    window.setTimeout(function(){
      //Start playing song
      document.getElementById('music').play();

      inputReady = true; //Keyboard listener functions active

      gameLoop = setInterval(sunnyGardenSunday,interval);

      animate();

    },4000);
  });

  $(window).keydown(function(event){ //Listener for all key inputs
      if(event.keyCode == '32'){ //spacebar
        event.preventDefault();
        if(inputReady){
          pause();
        }
      }
      if(event.keyCode == '65'){ //A
        if(inputReady && notPaused){
          checkHit(0);
        }
        if(hitsReady){
          window.clearInterval(hit1timer);
          ctz.clearRect(0,430,100,30);
          ctz.drawImage(hit_img,-5,430,110,30);
          var hit1timer = window.setTimeout(function(){
            ctz.clearRect(0,430,100,30);
          },200);
        }
      }
      if(event.keyCode == '83'){ //S
        if(inputReady && notPaused){
          checkHit(1);
        }
        if(hitsReady){
          window.clearInterval(hit2timer);
          ctz.clearRect(100,430,100,30);
          ctz.drawImage(hit_img,95,430,110,30);
          var hit2timer = window.setTimeout(function(){
            ctz.clearRect(100,430,100,30);
          },200);
        }
      }
      if(event.keyCode == '68'){ //D
        if(inputReady && notPaused){
          checkHit(2);
        }
        if(hitsReady){
          window.clearInterval(hit3timer);
          ctz.clearRect(200,430,100,30);
          ctz.drawImage(hit_img,195,430,110,30);
          var hit3timer = window.setTimeout(function(){
            ctz.clearRect(200,430,100,30);
          },200);
        }
      }
      if(event.keyCode == '70'){ //F
        if(inputReady && notPaused){
          checkHit(3);
        }
        if(hitsReady){
          window.clearInterval(hit4timer);
          ctz.clearRect(300,430,100,30);
          ctz.drawImage(hit_img,295,430,110,30);
          var hit4timer = window.setTimeout(function(){
            ctz.clearRect(300,430,100,30);
          },200);
        }
      }
    });

});
