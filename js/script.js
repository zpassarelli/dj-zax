$(document).ready(function(){

  var inputReady = false;
  var hitsReady = false;
  var pauseState = false;

  var score = $('#score');
  var status = $('#status');

  var ctx = document.getElementById('grid').getContext('2d'); //Background layer context
  var cty = document.getElementById('grid2').getContext('2d'); //Note layer context
  var ctz = document.getElementById('grid3').getContext('2d'); //Hit layer context

  var raf; //Request Animation Frame variable

  var noteArray = []; //Queues all notes that need to be animated
  var activeArray = []; //Holds all notes currently animating

  var hit_img = new Image();
  hit_img.src = './media/hit.png';

  var Note = function(x){
    this.x = x;
    this.y = 0;
    this.color = 'cyan';
    this.velocity = 4;
    this.active = false;
    this.notHit = true;
  };

  Note.prototype.drawNote = function(){
    cty.fillStyle = this.color;
    cty.fillRect(this.x,this.y,90,30);
    cty.strokeStyle = 'white';
    cty.strokeRect(this.x,this.y,90,30);
  };

  function createGrid(){ //Animate and draw background
    $('.info').fadeOut(500);

    window.setTimeout(function(){
      $('#grid').slideDown('slow');
      $('#pause').slideDown('slow');
      window.setTimeout(function(){
        hitsReady = true;
      },800);
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
    switch(code){
      case 'finish':
        status.css('color','cyan');
        status.html('FINISH');
        break;
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
      case 'early':
        status.css('color','silver');
        status.html('EARLY');
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

  function numToNote(){ //Convert numbers to notes
    noteArray = noteArray.map(function(val){
      return new Note((val*100)+5);
    });
    console.log(noteArray);
  }



  function checkHit(x){ //Check if input collided with note
    if(noteArray[row][x] !== null && !pauseState && inputReady){
      var cNote = noteArray[row][x];
      if(cNote.notHit){
        var data = cty.getImageData((x*100)+5,418,1,54).data.filter(function(val,i){
          return i%4 === 0;
        });
        if(data[0] > 0 && data[23] === 0){
          message('early');
          cNote.color = 'silver';
          cNote.notHit = false;
        } else if(data[15] > 0 && data[37] > 0){
          score.html(parseInt(score.html(),10)+500);
          message('perfect');
          cNote.color = 'gold';
          cNote.notHit = false;
        } else if((data[8] > 0 && data[30] > 0)||(data[23] > 0 && data[45] > 0)){
          score.html(parseInt(score.html(),10)+300);
          message('great');
          cNote.color = 'lime';
          cNote.notHit = false;
        } else if((data[1] > 0 && data[22] > 0)||(data[30] > 0 && data[52] > 0)){
          score.html(parseInt(score.html(),10)+100);
          message('good');
          cNote.color = 'orange';
          cNote.notHit = false;
        }
      }
    }
  }

  // function endRow(){
  //   for(var i in noteArray[row]){
  //     if(noteArray[row][i] !== null && noteArray[row][i].y >= 490){
  //       row++;
  //     }
  //   }
  //   if(row === noteArray.length){
  //     window.cancelAnimationFrame(raf);
  //     inputReady = false;
  //     message('finish');
  //   }
  // }

  function animate() { //Animates notes in active array
    raf = window.requestAnimationFrame(animate); //Animation Frame recursion

    for(var i = 0; i < 4; i++){
      if(noteArray[row][i] === null){
        continue;
      }
      var cNote = noteArray[row][i];
      cty.clearRect(i*100,0,100,500);
      cNote.drawNote();
      cNote.y += cNote.velocity;
      // if(cNote.y > 350){
      //   cNote.active = true;
      // }
      if(cNote.y >= 500){
        if(cNote.notHit){
          score -= 200;
          message('no');
        }
      }
    }
  }

  function pause(){ //Pause and unpause game
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

  $('#go').click(function(event){ //Initialize and start game
    event.preventDefault();

    // var selectedFile = document.getElementById('song').files[0];
    // console.log(selectedFile);
    //var test = "./media/rules.mp3";

    createGrid();
    message('count');

    noteArray = [0,1,2,3,0,1,2,3];

    window.setTimeout(function(){
      //Start playing song
      //$('body').prepend('<audio src='+test+' autoplay></audio>');
      inputReady = true;
      numToNote();
      //animate();
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
        if(inputReady){
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
        if(inputReady){
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
        if(inputReady){
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
        if(inputReady){
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
