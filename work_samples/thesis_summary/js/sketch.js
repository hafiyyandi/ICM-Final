//*----------------------*//
//p5 functions: Loading SVGs, Interactive Portraits
//*----------------------*//

let cnv;

let svg_URLs = [
    '../media/shapes/dog.svg',
    '../media/shapes/eye.svg',
    '../media/shapes/fingers.svg',
    '../media/shapes/music2.svg',
    '../media/shapes/pen.svg',
    '../media/shapes/tattoo2.svg'
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

    //load SVGs!
    for (let i = 0; i < svg_URLs.length; i++) {
        loadSVG(svg_URLs[i]);
    }
}

function setup() {

    //Portraits' Canvas
    cnv = createCanvas(100, 100);
    cnv.parent('portraits');
    frameRate(30);

    pwidth = $('#portraits').width();
    pheight = 9 / 16 * pwidth;
    resizeCanvas(pwidth, pheight);
    background('white');

    l_port = loadImage('../media/portraits/left.png');
    r_port = loadImage('../media/portraits/right.png');
    l_port_mix = loadImage('../media/portraits/left_mix.png');
    r_port_mix = loadImage('../media/portraits/right_mix.png');
    eye = loadImage('../media/icon/eye.png');
    
    //for some reason loading the image together with the SVGs will break p5...
    //assumption here is after 3s the SVGs would all have been loaded
    setTimeout(placeImage, 3000);
    noStroke();
}

function draw() {
    if (isLoaded) { //if the portrait images are loaded....

        //start drawing & interacting with canvas (portraits)
        background('white');
        scaled_w = pwidth / 5;
        scaled_h = scaled_w / ori_ratio;
        v = (pheight - scaled_h) / 2;

        let status = checkIfWithin(scaled_w * 1.5, pheight / 2, scaled_w * 3.5, pheight / 2, scaled_h * 1.4);

        //this section basically decides which portrait should disappear or show messages
        switch (status) {
            case 0:
            //if cursor is out of range of both portraits, show portrait with messages
                image(l_port_mix, scaled_w * 1, v, scaled_w, scaled_h);
                image(r_port_mix, scaled_w * 3, v, scaled_w, scaled_h);
                clear_white('L');
                clear_white('R');
                draw_white();
                break;
            case 1:
            //if cursor is within range of LEFT portrait and NOT RIGHT, show LEFT portrait, hide RIGHT
                image(l_port, scaled_w * 1, v, scaled_w, scaled_h);
                image(r_port, scaled_w * 3, v, scaled_w, scaled_h);
                clear_white('L');
                whiten('R');
                draw_white();
                break;
            case 2:
            //if cursor is within range of RIGHT portrait and NOT LEFT, show RIGHT portrait, hide LEFT
                image(l_port, scaled_w * 1, v, scaled_w, scaled_h);
                image(r_port, scaled_w * 3, v, scaled_w, scaled_h);
                whiten('L');
                clear_white('R');
                draw_white();
                break;
            case 3:
            //if cursor is within range of BOTH selfportraits, hide BOTH
                image(l_port, scaled_w * 1, v, scaled_w, scaled_h);
                image(r_port, scaled_w * 3, v, scaled_w, scaled_h);
                whiten('L');
                whiten('R');
                draw_white();
                break;
        }

        //turn cursor into an eye
        image(eye, mouseX - 37.5, mouseY - 24, 75, 48);
    }
}

function checkIfWithin(x1, y1, x2, y2, d) {
    //check if cursor is close to the selfportraits
    let r = d / 2;
    let d1 = int(dist(mouseX, mouseY, x1, y1));
    let d2 = int(dist(mouseX, mouseY, x2, y2));

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
            white_alpha_L += 2;
        }
    } else {
        if (white_alpha_R < 255) {
            white_alpha_R += 2;
        }
    }
}

function clear_white(str) {
    if (str == 'L') {
        if (white_alpha_L > 0) {
            white_alpha_L -= 2;
        }
    } else {
        if (white_alpha_R > 0) {
            white_alpha_R -= 2;
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

function placeImage() {
    isLoaded = true;
}

function loadSVG(url) {
    $.get(url, function(data) {
        let name = url.split('/')[3].split('.')[0];

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
    });
}