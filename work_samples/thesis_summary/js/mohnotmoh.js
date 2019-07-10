//*----------------------*//
//Mimics a printing job for Section 2, Passports
//*----------------------*//


let photo_index = 1;
let load_progress = 0;
let loadInterval;

function classify_as_mohammad() {

	$('#passport').height('0%');

    let source = 'media/passports/p' + photo_index + 'c.png';
    $('#passport').css('background-image', 'url(' + source + ')');

    if (photo_index < 4) {
        photo_index++;
    } else {
        photo_index = 1;
    }

    print_loading();

}

function classify_as_not_mohammad() {

	$('#passport').height('0%');

    let source = 'media/passports/p' + photo_index + 'o.png';
    $('#passport').css('background-image', 'url(' + source + ')');

    if (photo_index < 4) {
        photo_index++;
    } else {
        photo_index = 1;
    }

    print_loading();

}

function print_loading() {
	$('.starting_text').hide();
    $('#loading_bar').show();
    loadInterval = setInterval(loadtime, 500);
}

function loadtime() {
    if (load_progress < 100) {
        load_progress += 10;

        $('#loading_label').html('Sending job...');
        $('#loading_inner').width(load_progress + '%');
        
        $('#passport').height(load_progress+'%');

        $('#moh').attr("disabled", true);
        $('#not_moh').attr("disabled", true);

    } else {
        $('#loading_label').html('Printing done');
        load_progress = 0;
        $('#loading_inner').width(load_progress + '%');
        clearInterval(loadInterval);
        $('#loading_bar').hide();
        $('#moh').attr("disabled", false);
        $('#not_moh').attr("disabled", false);

        let photo_source = 'media/mohs/w-' + photo_index + '.jpg';
        $('#photo').attr('src', photo_source);
    }

}