$(document).ready(function() {
	//get all the contacts without applying any filter
	var cursor = navigator.mozContacts.getAll({});
	
	cursor.onsuccess = function() {
		
		if(cursor.result) {
			//take the contact name as a heading
			var contact = "<div><h3>" + cursor.result.name + "</h3>";
			console.log( cursor.result.photo );
			
			
			
			//loop through all the properties of the contact
			$.each(cursor.result, function(key, value) {
				
				//if a picture is provided, treat it differently
				if( key == 'photo' && value != null ) {
					//large contact photo create from blob object
					contact += "<div><img src='" + window.URL.createObjectURL(value[0]) + "' /></div>";
					//small contact photo create from blob object
					contact += "<div><img src='" + window.URL.createObjectURL(value[1]) + "' /></div>";
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
			
			cursor.continue();
		}
	};
	
	cursor.onerror = function() {
		alert("Error getting contacts");
		
		console.log(cursor.error);
	};
});