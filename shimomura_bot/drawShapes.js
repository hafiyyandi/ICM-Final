function write1Shape(note){

    push();
    ellipseMode(CENTER);
    fill('black');
    ellipse(window.width/2, window.height/2, 50, 50);
    pop();

    var randNum = parseInt(random(-1,8));
    var txt;
    switch(randNum){
        case 0 :
            fill('green');
            txt = "Δ";
            break;
        case 1 :
            fill('red');
            txt = "◯";
            break;
        case 2 :
            fill('blue');
            txt = "X";
            //generateResponse();
            break;
        case 3 :
            fill('pink');
            txt = "□";
            break;
        case 4 :
            fill('white');
            txt = "←";
            break;
        case 5 :
            fill('white');
            txt = "→";
            break;
        case 6 :
            fill('white');
            txt = "↑";
            break;
        case 7 :
            fill('white');
            txt = "↓";
            break;
    }

    textSize(25);
    textAlign(CENTER, CENTER);
    text(txt,window.width/2, window.height/2);


}


function genShapes(notes){
    var size = notes.length * 15;
    for (var i=0; i<notes.length; i++){
        rval = parseInt(random(0,100));
        gval = parseInt(random(80,255));
        bval = parseInt(random(100,255));
        noStroke();
        fill(rval, gval, bval);
        var rndX = random(window.width);
        var rndY = random(window.height);
        rect(rndX, rndY, size, size);

    }


}
