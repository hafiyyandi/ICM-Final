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
var numInterpolations = 5; //numInterpolations containing 32 notes


var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ];
//convert midi number to musical note
function fromMidi (midi) {
  var name = CHROMATIC[midi % 12]
  var oct = Math.floor(midi / 12) - 1
  if (oct > 0){
    return name + oct
  } else return name + "4" //THIS IS A BAD WORKAROUND
  
}

// go to https://goo.gl/magenta/musicvae-checkpoints to see more checkpoint urls
// try the 500mb mel_big for a really smooth interpolation
// var melodiesModelCheckPoint = 'https://storage.googleapis.com/download.magenta.tensorflow.org/models/music_vae/dljs/mel_big';
var melodiesModelCheckPoint = './data/mel_small';

// musicvae is trained on sequences of notes that are 2 bars, so 32 note per sequences.
// Input needs to be the the same format
var NUM_STEPS = 32; // DO NOT CHANGE.
var interpolatedNoteSequences; //!-- MIGHT NEED TO DO SEVERAL OF THESE

var sequencesArray = []; //stores interpolated sequences into a format friendly for Tone.part

//!------ SYNTHS ------!\\
var synth1 = new Tone.MembraneSynth({
            "pitchDecay" : 0.008,
            "octaves" : 2,
            "envelope" : {
                "attack" : 0.0006,
                "decay" : 0.5,
                "sustain" : 0
            }
        }).toMaster();

var synth2 = new Tone.PolySynth(6, Tone.Synth, {
    "oscillator" : {
        "partials" : [0, 2, 4, 6],
    }
}).toMaster();

//!------ PREDECLARE Tone.Part? ------!\\
var toneParts = []; //do multiple for multiple rows?

///////////////////////////////
//TONE.js setup for audio play back
var samplesPath = 'https://storage.googleapis.com/melody-mixer/piano/';
var samples = {};
var NUM_NOTES = 88;
var MIDI_START_NOTE = 21;

var isPartsInitialized = false;

//!--Player: play a note using sample
for (var i = MIDI_START_NOTE; i < NUM_NOTES + MIDI_START_NOTE; i++) {
  samples[i] = samplesPath + i + '.mp3';
}

var players = new Tone.Players(samples, function onPlayersLoaded(){
    console.log("Tone.js players loaded");
}).toMaster();

//!--CUSTOM FUNCTION CALLED BY TONE.PART, TO PLAY PLAYER
function h_playNote(midiNote, startTime, duration){
    var player = players.get(midiNote);
    player.fadeOut = 0.05;
    player.fadeIn = 0.01;
    player.start(Tone.now(), 0, duration);
}

//variables needed to adjust duration in playback
var totalPlayTime = (Tone.Transport.bpm.value * NUM_STEPS * numInterpolations) / 1000;
var oneNoteDur = totalPlayTime / (NUM_STEPS * numInterpolations);

//////////////////////////////////
//INTERPOLATION HAPPENS HERE. DO MULTIPLE???
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

        //!-- HAFI's addition
        console.log("interpolating 1");
        console.log(interpolatedNoteSequences);
        storeIntoArray(interpolatedNoteSequences);
        Tone.Transport.start();
    });


//!-- PARSE INTERPOLATED SEQUENCES INTO A FORMAT FRIENDLY FOR TONE.PART
function storeIntoArray(inter_array){
    for (var i = 0; i< inter_array.length; i++){
        var tempArray = [];
        for (var j = 0; j < inter_array[i].notes.length; j++){
            var pitch = inter_array[i].notes[j].pitch;
            // var time = Tone.Transport.toSeconds('8n') * inter_array[i].notes[j].quantizedStartStep;
            // var duration = Tone.Transport.toSeconds('8n') * ((inter_array[i].notes[j].quantizedEndStep - inter_array[i].notes[j].quantizedStartStep) || 1);
            var time = oneNoteDur * inter_array[i].notes[j].quantizedStartStep;
            var duration = oneNoteDur * ((inter_array[i].notes[j].quantizedEndStep - inter_array[i].notes[j].quantizedStartStep) || 1);
            
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
    console.log("STORING INTERPOLATED SEQUENCES DONE!");
    initialize_Parts();
}

function initialize_Parts(){
    console.log("CREATING TONE.PART FOR EACH SEQUENCE");
    for (var i = 0; i < sequencesArray.length; i++){
        var part = new Tone.Part(function(time, value){

            //h_playNote(value.pitch, time, value.duration);
            synth1.triggerAttackRelease(fromMidi(value.pitch), value.duration, time);

            }, sequencesArray[i]);
        toneParts.push(part);
        console.log(toneParts[i].length);

        toneParts[i].loop = true;
        toneParts[i].loopEnd = oneNoteDur * NUM_STEPS;
        console.log("CREATED Part FOR SEQUENCE: "+ i);
    }
    isPartsInitialized = true;
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
var tiles = [];

//HAFI's MODIF
var selectedBlock = 1;

function setup() {
    createCanvas(WIDTH , HEIGHT);
    START_COLOR = color(60, 180, 203);
    END_COLOR = color(233, 72, 88);
    noStroke();
    initializeTiles();
}

function draw() {

    //Draw Tiles + Notes
    //Drawing Tiles + notes
    background(38);
    for(var i = 0; i < numInterpolations; i++){
        //use currColor but at 50% opacity
        fill(red(tiles[i].currColor), green(tiles[i].currColor), blue(tiles[i].currColor), 180);
        rect(tiles[i].x, tiles[i].y, TILE_SIZE, TILE_SIZE);
        
        if (isPartsInitialized){ //draw progress of sequence
            fill(255,255,255,125);
            rect(tiles[i].x, tiles[i].y, TILE_SIZE*toneParts[i].progress, TILE_SIZE);
        }

        fill(tiles[i].currColor);
        if(interpolatedNoteSequences){
            drawNotes(interpolatedNoteSequences[i].notes, tiles[i].x, tiles[i].y, TILE_SIZE, TILE_SIZE);
        }

    }
    fill(255, 64);
    //rect(percent * WIDTH, 0, TILE_SIZE / NUM_STEPS, HEIGHT);
    //text(sequenceIndex + " - " + currStepIndex, 15, 15);
}

function mousePressed() {
    if(!interpolatedNoteSequences) {
        return;
    }

    for (var i = 0; i < numInterpolations; i++){
        var isWithinX = ((mouseX > tiles[i].x) && (mouseX < tiles[i].x + TILE_SIZE));
        var isWithinY = ((mouseY > tiles[i].y) && (mouseY < tiles[i].y + TILE_SIZE));
        if (isWithinX && isWithinY){
            console.log("clicked on tile: "+i);
            switchTile(i);
        }
    }

}

function switchTile(i){
    if (tiles[i].isPlaying){
        console.log("STOPPING: "+i);
        toneParts[i].stop();
    } else {
        console.log("PLAYING: "+i);
        toneParts[i].start();
    }
    tiles[i].isPlaying = !tiles[i].isPlaying;

}

function initializeTiles(){
    for(var i = 0; i < numInterpolations; i++){
        var x = i * TILE_SIZE;
        var y = HEIGHT-TILE_SIZE;
        var currColor = lerpColor(START_COLOR, END_COLOR, i / numInterpolations);
        tiles.push({
            x : x,
            y : y,
            currColor : currColor,
            isPlaying : false,
            isHovered : false
        });
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
