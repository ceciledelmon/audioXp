/*
////////////////////////
INITIALISATION CANVAS
////////////////////////
*/

//Create the renderer
var renderer = PIXI.autoDetectRenderer(
  window.innerWidth - 20, window.innerHeight - 30,
  {antialias: false, transparent: false, resolution: 1}
);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.view.style.border = "1px solid white";
renderer.backgroundColor = 0xFFFFFF;

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container()
stage.interactive = true;

var stageWidth = renderer.view.width
var stageHeight = renderer.view.height

/*
////////////////////////
INITIALISATION VARIABLES
////////////////////////
*/

var contexteAudio = new (window.AudioContext || window.webkitAudioContext)()
var analyseur = contexteAudio.createAnalyser()

var audioSource;
var audioBuffer = contexteAudio.createBufferSource()

var frequencyData = new Uint8Array(analyseur.frequencyBinCount)

//trame fond
var graphics = new PIXI.Graphics();

graphics.lineStyle(1, 0xE6E6E6);

for (var j = 0; j < stageHeight/5; j++) {
  graphics.moveTo(0,j*5-5);
  for (var i = 0; i < stageWidth/10; i++) {
    if (i % 2 == 0) {
      graphics.lineTo(i*10, j*5);
    }else{
      graphics.lineTo(i*10, j*5-5);
    }
  }
}
stage.addChild(graphics)

var count = 0

var fullLogo = PIXI.Sprite.fromImage('logo.png');
var logoContainer = new PIXI.Container()
logoContainer.addChild(fullLogo)
logoContainer.scale.x = 1
logoContainer.scale.y = 1
logoContainer.position.x = stageWidth/2;
logoContainer.position.y = stageHeight/2;
logoContainer.pivot.x = 208;
logoContainer.pivot.y = 136

stage.addChild(logoContainer)

var strokes = []

var funkyMode = false
var filter = new PIXI.filters.ColorMatrixFilter();

var filterSound;

var musicChoice = document.getElementById("music");
/*
////////////////////////
APPEL FONCTIONS
////////////////////////
*/
loadSound()

/*
////////////////////////
INITIALISATION EVENTS
////////////////////////
*/
// musicChoice.addEventListener('click', (event) => {
//   if (!playing) {
//     var index = musicChoice.getAttribute('index')
//     loadSound(index)
//     playing = true;
//     document.getElementById('musicList').style.display = 'none';
//   }
// })

document.addEventListener('keydown', (event) => {
  const keyCode = event.keyCode;

  if (keyCode==32) {
    console.log('pressed');
    funkyMode = !funkyMode
    if (funkyMode)
    {
      stage.filters = [filter];
    }
    else
    {
      stage.filters = null;
    }
  }
})

/*
////////////////////////
INITIALISATION FONCTIONS
////////////////////////
*/

function loadSound() {

  var request = new XMLHttpRequest()
  //You can change the music file here
  request.open('GET', 'music3.mp3', true);
  request.responseType = 'arraybuffer';

  request.onload = function () {

      contexteAudio.decodeAudioData(request.response, function (buffer) {
        // Tell the AudioBufferSourceNode to use this AudioBuffer.
        audioBuffer = buffer;

        // Create sound from buffer
        audioSource = contexteAudio.createBufferSource();
        audioSource.buffer = audioBuffer;

        // connect the audio source to context's output
        audioSource.connect( analyseur )
        analyseur.connect( contexteAudio.destination )

        // Create the filter.
        filterSound = contexteAudio.createBiquadFilter();
        filterSound.type = 'lowpass';
        filterSound.frequency.value = 5000;
        // Connect source to filter, filter to destination.
        audioSource.connect(filterSound);
        filterSound.connect(contexteAudio.destination);
        // play sound
        audioSource.start()

        draw()
      })
  }
  request.send();
}


function draw(){
  requestAnimationFrame(draw)
  // analyseur.fftSize = 128
  // var frequencyData = new Uint8Array(analyseur.fftSize);
  // analyseur.getByteTimeDomainData(frequencyData);

  analyseur.getByteFrequencyData(frequencyData);

  var frequencies = 0
  var average = 0

  for (var i = 0; i < frequencyData.length; i++) {
    frequencies += frequencyData[i]
    average = frequencies/frequencyData.length
  }

  //movement of the base
  logoContainer.scale.x = 0.5*(Math.log(average)-3)
  logoContainer.scale.y = 0.5*(Math.log(average)-3)
  if (funkyMode) {
    logoContainer.rotation += 0.05;
    filterSound.frequency.value = Math.sin(count)*50+50;
  }else{
    logoContainer.rotation = 0
    filterSound.frequency.value = 50000;
  }

  //recuperation of the average values
  var result1 = getRangeAverage(frequencyData,50, 345)
  var result2 = getRangeAverage(frequencyData,345, 690)
  var result3 = getRangeAverage(frequencyData,690, 1024)

  if (result1>120) {
    if (funkyMode) {
      var color = getRandomColor()
      createStroke(color)
    }else{
      createStroke(0x80FFd2)
    }
  }

  if (result2>80) {
    if (funkyMode) {
      var color = getRandomColor()
      createStroke(color)
    }else{
      createStroke(0xFFE07A)
    }
  }

  if (result3>7) {
    if (funkyMode) {
      var color = getRandomColor()
      createStroke(color)
    }else{
      createStroke(0xF97945)
    }
  }

  //Get the stroke increase
  if (average != 0 && strokes.length!=0 ) {
    //when music start and a stroke is needed
    for (var j = 0; j < strokes.length; j++) {
      var stroke = strokes[j]
      stroke.update(count, funkyMode)
      stroke.draw()
      if (stroke.logoStrokeContainer.scale.x>50) {
        count = 0
        stage.removeChild(stroke.logoStrokeContainer)
        strokes.splice(strokes.indexOf(stroke),1)
      }
    }
    count += 1
  }

  if (funkyMode) {

    var matrix = filter.matrix;

    matrix[1] = Math.sin(count) * 3;
    matrix[2] = Math.cos(count);
    matrix[3] = Math.cos(count) * 1.5;
    matrix[4] = Math.sin(count / 3) * 2;
    matrix[5] = Math.sin(count / 2);
    matrix[6] = Math.sin(count / 4);

  }

    //render all stage
    renderer.render(stage);
}

function getRangeAverage(frequencies, min, max){
  var average=0
  var turn = 0
  for (var i = 0; i < frequencies.length; i++) {
    if (i>min && i<max) {
      average += frequencies[i]
      turn ++
    }
  }
  return average/turn
}

function createStroke(color){
  //create stroke when the bit drop
  var options = {
    scale: logoContainer.scale.x*2+0.1,
    position:{
      x:stageWidth/2,
      y:stageHeight/2
    },
    pivot:{
      x:480,
      y:280
    },
    velocity:0,
    color: color,
    rotation: logoContainer.rotation
  }
  strokes.push( new LogoStroke(options))
}

function getRandomColor() {
  //var letters = '0123456789ABCDEF';
  var letters = '0123456789ABCDEF';
  var color = '0x';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
