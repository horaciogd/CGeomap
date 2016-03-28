/*
 * VHPlab base plugin
 * lat, lng, zoom
 *
 * JavaScript document to alter prototypes
 *
 * Author:
 * Horacio González
 * (c) 2016 - Distribuído baixo licencia GNU/GPL
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
	/* title & subtitle */
	$('#article .titre').html($(this.data).data('titre'));
	$('#article .soustitre').html($(this.data).data('soustitre'));
	/* texte */
	$('#article .texte').html($(this.data).data('texte'));
	$('#article .texte a.fancybox').fancybox();
};
VhplabMarker.prototype.bindPopupActions = function(_content) {
	$('a.fancybox', _content).click(function(){
		var img = $(this).attr('href');
		$.fancybox({ 'href' : img });
		return false;
	});
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
	this.parent.map.setView([this.lat, this.lng], this.zoom);
	this.infoWindow.openOn(this.parent.map);
	this.open = true;
	this.parent.open = this.id;
	var base_fb_url = $('#navigation .user .facebook').data('base_href');
	$('#navigation .user .facebook').attr('href', base_fb_url + '/?nodo=' + this.id);
};