//*----------------------*//
//1. Slice out new SVG paths from all possible INTERSECTIONS within a CREST
//2. Assign a color to each new paths
//*----------------------*//

let intersections = [];
let colors = [
    '#8ab6bc',
    '#fcb873',
    '#cb202e',
    '#ffde16',
    //'#efebd4',
    '#ffffff',
    '#c2b59b'
];

let max = 300; //default dimension for paths and SVGs

function createIntersections(source) {

    // create an empty project and a view for the canvas:
    let canvas = $('#crestCanvas')[0];
    paper.setup(canvas);

    // scale accordingly
    let w = $('#crestCanvas').width();
    //console.log("width: " + w);
    let point = new paper.Point(0, 0);
    paper.view.scale(w / max, point);

    // reset intersections array
    intersections.length = 0;

    // generate combination sequence
    //..a combination is a pairing of two or more paths from source, e.g. 1-2, 1-3-4, 1-2-3-4
    //..the combination sequence (12,13,14,123,134,124,...) makes sure all intersections are accounted for!
    let sequence = generateCombinations(source.length);

    for (let i = 0; i < sequence.length; i++) {
        if (sequence[i].length == 1) {
            let i_path = {
                index: i + "",
                path: new paper.Path(source[i])
            };

            i_path.path.strokeColor = 'white';
            i_path.path.fillColor = colors.randomElement();
            intersections.push(i_path);

        } else {
            let str = sequence[i];
            //console.log(str);
            let a_pos = 0;
            let a = str.charAt(a_pos);
            let b_pos = a_pos + 1;
            let b = str.charAt(b_pos);

            while (b_pos < str.length) {
                //console.log("a: " + a);
                //console.log("b: " + b);
                // console.log("-");

                //get previously generated intersections index here!
                let a_index = findIntersection(a);
                let b_index = findIntersection(b);
                let ab = findIntersection((a + b));

                if (ab == null) { //if this combination doesn't exist, create new interesections within combination
                    //console.log("merge " + a + " and " + b + " !");
                    let a_path = intersections[a_index].path;
                    let b_path = intersections[b_index].path
                    inter = a_path.intersect(b_path);
                    let i_path = {
                        index: a + b,
                        path: inter
                    }
                    i_path.path.strokeColor = 'white';
                    i_path.path.fillColor = colors.randomElement();
                    intersections.push(i_path);
                }

                //next pair
                a = a + b;
                b_pos++;
                b = str.charAt(b_pos);
            }
        }
    }

    //console.log(intersections);

}

function findIntersection(name) {
    for (let i = 0; i < intersections.length; i++) {
        if (intersections[i].index == name) {
            return i;
        }
    }
}

function generateCombinations(n) {
    let str = "";
    for (let i = 0; i < n; i++) {
        str += i;
    }
    let comb = combinations(str);
    comb = comb.sort(function(a, b) {
        // ASC  -> a.length - b.length
        // DESC -> b.length - a.length
        return a.length - b.length;
    });
    return comb;
}

function combinations(str) {
    var fn = function(active, rest, a) {
        if (!active && !rest)
            return;
        if (!rest) {
            a.push(active);
        } else {
            fn(active + rest[0], rest.slice(1), a);
            fn(active, rest.slice(1), a);
        }
        return a;
    }
    return fn("", str, []);
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}