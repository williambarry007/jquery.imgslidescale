/*
* File: jquery.imgslidescale.js
* Author: William Barry (http://williambarry.net)
*/

$.imgslidescale = {
	
	// User-definable options
	image_id: 'iss_image',	// id of the image to replace
	width: 150, 			// width of the draggable viewport
	height: 150,			// height of the draggable viewport
	update_path: '',		// Page that should receive the update info
	upload_path: '',		// Page that should receive the uploaded file
	extra_args: {},			// Extra arguments to be passed to the update and upload functions 
	
/******************************************************************************/

	x: 0,	// Current left offset of image
	y: 0,   // Current top offset of image
	w: 0,   // Original width of image
	h: 0,   // Original height of image
	w2: 0,  // Current width of image
	h2: 0,  // Current height of image
	scale: 1,
		       
/******************************************************************************/

	init: function(options) {
		// Set any user options
		for (var thing in options)
			this[thing] = options[thing];
				
		// Strip the querystring off the image and append a new one
		var d = new Date();
		var src = $('#'+this.image_id).attr('src').split('?')[0] + '?' + d.valueOf();

		// Get the width and height of the image
		var this2 = this;
		$('<img/>')
			.attr('src', src)
			.load(function() {
				this2.w = this2.w2 = this.width;
				this2.h = this2.h2 = this.height;
				this2.initSlider();
			});
	},
	
/******************************************************************************/

	initSlider: function() {
		var this2 = this;
		
		var div = this.getDiv();
		$('#'+this.image_id).replaceWith(div);
		
		// Create a draggable div
		$('#iss_draggable').draggable({
			stop: function(event, ui) {
				this2.x = ui.position.left;
				this2.y = ui.position.top;
			}
		});
		$('#iss_slider').slider({
			min: 0,
			max: 200,        
			value: 100,
			slide: function(event, ui) {
				
				// Get the center of the image
				var cx = this2.x + this2.w2/2;
				var cy = this2.y + this2.h2/2;
	                                
				// Get the new width and height
				this2.scale = ui.value > 0 ? ui.value/100 : 0;
				this2.w2 = Math.round(this2.scale*this2.w);
				this2.h2 = Math.round(this2.scale*this2.h);
				
				// Get the new offset based on the new dimensions
				this2.x = Math.round(cx - (this2.w2/2));
				this2.y = Math.round(cy - (this2.h2/2));
	
				// Set the new values
				$('#iss_draggable').css({top: this2.y, left: this2.x});
				$('#iss_image').css({width: this2.w2, height: this2.h2});
			}
		});
	},

/******************************************************************************/

	getDiv: function() {
		var this2 = this;
		
		var container = $('<div/>')
			.attr('id', 'iss_container')
			.css({ width: this.width });
		var d = new Date();
		
		// The upload form
		var form = $('<form/>')
			.attr('id', 'iss_upload_form')
			.attr('target', 'iss_upload_iframe')
			.attr('action', this.upload_path + '?' + d.valueOf())
			.attr('method', 'post')
			.attr('enctype', 'multipart/form-data')
			.attr('encoding', 'multipart/form-data'); // for ie
		
		for (var thing in this.extra_args)
		{
			input = $('<input/>')
				.attr('type', 'hidden')
				.attr('name', thing)
				.val(this.extra_args[thing]);
			form.append(input);
		}

		var div = $('<div/>')
			.addClass('iss_file_wrapper2');
		var span = $('<span/>')
			.addClass('iss_file_wrapper');
		var input = $('<input/>')
			.attr('type', 'file')
			.attr('id', 'iss_upload_file')
			.attr('name', 'iss_upload_file');
		var span2 = $('<span/>')
			.addClass('iss_button');
		span.append(input);
		span.append(span2);
		div.append(span);
		form.append(div);

		var input = $('<input/>')
			.attr('id', 'iss_upload_btn')
			.attr('type', 'submit')
			.val('Upload')
			.click(this2.upload);
		form.append(input);
		container.append(form);
		
		// The draggable image
		var draggable_container = $('<div/>').attr('id', 'iss_draggable_container').css({width: this.width, height: this.height});
		var draggable 			= $('<div/>').attr('id', 'iss_draggable');
		var img = $('<img/>')
			.attr('id', 'iss_image')
			.attr('src', $('#'+this.image_id).attr('src'));
		draggable.append(img);
		draggable_container.append(draggable);
		container.append(draggable_container);

		// The scale slider		
		var slider_container	= $('<div/>').attr('id', 'iss_slider_container');
		var slider 				= $('<div/>').attr('id', 'iss_slider');
		slider_container.append(slider);
		container.append(slider_container);

		// The scale and crop button
		var btn = $('<input/>').attr('type', 'button').val('Scale and Crop').click(this2.update);
		container.append(btn);
		
		// Hidden iframe
		var iframe = $('<iframe name="iss_upload_iframe"></iframe>')
			.attr('id', 'iss_upload_iframe')
			.attr('src', '/blank.htm')
			.css({width: 0, height: 0, border: '0'});
		container.append(iframe);
		
		var message = $('<div/>')
			.attr('id', 'iss_message');
		container.append(message);

		return container;
	},
	
/******************************************************************************/

	update: function() {
		$('#iss_message').html("<p class='iss_loading'>Cropping picture...</p>");
		
		var this2 = $.imgslidescale;
		var data = {
			scale_width: this2.w2,
			scale_height: this2.h2,
			crop_width: this2.width,
			crop_height: this2.height,
			x: this2.x*-1,
			y: this2.y*-1,
			scale: this2.scale
		};
		for (var thing in this2.extra_args)
			data[thing] = this2.extra_args[thing];
		
		$.ajax({
			data: data,
			type: 'post',
			url: this2.update_path,
			success: function(resp)
			{
				this2.reset();
			}        
		});
	},
	
/******************************************************************************/

	upload: function() {
		$('#message').html("<p class='iss_loading'>Uploading picture...</p");
	},
	
/******************************************************************************/

	uploadHandler: function(resp) {
		if (resp.error)
			$('#iss_message').html("<p class='iss_note iss_error'>"+resp.error+"</p>");
		else
			this.reset();
	},

/******************************************************************************/

	reset: function() {
		this.x  = 0;
		this.y  = 0;
		this.scale = 1;
		this.refreshImage();
		$('#iss_message').empty();
		$('#iss_draggable').css({top: 0, left: 0});
		$('#iss_slider').slider('value', 100);		
	},
	
/******************************************************************************/
				
	refreshImage: function() {
		
		// Strip the querystring and append a new one
		var d = new Date();
		var newSrc = $('#iss_image').attr('src').split('?')[0] + '?' + d.valueOf();
		
		// Load the new src in the background, then set the image to the new src		
		var this2 = this;
		$('<img/>')
			.attr('src', newSrc)
			.load(function() {
				this2.w = this2.w2 = this.width;
				this2.h = this2.h2 = this.height;
				
				$('#iss_image')
					.attr('src', newSrc)
					.css({
						width: this.width,
						height: this.height
					});
			});
	}
		
/******************************************************************************/

};

function imgslidescale_uploadHandler(resp) {
	$.imgslidescale.uploadHandler(resp);
}
