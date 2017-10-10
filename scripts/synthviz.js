import { synthView } from './synth_view.js';

window.synthView = synthView;
window.synth = synthView.synth;
window.envelope = window.synth.envelope;
document.addEventListener('DOMContentLoaded', function(){
  synthView.start();
});
