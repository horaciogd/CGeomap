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

VhplabMap.prototype.bindActions = function() {
	cgeomap.createNavigationList();
	cgeomap.bindNavigationListActions();
	if (this.open) {
		var marker = $(this.markers).data('marker_'+this.open);
		marker.click();
	}
};
VhplabMarker.prototype.openInfoWindow = function() {
	if(this.parent.open) {
		var open = $(this.parent.markers).data('marker_'+this.parent.open);
		open.closeInfoWindow();
	}
	$(".cgeomap .window a.fancybox").fancybox();
	var base_fb_url = $('#navigation .user .facebook').data('base_href');
	$('#navigation .user .facebook').attr('href', base_fb_url + '/?nodo=' + this.id);
	this.infoWindow.show();
	this.open = true;
	this.parent.open = this.id;
};