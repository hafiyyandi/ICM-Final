// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.




//Play with this to get back a larger or smaller blend of melodies
var numInterpolations = 4; //numInterpolations containing 32 notes

// generates an array where indices correspond to midi notes
var everyNote = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B,'.repeat(20).split(',').map( function(x,i) {
    return x + '' + Math.floor(i/12);
});

//returns the midi pitch value for the given note.
//returns -1 if not found
function toMidi(note) {
    return everyNote.indexOf(note);
}

var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ];

//convert midi number to musical note
function fromMidi (midi) {
  var name = CHROMATIC[midi % 12]
  var oct = Math.floor(midi / 12) - 1
  if (oct > 0){
    return name + oct
  } else return name + "4" //THIS IS A BAD WORKAROUND
  
}

//If you want to try out other melodies copy and paste any of these in https://github.....
var MELODY1 = { notes: [
    {pitch: toMidi('A3'), quantizedStartStep: 0, quantizedEndStep: 4},
    {pitch: toMidi('D4'), quantizedStartStep: 4, quantizedEndStep: 6},
    {pitch: toMidi('E4'), quantizedStartStep: 6, quantizedEndStep: 8},
    {pitch: toMidi('F4'), quantizedStartStep: 8, quantizedEndStep: 10},
    {pitch: toMidi('D4'), quantizedStartStep: 10, quantizedEndStep: 12},
    {pitch: toMidi('E4'), quantizedStartStep: 12, quantizedEndStep: 16},
    {pitch: toMidi('C4'), quantizedStartStep: 16, quantizedEndStep: 20},
    {pitch: toMidi('D4'), quantizedStartStep: 20, quantizedEndStep: 26},
    {pitch: toMidi('A3'), quantizedStartStep: 26, quantizedEndStep: 28},
    {pitch: toMidi('A3'), quantizedStartStep: 28, quantizedEndStep: 32}
]};

//you can also just put in the midi pitch note if you know it
var MELODY2 = { notes: [
    {pitch: 50, quantizedStartStep: 0, quantizedEndStep: 1},
    {pitch: 53, quantizedStartStep: 1, quantizedEndStep: 2},
    {pitch: 58, quantizedStartStep: 2, quantizedEndStep: 3},
    {pitch: 58, quantizedStartStep: 3, quantizedEndStep: 4},
    {pitch: 58, quantizedStartStep: 4, quantizedEndStep: 5},
    {pitch: 53, quantizedStartStep: 5, quantizedEndStep: 6},
    {pitch: 53, quantizedStartStep: 6, quantizedEndStep: 7},
    {pitch: 53, quantizedStartStep: 7, quantizedEndStep: 8},
    {pitch: 52, quantizedStartStep: 8, quantizedEndStep: 9},
    {pitch: 55, quantizedStartStep: 9, quantizedEndStep: 10},
    {pitch: 60, quantizedStartStep: 10, quantizedEndStep: 11},
    {pitch: 60, quantizedStartStep: 11, quantizedEndStep: 12},
    {pitch: 60, quantizedStartStep: 12, quantizedEndStep: 13},
    {pitch: 60, quantizedStartStep: 13, quantizedEndStep: 14},
    {pitch: 60, quantizedStartStep: 14, quantizedEndStep: 15},
    {pitch: 52, quantizedStartStep: 15, quantizedEndStep: 16},
    {pitch: 57, quantizedStartStep: 16, quantizedEndStep: 17},
    {pitch: 57, quantizedStartStep: 17, quantizedEndStep: 18},
    {pitch: 57, quantizedStartStep: 18, quantizedEndStep: 19},
    {pitch: 65, quantizedStartStep: 19, quantizedEndStep: 20},
    {pitch: 65, quantizedStartStep: 20, quantizedEndStep: 21},
    {pitch: 65, quantizedStartStep: 21, quantizedEndStep: 22},
    {pitch: 57, quantizedStartStep: 22, quantizedEndStep: 23},
    {pitch: 57, quantizedStartStep: 23, quantizedEndStep: 24},
    {pitch: 57, quantizedStartStep: 24, quantizedEndStep: 25},
    {pitch: 57, quantizedStartStep: 25, quantizedEndStep: 26},
    {pitch: 62, quantizedStartStep: 26, quantizedEndStep: 27},
    {pitch: 62, quantizedStartStep: 27, quantizedEndStep: 28},
    {pitch: 65, quantizedStartStep: 28, quantizedEndStep: 29},
    {pitch: 65, quantizedStartStep: 29, quantizedEndStep: 30},
    {pitch: 69, quantizedStartStep: 30, quantizedEndStep: 31},
    {pitch: 69, quantizedStartStep: 31, quantizedEndStep: 32}
]};


// go to https://goo.gl/magenta/musicvae-checkpoints to see more checkpoint urls
// try the 500mb mel_big for a really smooth interpolation
// var melodiesModelCheckPoint = 'https://storage.googleapis.com/download.magenta.tensorflow.org/models/music_vae/dljs/mel_big';
var melodiesModelCheckPoint = './data/mel_small';

