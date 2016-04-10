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
VhplabMap.prototype.initialize = function(_opts) {
	if (typeof _opts.url != "undefined") this.baseURL = _opts.url;
	if (typeof _opts.markers != "undefined") this.markersURL = this.baseURL + _opts.markers;
	if ((typeof _opts.recherche != "undefined")&&(_opts.recherche != false)) this.markersURL +=  '&recherche=' + _opts.recherche;
	if ((typeof _opts.auteur != "undefined")&&(_opts.auteur != false)) this.markersURL +=  '&auteur=' + _opts.auteur;
	if ((typeof _opts.categoria != "undefined")&&(_opts.categoria != false)) this.markersURL +=  '&categoria=' + _opts.categoria;
	if ((typeof _opts.tag != "undefined")&&(_opts.tag != false)) this.markersURL +=  '&tag=' + _opts.tag;
	if ((typeof _opts.meta_tag != "undefined")&&(_opts.meta_tag != false)) this.markersURL +=  '&meta_tag=' + _opts.meta_tag;
	if (typeof _opts.open != "undefined") this.open = _opts.open;
	this.createMap(_opts);
	this.initMapElements(_opts);
	if (this.markersURL != '') this.loadMarkers();
};
VhplabMap.prototype.initMapElements = function(_opts) {
	
	// Map Zoom Custom Control
	this.zoomControl = new vhplabZoomControl();
	this.zoomControl.setParent(this);
	this.map.addControl(this.zoomControl);
	
	// Map Loading Custom Control
	this.loadingControl = new vhplabLoadingControl();
	this.map.addControl(this.loadingControl);
	
	/*
	// Credits as custom control
  	this.credits = new VhplabCreditsControl();
  	$.get(cgeomap.url_site + "spip.php?page=ajax-credits", function(data) {
  		self.credits.initialize(self.map, data);
	});
	// Map Loading Custom Control
	this.LoadingControl = new VhplabLoadingControl();
	this.LoadingControl.initialize(this.map);
	*/
};
VhplabMap.prototype.loadMarkers = function() {
	var self = this;
	var url = this.markersURL +'&callback=?';
	// get URL via alert(url);
	$.ajax({
		type: 'GET',
		url: url,
		async: false,
		crossDomain: true,
		jsonpCallback: 'jsonArticles',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(_data, _textStatus, _jqXHR) {
			// get _data via alert(_data.toSource());
			self.addMarkers(_data);
		},
		error: function (xhr, ajaxOptions, thrownError) {
		}
	});			
};
VhplabMap.prototype.bindActions = function() {
	$('#loading').fadeOut();
	this.openMarker();
};

// ************ //
// Vhplab Marker
// ************ //

VhplabMarker.prototype.click = function(_callback) {
	if(!this.open) {
		var self = this;
		if (this.loadded) {
			this.openInfoWindow();
		} else {
			// get URL via alert(this.json);
			$('.leaflet-control-loading').fadeIn();
			$.getJSON(this.json, function(data) {
				$.each(data[0].marker, function(i, marker){
					$('.leaflet-control-loading').fadeOut();
					self.loadWindowData(marker);
					self.openInfoWindow();
					if(_callback) _callback();
				});
			});
		}
	}
};

//***********
// Map Loading Custom Control
//***********
var vhplabLoadingControl = L.Control.Zoom.extend({
	options: {
		position: 'topleft'
	},
	onAdd: function (map) {
		var name = 'leaflet-control-loading',
			container = L.DomUtil.create('div', name + ' leaflet-control');
		this._map = map;
		return container;
	}
});