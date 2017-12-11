// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z

// Further visualization modifications by Hafiyyandi
// http://hafiyyandi.com

// API documentation
// http://developer.nytimes.com

// Count term appearance in times per year

var start, end, total, w;

var firstDataSet = [];
var secondDataSet = [];

var midPoints = [];

var barWidth = 2;

var closestData = 0;
var closestDistance;
var subCanvasWidth = 800;
var verticalPadding = 30;

var taylorData = [];
var katyData = [];
var kimData = [];
var kanyeData = [];

function preload() {
  taylorImg = createImg("assets/rel_taylor.png");
  katyImg = createImg("assets/rel_katy.png");
  kimImg = createImg("assets/rel_kim.png");
  kanyeImg = createImg("assets/rel_kanye.png");
  nullImg = createImg("assets/rel_null.png");
  
	katyData[0] = loadJSON('katy2007.json');
	katyData[1] = loadJSON('katy2008.json');
	katyData[2] = loadJSON('katy2009.json');
	katyData[3] = loadJSON('katy2010.json');
	katyData[4] = loadJSON('katy2011.json');
	katyData[5] = loadJSON('katy2012.json');
	katyData[6] = loadJSON('katy2013.json');
	katyData[7] = loadJSON('katy2014.json');
	katyData[8] = loadJSON('katy2015.json');
	katyData[9] = loadJSON('katy2016.json');
	katyData[10] = loadJSON('katy2017.json');
  
  taylorData[0] = loadJSON('taylor2007.json');
  taylorData[1] = loadJSON('taylor2008.json');
  taylorData[2] = loadJSON('taylor2009.json');
  taylorData[3] = loadJSON('taylor2010.json');
  taylorData[4] = loadJSON('taylor2011.json');
  taylorData[5] = loadJSON('taylor2012.json');
  taylorData[6] = loadJSON('taylor2013.json');
  taylorData[7] = loadJSON('taylor2014.json');
  taylorData[8] = loadJSON('taylor2015.json');
  taylorData[9] = loadJSON('taylor2016.json');
  taylorData[10] = loadJSON('taylor2017.json');

  kimData[0] = loadJSON('kim2007.json');
  kimData[1] = loadJSON('kim2008.json');
  kimData[2] = loadJSON('kim2009.json');
  kimData[3] = loadJSON('kim2010.json');
  kimData[4] = loadJSON('kim2011.json');
  kimData[5] = loadJSON('kim2012.json');
  kimData[6] = loadJSON('kim2013.json');
  kimData[7] = loadJSON('kim2014.json');
  kimData[8] = loadJSON('kim2015.json');
  kimData[9] = loadJSON('kim2016.json');
  kimData[10] = loadJSON('kim2017.json');

  kanyeData[0] = loadJSON('kanye2007.json');
  kanyeData[1] = loadJSON('kanye2008.json');
  kanyeData[2] = loadJSON('kanye2009.json');
  kanyeData[3] = loadJSON('kanye2010.json');
  kanyeData[4] = loadJSON('kanye2011.json');
  kanyeData[5] = loadJSON('kanye2012.json');
  kanyeData[6] = loadJSON('kanye2013.json');
  kanyeData[7] = loadJSON('kanye2014.json');
  kanyeData[8] = loadJSON('kanye2015.json');
  kanyeData[9] = loadJSON('kanye2016.json');
  kanyeData[10] = loadJSON('kanye2017.json');
  
}

function setup() {

  // A canvas for drawing!
  var canvas = createCanvas(windowWidth, 550);
  textAlign(CENTER);
  ellipseMode(CENTER);
  rectMode(CENTER);

  // How many years to look at?
  start = 2007;
  end = 2017;
  total = end - start;

  // Initialize array for data set
  for (let i = 0; i <= total ; i++) {
    firstDataSet[i] = new DataPoint(0);
    firstDataSet[i].assignCeleb('Taylor Swift');
    secondDataSet[i] = new DataPoint(0);
    secondDataSet[i].assignCeleb(' ');
  }

  // How wide is each bar
  w = subCanvasWidth / (total + 1);

  // What should we search for?
  // sel1 = createSelect();
  // sel1.option('');
  // sel1.option('katy perry');
  // sel1.option('taylor swift');
  // sel1.option('beyonce');
  // sel1.option('rihanna');
  // sel1.changed(sel1Event);

  sel2 = createSelect();
  sel2.option('Choose Comparison');
  sel2.option('Katy Perry');
  sel2.option('Kim Kardashian');
  sel2.option('Kanye West');
  sel2.changed(sel2Event);

  for (var i = 0; i<=total; i++){
    var count = taylorData[i].response.facets.source.terms[0].count;
    firstDataSet[i].count = count;
    firstDataSet[i].height = map(count, 0, 500, 0, 300);
    firstDataSet[i].size = map(count, 0, 405, 10, 200);
    //firstDataSet[i].assignCeleb('Taylor Swift');
    //firstDataSet[i].image = taylorImg;
  }

}