// musicvae is trained on sequences of notes that are 2 bars, so 32 note per sequences.
// Input needs to be the the same format
var NUM_STEPS = 32; // DO NOT CHANGE.
var interpolatedNoteSequences;

var sequencesArray = [];
var synth = new Tone.Synth().toMaster();

//TRACK 0 SYNTH
var synth2 = new Tone.PolySynth(6, Tone.Synth, {
    "oscillator" : {
        "partials" : [0, 2, 4, 6],
    }
}).toMaster();

var part;
var part2;
var part3;

//Uses promises to chain together asynchronous operations.
//Check out https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises for info on promises
new musicvae.MusicVAE(melodiesModelCheckPoint)
    .initialize()
    .then(function(musicVAE) {
        //blends between the given two melodies and returns numInterpolations note sequences
        // MELODY1 = musicVAE.sample(1, 0.5)[0]; //generates 1 new melody with 0.5 temperature. More temp means crazier melodies
        return musicVAE.interpolate([MELODY1, MELODY2], numInterpolations);
    })
    .then(function(noteSequences) {
        var text = 'Click to Play a blend from Melody 1 to Melody 2 in ' + numInterpolations + ' interpolations';
        document.querySelector('.loading').innerHTML = text;
        interpolatedNoteSequences = noteSequences;

        //hafi
        console.log(interpolatedNoteSequences);
        storeIntoArray(interpolatedNoteSequences);
    });


//format: pitch, startTime, duration
function storeIntoArray(inter_array){

    for (var i = 0; i< inter_array.length; i++){
        var tempArray = [];
        for (var j = 0; j < inter_array[i].notes.length; j++){
            var pitch = fromMidi(inter_array[i].notes[j].pitch);
            // var time = Tone.Transport.toSeconds('8n') * inter_array[i].notes[j].quantizedStartStep;
            // var duration = Tone.Transport.toSeconds('8n') * ((inter_array[i].notes[j].quantizedEndStep - inter_array[i].notes[j].quantizedStartStep) || 1);
            var time = 0.12 * inter_array[i].notes[j].quantizedStartStep;
            var duration = 0.12 * ((inter_array[i].notes[j].quantizedEndStep - inter_array[i].notes[j].quantizedStartStep) || 1);
            var note = {
                'pitch' : pitch,
                'time' : time,
                'duration': duration

            }
            tempArray.push(note);
        }
        sequencesArray.push(tempArray);
    }
    console.log(sequencesArray);
    console.log("STORING DONE!");

    //format: pitch, startTime, duration
    part = new Tone.Part(function(time, value){
        //the notes given as the second element in the array
        //will be passed in as the second argument
        //h_playNote(value.pitch, value.startTime, value.duration);
        //synth.triggerAttackRelease(toMidi(value.pitch), "8n", Tone.Transport.toSeconds('8n') * (value.startTime));
        synth.triggerAttackRelease(value.pitch, value.duration, time);
        }, sequencesArray[0]);

    //part.start();
    //console.log(part.length);
    //console.log(part.state);

    part2 = new Tone.Part(function(time, value){
        //the notes given as the second element in the array
        //will be passed in as the second argument
        
        h_playNote(value.pitch, time, value.duration);
        //synth.triggerAttackRelease(value.pitch, value.duration, time);
        }, sequencesArray[0]);

    //part2.start();
    console.log(part2.length);
    //part2.loop = true;

    part3 = new Tone.Part(function(time, value){
        //the notes given as the second element in the array
        //will be passed in as the second argument
        
        h_playNote(value.pitch, time, value.duration);
        //synth.triggerAttackRelease(value.pitch, value.duration, time);
        }, sequencesArray[0]);

    //part3.start();
    console.log(part3.length);
    //part2.loop = true;
    //Tone.Transport.start();
 
}

///////////////////////////////
//TONE.js setup for audio play back
var samplesPath = 'https://storage.googleapis.com/melody-mixer/piano/';
var samples = {};
var NUM_NOTES = 88;
var MIDI_START_NOTE = 21;
for (var i = MIDI_START_NOTE; i < NUM_NOTES + MIDI_START_NOTE; i++) {
  samples[i] = samplesPath + i + '.mp3';
}

var players = new Tone.Players(samples, function onPlayersLoaded(){
    console.log("Tone.js players loaded");
}).toMaster();


function playNote(midiNote, numNoteHolds){
    var duration = Tone.Transport.toSeconds('8n') * (numNoteHolds || 1);
    //console.log("pitch: "+midiNote);
    console.log("duration: "+duration);
    var player = players.get(midiNote);
    player.fadeOut = 0.05;
    player.fadeIn = 0.01;
    player.start(Tone.now(), 0, duration);
}

