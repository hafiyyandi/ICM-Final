//p5 functions, loading of doodles' SVGs, portraits' functions
let cnv;

let svg_URLs = [
    //'shapes/body.svg',
    'shapes/dog.svg',
    'shapes/eye.svg',
    'shapes/fingers.svg',
    //'shapes/fullmoon.svg',
    //'shapes/glasses2.svg',
    //'shapes/grandma1.svg',
    //'shapes/grandma2.svg',
    //'shapes/indo.svg',
    'shapes/music2.svg',
    'shapes/pen.svg',
    //'shapes/signature.svg',
    //'shapes/singapore.svg',
    'shapes/tattoo2.svg'
];
let svgs = [];
let icon;

let pwidth;
let pheight;
let scaled_w;
let scaled_h;
let v;
let l_port;
let r_port;
let ori_ratio = 400 / 711;
let eye;
let isLoaded = false;
let white_alpha_L = 0;
let white_alpha_R = 0;

function preload() {
    for (let i = 0; i < svg_URLs.length; i++) {
        loadSVG(svg_URLs[i]);
    }
}

function setup() {
    cnv = createCanvas(100, 100);
    cnv.parent('portraits');
    frameRate(30);

    pwidth = $('#portraits').width();
    pheight = 9 / 16 * pwidth;
    resizeCanvas(pwidth, pheight);
    background('white');

    l_port = loadImage('portraits/left.png');
    r_port = loadImage('portraits/right.png');
    l_port_mix = loadImage('portraits/left_mix.png');
    r_port_mix = loadImage('portraits/right_mix.png');
    eye = loadImage('icon/eye.png');
    setTimeout(placeImage, 3000);
    noStroke();
}

function placeImage() {
    //for some reason loading the image together with the SVGs will break p5
    // console.log('hey!');
    isLoaded = true;
}

function draw() {
    if (isLoaded) {
        background('white');
        scaled_w = pwidth / 5;
        scaled_h = scaled_w / ori_ratio;
        v = (pheight - scaled_h) / 2;

        // ellipse(scaled_w * 1.5, pheight / 2, scaled_h * 1.4, scaled_h * 1.4);
        // ellipse(scaled_w * 3.5, pheight / 2, scaled_h * 1.4, scaled_h * 1.4);
        let status = checkIfWithin(scaled_w * 1.5, pheight / 2, scaled_w * 3.5, pheight / 2, scaled_h * 1.4);

        switch (status) {
            case 0:
                image(l_port_mix, scaled_w * 1, v, scaled_w, scaled_h);
                image(r_port_mix, scaled_w * 3, v, scaled_w, scaled_h);
                clear_white('L');
                clear_white('R');
                draw_white();
                break;
            case 1:
                image(l_port, scaled_w * 1, v, scaled_w, scaled_h);
                image(r_port, scaled_w * 3, v, scaled_w, scaled_h);
                clear_white('L');
                whiten('R');
                draw_white();
                break;
            case 2:
                image(l_port, scaled_w * 1, v, scaled_w, scaled_h);
                image(r_port, scaled_w * 3, v, scaled_w, scaled_h);
                whiten('L');
                clear_white('R');
                draw_white();
                break;
            case 3:
                image(l_port, scaled_w * 1, v, scaled_w, scaled_h);
                image(r_port, scaled_w * 3, v, scaled_w, scaled_h);
                whiten('L');
                whiten('R');
                draw_white();
                break;
        }
        //image(l_port, scaled_w * 1, v, scaled_w, scaled_h);
        //image(r_port, scaled_w * 3, v, scaled_w, scaled_h);

        image(eye, mouseX - 37.5, mouseY - 24, 75, 48);
    }
}

function checkIfWithin(x1, y1, x2, y2, d) {
    let r = d / 2;
    let d1 = int(dist(mouseX, mouseY, x1, y1));
    let d2 = int(dist(mouseX, mouseY, x2, y2));

    // console.log('r: '+r);
    // console.log('d1: ' + d1);
    // console.log('d2: ' + d2);

    if (d1 <= r && d2 <= r) {
        return 3;
    } else if (d1 <= r && d2 > r) {
        return 1;
    } else if (d1 > r && d2 <= r) {
        return 2;
    } else {
        return 0;
    }

}

function whiten(str) {
    if (str == 'L') {
        if (white_alpha_L < 255) {
            white_alpha_L+=2;
        }
    } else {
        if (white_alpha_R < 255) {
            white_alpha_R+=2;
        }
    }
}

function clear_white(str) {
    if (str == 'L') {
        if (white_alpha_L > 0) {
            white_alpha_L-=2;
        }
    } else {
        if (white_alpha_R > 0) {
            white_alpha_R-=2;
        }
    }
}

function draw_white() {
    push();
    fill(255, 255, 255, white_alpha_L);
    rect(scaled_w * 1, v, scaled_w, scaled_h);
    pop();
    push();
    fill(255, 255, 255, white_alpha_R);
    rect(scaled_w * 3, v, scaled_w, scaled_h);
    pop();
}

function loadSVG(url) {
    $.get(url, function(data) {
        let name = url.split('/')[1].split('.')[0];
        console.log(name);

        let shape = []
        //get drawing commands
        let d = $(data);
        let paths = $('path', d);
        for (let i = 0; i < paths.length; i++) {
            for (let j = 0; j < paths[i].attributes.length; j++) {
                if (paths[i].attributes[j].name == 'd') {
                    shape.push(paths[i].attributes[j].value);
                }
            }
        }

        let svg = {
            name: name,
            shape: shape
        }
        svgs.push(svg);
        if (svgs.length < 2) {
            icon = svgs[0];
            rosette = createRosette();
            createCrest(rosette, icon.shape, inter_val);
        }
        console.log('loading done!');
    });
}