/*
 * VHPlab base plugin
 * lat, lng, zoom
 *
 * JavaScript document to alter prototypes
 *
 * Author:
 * Horacio González
 * (c) 2015 - Distribuído baixo licencia GNU/GPL
 *
 */

//***********
// Vhplab Map
//***********
VhplabMap.prototype.bindActions = function() {
	cgeomap.createNavigationList();
	cgeomap.bindNavigationListActions();
	if (this.open) {
		var marker = $(this.markers).data('marker_'+this.open);
		marker.click();
	}
};

// ************ //
// Vhplab Marker
// ************ //
VhplabMarker.prototype.appendContent = function() {
	$('#content .wrapper').empty();
	$('#content .wrapper').append('<hgroup></hgroup>');
	$('#content .wrapper hgroup').append('<h1>'+ this.titre +'</h1>');
	$('#content .wrapper hgroup').append('<h2>'+ $(this.data).data('soustitre') +'</h2>');
	$('#content .wrapper').append('<div class="texte">'+ $(this.data).data('texte') +'</div>');
	$('#content .wrapper a.fancybox').fancybox();
};
VhplabMarker.prototype.click = function() {
	if(!this.open) {
		var self = this;
		if (this.loadded) {
			cgeomap.slideContent('hide', function() {
				self.appendContent();
				cgeomap.slideContent('show');
				self.openInfoWindow();
			});
		} else {
			$('#loading_content').fadeIn();
			cgeomap.slideContent('hide', function() {
				// get URL via alert(self.json);
				$.getJSON(self.json, function(data) {
					$('#loading_content').fadeOut();
					$.each(data[0].marker, function(i, marker){
						self.loadWindowData(marker);
						self.appendContent();
						cgeomap.slideContent('show');
						self.openInfoWindow();
					});
				});
			});
		}
	}
};
VhplabMarker.prototype.openInfoWindow = function() {
	if(this.parent.open) {
		var open = $(this.parent.markers).data('marker_'+this.parent.open);
		open.closeInfoWindow();
	}
	this.infoWindow.open(this.map, this.marker);
	this.open = true;
	this.parent.open = this.id;
	var base_fb_url = $('#navigation .user .facebook').data('base_href');
	$('#navigation .user .facebook').attr('href', base_fb_url + '/?nodo=' + this.id);
};

// ************ //
// InfoBox
// ************ //
InfoBox.prototype.bindActions = function(_content) {
	$('a.fancybox', this.div_).click(function(){
		var img = $(this).attr('href');
		$.fancybox({ 'href' : img });
		return false;
	});
};