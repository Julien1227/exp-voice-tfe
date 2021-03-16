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

// get's html elements, loops over them & attaches a frequency from analysed data - what you do is up to you!
function animateStuff() {
  requestAnimationFrame(animateStuff);
  analyserNode.getByteFrequencyData(frequencyData);
  
  // Animation stuff--------------------------------
  var allRepeatedEls = document.getElementsByTagName('i');
  var totalEls = allRepeatedEls.length;

  // Simple example of changing opacity & colour -> EDIT THIS!
  for (var i=0; i<totalEls; i++) {
    // set colours
    var lightColour = i*10;
    allRepeatedEls[i].style.backgroundColor = 'hsla('+lightColour+',  80%, 50%, 0.8)';
    allRepeatedEls[i].style.borderColor = 'hsla('+lightColour+',  80%, 50%, 1)';
    // flash on frequency
    var freqDataKey = i*2;
    if (frequencyData[freqDataKey] > 100){
      // frequency played - make opache
      allRepeatedEls[i].style.opacity = "1";
    } else {
      // frequency not played - fade out
      allRepeatedEls[i].style.opacity = "0.2";
    }
  }
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