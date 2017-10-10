import { synthView } from './synth_view.js';

window.synthView = synthView;
window.synth = synthView.synth;
document.addEventListener('DOMContentLoaded', function(){
  $(function() {
      $(".dial").knob();
  });
  synthView.start();
});
