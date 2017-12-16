var songs;
var test;

var total = 12;
var subCanvasWidth = 800;
var subCanvasHeight = 400;

var keys = ["C", "Db", "D", "D#", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]; //order matters!

var xVals = [];
var yVals = [];

var singleArt = [];
var albumArt = [];
var dataSet = [];

class dataPoint{
  constructor(songdata, artwork){
    
    //x-coordinate of data
    this.x = songdata.year - 2006;
    
    //y-coordinate
    this.songkey = songdata.key;
    this.y = checkKey(this.songkey);

    //color of data, depends on genre mix
    this.genre = songdata.genre;
    this.color = getColor(this.genre);

    //frequency of pulse, takes value from song's bpm
    this.bpm = songdata.bpm;
    this.freq = map(this.bpm, 50, 200, 0.05, 0.5);

    //size of data, depends on chart performance
    this.maxsize = 80 / map(songdata.peakchart, 1, 50, 1, 10);

    //save loaded image
    this.artwork = artwork;

    //showing?
    this.isGenreDisplaying = true;
    this.isBPMDisplaying = true;
  }
}

function preload(){
  songs = loadJSON("songs.json", loadArt);
}

function loadArt(songs){
    for (var i=0; i<songs.data.length; i++){
      singleArt.push(loadImage(songs.data[i].artwork));
      //albumArt.push(loadImage(songs.data[i].album.artwork));
  }
}

function setup() { 

  createCanvas(1200,800);
  //console.log(songs.data[0].title);
  ellipseMode(CENTER);
  //ellipseMode(RADIUS);
  imageMode(CENTER);

  for (var i=0; i<songs.data.length; i++){
    var newData = new dataPoint(songs.data[i], singleArt[i]);
    dataSet.push(newData);
  }

  sel1 = createSelect();
  sel1.option('all genre');
  sel1.option('pop');
  sel1.option('country');
  sel1.option('rock');
  sel1.changed(sel1Event);

  sel2 = createSelect();
  sel2.option('all beats');
  sel2.option('<100 BPM');
  sel2.option('100-150 BPM');
  sel2.option('>150 BPM');
  sel2.changed(sel2Event);
}

