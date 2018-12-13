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
var numInterpolations = 8; //numInterpolations containing 32 notes


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
var interpolatedNoteSequences2;

var sequencesArray = []; //stores interpolated sequences into a format friendly for Tone.part
var sequencesArray2 = [];

//!------ SYNTHS ------!\\
var synth1 = new Tone.MembraneSynth({
            "pitchDecay" : 0.008,
            "octaves" : 2,
            "envelope" : {
                "attack" : 0.0006,
                "decay" : 0.5,
                "sustain" : 0.5
            }
        }).toMaster();

var synth2 = new Tone.PolySynth(6, Tone.Synth, {
    "oscillator" : {
        "partials" : [0, 2, 4, 6],
    }
}).toMaster();

synth2.set("volume", -6);

//!------ PREDECLARE Tone.Part? ------!\\
var toneParts = []; //do multiple for multiple rows?
var toneParts2 = [];

///////////////////////////////
//TONE.js setup for audio play back
var samplesPath = 'https://storage.googleapis.com/melody-mixer/piano/';
var samples = {};
var NUM_NOTES = 88;
var MIDI_START_NOTE = 21;

var isPartsInitialized = false;
var isPartsInitialized2 = false;

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
        storeIntoArray(1,interpolatedNoteSequences);
        //Tone.Transport.start();
    });

new musicvae.MusicVAE(melodiesModelCheckPoint)
    .initialize()
    .then(function(musicVAE) {
        //blends between the given two melodies and returns numInterpolations note sequences
        // MELODY1 = musicVAE.sample(1, 0.5)[0]; //generates 1 new melody with 0.5 temperature. More temp means crazier melodies
        return musicVAE.interpolate([MELODY1, MELODY2], numInterpolations);
    })
    .then(function(noteSequences) {
        var text = 'Click to Play a blend from Melody 1 to Melody 2 in ' + numInterpolations + ' interpolations 2';
        document.querySelector('.loading').innerHTML = text;
        interpolatedNoteSequences2 = noteSequences;

        //!-- HAFI's addition
        console.log("interpolating 2");
        console.log(interpolatedNoteSequences2);
        storeIntoArray(2,interpolatedNoteSequences2);
        Tone.Transport.start();
    });



//!-- PARSE INTERPOLATED SEQUENCES INTO A FORMAT FRIENDLY FOR TONE.PART
function storeIntoArray(index, inter_array){
    for (var i = 0; i< inter_array.length; i++){
        var tempArray = [];
        for (var j = 0; j < inter_array[i].notes.length; j++){
            
            if (index == 1) { // 1 is melody
                var pitch = inter_array[i].notes[j].pitch;
                var time = oneNoteDur * inter_array[i].notes[j].quantizedStartStep;
                var duration = oneNoteDur * ((inter_array[i].notes[j].quantizedEndStep - inter_array[i].notes[j].quantizedStartStep) || 1);
            } else if (index == 2) { // 2 is... baseline?
                var pitch = inter_array[i].notes[j].pitch;
                var time = 2 * oneNoteDur * inter_array[i].notes[j].quantizedStartStep;
                var duration = 2 * oneNoteDur * ((inter_array[i].notes[j].quantizedEndStep - inter_array[i].notes[j].quantizedStartStep) || 1);     
            }

            var note = {
                'pitch' : pitch,
                'time' : time,
                'duration': duration

            }
            tempArray.push(note);
        }
        if (index == 1){
            sequencesArray.push(tempArray);
        } else if (index == 2){
            sequencesArray2.push(tempArray);
        }
        
    }
    
    //console.log(sequencesArray);
    console.log("STORING INTERPOLATED SEQUENCES DONE! " + index);
    
    if (index == 1){
        initialize_Parts();
    } else if (index == 2){
        initialize_Parts2();
    }
    
}

function initialize_Parts(){
    console.log("CREATING TONE.PART FOR EACH SEQUENCE in 1");
    for (var i = 0; i < sequencesArray.length; i++){
        var part = new Tone.Part(function(time, value){

            //h_playNote(value.pitch, time, value.duration);
            synth2.triggerAttackRelease(fromMidi(value.pitch), value.duration, time);

            }, sequencesArray[i]);
        toneParts.push(part);
        console.log(toneParts[i].length);

        toneParts[i].loop = true;
        toneParts[i].loopEnd = oneNoteDur * NUM_STEPS;
        console.log("<1> CREATED Part FOR SEQUENCE: "+ i);
    }
    isPartsInitialized = true;
}

