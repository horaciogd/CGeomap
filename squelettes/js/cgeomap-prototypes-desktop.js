/*
 * VHPlab plugin for Commons CGEOMAP project and media localization
 *
 * JavaScript document to alter map prototypes
 *
 * Author:
 * Horacio González
 * (c) 2016 - Distribuído baixo licencia GNU/GPL
 *
 */
 
//***********
// Vhplab Interface
//***********
VhplabInterface.prototype.ready = function(_opts) {
 	this.map = new VhplabMap();
	this.map.initialize({
		url: this.url_site,
		markers: (typeof _opts.markers != "undefined") ? _opts.markers : '',
		limit: (typeof _opts.limit != "undefined") ? _opts.limit : 300,
		id: (typeof _opts.id != "undefined") ? _opts.id : 'cgeomap',
		zoom: (typeof _opts.zoom != "undefined") ? _opts.zoom : 10,
		latitude: (typeof _opts.latitude != "undefined") ? _opts.latitude : 0.0,
		longitude: (typeof _opts.longitude != "undefined") ? _opts.longitude : 0.0,
		open: (typeof _opts.open != "undefined") ? _opts.open : false,
		custom: (typeof _opts.custom != "undefined") ? _opts.custom : false,
		latitudeTag: (typeof _opts.latitudeTag != "undefined") ? _opts.latitudeTag : '.cartography .latitude',
		longitudeTag: (typeof _opts.longitudeTag != "undefined") ? _opts.longitudeTag : '.cartography .longitude',
		zoomTag: (typeof _opts.zoomTag != "undefined") ? _opts.zoomTag : '.cartography .zoom'
	});
	this.bindToggleContent();
};
VhplabInterface.prototype.loadArticleTemplate = function(_callback) {
	// get URL via alert(this.url_article);
 	$("#content .wrapper").load(this.url_article, function() {
 		$('#article .header .editer').click(function() { 
 			$(this).fadeOut('fast', function(){
 				cgeomap.toggleUtilities($(this).attr('name'));
 			});
 		});
 		cgeomap.loadUser();
		if(_callback) _callback();
	});
};
VhplabInterface.prototype.loadUser = function(_callback) {
	// get URL via alert(this.url_user);
	$("#user").load(this.url_user, function() {
		/* Session & Admin */
		if ($("#user .utilities").data("session") == "ok") cgeomap.session = true;
		if ($("#user .utilities").data("admin") == "ok") cgeomap.admin = true;
		/* Login */
		$('#user .login').hide();
		/* Utilities  */
		$("#content").data('selected','carte');
		$("#user .utilities .carte").addClass('on');
		$("#user .utilities a").click(function() { 
			cgeomap.toggleUtilities($(this).attr('name'));
		});
		/* Formulaire */
		$('#formulaire').hide();
	});
};