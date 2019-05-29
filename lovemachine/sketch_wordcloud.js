var songs;

var stopwords = ["And", "and", "But", "but", "the", "The", "with", "With", "A", "a", "on", "On", "It", "it", "It's", "it's", "are", "Are", "At", "at", "For", "for","In", "in", "Is", "is", "Of", "of"];
var isIgnore = false;

function preload(){
  songs = loadJSON("songs.json");
}

function setup() { 

  createCanvas(1200,850);
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
    for (var k =0;k< stopwords.length; k++){
    	//console.log(stopwords[k]);
    	//var isIgnore = false;
    	if (word == stopwords[k]){
    		isIgnore = true;
    		//console.log(word + " is ignored!");
    	}
    }
    if (!isIgnore){
    	//console.log("HELLO");
	    textSize(freq[word]*0.5);
	    text(word, xcount*x_space, ycount*y_space);
	    if (xcount*x_space< width*0.9) {
	      xcount++;
	    } else {
	      xcount = 2;
	      ycount++;
	    }
	}
	isIgnore = false;
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