function draw() { 
  //subCanvasWidth = width * 0.8;
  background('black');
  
  stroke('white');
  strokeWeight(0.5);
  
  var baseline = height - height/6;
  var origin_x = (width/2) - (subCanvasWidth/2); //0 in the axis
  
  //line that follows mouse
  //stroke(50);
  //line(mouseX, 0, mouseX, height);
  
  //dataset highlighting
  var cd = 1000; //cd = closestdata. for highlighting purposes
  var closestDistance = 1000;
  var isDisplaying = false;

  /*****************************/
  //DRAW AXES

  //draw x-axis
  line(0, baseline, width, baseline);
  for (var i =0; i<total; i++){
    var w = subCanvasWidth / (total);
    var coord_x = w*i + origin_x + w/2;
    xVals.push(coord_x); //save coordinate for data set
    
    fill(200);
    ellipse(coord_x, baseline, 3,3);

    var year = 2006 + i;
    textAlign(CENTER);
    fill(200);
    noStroke();
    textSize(9);
    text(year, coord_x, baseline + 20);
  }

  //draw y-axis

  //line(origin_x, baseline, origin_x, baseline-subCanvasHeight);
  for (var j =0; j<keys.length; j++){
    var h = subCanvasHeight / (keys.length + 1);
    var coord_y = baseline - h*(j+1);
    yVals.push(coord_y); //save coordinate for data set
    
    //ellipse(origin_x, coord_y, 3,3);
    stroke(30);
    line(origin_x, coord_y, origin_x+subCanvasWidth, coord_y);

    textAlign(LEFT, CENTER);
    fill(200);
    noStroke();
    textSize(9);
    text(keys[j], origin_x - 30, coord_y);

  }
  
  /*****************************/
  //SELCTOR / LEGEND / KEY
  sel1.position(((width+subCanvasWidth)/2-150), baseline-subCanvasHeight-30);
  sel2.position(((width+subCanvasWidth)/2-280), baseline-subCanvasHeight-30);
  
  push();
  fill(85);
  textSize(9);
  text("lower chart\nposition", origin_x, baseline-subCanvasHeight-15);
  ellipse(origin_x + 60, baseline-subCanvasHeight-15, 5, 5);
  ellipse(origin_x + 80, baseline-subCanvasHeight-15, 18, 18);
  text("higher chart\nposition", origin_x + 100, baseline-subCanvasHeight-15);
  pop();



  /*****************************/
  //DRAW DATA SET
  
  //ellipse(width/2, height/2, 10, 10);
  //console.log(yVals); //check if coordinates are saved

  for (var k=0; k<songs.data.length; k++){
    var size = (sin(frameCount*dataSet[k].freq)*(dataSet[k].maxsize*0.1))+dataSet[k].maxsize;
    
    push();

    if(dataSet[k].isGenreDisplaying && dataSet[k].isBPMDisplaying){
      stroke(dataSet[k].color[0],dataSet[k].color[1],dataSet[k].color[2], 200);
    } else {
      stroke(dataSet[k].color[0],dataSet[k].color[1],dataSet[k].color[2], 50);
    }
    //stroke(dataSet[k].color[0],dataSet[k].color[1],dataSet[k].color[2], 200);
    strokeWeight(1);
    noFill();
    ellipse(xVals[dataSet[k].x], yVals[dataSet[k].y], size, size);
    pop();

    push();
    
    if(dataSet[k].isGenreDisplaying && dataSet[k].isBPMDisplaying){
      fill(dataSet[k].color[0],dataSet[k].color[1],dataSet[k].color[2], 200);
    } else {
      fill(dataSet[k].color[0],dataSet[k].color[1],dataSet[k].color[2], 50);
    }
    noStroke();
    ellipse(xVals[dataSet[k].x], yVals[dataSet[k].y], dataSet[k].maxsize*0.8, dataSet[k].maxsize*0.8);
    pop();
    //image(dataSet[k].artwork, xVals[dataSet[k].x], yVals[dataSet[k].y], dataSet[k].maxsize*0.8, dataSet[k].maxsize*0.8);
    
    //check which data point is closest to mouse position
    var distanceToMouse = dist(mouseX, mouseY, xVals[dataSet[k].x], yVals[dataSet[k].y]);
    if (distanceToMouse<=(dataSet[k].maxsize*0.8) && dataSet[k].isBPMDisplaying && dataSet[k].isGenreDisplaying){
      cd = k;
      //console.log(k);
    }
  }


  /*****************************/
  //DISPLAY INFO OF CLOSEST DATA POINT

  if (cd!=1000){
  
    var data_x = xVals[dataSet[cd].x];
    var data_y = yVals[dataSet[cd].y];
    var data_circle = dataSet[cd].maxsize*0.8;

    //put information in data point into variables
    var offset = 20;
    var boxsize = 120;
    var fs = 14; //fontsize

    var str_bpm = songs.data[cd].bpm.toString();
    var str_year = songs.data[cd].year.toString();
    var str_peakchart = songs.data[cd].peakchart.toString();
    var str_genre="";
    for (var l=0; l<songs.data[cd].genre.length; l++) {
      var placeholder = songs.data[cd].genre[l];
      str_genre = str_genre + placeholder + " ";
    }
    var str_majorminor="";
    if (songs.data[cd].isMajor){
      str_majorminor = "Major";
    } else {
      str_majorminor = "Minor";
    }

    //append all the info into one string
    var info = 
      songs.data[cd].title + " - " +
      str_year+ "\n" +
      "Album: " + songs.data[cd].album.title + "\n" +
      "BPM: " + str_bpm + "\n" +
      "Key: " + songs.data[cd].key + " " + str_majorminor + "\n" +
      "Genre: " + str_genre + "\n" +
      "Peak Chart Position (US): " + str_peakchart;

    //console.log(info);
    
    //START DRAWING HERE
    //display info of the song
    push();
    textAlign(LEFT, TOP);
    fill('white');
    noStroke();
    text(info, data_x + offset, data_y + offset);
    pop();

    //highlight the year and key of the song
    push();
    stroke(150);
    strokeWeight(0.5);
    line(data_x, data_y, data_x, baseline);
    line(origin_x, data_y, data_x, data_y);
    noStroke();
    fill(200);
    rect(data_x-20, baseline + 10, 40, 20); //box for year
    rect(origin_x-40, data_y-10, 30, 20); //box for key
    textSize(9);
    textStyle(BOLD);
    fill('black');
    textAlign(CENTER);
    text(songs.data[cd].year.toString(), data_x, baseline + 20);
    textAlign(LEFT);
    text(songs.data[cd].key.toString(), origin_x - 30, data_y);
    pop();

    image(dataSet[cd].artwork, data_x, data_y, data_circle, data_circle);
  
  }


}

