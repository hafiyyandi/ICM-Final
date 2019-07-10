//*----------------------*//
// DOM event handlers
//*----------------------*//

$(window).ready(function() {

    $('#crestCanvas').width('100%');
    let w = $('#crestCanvas').width();
    $('#crestCanvas').height(w);

    $('#moh').click(classify_as_mohammad);
    $('#not_moh').click(classify_as_not_mohammad);
    $('#loading_bar').hide();

    let h = $('#photo_window').height();
    $('#passport_window').height(h);
    $('#print_job').height(0.8 * h);

    //center the main title
    let video_h = $('#videobcg').height();
    $('#intro').css({ 'margin-top': -video_h / 2 });
});


//*--- Section 3, Mashup's handlers ---*//

let inter_val = 0.5;

//update icon (RIGHT)
function updateicon(str) {
    $('#customicon').attr('src', '../media/shapes/' + str + '.svg');
    for (let i = 0; i < svgs.length; i++) {
        if (svgs[i].name == str) {
            icon = svgs[i];
            break;
        }
    }
    rosette = createRosette();
    createCrest(rosette, icon.shape, inter_val);
}

//update polygon setting (LEFT)
function update_n(val) {
    npoints = n_key[val];
    $("#n_value").html(npoints);
    rosette = createRosette();
    createCrest(rosette, icon.shape, inter_val);
}

function update_angle(val) {
    han_angle = val;
    rosette = createRosette();
    createCrest(rosette, icon.shape, inter_val);
}

function update_width(val) {
    han_width = val / 10;
    rosette = createRosette();
    createCrest(rosette, icon.shape, inter_val);
}

function update_inter(val) {
    inter_val = val / 100;
    rosette = createRosette();
    createCrest(rosette, icon.shape, inter_val);
}

//*--- Window-level interactions ---*//

const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//makes sure that the SVGs scale appropriately when window gets resized
$(window).resize(function() {
    $('#crestCanvas').width('100%');
    let w = $('#crestCanvas').width();
    $('#crestCanvas').height(w);
    createCrest(rosette, icon.shape, inter_val);
});

//blur video background as user scrolls on the page
$(window).scroll(function() {
    let scroll = this.scrollY;
    let blur_val = scale(scroll, 0, 600, 0, 15);
    if (blur_val > 15) {
        blur_val = 15;
    }
    let blur_str = 'blur(' + blur_val + 'px)';
    $('#videobcg').css({ '-o-filter': blur_str, 'filter': blur_str });
});