function h_playNote(midiNote, startTime, numNoteHolds){
    //console.log(midiNote);
    //console.log(Tone.Transport.toSeconds('8n'));
    var duration = Tone.Transport.toSeconds('16n') * (numNoteHolds || 1);
    var startTime = Tone.Transport.toSeconds('16n') * (startTime);
    var player = players.get(toMidi(midiNote));
    player.fadeOut = 0.05;
    player.fadeIn = 0.01;
    //player.start(startTime, 0, duration);
    player.start(Tone.now(), 0, numNoteHolds);
    //player.start(startTime, 0, numNoteHolds);
}

var sequenceIndex = -1;
var stepIndex = -1;

///////////////////////////////
//p5.js setup
var TILE_SIZE = 150;
var WIDTH = TILE_SIZE * numInterpolations;
var HEIGHT = 170;
var START_COLOR;
var END_COLOR;


//HAFI's MODIF
var selectedBlock = 1;
var totalPlayTime;
var sequenceLength;
var startPoint;
var endPoint;

function setup() {
    createCanvas(WIDTH , HEIGHT);
    START_COLOR = color(60, 180, 203);
    END_COLOR = color(233, 72, 88);
    
    //HAFI'S MODIF, made it so it loops within selected sequence
    totalPlayTime = (Tone.Transport.bpm.value * NUM_STEPS * numInterpolations) / 1000;
    console.log(totalPlayTime);
    sequenceLength = totalPlayTime/numInterpolations;
    // startPoint = selectedBlock * sequenceLength;
    // endPoint = (selectedBlock+1) * sequenceLength;

    // Tone.Transport.loop = true;
    // Tone.Transport.seconds = startPoint;
    // Tone.Transport.setLoopPoints(startPoint, endPoint);
    
    noStroke();
}

function draw() {
    //here we calculate the percentage through melodies, between 0-1

    //var totalPlayTime = (Tone.Transport.bpm.value * NUM_STEPS * numInterpolations) / 1000;
    var percent = Tone.Transport.seconds / totalPlayTime % 1;

    //console.log(Tone.Transport.seconds);
    
    //here we calculate the index of interpolatedNoteSequences
    //and currStepIndex is the note between 0-31 of that playback
    
    var currSequenceIndex = Math.floor(percent * numInterpolations);
    var currStepIndex = Math.floor((percent * numInterpolations - currSequenceIndex) * NUM_STEPS);

    //HAFI'S MODIFICATION
    // currSequenceIndex = 0;

    // if (currStepIndex>31){
    //     currStepIndex = 0;
    // }

    function isCurrentStep(note) {
        return note.quantizedStartStep === currStepIndex;
    }
    if(Tone.Transport.state === 'started') { //playback started
        if(currStepIndex != stepIndex) {
            //here we search through all notes and find any that match our current step index
            var notes = interpolatedNoteSequences[currSequenceIndex].notes.filter(isCurrentStep);
            notes.forEach(function(note) {
                var noteDuration = note.quantizedEndStep - note.quantizedStartStep;
                //console.log("noteDur: "+noteDuration);
                //playNote(note.pitch, noteDuration);
            });
        }
        sequenceIndex = currSequenceIndex;
        stepIndex = currStepIndex;
    }

    //Draw Tiles + Notes
    //Drawing Tiles + notes
    background(38);
    for(var i = 0; i < numInterpolations; i++){
        var x = i * TILE_SIZE;
        var y = HEIGHT-TILE_SIZE;
        var currColor = lerpColor(START_COLOR, END_COLOR, i / numInterpolations);
        //use currColor but at 50% opacity
        fill(red(currColor), green(currColor), blue(currColor), 125);
        rect(x, y, TILE_SIZE, TILE_SIZE);
        fill(currColor);
        if(interpolatedNoteSequences){
            drawNotes(interpolatedNoteSequences[i].notes, x, y, TILE_SIZE, TILE_SIZE);
        }

    }
    fill(255, 64);
    rect(percent * WIDTH, 0, TILE_SIZE / NUM_STEPS, HEIGHT);
    text(sequenceIndex + " - " + currStepIndex, 15, 15);
}

function mousePressed() {
    if(!interpolatedNoteSequences) {
        return;
    }
    var loadingSpan = document.querySelector('.loading');
    if(Tone.Transport.state === 'started') {

        console.log ("STOP!");
        Tone.Transport.stop();
        loadingSpan.innerHTML = 'Play';
    } else {

        Tone.Transport.start();
        part3.start();
        //part2.start();
        //console.log(part2.state);
        
        //Tone.Transport.seconds = startPoint;
        loadingSpan.innerHTML = 'Pause';
    }
}

function drawNotes(notes, x, y, width, height) {
    push();
    translate(x, y);
    var cellWidth = width / NUM_STEPS;
    var cellHeight = height / NUM_NOTES;
    notes.forEach(function(note) {
        var emptyNoteSpacer = 1;
        rect(emptyNoteSpacer + cellWidth * note.quantizedStartStep, height - cellHeight * (note.pitch-MIDI_START_NOTE),
            cellWidth * (note.quantizedEndStep - note.quantizedStartStep) - emptyNoteSpacer, cellHeight);
    });
    pop();
}
