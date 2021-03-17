// set up audio context
var audioContext = (window.AudioContext || window.webkitAudioContext);
// create audio class
if (audioContext) {
  // Web Audio API is available.
  var audioApi = new audioContext();
} else {
  // Web Audio API is not available. Ask the user to use a supported browser.
  alert("Oh nos! It appears your browser does not support the Web Audio API, please upgrade or use a different browser");
}
// set up getUserMedia
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// variables
var audioBuffer,
    analyserNode,
    frequencyData = new Uint8Array(1024);

// create an audio API analyser node and connect to source
function createAnalyserNode(audioSource) {
  analyserNode = audioApi.createAnalyser();
  analyserNode.fftSize = 2048;
  audioSource.connect(analyserNode);
}

const color1 = document.querySelector('.color1');
const color2 = document.querySelector('.color2');
const span1 = document.getElementById('span-r');
const span2 = document.getElementById('span-v');
const span3 = document.getElementById('span-b');
const span4 = document.getElementById('span-t');


// get's html elements, loops over them & attaches a frequency from analysed data - what you do is up to you!
function animateStuff() {
  requestAnimationFrame(animateStuff);
  analyserNode.getByteFrequencyData(frequencyData);

  // Animation stuff--------------------------------
  var allRepeatedEls = document.getElementsByTagName('i');
  //allRepeatedEls = selectorAll des i
  var totalEls = allRepeatedEls.length;
  //totalEls = nombre de "i"

  // assigne une fréquence à chaque i, lorsque la fréquence est supérieure à 100, elle est considérée comme jouée et le block se lumine
  for (var i=0; i<totalEls; i++) {
    // set colours
    var lightColour = i*3;
    allRepeatedEls[i].style.backgroundColor = 'hsla('+lightColour+',  80%, 50%, 0.8)';
    allRepeatedEls[i].style.borderColor = 'hsla('+lightColour+',  80%, 50%, 1)';

    // flash on frequency
    var freqDataKey = i * 3;

    if (frequencyData[freqDataKey] > 100){
      // frequency played - make opache
      allRepeatedEls[i].style.opacity = "1";
    } else {
      // frequency not played - fade out
      allRepeatedEls[i].style.opacity = "0.2";
    }
    console.log(frequencyData[1]);
    color2.style.backgroundColor = 'hsl('+frequencyData[i]+',  100%, 50%, 0.8)';
    color1.style.backgroundColor = 'rgba('+frequencyData[100]*2.5+', '+frequencyData[250]*2.5+', '+frequencyData[500]*2.5+', 1)';
    span1.innerHTML = frequencyData[0];
    span2.innerHTML = frequencyData[200];
    span3.innerHTML = frequencyData[450];
    span4.innerHTML = frequencyData[i];
  }

  /* COMMENTAIRE - COMMENT CA FONCTIONNE

  frequencyData[0] = fréquence graves
  frequencyData[200-400+-] = fréquence moyennes
  frequencyData[400+] = fréquence très aigues
  Plus le brui est fort, plus les nombres enregistré à ces fréquences sont grand

  */

}

// getUserMedia success callback -> pipe audio stream into audio API
function gotStream(stream) {
    // Create an audio input from the stream.
    var audioSource = audioApi.createMediaStreamSource(stream);
    createAnalyserNode(audioSource);
    animateStuff();
}

// pipe in analysing to getUserMedia
navigator.getUserMedia(
  {audio:true},
  gotStream,
  function(err) {
    console.log("The following error occured: " + err);
  } 
);