$('#btn_save_server').click(function() {
	contacts = $('#contacts').html();
	
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
	
	$.ajax({
		type: "POST",
		url: 'http://www.local/mobile-sync/save_contacts.php',
		data: { contacts: contacts },
		beforeSend: function() {
			
		},
		success: function(data) {
			alert('done');
		},
		error: function(request, status, error) {
			alert('error: ' + request.responseText);
		}
	});
});