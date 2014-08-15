function send_data(counter) {
	$.ajax({
		type: "POST",
		url: 'http://192.168.100.4/mobile-sync/save_contacts.php',
		data: { contacts: JSON.stringify(contacts[counter]) },
		beforeSend: function() {
			
		},
		success: function(data) {
			if( counter < contacts.length ) {
				setTimeout( send_data( ++counter ), 500 );
			}
		},
		error: function(request, status, error) {
			alert('error: ' + request.responseText);
		}
	});
}

$('#btn_save_server').click(function() {
	
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
	
	send_data( 0 );
	//send the contact over ajax one by one
	//for(var i = 0; i < contacts.length; i++) {
		
		//setTimeout( send_data( contacts[i] ), 500 );
		//$.delay(500);
	//}
	
});