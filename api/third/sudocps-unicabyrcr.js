(function() {
                 
	// Localize jQuery variable
	//var jQuery;
	 
	/******** Load jQuery if not present *********/
	if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.11.1') {
		var script_tag = document.createElement('script');
		script_tag.setAttribute("type","text/javascript");
		script_tag.setAttribute("src",
		"http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
		if (script_tag.readyState) {
		  script_tag.onreadystatechange = function () { // For old versions of IE
			  if (this.readyState == 'complete' || this.readyState == 'loaded') {
				  scriptLoadHandler();
			  }
		  };
		} else { // Other browsers
		  script_tag.onload = scriptLoadHandler;
		}
		// Try to find the head, otherwise default to the documentElement
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
	} else {
		// The jQuery version on the window is the one we want to use
		jQuery = window.jQuery;
		main();
	}
	 
	/******** Called once jQuery has loaded ******/
	function scriptLoadHandler() {
		// Restore $ and window.jQuery to their previous values and store the
		// new jQuery in our local jQuery variable
		jQuery = window.jQuery.noConflict(true);
		// Call our main function
		main();
	 
	}
	 
	/******** Our main function ********/
	function main() {
		jQuery(document).ready(function($) {
			var rcr = $('#sudocps-unicabyrcr').attr("rcr");
			// We can use jQuery 1.4.2 here
/******* Load Bootstrap CSS *******/
var css_link = $("<link>", { 
rel: "stylesheet", 
type: "text/css", 
href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" 
});
css_link.appendTo('head');  
/******* Load Bootstrap JS *******/
var js_link = $("<script>", {  
src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" 
},"<\/script>");
js_link.appendTo('head');
			/******* Load HTML widget statique*******/
	$.fn.showLinkLocation = function() {
				var link = $("#widget");
				//link.append('<ul></ul');
				   link.append('<div class="panel panel-default" style="width:300px;"><div class="panel-heading"><h3 class="panel-title">Unicas du RCR '+rcr+'</h3></div><div class="panel-body" style="height: 350px;overflow-y: scroll;"><ul id="content" class="list-group"></ul></div></div>')
				   $.ajax({
			url: 'http://sudocps.univ-cotedazur.fr/sudocps-pro-app/api/rcr2unicas/'+rcr,
			type: 'GET',
			dataType: 'json',
			success: function(response) {
				result = response.unicas;
				console.log(result.length);
				for (var i = 0; i <= result.length; i++) {
				   $("#content").append('<li class="list-group-item">' + result[i].record.titre + '<p><button class="btn btn-primary btn-xs" type="button">ISSN '+result[i].record.issn+'</button></p><p><i>'+result[i].loc.etat_de_collection+'</i></p></li>');
			   }
			}
		});
			return link;
		};
	 $( "#widget" ).showLinkLocation();
		});
	}
	})(); 