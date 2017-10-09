import { synthView } from './synth_view.js';

window.synthView = synthView;
document.addEventListener('DOMContentLoaded', function(){
  synthView.start();
});
