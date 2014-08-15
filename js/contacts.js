var contacts = [];

$(document).ready(function() {
	//get all the contacts without applying any filter
	var cursor = navigator.mozContacts.getAll({});
	
	cursor.onsuccess = function() {
		
		if(cursor.result) {
			//take the contact name as a heading
			var contact = "<div><h3>" + cursor.result.name + "</h3>";
			var id = cursor.result.id;
			console.log( id );
			//loop through all the properties of the contact
			$.each(cursor.result, function(key, value) {
				
				//if a picture is provided, treat it differently
				if( key == 'photo' && value != null && value.length != 0 ) {
					try {
						//large contact photo create from blob object
						contact += "<div><img src='" + window.URL.createObjectURL(value[0]) + "' /></div>";
						
						//upload the image to the server
						var reader = new window.FileReader();
						reader.readAsDataURL( value[0] );
						reader.onloadend = function() {
							$.ajaxPrefilter(function(options) {
								if (options.xhrConstructParam) {
									options.xhr = function() {
										return new window.XMLHttpRequest(options.xhrConstructParam);
									}
								}
							});
							
							//for FirefoxOS (require "mozSystem" param in AJAX calls)
							var xhrConstructParam = null;
							xhrConstructParam = {
								mozSystem: true
							};
							
							//default settings for AJAX methods
							$.ajaxSetup({
								xhrConstructParam: xhrConstructParam
							});
							
							//prepare data for sending image data
							base64data = reader.result;
							data = {}
							data['id'] = id;
							data['base64data'] = base64data;
							
							$.ajax({
								type: "POST",
								url: 'http://192.168.100.4/mobile-sync/save_image.php',
								data: { data: data },
								timeout: 3000,
								beforeSend: function() {
								},
								success: function(data) {
									
								},
								error: function(request, status, error) {
									alert('error: ' + request.responseText);
								}
							});
						}
						
						//small contact photo create from blob object
						contact += "<div><img src='" + window.URL.createObjectURL(value[1]) + "' /></div>";
					}
					catch(e) {
						console.log("Photo Error for '" + cursor.result.name[0] + "'");
						console.log(e);
					}
				}
				//make sure the property is not set to null not it matches any of the skipped list
				else if( value != null && $.inArray( key, ["init", "toJSON"] ) < 0 ) {
					
					//for complex objects, list all of their childs
					if( typeof(value) === 'object' && $.inArray( key, ["name", "givenName", "additionalName", "familyName"] ) < 0 ) {
						contact += "<div><strong>" + key + ": </strong>";
						for( var i = 0; i < value.length; i++ ) {
							contact += "<div>" + value[i].type + " " + value[i].value + "</div>";
						}
						contact += "</div>";
					}
					else {
						contact += "<div><strong>" + key + ": </strong>" + value + "</div>";
					}
				}
			});
			
			//fill the contacts on the page
			$('#contacts').html( $('#contacts').html() + contact );
			
			//add the raw result into the contacts array
			contacts.push( cursor.result );
			cursor.continue();
		}
	};
	
	cursor.onerror = function() {
		alert("Error getting contacts");
		
		console.log(cursor.error);
	};
});