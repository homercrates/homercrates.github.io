 function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if(!audio) return;
    audio.currentTime = 0 // restarts audio if you press button fast it will stop sound and set time to 0 and start over
    audio.play();
    key.classList.add('playing');
  };

  function removeTransition(e){
    if(e.propertyName !== 'transform') return; // skip if not transform
    this.classList.remove('playing');
  };

  const keys = document.querySelectorAll('.key'); // going to make an array of the 8 kkeys in keys
  keys.forEach(key => key.addEventListener('transitionend', removeTransition));
  // each key is going to get an eventListener addded to it to listen for transition end.. if happens removeTransition function.

  window.addEventListener('keydown', playSound);

  