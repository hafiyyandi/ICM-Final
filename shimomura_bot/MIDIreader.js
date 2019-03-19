//READ INPUT FROM MIDI KEYBOARD
var timer=0;
var timeInterval;
var input = "";

var isFirstNote = true;
var hearInterval;
var hearDuration = 2000;

//synth for keys pressed
var synth_m = new Tone.PolySynth(6, Tone.Synth, {
    "oscillator" : {
        "partials" : [0, 2, 3, 4],
    }
}).toMaster();

if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
} else {
    console.log('WebMIDI is not supported in this browser.');
}

navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    console.log(midiAccess);

    for (var input of midiAccess.inputs.values()){
        input.onmidimessage = getMIDIMessage;
    }
}

function getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // noteOn
            if (velocity > 0) {
                noteOn(note);
                //console.log (note);
            } else {
                noteOff(note);
                //console.log("off!");
            }
            break;
        case 128: // noteOff
            noteOff(note);
            //console.log("off!");
            break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
}


function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

function noteOn(note){
    //play note
    var m_note = fromMidi(note);
    synth_m.triggerAttack(m_note);
    //write1Shape(note);
    //console.log(note + " ON!");
    timerInterval = setInterval(function(){
          timer += 1;
    }, 1);

    //Listen for 2 seconds, then start generating
    if (isFirstNote){
        isFirstNote = false;
        document.getElementById("status").innerHTML = "LISTENING...";
        hearInterval = setTimeout(function(){
            isFirstNote = true;
            console.log(seed);
            generateResponse();
        }, hearDuration);
    }

}

function noteOff(note){

    //release note
    var m_note = fromMidi(note);
    synth_m.triggerRelease(m_note);

    //console.log(note + " OFF!");
    clearInterval(timerInterval);
    console.log("duration: "+ timer);

    //save input note
    var i_note = "n_"+note;
    var i_dur = "_d"+timer+" ";
    
    input = input+i_note+i_dur;
    console.log(input);

    timer = 0;
}


