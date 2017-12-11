var relations;

//var subCanvasWidth = 800;
//var subCanvasHeight = 400;

var faces = [];
var dataSet = [];

class dataPoint{
  constructor(reldata){

    this.name = reldata.name;
    this.job = reldata.job;
    this.type = reldata.type;

    //coordinates of data depends on relationship type
    switch (this.type){
      case "Ex-Boyfriend":
        //upper left quadrant
        this.x_min = 0 + 100;
        this.x_max = width/2 - 100;
        this.y_min = 0 + 100;
        this.y_max = height/2 -100;
        //assign color
        this.color = [74, 51, 240];
      break;
      
      case "Enemy":
        //lower left quadrant
        this.x_min = 0 + 100;
        this.x_max = width/2 - 100;
        this.y_min = height/2;
        this.y_max = height - 100;
        //assign color
        this.color = [255,0,0];
      break;
      
      case "Squad Member":
        //right side
        this.x_min = width/2;
        this.x_max = width - 100;
        this.y_min = 0 + 100;
        this.y_max = height - 100;
        //assign color
        this.color = [234,30,104];
      break;

      case "N/A":
        //center
        this.x_min = width/2;
        this.x_max = width/2;
        this.y_min = height/2;
        this.y_max = height/2;
        //assign color
        this.color = [255, 255, 255];
      break;

      case "Boyfriend":
        //near center
        this.x_min = width/2;
        this.x_max = width/2 + 90;
        this.y_min = height/2 - 90;
        this.y_max = height/2 + 90;
        //assign color
        this.color = [255, 255, 255];
      break;
    }

    //actual coordinates of data
    //this.org_x = random(this.x_min, this.x_max);
    //this.org_y = random(this.y_min, this.y_max);

    //save image of face
    //this.face = face;

    //size of data, depends social following
    this.ig_fol = reldata.ig_fol;
    this.t_fol = reldata.t_fol;
    this.total_fol = this.ig_fol + this.t_fol;
    this.size = map(this.total_fol, 10000, 200000000, 20, 100);
  }
}

function preload(){
  relations = loadJSON("relations.json", loadFaces);
}

function loadFaces(relations){
    for (var i=0; i<relations.data.length; i++){
      faces.push(loadImage(relations.data[i].image));
  }
}

function setup() { 

  createCanvas(windowWidth, windowHeight);
  //console.log(songs.data[0].title);
  ellipseMode(CENTER);
  //ellipseMode(RADIUS);
  imageMode(CENTER);

  for (var i=0; i<relations.data.length; i++){
    //var newData = new dataPoint(relations.data[i], faces[i]);
    var newData = new dataPoint(relations.data[i]);
    dataSet.push(newData);
    dataSet[i].face = faces[i];
  }

  
  //assign coordinates to dataset
  var protection = 0;
  var counter = 0;

  while (counter < dataSet.length){
    var currentData = dataSet[counter];
    currentData.org_x = random(currentData.x_min, currentData.x_max);
    currentData.org_y = random(currentData.y_min, currentData.y_max);

    //make sure no data point is overlapping each other
    var overlapping = false;
    
    for (var j = 0; j<counter; j++){
      var other = dataSet[j];
      var d = dist(currentData.org_x, currentData.org_y, other.org_x, other.org_y);
      if (d < currentData.size + other.size){
        overlapping = true;
      }
    }

    //if not overlapping, move on to next data point
    if (!overlapping){
      counter ++;
      console.log("data number: " + i);
      console.log("name: " + currentData.name);
      console.log("x: " + currentData.org_x);
      console.log("y: " + currentData.org_y);
      console.log("size: " + currentData.size);
    }

    protection++;
    if (protection > 10000){
      break;
    }
  }

  // sel1 = createSelect();
  // sel1.option('all genre');
  // sel1.option('pop');
  // sel1.option('country');
  // sel1.option('rock');
  // sel1.changed(sel1Event);

  // sel2 = createSelect();
  // sel2.option('all beats');
  // sel2.option('<100 BPM');
  // sel2.option('100-150 BPM');
  // sel2.option('>150 BPM');
  // sel2.changed(sel2Event);
}

function draw() { 
  background('black');
  
  stroke('white');
  strokeWeight(0.5);
  noFill();

  push();
  noStroke();
  fill(85);
  textSize(9);
  text("smaller\nsocial\nfollowing", 100, 60);
  ellipse(150, 60, 5, 5);
  ellipse(170, 60, 18, 18);
  text("larger\nsocial\nfollowing",200, 60);
  pop();

  var cd = 1000; //cd = closest data

  for (var i=0; i<dataSet.length; i++){
    // push();
    // noStroke();
    // fill(100);
    // textSize(8);
    // text(dataSet[i].name, dataSet[i].org_x, dataSet[i].org_y);
    // pop();

    //DRAW CIRCLE HERE
    push();
    stroke(dataSet[i].color[0], dataSet[i].color[1], dataSet[i].color[2] );
    ellipse(dataSet[i].org_x, dataSet[i].org_y, dataSet[i].size, dataSet[i].size);
    line(width/2, height/2, dataSet[i].org_x, dataSet[i].org_y);
    pop();


    //check which data point is closest to mouse position
    var distanceToMouse = dist(mouseX, mouseY, dataSet[i].org_x, dataSet[i].org_y);
    if (distanceToMouse<=dataSet[i].size){
      cd = i;
      //console.log(k);
    }

  }

  for (var j = 0; j<dataSet.length; j++){
    image(dataSet[j].face, dataSet[j].org_x, dataSet[j].org_y, dataSet[j].size, dataSet[j].size);
    
    push();
    noStroke();
    fill(0,0,0,100);
    ellipse(dataSet[j].org_x, dataSet[j].org_y, dataSet[j].size, dataSet[j].size);
    pop();
  }

  //if mouse is over one of the data, display its info
  if (cd!=1000){

    var cData = dataSet[cd]
    var data_x = cData.org_x;
    var data_y = cData.org_y;
    var data_circle = cData.size;

    //put information in data point into variables
    var offset = 20;
    var boxsize = 120;
    var fs = 14; //fontsize

    var str_name = cData.name;
    var str_job = cData.job;
    var str_type = cData.type;
    var str_ig_fol = cData.ig_fol.toLocaleString();
    var str_t_fol = cData.t_fol.toLocaleString();

    //append all information into 1 string

    var info = 
      str_name + "\n" +
      str_job + "\n" +
      "Relationship Type: " + str_type + "\n" +
      "Instagram followers: " + str_ig_fol + "\n" +
      "Twitter followers: " + str_t_fol;

    //START DRAWING HERE

    image(dataSet[cd].face, dataSet[cd].org_x, dataSet[cd].org_y, dataSet[cd].size*1.5, dataSet[cd].size*1.5);
    //display info of the person
    push();
    fill(0,0,0,100);
    stroke(50);
    //rect (data_x, data_y, boxsize *2, boxsize);
    pop();

    push();
    textAlign(LEFT, TOP);
    textSize(10);
    fill('white');
    noStroke();
    text(info, data_x + offset, data_y + offset);
    pop();


  }


}