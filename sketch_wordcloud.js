var songs;

var xVals = [];
var yVals = [];

var singleArt = [];
var albumArt = [];
var dataSet = [];

function preload(){
  songs = loadJSON("songs.json");
}

function setup() { 

  createCanvas(1200,1200);
  background('black');
  //console.log(songs.data[0].title);
  ellipseMode(CENTER);
  imageMode(CENTER);

  var allLyrics = "";

  for (var i=0; i<songs.data.length; i++){
    var placeholder = songs.data[i].lyrics;
    allLyrics = allLyrics + placeholder + " ";
  }

  var x_space = 30;
  var y_space = 15;
  var xcount = 2;
  var ycount = 2;

  fill('white');

  var freq = wordFreq(allLyrics);
  Object.keys(freq).sort().forEach(function(word) {
    //console.log("count of " + word + " is " + freq[word]);
    textSize(freq[word]*0.4);
    text(word, xcount*x_space, ycount*y_space);
    if (xcount*x_space< width) {
      xcount++;
    } else {
      xcount = 2;
      ycount++;
    }
  });

}

function draw() { 
  //subCanvasWidth = width * 0.8;


}

function wordFreq(string) {
    var words = string.replace(/[.]/g, '').split(/\s/);
    var freqMap = {};
    words.forEach(function(w) {
        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });

    return freqMap;
}
