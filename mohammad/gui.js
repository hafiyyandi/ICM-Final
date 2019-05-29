//functions tied to GUI's
const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//update icon (RIGHT)
function updateicon(str) {
    $('#customicon').attr('src', 'shapes/' + str + '.svg');
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

let inter_val = 0.5;

function update_angle(val) {
    han_angle = val;
    //$("#angle_value").html(han_angle);
    rosette = createRosette();
    createCrest(rosette, icon.shape, inter_val);
}

function update_width(val) {
    han_width = val / 10;
    //$("#width_value").html(han_width);
    rosette = createRosette();
    createCrest(rosette, icon.shape, inter_val);
}

//update interpolation slider
function update_inter(val) {
    inter_val = val / 100;
    //$("#inter_value").html(inter_val);
    rosette = createRosette();
    createCrest(rosette, icon.shape, inter_val);
}

$(window).resize(function() {
    $('#crestCanvas').width('100%');
    let w = $('#crestCanvas').width();
    $('#crestCanvas').height(w);
    createCrest(rosette, icon.shape, inter_val);
});

$(window).ready(function() {

    $('#crestCanvas').width('100%');
    let w = $('#crestCanvas').width();
    $('#crestCanvas').height(w);

    $('#moh').click(classify_as_mohammad);
    $('#not_moh').click(classify_as_not_mohammad);
    $('#loading_bar').hide();

    let h = $('#photo_window').height();
    $('#passport_window').height(h);
    $('#print_job').height(0.8*h);

    //center the main title
    let video_h = $('#videobcg').height();
    $('#intro').css({'top': video_h/2});
});

window.addEventListener("scroll", function (event) {
    let scroll = this.scrollY;
    //console.log(scroll);
    let blur_val = scale(scroll, 0, 600, 0, 15);
    
    if (blur_val > 15){
        blur_val = 15;
    }
    
    let blur_str = 'blur('+blur_val+'px)';

    $('#videobcg').css({'-o-filter': blur_str, 'filter': blur_str});
});