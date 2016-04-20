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
		open: (typeof _opts.open != "undefined") ? _opts.open : false
	});
};