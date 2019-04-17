/*
 * VHPlab plugin for Commons CGEOMAP project and media localization
 *
 * JavaScript document to alter map prototypes
 *
 * Author:
 * Horacio González
 * (c) 2013 - Distribuído baixo licencia GNU/GPL
 *
 */

//***********
// Vhplab Interface
//***********
VhplabInterface.prototype.ready = function(_opts) {
	this.map = new VhplabMap();
	
	var open;
	var parametros = cgeomap.parseURL();
	if ((typeof parametros != "undefined")&&(typeof parametros.nodo != "undefined")) {
		open = parametros.nodo;
	} else {
		(typeof _opts.open != "undefined") ? open = _opts.open : open = false;
	}
	
	this.map.initialize({
		url: this.url_site,
		markers: (typeof _opts.markers != "undefined") ? _opts.markers : '',
		recherche: (typeof _opts.recherche != "undefined") ? _opts.recherche : false,
		auteur: (typeof _opts.auteur != "undefined") ? _opts.auteur : false,
		categoria: (typeof _opts.categoria != "undefined") ? _opts.categoria : false,
		tag: (typeof _opts.tag != "undefined") ? _opts.tag : false,
		meta_tag: (typeof _opts.meta_tag != "undefined") ? _opts.meta_tag : false,
		id: (typeof _opts.id != "undefined") ? _opts.id : 'cgeomap',
		zoom: (typeof _opts.zoom != "undefined") ? _opts.zoom : 10,
		latitude: (typeof _opts.latitude != "undefined") ? _opts.latitude : 0.0,
		longitude: (typeof _opts.longitude != "undefined") ? _opts.longitude : 0.0,
		open: open
	});
	this.bindToggleContent();
};
VhplabInterface.prototype.initialize = function(_opts) {
	
	// Avoid error if no _opts
	if (typeof _opts == "undefined") _opts = { };
	
	// Store url
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	if (this.url_site.slice(-1)!="/") this.url_site += "/";
	if (typeof _opts.url_article != "undefined") this.url_article = _opts.url_article;
	if (typeof _opts.url_user != "undefined") this.url_user = _opts.url_user;
	if (typeof _opts.url_submap != "undefined") this.url_submap = _opts.url_submap;
	
	$("#navigation").data('visible', true);
	$("#navigation .toggle_button").click(function(){
		cgeomap.toggleMapNavigation();
	});
	
	$('#navigation .user .facebook').click(function(){
		cgeomap.shareOverrideOGMeta();
		return false;
	});	
	
	// Map options
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	// load custom map prototypes 
	// console.log('load custom map prototypes');
	if (typeof _opts.custom_map_prototypes != "undefined") {
		$.getScript(_opts.custom_map_prototypes, function(data) {
			cgeomap.ready(_opts.map_opts);
		});
	// use standard prototypes
	} else {
		cgeomap.ready(_opts.map_opts);
	}
	
	// Initialize soundManager
	soundManager.setup({
		// disable or enable debug output
		debugMode: true,
  		// use HTML5 audio for MP3/MP4, if available
  		preferFlash: false,
  		useFlashBlock: true,
  		// path to directory containing SM2 SWF
  		url: 'swf/',
  		// optional: enable MPEG-4/AAC support (requires flash 9)
  		flashVersion: 9
  	});
  	
	this.initContent();
	
};
VhplabInterface.prototype.loadArticleTemplate = function(_callback) {
	// console.log('/* Map prototype */ cgeomap.loadArticleTemplate()');
	// Get URL via log
	// console.log('Article Template URL: '+ this.url_article);
	$("#content .wrapper").load(this.url_article, function() {
 		/* Editer */
 		$('#article .header .editer').remove();
 		$('#article header .permalink').remove();
 		/* Custom Scroll */
		$("#article .scroll").mCustomScrollbar({
			scrollInertia: 150,
			theme: "dark-thick"
		});
		/* Formulaire */
		$('#formulaire').remove();
		/* Contributions */
		$('#contributions').remove();
		/* Embed */
		$('#embed').remove();
		/* Callback */
		if(_callback) _callback();
	});
};
VhplabInterface.prototype.toggleMapNavigation = function() {
	var visible = $("#navigation").data('visible');
	if (visible) {
		$("#navigation .articles").slideUp();
		$("#navigation hgroup").fadeOut();
		$("#navigation").data('visible', false);
		$("#navigation .toggle_button").addClass('closed');
		$("#navigation").animate({ top: "-=145"}, "swing", function() {
		});
	} else {
		$("#navigation .articles").slideDown();
		$("#navigation").data('visible', true);
		$("#navigation hgroup").fadeIn();
		$("#navigation .toggle_button").removeClass('closed');
		$("#navigation").animate({ top: "+=145"}, "swing", function() {
		});
	}
};