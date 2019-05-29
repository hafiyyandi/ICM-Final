var lastTimeCheck = 0;
var stampSpeed = 1000; // how fast the sketch
                       // samples the video's color
var drawIndex = 0;
var lineWeight = 1;

var blackBar = 5; //fill this number if the video has black bars

var videos;
//var videoData = [];
var playingVideo = [];
var mvDataSet = [];
//var baseVideoWidth = 120;

var subCanvasWidth = 1000;
var origin_y;
var origin_x;
var padding = 30;

var rad = 10;

var number = 2;
var start = 0;
//var end = 4;
//var offset = 0;

var button;

class mvData{
  constructor (mv){
    this.title = mv.title;
    this.year = mv.year;
    this.views = mv.views;
    this.album = mv.album;
    this.width = constrain((this.views / 2000000), 100, 400); //video size depends on views
    //this.videoData = videodata;
  }
}

function preload(){
  videos = loadJSON("mv.json", loadVideos);
}

function loadVideos(videos){ //load 3 videos first
  for (var i=0; i<number; i++){
    var newVid = createVideo(videos.data[i].path);
    playingVideo.push(newVid);
    //videoData[i].hide();
  }
}

function setup() {
  createCanvas(1200,600);
  background("black");
  ellipseMode(CENTER);
  //rectMode(CENTER);
  
  origin_y = height/4;
  origin_x = (width/2) - (subCanvasWidth/2); //0 in the axis

  button = createButton('next videos');
  button.position(((width+subCanvasWidth)/2)-50, origin_y-60);
  button.mousePressed(nextVid);

  push();
  stroke(150);
  strokeWeight(0.5);
  line(0, origin_y-10, width, origin_y-10);
  pop();
  //origin_x = 20;

  //create new objects for ALL mv data
  for (var i=0; i<videos.data.length; i++){
     var newData = new mvData(videos.data[i]);
     mvDataSet.push(newData);
  }

  //resize & position the videos //INDEX ADJUSTMENT NEEDED
  for (var j=0; j<number; j++){
    //playingVideo[j].show();
    playingVideo[j].size(mvDataSet[j].width, AUTO);

    var neworigin = origin_x;    
    for (var k =0; k<j; k++) {
      neworigin += mvDataSet[k].width + padding;
    }
  
    playingVideo[j].position(neworigin, origin_y);
    playingVideo[j].play();
    playingVideo[j].volume(0);

    //save the height of the video
    mvDataSet[j].height = playingVideo[j].size().height;
    mvDataSet[j].origin_x = neworigin;

    //draw ellipse on top of the video
    push();
    fill('black');
    stroke(150);
    ellipse(mvDataSet[j].origin_x, origin_y-10, rad, rad);
    pop();
  }

  console.log(start);


}

