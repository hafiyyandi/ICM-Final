var lastTimeCheck = 0;
var stampSpeed = 1000; // how fast the sketch
                       // samples the video's color
var drawIndex = 0;
var lineWeight = 0.5;

var blackBar = 0; //fill this number if the video has black bars

var videos;
var videoData = [];
var mvDataSet = [];
var baseVideoWidth = 120;

var subCanvasWidth = 800;
var origin_y;
var origin_x;
var padding = 10;

var number = 3;

var start = 0;
//var end = 4;
//var offset = 0;

class mvData{
  constructor (mv, videodata){
    this.title = mv.title;
    this.year = mv.year;
    this.views = mv.views;
    this.album = mv.album;
    this.width = this.views / 2000000; //video size depends on views
    this.videoData = videodata;
  }
}

function preload(){
  videos = loadJSON("mv-1.json", loadVideos);
}

function loadVideos(videos){
  for (var i=0; i<number; i++){
    var newVid = createVideo(videos.data[i].path);
    videoData.push(newVid);
    //videoData[i].hide();
  }
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  background("black");
  
  origin_y = height/6;
  origin_x = (width/2) - (subCanvasWidth/2); //0 in the axis
  
  //create new objects for mv data
  for (var i=0; i<videoData.length; i++){
    var newData = new mvData(videos.data[i], videoData[i]);
    mvDataSet.push(newData);
  }

  //resize & position the videos
  for (var j=0; j<number; j++){
    mvDataSet[j].videoData.show();
    mvDataSet[j].videoData.size(mvDataSet[j].width, AUTO);

    var neworigin = origin_x;    
    for (var k =0; k<j; k++) {
      neworigin += mvDataSet[k].width + padding;
    }
  
    mvDataSet[j].videoData.position(neworigin, origin_y);
    mvDataSet[j].videoData.play();
    mvDataSet[j].videoData.volume(0);

    //save the height of the video
    mvDataSet[j].height = mvDataSet[j].videoData.size().height;
    mvDataSet[j].origin_x = neworigin;
  }

  console.log(start);


}

function draw() {


  stroke('white');
  //line(origin_x, origin_y, origin_x+subCanvasWidth, origin_y);

  var redTotal = [];
  var blueTotal = [];
  var greenTotal = [];
  
  var redAvg = [];
  var blueAvg = [];
  var greenAvg = [];
  
  // for (var j=0; j<mvDataSet.length;j++){
    
  // }


  noStroke();

  /**********************/
  //LOAD AND CALCULATE COLOR AVERAGES

  for (var i=0; i<mvDataSet.length; i++){
    
    redTotal[i] = 0;
    blueTotal[i] = 0;
    greenTotal[i] = 0;

    mvDataSet[i].videoData.loadPixels();
    

    for (var cx = 0; cx < mvDataSet[i].videoData.width; cx ++) {
      for (var cy = 0; cy < mvDataSet[i].videoData.height; cy ++) {

        if (cy > blackBar && cy < mvDataSet[i].videoData.height - blackBar) {
          var offset = int(((cy * mvDataSet[i].videoData.width) + cx) * 4);
          var redc = mvDataSet[i].videoData.pixels[offset];
          var greenc = mvDataSet[i].videoData.pixels[offset + 1];
          var bluec = mvDataSet[i].videoData.pixels[offset + 2];

          redTotal[i] += redc;
          //console.log(redTotal);
          greenTotal[i] += greenc;
          blueTotal[i] += bluec;

          fill(redc, greenc, bluec);

        }
      }
    }

    redAvg[i] = int(redTotal[i] / (mvDataSet[i].videoData.width * mvDataSet[i].videoData.height));
    greenAvg[i] = int(greenTotal[i] / (mvDataSet[i].videoData.width * mvDataSet[i].videoData.height));
    blueAvg[i] = int(blueTotal[i] / (mvDataSet[i].videoData.width * mvDataSet[i].videoData.height));
  }


  /**********************/
  //DRAW COLOR AVERAGES

  if (millis() - lastTimeCheck > stampSpeed) {
    //console.log(redAvg + "," + greenAvg + "," + blueAvg);
    for (var j=0; j<mvDataSet.length; j++){
      fill(redAvg[j], greenAvg[j], blueAvg[j]);
      noStroke();

      var col_origin_y = origin_y + mvDataSet[j].height + padding;
      var col_origin_x = mvDataSet[j].origin_x;
      
      rect(col_origin_x, (col_origin_y + (drawIndex*lineWeight)), mvDataSet[j].width, lineWeight);
    }
    
    drawIndex++;
    lastTimeCheck = millis();
  }

}

function mousePressed() {
  if (start <30){
    start += (number);
  } else {
    start = 0;
  }

  var counter = start;
  var end = start + number - 1;

  console.log(start);
}