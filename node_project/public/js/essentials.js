
// check if the object is empty or not
function isEmpty(obj) {
    if (obj == null){
    	return true;
    }
    else if(obj == undefined){

    	return true;
    }

    return Object.keys(obj).length === 0;

}



// creating space for playlist
function create_space(){
	var playdiv = document.getElementById('playlist_area');


	// generating five items for playlist
	for(var i = 0; i < 5; i++){
		var list = document.createElement('li');
		var child_div = document.createElement('div');
		child_div.className = "song_div";

		
		// creating a heading element
		var child_head = document.createElement('input');
		child_head.className = "song_head";
		child_head.type = 'submit';
		child_head.value = 'Fetching... ';

		// styling the the heading
		child_head.style.color = "white";
		child_head.style.background= "transparent";
		child_head.style.borderStyle = 'none';
		child_head.style.fontSize= '30px';
		child_head.style.alignContent = 'center';
		child_head.style.textTransform = 'capitalize';
	

		// creating a text node for head node
		var txt_node = document.createTextNode("song_no " + (i + 1));

		child_head.appendChild(txt_node);
		child_div.appendChild(child_head);
		list.appendChild(child_div);
		playdiv.appendChild(list);
	}
}



// returns an  info object
function get_song_info(song_id){
		var result = 1
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
	  	if (this.readyState == 4 && this.status == 200) {
	    	
	  		// json object would be parsed

	  		var info = JSON.parse(this.responseText);
	  		console.log("response from getinfobyid ", info);
	  		if (!(isEmpty(info))){

	  			 result = info
	  		}
	  		else{
	  			console.log("song info not received");
	  			result = null;
	  		}

	    }
	    else{
	    	console.log("data was not fetched")
	    	result = null;
	    }
	  };
	  xmlhttp.open("GET", "api/getinfobyid/?id=" + song_id, true);
	  xmlhttp.send();

	delay();
	return result

}


// set the current song
function set_cur_song(){
	if((!isEmpty(obj)) && (cur_song_id == null)){
		cur_song_id = Object.keys(obj)[0].id;
		c_info = get_song_info(cur_song_id)
		playme(c_info);
	}
}


// assigning signature
function assign_signature(){
	var obj = get_play_list_from_server();
	set_cur_song();

	var song_div = document.getElementsByClassName("song_div");
	if(obj){
		var i = 0
		for(var key in obj){
			// adding more signature to the playlist
			song_div[i].childNodes[0].id = obj[key].id;
			song_div[i].childNodes[0].value = obj[key].title + ' ' + obj[key].artist;
			song_div[i].childNodes[0].name = obj[key].title
			song_div[i].childNodes[0].onclick = function() { playme(get_song_info(this.id)); };
			i++; 	


		}
	}

}


// updates the player
function updatePlayer(song_title, song_artist, audio_file){
        var player = $("#jplayer_1");

        player.jPlayer({
        ready: function () { 
          $(this).jPlayer("setMedia", { 
          	title:song_title,
			artist: song_artist,
			mp3: audio_file

          }); 
          $(this).jPlayer("play", 0);
        },
        swfPath: "/js",
        supplied: "mp3",

      }); 
      player.jPlayer("setMedia", { 
            mp3: guid
          }); 
      player.jPlayer("play", 0);
    }


// implementing play next in play list
function play_next(){
	var flag = 0;

	for(var key in obj){
		if(obj[key].id == cur_song_id){
			flag = 1;
		}
		if((obj[key].id != cur_song_id) && (flag == 1)){
			playme(obj[key]);
			return;
		} 

	}

	for(var key in obj){
		if(obj[key].id == cur_song_id){
			flag = 1;
		}
		if((obj[key].id != cur_song_id) && (flag == 1)){
			playme(obj[key]);
			return;
		} 
	}
}



function hightlight_in_list(c_info){

	var all = document.getElementsByClassName("song_head");
	for(var i = 0; i < all.length; i++){
		if(all[i].id != c_info.id){
			all[i].style.textDecoration = 'none';
		}
		else{
			all[i].style.textDecoration = 'blink';
		}
	}


}



// this function will play the song
function playme(c_info){
	// destroying the current session of jPlayer
	$("#jjplayer_1").jPlayer("destroy");

	// updates the player
	updatePlayer(c_info.title, c_info.artist, c_info.filename);



	cur_song_id = c_info.id;
	var title = document.getElementById("current_song_played");
	title.innerHTML = c_info.title;
	// highliting in the list
	highlight_in_playlist(c_info);
	// changing the name 
	document.getElementById('current_song_played').innerHTML = c_info.title;
}




function delay(){
	setTimeout(function(){}, 2000);
}


// a function to get the songlist from the server
function get_play_list_from_server(){
	var xmlhttp = new XMLHttpRequest();
      	xmlhttp.onreadystatechange = function() {
      	if (this.readyState == 4 && this.status == 200) {
        	
      		// json object would be parsed
      		var result = JSON.parse(this.responseText);
      		console.log(result);
      		var string = result.body;
      		var idarr = string.split(" ");
      		for(var i = 0; i < idarr.length; i++){
      			idarr[i] = parseInt(idarr[i]);
      		}
      		console.log(idarr);

      		for(var i = 0; i < idarr.length; i++){
      			obj.idarr[i] = get_song_info(idarr[i]);
      		}

      		if(!(isEmpty(obj))){
				assign_signature();

      			console.log("songs are successfully received"); 	
      		} 
      		else{
      			console.log("songs not received");
      		}
        }
        else{
        	console.log("songs were not fetched")
        }
      };
      xmlhttp.open("GET", "api/getplaylistdata", true);
      xmlhttp.send();
    
}



// like change the status of the like song
function liked(){
	var l_button = document.getElementById("like_button");
	if(l_button.flag == '1'){
		l_button.style.backgroundColor = "transparent";
		l_button.flag = '0';

		// sending the server request to tweak the playlist for liking the song
		var xmlhttp = new XMLHttpRequest();
      	
      	xmlhttp.onreadystatechange = function() {
      	if (this.readyState == 4 && this.status == 200) {
        	console.log("liked info sent")
        	assign_signature();

        }
        else{
        	console.log("liked info not sent")
        }
      };
    
	    xmlhttp.open("POST", "api/like/id?id=" + cur_song_id, true);
	  	xmlhttp.send();

	}
	else{
		l_button.style.backgroundColor = "#e6005c";
		l_button.flag = '1';


		// sending the server request to tweak the playlist for disliking the song
		var xmlhttp = new XMLHttpRequest();
      	
      	xmlhttp.onreadystatechange = function() {
      	if (this.readyState == 4 && this.status == 200) {
        	console.log("liked info sent")
        	assign_signature();

        }
        else{
        	console.log("liked info not sent")
        }
      };
    
	    xmlhttp.open("POST", "api/unlike/id?id=" +cur_song_id, true);
	  	xmlhttp.send();
	}


}


create_space();
assign_signature();
console.log("hello + " + get_song_info(58));
var obj = {}
var cur_song_id = null;
