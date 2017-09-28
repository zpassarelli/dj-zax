$(document).ready(function(){

  var music = document.createElement('audio');
  music.setAttribute('src', './media/ignite-infinity.mp3');
  music.volume = 0.5;
  music.load();
  music.addEventListener("canplaythrough", function(){
    $('#start').text('START');
    $('#start').attr('disabled',false);
  }, true);

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
  var interval = 500; //Time interval between notes
  var velocity = 4.2; //Note speed

  var startTime; //Variables for timing
  var timeElapsed = 0;
  var pausedTime;

  var noteArray = []; //Queues all notes that need to be animated
  var activeArray = []; //Holds all notes currently animating

  var hit_img = new Image();
  hit_img.src = './media/hit.png';

  $('#start').click(function(){ //Initialize and start game

    $('.info').fadeOut(500); //Hide info

    createGrid(); //Draw game area

    numGenerator(Math.round(music.duration * 1.85)); //Generate numbers according to song duration

    noteArray = noteArray.map(function(val){ //Convert numbers to note instances
      return new Note((val*100)+5);
    });

    message('count'); //Countdown to start
    music.play();

    window.setTimeout(function(){

      inputReady = true; //Keyboard listener functions active

      startTime = Date.now();

      gameLoop = setTimeout(sunnyGardenSunday,interval);

      animate();

    },1000);
  });

  function sunnyGardenSunday(){
    timeElapsed += interval;
    var diff = (Date.now() - startTime) - timeElapsed;

    gameLoop = window.setTimeout(sunnyGardenSunday, (interval - diff));

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
      window.clearTimeout(gameLoop);
      window.cancelAnimationFrame(raf);
      remainingTime = (Date.now() - startTime) - timeElapsed;
      notPaused = false; //Game is now not notPaused, therefore paused
      message('pause');
      music.pause();
      document.getElementById('bgvid').pause();
    } else {
      timeElapsed = 0;
      startTime = Date.now() - remainingTime;
      gameLoop = setTimeout(sunnyGardenSunday, interval - remainingTime);

      raf = window.requestAnimationFrame(animate);
      notPaused = true;
      message('');
      music.play();
      document.getElementById('bgvid').play();
    }
  }

  var Note = function(x){
    this.x = x;
    this.y = 0;
    this.color = 'cyan';
    this.stroke = 'white';
    this.velocity = velocity; //note speed
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

  function numGenerator(length){ //Fills array with random numbers
    for(var i = 0; i < length; i++){
      noteArray[i] = Math.floor(Math.random()*4);
    }
  }

  function createGrid(){ //Animate and draw background

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
        status.css('color','white');
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
                statusReset = 5;
              },500);
            },500);
          },500);
        },500);
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
        break;
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