function checkKey(key){
  var index;
  for (var i=0; i<keys.length; i++){
    if (key == keys[i]) {
      index = i;
    }
  }

  return index;
}

//GENRE SELECTOR
function sel1Event(){
  var term = sel1.value();
  //console.log("genre: "+term);


  for (var i=0; i<dataSet.length; i++){
    var isMatched = false;

    if (term == "all genre"){
      isMatched = true;
    } else {
      for (var j=0; j<dataSet[i].genre.length; j++){
        if (term == dataSet[i].genre[j]){
          isMatched = true;
        }
      }
    }
    
    dataSet[i].isGenreDisplaying = isMatched;
    //console.log("data set " + i + " " + dataSet[i].isGenreDisplaying);
  }
}

//BPM SELECTOR
function sel2Event(){
  var term = sel2.value();
  var minVal = 0;
  var maxVal = 1000;

  //console.log("BPM: "+term);

  switch(term){
      case "all beats":
      minVal = 0;
      maxVal = 1000;
      break;
      case "<100 BPM":
      minVal = 0;
      maxVal = 100;
      break;
      case "100-150 BPM":
      minVal = 101;
      maxVal = 150;
      break;
      case ">150 BPM":
      minVal = 151;
      maxVal = 1000;
      break;
  }

  for (var i=0; i<dataSet.length; i++){
    var isMatched = false;
    var bpm = dataSet[i].bpm;
    //console.log("data set "+ i + " bpm: " +bpm);
    
    if (bpm >= minVal && bpm <= maxVal){
      isMatched = true;
    }

    dataSet[i].isBPMDisplaying = isMatched;
    //console.log("data set " + i + " " + dataSet[i].isBPMDisplaying);
  }
}

function getColor(genre){

  var colVals = [0,0,0];
  var r = 0;
  var g = 0;
  var b = 0;

  //assign increment of RGB values based on genre
  for (var i=0; i<genre.length; i++){
    switch (genre[i]){
      case "pop":
        r += 234;
        g += 30;
        b += 104;
        break;
      case "rock":
        b += 150;
        break;
      case "country":
        r += 150;
        g += 150;
        break;
      case "dance":
        r += 150;
        g -= 100;
        b += 100;
        break;
      case "disco":
        r += 150;
        g -= 100;
        b += 100;
        break;
      case "electro":
        r += 150;
        g -= 100;
        b += 100;
        break;
      case "R&B":
        r += 100;
        g -= 150;
        b += 150;
        break;
    }
  }

  colVals[0] = constrain(r, 0, 255);
  colVals[1] = constrain(g, 0, 255);
  colVals[2] = constrain(b, 0, 255);

  return colVals;

}

function calculateDistance(x1, y1, x2, y2) {
  var xDist = x1 - x2;
  var yDist = y1 - y2;
  var distance = Math.sqrt((xDist*xDist) + (yDist*yDist));
  return distance;
} 
