//Crest is a the outcome of mashing & interpolating two shapes

let crest;

function createCrest(ros, handdrawing, slider){
    let rosette = ros;
    crest = mashShapes(rosette.inner, handdrawing, slider); //mashshapes.js
    //console.log(crest);
    //drawCrest(crest);
    createIntersections(crest);
}

//this is replaced by paper's functions in intersections.js
function drawCrest(interpolation){
    let paths="";
    for (let i=0; i<interpolation.length; i++){
        let path = "<path class=\"st0\" d=\"";
        path = path + interpolation[i] + "\"/>";
        paths += path;
    }
    //console.log(paths);
    $("#crest").html(paths);
}