function draw() {
  background(0);
  closestDistance = 10000;
	
  //RESET IMAGE
  taylorImg.hide();
  kimImg.hide();
  kanyeImg.hide();
  katyImg.hide();
  nullImg.hide();
  
  
  //TITLE
  // push();
  // textAlign(LEFT);
  // fill('black');
  // textSize(25);
  // textStyle(BOLD);
  // text("which pop queen stays", ((width - subCanvasWidth) / 2), 60);
  // text("more mention-worthy", ((width - subCanvasWidth) / 2), 80);
  // text("throughout the", ((width - subCanvasWidth) / 2), 100);
  // text("decade?", ((width - subCanvasWidth) / 2), 120);
  // textSize(10);
  // textStyle(ITALIC);
  // text("according to the New York Times", ((width - subCanvasWidth) / 2), 140);
  // textStyle(BOLD);
  // text("vs", (width - subCanvasWidth) / 2 + 130, 178);
  // pop();

  //sel1.position((width - subCanvasWidth) / 2, 160);
  sel2.position((width - subCanvasWidth) / 2, 160);
  /******************/
  
  //BLACK LINE
  push();
  stroke(180);
  strokeWeight(0.5);
  line(mouseX, 0, mouseX, height);
  stroke(200);
  line(0, height - (100 + verticalPadding), width, height - (100 + verticalPadding));
  pop();


  for (let i = 0; i < (total + 1); i++) {

    midPoints[i] = (i * w) + (w / 2) + ((width - subCanvasWidth) / 2);

    //DATA POINTS SET 1
    push();
    fill(234, 51, 104);
    noStroke();
    //rect(midpoint - (2*barWidth), height - 100 - firstDataSet[i].height, barWidth, firstDataSet[i].height);
    ellipse(midPoints[i] - (2 * barWidth), height - (100 + verticalPadding) - firstDataSet[i].height, 3, 3);
    pop();

    //YEAR
    push();
    stroke('black');
    strokeWeight(0.5);
    line(midPoints[i], height - (97 + verticalPadding), midPoints[i], height - (103 + verticalPadding));
    noStroke();
    textSize(8.5);
    fill(100);
    text(start + i, midPoints[i], height - (80 + verticalPadding));
    pop();
		
    //DATA POINTS SET 2
    push();
    fill(255);
    noStroke();
    //rect(midpoint + barWidth, height - 100 - secondDataSet[i].height, barWidth, secondDataSet[i].height);
    ellipse(midPoints[i] + barWidth, height - (100 + verticalPadding) - secondDataSet[i].height, 3, 3);
    pop();

    let distanceToMouse = calculateDistance(midPoints[i]);

    if (distanceToMouse < closestDistance) {
      closestDistance = distanceToMouse;
      closestData = i;
    }

    // DATA LINES
    if (i > 0) {
      push();
      stroke(234, 51, 104);
      strokeWeight(1);
      line(midPoints[i] - (2 * barWidth), height - (100 + verticalPadding) - firstDataSet[i].height, midPoints[i - 1] - (2 * barWidth), height - (100 + verticalPadding) - firstDataSet[i - 1].height);
      stroke(255);
      line(midPoints[i] + barWidth, height - (100 + verticalPadding) - secondDataSet[i].height, midPoints[i - 1] + barWidth, height - (100 + verticalPadding) - secondDataSet[i - 1].height);
      pop();
    }


  }


  //HIGHLIGHTED DATA LEGEND
  push();
  fill('white');
  noStroke();
  ellipse(midPoints[closestData] - (2 * barWidth), height - (100 + verticalPadding) - firstDataSet[closestData].height, firstDataSet[closestData].size, firstDataSet[closestData].size);
  ellipse(midPoints[closestData] + barWidth, height - (100 + verticalPadding) - secondDataSet[closestData].height, secondDataSet[closestData].size, secondDataSet[closestData].size);
  pop();
  
  //BUBBLE HEAD
  firstDataSet[closestData].image.position(midPoints[closestData] - (2 * barWidth) - (firstDataSet[closestData].size / 2), height - (100 + verticalPadding) - firstDataSet[closestData].height - (firstDataSet[closestData].size / 2));
  firstDataSet[closestData].image.size(firstDataSet[closestData].size, firstDataSet[closestData].size);
  firstDataSet[closestData].image.show();
  secondDataSet[closestData].image.position(midPoints[closestData] + barWidth - (secondDataSet[closestData].size / 2), height - (100 + verticalPadding) - secondDataSet[closestData].height - (secondDataSet[closestData].size / 2));
  secondDataSet[closestData].image.size(secondDataSet[closestData].size, secondDataSet[closestData].size);
  secondDataSet[closestData].image.show();

	//YEAR
  fill(200);
  rect(midPoints[closestData], height - (84 + verticalPadding), 30, 15);
  fill('black');
  textSize(9);
  textStyle(BOLD);
  text(start + closestData, midPoints[closestData], height - (80 + verticalPadding));
	
  //DATA POINTS
  push();
  textAlign(LEFT);
  fill(100);
  textSize(11);
  textStyle(BOLD);
  text("article mention", midPoints[closestData], height - (55 + verticalPadding))
  textStyle(NORMAL);
  fill(234, 51, 104);
  text(firstDataSet[closestData].nick, midPoints[closestData], height - (40 + verticalPadding));
  text(int(firstDataSet[closestData].count), midPoints[closestData] + 80, height - (40 + verticalPadding));
  fill(255);
  text(secondDataSet[closestData].nick, midPoints[closestData], height - (25 + verticalPadding));
  text(int(secondDataSet[closestData].count), midPoints[closestData] + 80, height - (25 + verticalPadding));
  pop();


}

