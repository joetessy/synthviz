# SynthViz

[SynthViz](https://www.joetessy.life/synthviz "SynthViz") is a polyphonic dual oscillator synthesizer and audio visualizer.

![SynthViz Gif](./images/synthgif.gif)

## Technologies

SynthViz uses the Web Audio API to control the synthesizer and HTML5 canvas for displaying the audio visualization. It comes with preset sounds for users unfamiliar with electronic audio concepts.

### Computer Keyboard Mapping

The user can play the synthesizer keyboard by pushing keys on the computer keyboard. SynthViz will display the computer keys mapped on top of the piano keyboard. Users can switch to different keys by using the tune knob and the computer keys will re-map on the piano keyboard.

### Audio Visualization

The wave from of the audio from all voices and oscillators displays over the background of the application using HTML5 canvas.

### Synthesizer Controls

 The user can control the following parameters on the synthesizer:

- [ ] Oscillators types: sine, square, sawtooth, triangle waves.
- [ ] Oscillator octave
- [ ] Oscillator volume
- [ ] Envelope: attack, decay, sustain release,
- [ ] Vibrato LFO: speed, depth
- [ ] Tremolo LFO: speed, depth
- [ ] Low pass filter

The UI for synthesizer controls features [jQuery Knob](http://anthonyterrien.com/demo/knob/ "jQuery Knob"), a JavaScript library that provides simple visually aesthetic knob components.

## How It Works

### Synthesis

* ```context``` is the interface representing the audio processing graph built from the linked audio nodes. Created using Web Audio's ```new AudioContext()```.

* ```oscillator``` is an  Audio Source node preventing a periodic waveform. Users can set the oscillating frequency and type, such as sine, triangle, sawtooth, and square. Created using Web Audio's ```context.createOscillator()```.

* ``` amp ``` represents a ``GainNode``. The interface allows the user to adjust the gain value, or volume. Oscillators are attached to gain nodes, and gain nodes can be connected to audio destination or other audio nodes. In SynthViz, gain nodes are also used to control the change amplitude for vibrato (wave frequency) and tremolo (wave amplitude) LFOs. Created using Web Audio's ```context.createGain()```;

* ```biquadfilter``` represents a simple low order filter allowing the user to set a cutoff frequency for a sound. Created using Web Audio's ```context.createBiquadFilter()```

* ```envelope``` is an object that allows users to control the volume of a gain node. The the envelope is connected to the audio param amplitude of the node via its ```connect``` method, and allows the user to set the attack, decay, sustain, and release levels oscillator amplitude using methods ```setValueAtTime(value, time)``` and ```linearRampToValueAtTime(amplitude, now + attackTime)```

* ```compressor``` is a dynamics compressor node that compresses the audio. This is used to make the audio sound more full by removing dynamic range and avoiding clipping. Created using Web Audio's ```context.createDynamicsCompressor()```

* ```context.destination``` is representing the final destination of all audio in the context, represents an actual audio-rendering device such as your device's speakers or headphones.


### LFO, Vibrato and Tremolo

*  ```lfo``` is an oscillator node that is used to modulate oscillator settings instead of producing a new sound wave.

* ```lfo``` objects are connected to an ```lfoAmp```, an object representing a gain node setting the amplitude of modulation.  ```lfoAmp``` is then connected to the audio node to be modulating, either frequency for vibrato or sound amplitude for tremolo


### Voices - Polyphony

SynthViz is a polyphonic synthesizer and was created during a voice model. Voices represent a current sound With every key press, a new voice is created. With every key lift, the voice was removed. The voice lifecycle is below.

* A user presses a key and creates a voice. The voice will generate two oscillators. The oscillator frequency is set by the specific keyboard key press.

* Oscillator objects are connected to their own respective amps. Users can set the oscillator wave type using the UI.


* amps are connected to their own respective low pass filters. Users can control the filters cutoff frequency.

* an lfo object for controlling vibrato is connected to its own separate lfo amp. The lfo amp is conntected to the frequency audio param of both oscillators. Users can control the lfo frequency for the vibrato speed, and the lfoamp amplitude for vibrato depth.

* both filters are connected to their respective analyzer nodes, which provide sound info needed for visualization

* analyzer nodes are connected to volume, which is a higher level gain node

* the lfo oscillator and wave oscillators start and initiate sound. When the user lifts off the pressed key, all of the above nodes will disconnect and the voice will be deleted.

* Every voice hooks into a synth object that holds the volume node. The volume node is connected to a pressor, which is connected to the  context destination.

* The tremolo lfo is connected to its own tremolo lfo amp, which is connected to the gain of the final volume node. This is so the tremolo effect will occur over the whole keyboard, instead of individually for every key press.

### Audio Visualization

*  Each voice has an ```analyzer```, a Web Audio ```AnalyserNode``` that handles drawing the wave form

* ```VolumeNode.frequencyBinCount``` method returns half the value of the Fast Fourier Transform size, representing the number of data values needed for visualization. This is saved to the variable ```bufferLength```

* ```dataArray``` is set to a new unsigned byte array ```Uint8Array``` with the ```bufferLength``` passed in as an argument. The array's length is equal to the number of data values returned by ```frequencyBinCount```

* `volumeAnalyser.getByteTimeDomainData()` takes in the ```dataArray```, copying the current waveform or time-domain data into the unsigned byte array ```Uint8Array```

* Using canvas, bufferLength, and the time-domain data, we can draw segments of the wave for each point in the buffer at a specific height based on the data point value from the array. The ```a draw``` method is called recursively allowing us to see a visual representation of the audio signal in the form of an oscilloscope
