  
let brownNoiseNode = null;
let toggleButton = document.querySelector('.brown-noise2');
let isPlaying = false;
let audioContext;
let filterNode = null;

document.addEventListener('DOMContentLoaded', (event) => {

  toggleButton.addEventListener('click', async () => {
      
    if (!audioContext){
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.audioWorklet.addModule('/brown.js');
    }
    
      if (isPlaying) {
        if (brownNoiseNode != null){
            brownNoiseNode.disconnect();
            brownNoiseNode = null;
        }

        //gain
        if (gainNode != null){
            gainNode.disconnect();
            gainNode = null;
        }

          //unmute icon svg
          toggleButton.innerHTML = unmuteIcon;
          isSoundOn = false;
          

      } else {
          brownNoiseNode = new AudioWorkletNode(audioContext, 'brown-noise-processor');

          //gain
          gainNode = audioContext.createGain();

          // online only volume control
          if (isOnline == true){
            gainNode.gain.value = currentTemp * (-1/12) + 3;
          }

          //lowpass filter
          filterNode = audioContext.createBiquadFilter();
          filterNode.type = 'lowpass';
          filterNode.frequency.value = 4000;

          brownNoiseNode.connect(filterNode).connect(gainNode).connect(audioContext.destination);

          //mute icon svg
          toggleButton.innerHTML = muteIcon;
          isSoundOn = true;
      }
      isPlaying = !isPlaying;
  });

})



  let unmuteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16"><path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
  <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/></svg>`

  let muteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/></svg>`