// // This callback is for when the user clicks the button
// function sel1Event() {
//   var term;
//   //background(240);
//   term = sel1.value();
  
//   var referredArray;
//   switch (term) {
//       case 'beyonce':
//         referredArray = beyonceData;
//         break;
//       case 'katy perry':
//         referredArray = katyData;
//         break;
//       case 'taylor swift':
//         referredArray = taylorData;
//         break;
//       case 'rihanna':
//         referredArray = rihannaData;
//         break;
//     }

//   for (var i = 0; i<=total; i++){
//     var count = referredArray[i].response.facets.source.terms[0].count;
//     firstDataSet[i].count = count;
//     firstDataSet[i].height = map(count, 0, 500, 0, 300);
//     firstDataSet[i].size = map(count, 0, 405, 10, 200);
//     firstDataSet[i].assignCeleb(term);
//   }
  
// }

// This callback is for when the user clicks the button
function sel2Event() {
  var term;
  term = sel2.value();
  
  var referredArray;
  switch (term) {
      case 'Katy Perry':
        referredArray = katyData;
        break;
      case 'Kim Kardashian':
        referredArray = kimData;
        break;
      case 'Kanye West':
        referredArray = kanyeData;
        break;
    }

  for (var i = 0; i<=total; i++){
    var count = referredArray[i].response.facets.source.terms[0].count;
    secondDataSet[i].count = count;
    secondDataSet[i].height = map(count, 0, 500, 0, 300);
    secondDataSet[i].size = map(count, 0, 405, 10, 200);
    secondDataSet[i].assignCeleb(term);
  }

}


class DataPoint {
  constructor(count) {
    this.count = count;
    this.height = map(count, 0, 500, 0, 300);
    this.size = map(count, 0, 405, 10, 200);
  }

  assignCeleb(term) {
    this.name = term;
    switch (term) {
      case 'Taylor Swift':
        this.image = taylorImg;
        this.nick = 'Taylor Swift';
        break;
      case 'Katy Perry':
        this.image = katyImg;
        this.nick = 'Katy Perry';
        break;
      case 'Kim Kardashian':
        this.image = kimImg;
        this.nick = 'Kim Kardashian';
        break;
      case 'Kanye West':
        this.image = kanyeImg;
        this.nick = 'Kanye West';
        break;
      case ' ':
        this.image = nullImg;
        this.nick = ' ';
        break;
      case 'Choose Comparison':
        this.image = nullImg;
        this.nick = ' ';
        break;
    }
  }
}

function calculateDistance(midPoint) {
  let xDist = abs(mouseX - midPoint);
  return xDist;
}