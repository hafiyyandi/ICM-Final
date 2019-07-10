//*----------------------*//
//ROSETTE is the starting polygon shapes
//*----------------------*//

let npoints = 8;
let han_angle = 50;
let han_width = 1;
let n_key = [4, 8, 10, 12, 14, 16, 20, 28, 30, 32, 34];
let radius = 300 / 2;
let rosette;

function createRosette() {
    let inner = [];
    let m_angle = 90-han_angle;
    let scale = han_width;
    let midpoints = [];
    let vertices = [];
    let angle = TWO_PI / npoints;

    //step 1: create a polygon tile
    let start = 0;
    for (let a = start; a < (TWO_PI + start); a += angle) {
        let sx = radius + cos(a) * radius;
        let sy = radius + sin(a) * radius;
        vertex(sx, sy);
        let current = createVector(sx, sy);
        vertices.push(current);
    }

    //step 2: make hankins
    for (let i = 0; i < vertices.length; i++) {
        let current = vertices[i];
        let prev;

        //make midpoints
        if (i != 0) {
            prev = vertices[i - 1];
        } else {
            current = vertices[i];
            prev = vertices[vertices.length - 1];
        }
        let mid_x = (current.x + prev.x) / 2;
        let mid_y = (current.y + prev.y) / 2;
        let midpoint = createVector(mid_x, mid_y);

        //create hankins
        let h1 = p5.Vector.sub(midpoint, current);
        h1.rotate(radians(-m_angle));
        h1.mult(scale);
        let end1 = p5.Vector.add(midpoint, h1);

        let h2 = p5.Vector.sub(midpoint, prev);
        h2.rotate(radians(m_angle));
        h2.mult(scale);
        let end2 = p5.Vector.add(midpoint, h2);

        let mid = {
            midpoint: midpoint,
            end1: end1,
            end2: end2
        }
        midpoints.push(mid);
    }

    //step 3: create rosette
    for (let i = 0; i < midpoints.length / 2; i++) {

        let a = midpoints[i];
        let b = midpoints[i + midpoints.length / 2];

        let poly = [
            [a.end1.x, a.end1.y],
            [a.midpoint.x, a.midpoint.y],
            [a.end2.x, a.end2.y],
            [b.end1.x, b.end1.y],
            [b.midpoint.x, b.midpoint.y],
            [b.end2.x, b.end2.y]
        ];
        inner.push(poly);
    }

    let rosette = {
        outer: vertices,
        inner: inner
    }

    drawRosette(rosette);
    return rosette;
}

function drawRosette(ros) {
    let rose = ros.inner;
    let polys = "";
    for (let i = 0; i < rose.length; i++) {
        let points = "points=\"";
        for (let j = 0; j < rose[i].length; j++) {
            points = points + rose[i][j][0] + "," + rose[i][j][1] + " ";
        }
        points = "<polygon class=\"st0\" " + points + "\" />\n";
        polys += points;
    }
    //console.log(polys);
    $("#rosette").html(polys);
}