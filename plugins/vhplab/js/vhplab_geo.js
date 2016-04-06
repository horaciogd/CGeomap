/*
 * VHPlab base plugin
 * lat, lng, zoom
 *
 * Author:
 * Horacio González
 * (c) 2016 - Distribuído baixo licencia GNU/GPL
 *
 */

//***********
// Vhplab Map
//***********
function VhplabMap() {
	this.map = null;
	this.maxZoomService = null;
	this.ZoomControl = null;
	this.geocoder = null;
	this.markerList = new Array();
	this.markers = {};
	this.open = false;
	this.totalMarkers = 0;
	this.clickableMarker = L.marker();
	this.msgWindow = L.popup({
		maxWidth: 370,
		minWidth: 370,
		offset: [0, -8]
	});
	this.baseURL = ''; 
	this.markersURL = '';
	this.offset = 0;
	this.limit = 200;
	this.latitudeTag = "#vhplab_latitude";
	this.longitudeTag = "#vhplab_longitude";
	this.zoomTag = "#vhplab_zoom";
};
VhplabMap.prototype.addMarker = function(_path, _data) {
	var marker = new VhplabMarker();
	marker.initialize(_path, _data, this);
	$(this.markers).data('marker_'+marker.id, marker);
	this.markerList.push(marker.id);
};
VhplabMap.prototype.addMarkers = function(_data, _callback) {
	var n = this.offset;
	var self = this;
	var count = $(_data.markers).length - 1;
	var path = _data.link;
	// Loop through each marker data element
	$.each(_data.markers, function(i, marker) {
		n++;
		self.addMarker(path, marker, n);
		if(i==count) {
			var loadded = self.markerList.length;
			self.bindActions();
			if (_callback) _callback();
		}
	});
};
VhplabMap.prototype.bindActions = function() {
	if (this.open) {
		var marker = $(this.markers).data('marker_'+this.open);
		marker.click();
	}
};
VhplabMap.prototype.clickListener = function(_e) {
	this.clickableMarker.setLatLng(_e.latlng);
	//this.clickableMarker.setOpacity(1);
	this.clickableMarker.addTo(this.map);
	this.map.panTo(_e.latlng);
	$(this.latitudeTag).val(_e.latlng.lat);
	$(this.longitudeTag).val(_e.latlng.lng);
	$(this.zoomTag).val(this.map.getZoom());
};
VhplabMap.prototype.codeAddress = function(_address) {
	this.geocoder.geosearch(_address);
};
VhplabMap.prototype.closeOpenMarker = function() {
	if(this.open) {
		var open = $(this.markers).data('marker_'+this.open);
		open.closeInfoWindow();
	}
};
VhplabMap.prototype.createMap = function(_opts) {
	this.lat = _opts.latitude;
	this.lng = _opts.longitude;
	this.zoom = _opts.zoom;
	this.map = L.map(_opts.id, { zoomControl: false }).setView([_opts.latitude, _opts.longitude], _opts.zoom);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(this.map);
};
VhplabMap.prototype.hideMarkers = function(_exception) {
	if (typeof _exception != "undefined") {
		$.each($(this.markers).data(),function(i, e) {
			if (jQuery.inArray(e.id, _exception)<0) cgeomap.map.map.removeLayer(e.marker);
		});
	} else {
		$.each($(this.markers).data(),function(i, e) {
			cgeomap.map.map.removeLayer(e.marker);
		});
	}
};
VhplabMap.prototype.initialize = function(_opts) {
	if (typeof _opts.offset != "undefined") this.offset = _opts.offset;
	if (typeof _opts.limit != "undefined") this.limit = _opts.limit;
	if (typeof _opts.url != "undefined") this.baseURL = _opts.url;
	if (typeof _opts.markers != "undefined") this.markersURL = this.baseURL + _opts.markers;
	if (typeof _opts.latitudeTag != "undefined") this.latitudeTag = _opts.latitudeTag;
	if (typeof _opts.longitudeTag != "undefined") this.longitudeTag = _opts.longitudeTag;
	if (typeof _opts.zoomTag != "undefined") this.zoomTag = _opts.zoomTag;
	if (typeof _opts.open != "undefined") this.open = _opts.open;
	this.createMap(_opts);
	this.initMapElements(_opts);
	if (this.markersURL != '') this.loadMarkers();
};
VhplabMap.prototype.initMapElements = function(_opts) {
	// Max Zoom Service
	
	// Map Zoom Custom Control
	this.zoomControl = new vhplabZoomControl();
	this.zoomControl.setParent(this);
	this.map.addControl(this.zoomControl);
	
	// Geocoder
	this.geocoder = new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.OpenStreetMap()
    });
	
	if ((typeof _opts.formulaire != "undefined")&&(_opts.formulaire==true)) {
		// Clickable Marker
    	this.setInitialMarker(_opts);
    	// Listeners
    	var self = this;
		this.map.on('click', function(_e){
			self.clickListener(_e);
		});
		this.map.on('zoomend', function(_e){
			self.zoomListener(_e);
		});
	}
};
VhplabMap.prototype.loadMarkers = function() {
	var self = this;
	// load markers data
	// get URL via alert(this.markersURL +'&offset='+ this.offset +'&limit='+ this.limit +'&callback=?');
	$.getJSON(this.markersURL +'&offset='+ this.offset +'&limit='+ this.limit +'&callback=?', function(data){
		self.addMarkers(data[0]);
	});					
};
VhplabMap.prototype.openMarker = function() {
	if (this.open) {
		var marker = $(this.markers).data('marker_'+this.open);
		marker.click();
	}
};
VhplabMap.prototype.panOut = function() {
	this.map.setView([this.lat, this.lng], this.zoom);
};
VhplabMap.prototype.reloadMarkers = function(_url, _callback) {
	var self = this;
	// load markers data
	// get URL via alert(_url);
	$.getJSON(_url, function(data){
		//alert(data.toSource());
		self.updateMarkers(data[0], function(){
			self.reloadMarkers(_callback);
		}, function(){
			if (_callback) _callback();
		});
	});
	$.getJSON(this.markersURL +'&offset='+ this.offset +'&limit='+ this.limit +'&var_mode=recalcul&callback=?', function(data){});				
};
VhplabMap.prototype.setInitialMarker = function(_opts) {
	var url, visible;
	(typeof _opts.visible != "undefined") ? visible = _opts.visible : visible = 1;
	if (typeof _opts.default_icon != "undefined") {
		url = _opts.default_icon;
	} else if ((typeof $("#formulaire .icon").attr("src") != "undefined")&&($("#formulaire .icon").attr("src") != "")) {
		url = $("#formulaire .icon").attr("src");
	} else {
		url = this.baseURL + 'plugins/vhplab/images/icons/default_icon.png';
	}
	var icon = L.icon({
		iconUrl: url,
    	iconRetinaUrl: url,
    	iconSize: [60, 60],
		iconAnchor: [30, 60]
	});
	this.clickableMarker.setIcon(icon);
	var latitude, longitude, zoom;
	var pos = this.map.getCenter();
	(typeof _opts.latitude!="undefined") ? latitude = _opts.latitude : latitude = pos.lat;
	(typeof _opts.longitude!="undefined") ? longitude = _opts.longitude : longitude = pos.lng;
	(typeof _opts.zoom!="undefined") ? zoom = _opts.zoom : zoom = this.map.getZoom();
	if ( ((latitude==0.0)&&(longitude==0.0)&&(navigator.geolocation)) || ((typeof _opts.position!="undefined")&&(_opts.position=="geolocation")) ) {
		var self = this;
		navigator.geolocation.getCurrentPosition(function(position) {
			// succes
			self.map.setView([position.coords.latitude, position.coords.longitude], zoom);
			self.clickableMarker.setLatLng([position.coords.latitude, position.coords.longitude]);
			$(self.latitudeTag).val(position.coords.latitude);
			$(self.longitudeTag).val(position.coords.longitude);
			$(self.zoomTag).val(zoom);
		}, function() {
			// error
		});
	} else {
		this.map.setView([latitude, longitude], zoom);
		this.clickableMarker.setLatLng([latitude, longitude]);
		$(this.latitudeTag).val(latitude);
		$(this.longitudeTag).val(longitude);
		$(this.zoomTag).val(zoom);
	}
	if (visible==1) this.clickableMarker.addTo(this.map);
	//this.clickableMarker.setOpacity(visible);
};
VhplabMap.prototype.showMarkers = function(_exception) {
	if (typeof _exception != "undefined") {
		$.each($(this.markers).data(),function(i, e) {
			if (jQuery.inArray(e.id, _exception)>=0) e.marker.addTo(cgeomap.map.map);
		});
	} else {
		$.each($(this.markers).data(),function(i, e) {
			e.marker.addTo(cgeomap.map.map);
		});
	}
};
VhplabMap.prototype.updateDistances = function(_lat, _lng) {
	$.each($(this.markers).data(), function(name, marker) {
		marker.setDistance(_lat, _lng);
	});
	//alert('sort list');
	var self = this;
	this.markerList.sort(function(a,b) {
		var ma = $(self.markers).data('marker_'+a);
		var mb = $(self.markers).data('marker_'+b);
		if (ma.distance < mb.distance) return -1;
		if (ma.distance > mb.distance) return 1;
		return 0;
	});
};
VhplabMap.prototype.updateMarker = function(_path, _data, _n) {
	var marker = $(this.markers).data('marker_'+_data.id);
	if (typeof marker == "undefined") {
		marker = new VhplabMarker();
		marker.initialize(_path, _data, this);
		$(this.markers).data('marker_'+marker.id, marker);
		this.markerList.push(marker.id);
	} else {
		marker.updateData(_path, _data, this);
	}
};
VhplabMap.prototype.updateMarkers = function(_data, _more, _callback) {
	var n = this.offset;
	var self = this;
	var count = $(_data.markers).length - 1;
	var path = _data.link;
	// Loop through each marker data element
	$.each(_data.markers, function(i, marker) {
		n++;
		self.updateMarker(path, marker, n);
		if(i==count) {
			var loadded = self.markerList.length;
			self.offset = loadded;
			_callback();
		}
	});
};
VhplabMap.prototype.zoomListener = function(_opts) {
	$(this.zoomTag).val(this.map.getZoom());
};