function initialize_Parts2(){
    console.log("CREATING TONE.PART FOR EACH SEQUENCE in 2");
    for (var i = 0; i < sequencesArray2.length; i++){
        var part = new Tone.Part(function(time, value){

            //h_playNote(value.pitch, time, value.duration);
            synth1.triggerAttackRelease(fromMidi(value.pitch), value.duration, time);

            }, sequencesArray2[i]);
        toneParts2.push(part);
        console.log(toneParts2[i].length);

        toneParts2[i].loop = true;
        toneParts2[i].loopEnd = 2 * oneNoteDur * NUM_STEPS;
        console.log("<2> CREATED Part FOR SEQUENCE: "+ i);
    }
    isPartsInitialized2 = true;
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
var START_COLOR2;
var END_COLOR2;
var tiles = [];
var tiles2 = [];

//HAFI's MODIF
var selectedBlock = 1;

function setup() {
    createCanvas(WIDTH , HEIGHT*2 + 20);
    START_COLOR = color(60, 180, 203);
    END_COLOR = color(233, 72, 88);
    START_COLOR2 = color(0, 0, 203);
    END_COLOR2 = color(0, 72, 88);
    noStroke();
    initializeTiles();
}

function draw() {
    //console.log( mouseX+ " , " + mouseY);
    //Draw Tiles + Notes
    //Drawing Tiles + notes
    background(0);
    for(var i = 0; i < numInterpolations; i++){
        //use currColor but at 50% opacity
        fill(red(tiles[i].currColor), green(tiles[i].currColor), blue(tiles[i].currColor), 255);
        rect(tiles[i].x, tiles[i].y, TILE_SIZE, TILE_SIZE);
        
        fill(red(tiles2[i].currColor), green(tiles2[i].currColor), blue(tiles2[i].currColor), 180);
        rect(tiles2[i].x, tiles2[i].y, TILE_SIZE, TILE_SIZE);
        
        if (isPartsInitialized){ //draw progress of sequence
            fill(255,255,255,125);
            rect(tiles[i].x, tiles[i].y, TILE_SIZE*toneParts[i].progress, TILE_SIZE);
        }

        if (isPartsInitialized2){ //draw progress of sequence
            fill(255,255,255,125);
            rect(tiles2[i].x, tiles2[i].y, TILE_SIZE*toneParts2[i].progress, TILE_SIZE);
        }

        fill('white');
        if(interpolatedNoteSequences){
            drawNotes(interpolatedNoteSequences[i].notes, tiles[i].x, tiles[i].y, TILE_SIZE, TILE_SIZE);
        }

        fill('white');
        if(interpolatedNoteSequences2){
            drawNotes(interpolatedNoteSequences2[i].notes, tiles2[i].x, tiles2[i].y, TILE_SIZE, TILE_SIZE);
        }

    }
    fill(255, 64);
}

function mousePressed() {
    if(!interpolatedNoteSequences && !interpolatedNoteSequences2) {
        return;
    }

    for (var i = 0; i < numInterpolations; i++){
        var isWithinX = ((mouseX > tiles[i].x) && (mouseX < tiles[i].x + TILE_SIZE));
        var isWithinY = ((mouseY > tiles[i].y) && (mouseY < tiles[i].y + TILE_SIZE));
        if (isWithinX && isWithinY){
            console.log("<1> clicked on tile: "+i);
            switchTile(i);
        }
    }

    for (var i = 0; i < numInterpolations; i++){
        var isWithinX = ((mouseX > tiles2[i].x) && (mouseX < tiles2[i].x + TILE_SIZE));
        var isWithinY = ((mouseY > tiles2[i].y) && (mouseY < tiles2[i].y + TILE_SIZE));
        if (isWithinX && isWithinY){
            console.log("<2> clicked on tile: "+i);
            switchTile2(i);
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

function switchTile2(i){
    if (tiles2[i].isPlaying){
        console.log("STOPPING: "+i);
        toneParts2[i].stop();
    } else {
        console.log("PLAYING: "+i);
        toneParts2[i].start();
    }
    tiles2[i].isPlaying = !tiles2[i].isPlaying;

}

function initializeTiles(){
    for(var i = 0; i < numInterpolations; i++){
        var x = i * TILE_SIZE;
        
        var y = HEIGHT-TILE_SIZE;
        var y2 = HEIGHT + 20;

        var currColor = lerpColor(START_COLOR, END_COLOR, i / numInterpolations);
        var currColor2 = lerpColor(START_COLOR2, END_COLOR2, i / numInterpolations);

        tiles.push({
            x : x,
            y : y,
            currColor : currColor,
            isPlaying : false,
            isHovered : false
        });
        tiles2.push({
            x : x,
            y : y2,
            currColor : currColor2,
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