function draw() {

  displayLegend();

  //stroke('white');
  //line(origin_x, origin_y, origin_x+subCanvasWidth, origin_y);

  //background(0);
  var cd = 1000; //cd = closestdata

  var redTotal = [];
  var blueTotal = [];
  var greenTotal = [];
  
  var redAvg = [];
  var blueAvg = [];
  var greenAvg = [];
  noStroke();

  /**********************/
  

  if (millis() - lastTimeCheck > stampSpeed) {

    //LOAD AND CALCULATE COLOR AVERAGES
    for (var i=0; i<playingVideo.length; i++){
    
    redTotal[i] = 0;
    blueTotal[i] = 0;
    greenTotal[i] = 0;

    playingVideo[i].loadPixels();
    

    for (var cx = 0; cx < playingVideo[i].width; cx ++) {
      for (var cy = 0; cy < playingVideo[i].height; cy ++) {

        if (cy > blackBar && cy < playingVideo[i].height - blackBar) {
          var offset = int(((cy * playingVideo[i].width) + cx) * 4);
          var redc = playingVideo[i].pixels[offset];
          var greenc = playingVideo[i].pixels[offset + 1];
          var bluec = playingVideo[i].pixels[offset + 2];

          redTotal[i] += redc;
          //console.log(redTotal);
          greenTotal[i] += greenc;
          blueTotal[i] += bluec;

          fill(redc, greenc, bluec);

        }
      }
    }

    redAvg[i] = int(redTotal[i] / (playingVideo[i].width * playingVideo[i].height));
    greenAvg[i] = int(greenTotal[i] / (playingVideo[i].width * playingVideo[i].height));
    blueAvg[i] = int(blueTotal[i] / (playingVideo[i].width * playingVideo[i].height));
    }


    //DRAW COLOR AVERAGES
    //console.log(redAvg + "," + greenAvg + "," + blueAvg);
    for (var j=0; j<playingVideo.length; j++){
      fill(redAvg[j], greenAvg[j], blueAvg[j]);
      noStroke();

      //INDEX ADJUSTMENT NEEDED

      var col_origin_y = origin_y + mvDataSet[j+start].height + padding;
      var col_origin_x = mvDataSet[j+start].origin_x;
      
      rect(col_origin_x, (col_origin_y + (drawIndex*lineWeight)), mvDataSet[j+start].width, lineWeight);
    }
    
    drawIndex++;
    lastTimeCheck = millis();
  }

  /**********************///END OF TIMER FUNCTION

  //USE MOUSE TO HIGHLIGHT DATA
  //check which data is hovered by mouse
  for (var k=0; k<playingVideo.length; k++){
    var distanceToMouse = dist(mouseX, mouseY, mvDataSet[k+start].origin_x, origin_y-10);
    if (distanceToMouse<=rad){
      cd = k+start;
      console.log(cd);
    } else {
      push();
      fill('black');
      noStroke();
      rect(mvDataSet[k+start].origin_x-10, origin_y-70-10, 200, 60);
      pop();

      //draw ellipse on top of the video
      push();
      fill('black');
      stroke(150);
      ellipse(mvDataSet[k+start].origin_x, origin_y-10, rad, rad);
      pop();
    }
  }

  if (cd<1000){

    var str_title = mvDataSet[cd].title;
    var str_year = mvDataSet[cd].year.toString();
    var str_album = mvDataSet[cd].album;
    var str_views = mvDataSet[cd].views.toLocaleString();

    var info = 
    str_title + "\n" +
    str_year + "\n" +
    "Album: " + str_album + "\n" +
    "YT Views: " + str_views;

    //display info of the song
    push();
    fill('black');
    noStroke();
    rect(mvDataSet[cd].origin_x-10, origin_y-70-10, 200, 60);
    pop();

    push();
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(10);
    fill('white');
    noStroke();
    text(info, mvDataSet[cd].origin_x, origin_y-70);
    pop();

    push();
    fill(234,30,104);
    noStroke();
    ellipse(mvDataSet[cd].origin_x, origin_y-10, rad*0.5, rad*0.5);
    pop();

  }

}

function nextVid() {

  drawIndex = 0;
  background(0);

  push();
  stroke(150);
  strokeWeight(0.5);
  line(0, origin_y-10, width, origin_y-10);
  pop();

  if (start < 30){ //DON'T FORGET TO CHANGE THE NUMBER HERE
    start += (number);
  } else {
    start = 0;
  }

  var counter = start;
  var vi = 0;
  var end = start + number - 1;

  console.log(counter);

  while (counter <= end){
    playingVideo[vi].pause();
    playingVideo[vi].src = videos.data[counter].path;

    console.log(playingVideo[vi].src);
    console.log("Playing video number: " + counter + " on slot number: " + vi);
    //playingVideo[vi].load();
    //playingVideo[vi].play();

    playingVideo[vi].size(mvDataSet[counter].width, AUTO);

    var neworigin = origin_x;    
    for (var k =0; k<vi; k++) {
      neworigin += mvDataSet[counter-(k+1)].width + padding;
      //console.log("calculating origin from: " + (counter-vi));
    }
  
    playingVideo[vi].position(neworigin, origin_y);
    playingVideo[vi].play();
    playingVideo[vi].volume(0);

    //save the height of the video
    mvDataSet[counter].height = playingVideo[vi].size().height;
    mvDataSet[counter].origin_x = neworigin;
    
    //draw ellipse on top of the video
    push();
    fill('black');
    stroke(150);
    ellipse(mvDataSet[counter].origin_x, origin_y-10, rad, rad);
    pop();

    counter ++;
    vi++;


  }
  //console.log(start);
}

function displayLegend(){
  push();
  rectMode(CORNER);
  fill('black');
  rect(((width+subCanvasWidth)/2 - 240), origin_y-70, 200, 40);
  pop();

  push();
  rectMode(CENTER);
  fill(85);
  textSize(9);
  text("fewer\nYT Views", ((width+subCanvasWidth)/2 - 240), origin_y-60);
  rect(((width+subCanvasWidth)/2 - 190), origin_y-60, 10, 5);
  rect(((width+subCanvasWidth)/2 - 160), origin_y-60, 36, 18);
  text("more\nYT Views", ((width+subCanvasWidth)/2 - 130), origin_y-60 );
  pop();
}