// ************ //
// Vhplab Marker
// ************ //
function VhplabMarker() {
	this.lat;
	this.lng;
	this.zoom;
	this.id = null;
	this.json = null;
	this.distance = null;
	this.data = {};
	this.content;
	this.loadded = false;
	this.open = false;
	this.num = null;
	this.map = null;
	this.infoWindow = L.popup({
		maxWidth: 370,
		minWidth: 370,
		offset: [0, 0]
	});
	this.marker = L.marker();
	this.parent = null;
};
VhplabMarker.prototype.bindPopupActions = function(_content) {
	
};
VhplabMarker.prototype.click = function(_callback) {
	if(!this.open) {
		var self = this;
		if (this.loadded) {
			this.openInfoWindow();
		} else {
			// get URL via alert(this.json);
			$.getJSON(this.json, function(data) {
				$.each(data[0].marker, function(i, marker){
					self.loadWindowData(marker);
					self.openInfoWindow();
					if(_callback) _callback();
				});
			});
		}
	}
};
VhplabMarker.prototype.closeInfoWindow = function() {
	if (this.open) {
		this.parent.map.closePopup();
		this.open = false;
		this.parent.open = false;
	}
};
VhplabMarker.prototype.initialize = function(_path, _opts, _parent) {
	typeof _opts.id != "undefined" ? this.id = parseInt(_opts.id) : this.id = 0;
	typeof _opts.json != "undefined" ? this.json = _path + _opts.json : this.json = "";
	typeof _opts.lat != "undefined" ? this.lat = parseFloat(_opts.lat) : this.lat = 0.0;
	typeof _opts.lng != "undefined" ? this.lng = parseFloat(_opts.lng) : this.lng = 0.0;
	typeof _opts.zoom != "undefined" ? this.zoom = parseInt(_opts.zoom) : this.zoom = 0;
	typeof _opts.titre != "undefined" ? $(this.data).data('titre', _opts.titre) : $(this.data).data('titre', "");
	typeof _opts.lesauteurs != "undefined" ? $(this.data).data('lesauteurs', _opts.lesauteurs) : $(this.data).data('lesauteurs', "");
	typeof _opts.soustitre != "undefined" ? $(this.data).data('soustitre', _opts.soustitre) : $(this.data).data('soustitre', "");
	typeof _opts.visibility != "undefined" ? $(this.data).data('visibility', _opts.visibility) : $(this.data).data('visibility', "default");
	this.parent = _parent;
	
	this.marker.setLatLng([this.lat, this.lng]);
	this.infoWindow.setContent('');
	this.infoWindow.setLatLng([this.lat, this.lng]);
	
	if (typeof _opts.icon != "undefined") {
		var width, height, url;
		typeof _opts.icon.width != "undefined" ? width = parseInt(_opts.icon.width) : width = 60;
		typeof _opts.icon.height != "undefined" ? height = parseInt(_opts.icon.height) : height = 60;
		typeof _opts.icon.url != "undefined" ? url = _path + _opts.icon.url : url = 'plugins/vhplab/images/icons/default_icon.png';
    	var icon = L.icon({
			iconUrl: url,
    		iconRetinaUrl: url,
    		iconSize: [width/2, height/2],
    		iconAnchor: [width/4, height/2]
		});
		$(this.data).data('icon', {
			url: url,
			width: width,
			height: height
		});
		this.marker.setIcon(icon);
		L.setOptions(this.infoWindow, {
			offset: [0, -height/2]
		});
	}
	
	this.marker.addTo(this.parent.map);
	var self = this;
	this.marker.on('click', function(e) {
		self.click();
	});
};
VhplabMarker.prototype.loadWindowData = function(_data) {
	// alert('loadWindowData: '+ JSON.stringify(_data));
	typeof _data.texte != "undefined" ? $(this.data).data('texte', _data.texte) : $(this.data).data('texte', "");
	typeof _data.descriptif != "undefined" ? $(this.data).data('descriptif', _data.descriptif) : $(this.data).data('descriptif', "");
	typeof _data.chapo != "undefined" ? $(this.data).data('chapo', _data.chapo) : $(this.data).data('chapo', "");
	typeof _data.ps != "undefined" ? $(this.data).data('ps', _data.ps) : $(this.data).data('ps', "");
	typeof _data.notes != "undefined" ? $(this.data).data('notes', _data.ps) : $(this.data).data('notes', "");
	typeof _data.date != "undefined" ? $(this.data).data('date', _data.date) : $(this.data).data('date', "");
	typeof _data.date_redac != "undefined" ? $(this.data).data('date_redac', _data.date_redac) : $(this.data).data('date_redac', "");
	typeof _data.date_modif != "undefined" ? $(this.data).data('date_modif', _data.date_modif) : $(this.data).data('date_modif', "");
	typeof _data.id_rubrique != "undefined" ? $(this.data).data('id_rubrique', parseInt(_data.id_rubrique)) : $(this.data).data('id_rubrique', 0);
	typeof _data.id_secteur != "undefined" ? $(this.data).data('id_secteur', parseInt(_data.id_secteur)) : $(this.data).data('id_secteur', 0);
	typeof _data.lien != "undefined" ? $(this.data).data('lien', _data.lien) : $(this.data).data('lien', "");
	typeof _data.lien != "undefined" ? $(this.data).data('lien', _data.lien) : $(this.data).data('lien', "");
	typeof _data.visites != "undefined" ? $(this.data).data('visites', parseInt(_data.visites)) : $(this.data).data('visites', 0);
	typeof _data.popularite != "undefined" ? $(this.data).data('popularite', parseInt(_data.popularite)) : $(this.data).data('popularite', 0);
	typeof _data.lang != "undefined" ? $(this.data).data('lang', _data.lang) : $(this.data).data('lang', "");
	typeof _data.auteur != "undefined" ? $(this.data).data('auteur', _data.auteur) : $(this.data).data('auteur', false);
	typeof _data.autorise != "undefined" ? $(this.data).data('autorise', _data.autorise) : $(this.data).data('autorise', false);
	typeof _data.url_article != "undefined" ? $(this.data).data('url_article', _data.url_article) : $(this.data).data('url_article', "");
	typeof _data.url_editer != "undefined" ? $(this.data).data('url_editer', _data.url_editer) : $(this.data).data('url_editer', "");
	typeof _data.autorise != "undefined" ? $(this.data).data('autorise', _data.autorise) : $(this.data).data('autorise', false);
	typeof _data.image != "undefined" ? image = _data.image : image = false;
	$(this.data).data('image', image);
	typeof _data.enclosure != "undefined" ? enclosure = _data.enclosure : enclosure = false;
	$(this.data).data('enclosure', enclosure);
	typeof _data.tags != "undefined" ? tags = _data.tags.split(",") : tags = false;
	$(this.data).data('tags', tags);
	
	// set window content
	this.content = document.createElement("div");
    this.content.className = "window_wrapper";
    this.content.id = "window_"+ this.id;
	this.content.innerHTML = '<hgroup><h2>'+ $(this.data).data('titre') +'</h2><h3>'+ $(this.data).data('soustitre') +'</h3></hgroup><div>'+ $(this.data).data('descriptif') +'</div>';
    this.bindPopupActions(this.content);
	this.infoWindow.setContent(this.content);
	
	// append article & open Popup
	this.openInfoWindow();
	
	// store is already loadded
	this.loadded = true;
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
};
VhplabMarker.prototype.setDistance = function(_refLat, _refLng) {
	this.distance = L.latLng([this.lat, this.lng]).distanceTo([_refLat, _refLng]);
};
VhplabMarker.prototype.updateData = function(_path, _data, _parent) {
	this.data = {};
	this.loadded = false;
	this.open = false;
	typeof _data.json != "undefined" ? this.json = _path + _data.json : this.json = "";
	typeof _data.lat != "undefined" ? this.lat = parseFloat(_data.lat) : this.lat = 0.0;
	typeof _data.lng != "undefined" ? this.lng = parseFloat(_data.lng) : this.lng = 0.0;
	typeof _data.zoom != "undefined" ? this.zoom = parseInt(_data.zoom) : this.zoom = 0;
	typeof _data.titre != "undefined" ? $(this.data).data('titre', _data.titre) : $(this.data).data('titre', "");
	typeof _data.lesauteurs != "undefined" ? $(this.data).data('lesauteurs', _data.lesauteurs) : $(this.data).data('lesauteurs', "");
	typeof _data.soustitre != "undefined" ? $(this.data).data('soustitre', _data.soustitre) : $(this.data).data('soustitre', "");
	this.parent = _parent;
	
	this.marker.setLatLng([this.lat, this.lng]);
	this.infoWindow.setContent('');
	this.infoWindow.setLatLng([this.lat, this.lng]);
	
	if (typeof _data.icon != "undefined") {
		var width, height, url;
		typeof _data.icon.width != "undefined" ? width = parseInt(_data.icon.width) : width = 60;
		typeof _data.icon.height != "undefined" ? height = parseInt(_data.icon.height) : height = 60;
		typeof _data.icon.url != "undefined" ? url = _path + _data.icon.url : url = 'plugins/vhplab/images/icons/default_icon.png';
    	var icon = L.icon({
			iconUrl: url,
    		iconRetinaUrl: url,
    		iconSize: [width/2, height/2],
    		iconAnchor: [width/4, height/2]
		});
		$(this.data).data('icon', {
			url: url,
			width: width,
			height: height
		});
		this.marker.setIcon(icon);
		L.setOptions(this.infoWindow, {
			offset: [0, -height/2]
		});
	}
	
	var self = this;
	$.getJSON(this.json, function(data) {
		$.each(data[0].marker, function(i, marker){
			self.loadWindowData(marker);
		});
	});
};

//***********
// Map Zoom Custom Control
//***********
var vhplabZoomControl = L.Control.Zoom.extend({
	options: {
		position: 'bottomright'
	},
	onAdd: function (map) {
		var zoomName = 'leaflet-control-zoom',
			container = L.DomUtil.create('div', zoomName + ' leaflet-bar');
		this._map = map;
		this._zoomInButton  = this._createButton(
			this.options.zoomInText, this.options.zoomInTitle,
			zoomName + '-in',  container, this._zoomIn,  this);
		/*
		this._zoomPanOut = this._createButton(
			'Tout Voir','Voir tous les marqueurs',
			zoomName + '-panout', container, this.panout, this);
		*/
		this._zoomOutButton = this._createButton(
			this.options.zoomOutText, this.options.zoomOutTitle,
			zoomName + '-out', container, this._zoomOut, this);
		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);
		return container;
	},
	panout: function() {
		this._parent.panOut()
	},
	setParent: function(_parent) {
		this._parent = _parent;
	}
});