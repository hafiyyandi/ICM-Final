//use the same data structure for posting form inputs to server?
let placeholder = {
	name: "Johnny Doe",
	tagline: "Tagline",
	email: "hello@mywebsite.com",
	bio: {
		highlight: "Bio goes here.",
		body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
	},
	social : {
		insta: {
			handle: "@johndoe",
			following_count: "--"
		},
		twitter: {
			handle: "@johndoe",
			following_count: "--"
		},
		youtube: {
			handle: "johndoe",
			following_count: "--"
		}
	}
}

function updateShort(e){
	
	//get element-to-be-rendered from input's id
	let id = $(e).attr("id");
	id = "#" + id.substring(2);
	
	let val = $(e).val();

	if (val) {
		$(id).html(val);
		$(id).removeClass("untouched");
	} else { //if input has no value, put back placeholder
		$(id).html(eval("placeholder."+id.substring(1)));
		$(id).addClass("untouched");
	}

}

function updateBio(val){

	let highlight;
	let body;

	//parse bio input here
	//todo: recognize other punctuations: !

	if(val) {
		let bio = val.split(".");

		if (bio.length>1){ //if bio has more than 1 sentence, make the first sentence a highlight
			highlight = val.split(".")[0] + ".";
			body = val.substring(val.indexOf('.')+1);
		} else { //else don't highlight anything
			highlight = "";
			body = val;
		}
	} else { //if there isn't anything on the text box, default to placeholder
		highlight = placeholder.bio.highlight;
		body = placeholder.bio.body;
	}

	let bio_html = "<p> <span class=\"highlight\">" + highlight + "</span> " +
                   body + "</p>";
    $("#bio").html(bio_html);

}

function initPlaceholder() {
	$("#name").html(placeholder.name);
	$("#tagline").html(placeholder.tagline);
	$("#contact").html(placeholder.email);

	//Bio's HTML string
	let bio_html = "<p> <span class=\"highlight\">" + placeholder.bio.highlight + "</span> " +
                   placeholder.bio.body + "</p>";
    $("#bio").html(bio_html);
}

