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
	
	this.tileLayer = null;
	this.satelliteLayer = null;
	
	this.mapLayer = new VhplabLayer();
	this.editorLayer = new VhplabLayer();
	this.emptyLayer = new VhplabLayer();
	
	this.activeLayer = '';
	
	this.maxZoomService = null;
	this.ZoomControl = null;
	this.geocoder = null;
	
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
	this.auteur = 'none';
	this.offset = 0;
	this.limit = 200;
	this.latitudeTag = "#vhplab_latitude";
	this.longitudeTag = "#vhplab_longitude";
	this.zoomTag = "#vhplab_zoom";
	this.lat;
	this.lng;
	this.zoom;
};
VhplabMap.prototype.addClickableMarker = function(_latitude, _longitude, _zoom) {
	// console.log('addClickableMarker();');
	// console.log('_latitude: '+ _latitude +', _longitude: '+ _longitude +', _zoom: '+ _zoom);
	this.emptyLayer.layer.clearLayers();
	this.updateClickableMarker(_latitude, _longitude, _zoom);
	this.emptyLayer.layer.addLayer(this.clickableMarker);
};
VhplabMap.prototype.addMarkers = function(_data, _layer, _callback) {
	// console.log('/* Original prototype */ cgeomap.map.addMarkers();');
	// Empty none layer
	var target = this.getLayer(_layer);
	target.reset();
	// Count markers
	var count = $(_data.markers).length - 1;
	console.log('Total Markers = '+ $(_data.markers).length);
	var num = 0; 
	// If _data has markers
	if ($(_data.markers).length>=1) {
		// Loop through each marker data element
		$.each(_data.markers, function(i, marker) {
			console.log('Looping through each marker: i = '+ i +', count = '+ count);
			if (cgeomap.map.createMarker(_data.link, marker, num, target)) num ++;
			// Finish when all markers are looped
			if(i==count) {
				// Paginate only if needed
				(num>6) ? target.pagination = true : target.pagination = false;
				target.pages =  (num - num % 6) / 6;
				console.log('markerList: '+ target.markerList.toString());
				// Esto no puede estar funcionando bien ???
				console.log('layer.length: '+ target.layer.getLayers().length);
				// Callback to bind actiosn after loading and creating markers
				if (_callback) _callback();
			}
		});
	} else {
		// Callback to bind actiosn after loading and creating markers
		if (_callback) _callback();
	}
};
VhplabMap.prototype.addMarkersToEditorLayer = function() {
	console.log('cgeomap.map.addMarkersToEditorLayer();');
	// Empty layer
	var target = this.getLayer('editor');
	target.reset();
	// Get editor id
	var auteur = $("#user .data").data("auteur");
	console.log('Editor id = '+ auteur +', typeof '+ typeof auteur);
	// count only editor markers
	var n = 0;
	// Add Markers to editor layer
	$.each($(this.markers).data(), function(i, marker) {
		console.log('Looping through each marker: i = '+ i +', n = '+ n);
		// console.log('Marker: "'+ e.id +'", Auteurs: '+ e.auteurs.toString() +', '+ jQuery.inArray(auteur, e.auteurs) +', typeof '+ typeof e.auteurs[0]);
		if (jQuery.inArray(auteur, marker.auteurs)>=0)  { 
			// Add marker to vhpLayer
			cgeomap.map.addMarkerToLayer(marker, n, target);
			n++;
		}
	});
	(n>6) ? target.pagination = true : target.pagination = false;
	target.pages =  (n - n % 6) / 6;
	console.log('markerList: '+ target.markerList.toString());
	console.log('layer.length: '+ target.layer.getLayers().length);
	console.log('target.pagination: '+ target.pagination);
	console.log('n: '+ n);
};
VhplabMap.prototype.addMarkerToLayer = function(_marker, _num, _layer) {
	console.log('/* Original prototype */ cgeomap.addMarkerToLayer();');
	console.log('Add Marker: "'+ _marker.id +'" to layer');
	// Add marker to marker's list
	_layer.markerList.push(_marker.id);
	// Add marker to leaflet layer
	_layer.layer.addLayer(_marker.marker);
	// Update navigation html
	_layer.addToNavigationHtml(cgeomap.createNavigationElement('\t\t\t\t', (_num - _num % 6) / 6, _marker.id, $(_marker.data).data('titre'), $(_marker.data).data('lesauteurs')));		
	return true;
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
	$(this.latitudeTag).val(_e.latlng.lat%360);
	$(this.longitudeTag).val(_e.latlng.lng%360);
	
	$(this.zoomTag).val(this.map.getZoom());
};
VhplabMap.prototype.closeOpenMarker = function() {
	if(this.open) {
		var open = $(this.markers).data('marker_'+this.open);
		open.closeInfoWindow();
	}
};
VhplabMap.prototype.codeAddress = function(_address) {
	this.geocoder.geosearch(_address);
};
VhplabMap.prototype.createMap = function(_opts) {
	this.lat = _opts.latitude;
	this.lng = _opts.longitude;
	this.zoom = _opts.zoom;
	this.map = L.map(_opts.id, { zoomControl: false }).setView([_opts.latitude, _opts.longitude], _opts.zoom);
	/* stamen-tiles */
	this.tileLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png'
	});
	/* openstreetmap-tiles */
	/*
	this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	*/
	this.satelliteLayer = L.tileLayer('https://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/hybrid.day/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}', {
		attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
		subdomains: '1234',
		mapID: 'newest',
		app_id: 'jsOvofk7CMupabWlBWUg',
		app_code: '3SaF3jCsS8c-YfUb0gAXlg',
		base: 'aerial',
		maxZoom: 20,
		type: 'maptile',
		language: 'eng',
		format: 'png8',
		size: '256'
	});
	this.tileLayer.addTo(this.map);
};
VhplabMap.prototype.createMarker = function(_path, _markerData, _num, _layer) {
	console.log('/* Original prototype */ cgeomap.map.createMarker();');
	// create Marker
	var marker = new VhplabMarker();
	marker.initialize(_path, _markerData, this);
	console.log('Create Marker: "'+ marker.id);
	// Save marker as jQuery data
	$(this.markers).data('marker_'+ marker.id, marker);
	// Add marker to vhpLayer
	if	(this.addMarkerToLayer(marker, _num, _layer)) {
		return true;
	} else {
		return false;
	}
};
VhplabMap.prototype.getLayer = function(_name) {
	switch (_name) {
		case 'editor':
			return this.editorLayer;
			break;
		case 'map':
			return this.mapLayer;
			break;
		case 'empty':
			return this.emptyLayer;
			break;
	}
};
VhplabMap.prototype.hideActiveLayer = function() {
	switch (this.activeLayer) {
		case 'editor':
			console.log('hide editorLayer();');
			this.map.removeLayer(this.editorLayer.layer);
			break;
		case 'map':
			console.log('hide mapLayer();');
			this.map.removeLayer(this.mapLayer.layer);
			break;
		case 'empty':
			console.log('hide emptyLayer();');
			this.map.removeLayer(this.emptyLayer.layer);
			break;
		case '':
			break;
	}
};
VhplabMap.prototype.hideMarkers = function(_exception) {
	/*
	if (typeof _exception != "undefined") {
	
		console.log('map.hideMarkers(); - _exception');
		
		$.each($(this.markers).data(),function(i, e) {
			if (jQuery.inArray(e.id, _exception)<0) cgeomap.map.map.removeLayer(e.marker);
		});
	} else {
		
		console.log('map.hideMarkers();');
		
		$.each($(this.markers).data(),function(i, e) {
			cgeomap.map.map.removeLayer(e.marker);
		});
		
	}
	*/
};
VhplabMap.prototype.initialize = function(_opts) {
	console.log('cgeomap.map.initialize();');
	if (typeof _opts.offset != "undefined") this.offset = _opts.offset;
	if (typeof _opts.limit != "undefined") this.limit = _opts.limit;
	if (typeof _opts.url != "undefined") this.baseURL = _opts.url;
	if (typeof _opts.markers != "undefined") this.markersURL = this.baseURL + _opts.markers;
	if (typeof _opts.auteur != "undefined") this.auteur = _opts.auteur;
	if (typeof _opts.latitudeTag != "undefined") this.latitudeTag = _opts.latitudeTag;
	if (typeof _opts.longitudeTag != "undefined") this.longitudeTag = _opts.longitudeTag;
	if (typeof _opts.zoomTag != "undefined") this.zoomTag = _opts.zoomTag;
	if (typeof _opts.open != "undefined") this.open = _opts.open;
	this.createMap(_opts);
	this.initMapElements(_opts);
	if (this.markersURL != '') this.loadMarkers();
};
VhplabMap.prototype.initMapElements = function(_opts) {
	// Marker Layers
	
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
	// Load markers data
	console.log('cgeomap.map.loadMarkers();');
	var url = this.markersURL;
	if (this.auteur!='none') url += '&id_auteur='+ this.auteur;
	url += '&offset='+ this.offset +'&limit='+ this.limit +'&callback=?';
	// Get URL via log
	console.log('Markers URL: '+ url);
	$.getJSON(url, function(data){
		cgeomap.map.addMarkers(data[0], 'map', function(){
			cgeomap.map.bindActions();
		});
	});	
};
VhplabMap.prototype.openMarker = function() {
	if (this.open) {
		var marker = $(this.markers).data('marker_'+this.open);
		if (typeof marker != "undefined") {
			marker.click();
		} else {
			this.open = this.mapLayer.markerList[0];
			console.log('Markers 0: marker_'+ this.open);
			var first = $(this.markers).data('marker_'+ this.open);
			first.click();
		}
	}
};
VhplabMap.prototype.panOut = function() {
	this.map.setView([this.lat, this.lng], this.zoom);
};
VhplabMap.prototype.rebuildLayer = function(_name) {
	console.log('cgeomap.map.rebuildLayer("'+ _name +'");');
	// Store variables
	var target = this.getLayer(_name);
	var markerList = Array.from(target.markerList);
	console.log('layer markerList: '+ target.markerList.toString());
	console.log('stored markerList: '+ markerList.toString());
	// Empty layer
	target.reset();
	// Add Markers to layer
	$.each(markerList, function(i, id) {
		console.log('Looping through each marker: i = '+ i +'id = '+ id);
		// Add marker to vhpLayer
		cgeomap.map.addMarkerToLayer($(cgeomap.map.markers).data('marker_'+ id), i, target);
	});
	(markerList.length>6) ? target.pagination = true : target.pagination = false;
	target.pages =  (markerList.length - markerList.length % 6) / 6;
	console.log('markerList: '+ target.markerList.toString());
	console.log('layer.length: '+ target.layer.getLayers().length);
};
VhplabMap.prototype.removeFromLayer = function(_id, _name) {
	console.log('cgeomap.map.removeFromLayer('+ _id +', "'+ _name +'");');
	// Store variables
	var target = this.getLayer(_name);
	var index = target.markerList.indexOf(_id);
	if (index > -1) {
    	target.markerList.splice(index, 1);
		this.rebuildLayer(_name);
	}
};
VhplabMap.prototype.reloadMarkers = function(_callback) {
	// Reload markers data
	console.log('cgeomap.map.reloadMarkers();');
	var url = this.markersURL;
	if (this.auteur!='none') url += '&id_auteur='+ this.auteur;
	url += '&offset='+ this.offset +'&limit='+ this.limit +'&var_mode=recalcul&callback=?';
	// Get URL via log
	console.log('Markers URL: '+ url);
	$.getJSON(url, function(data){
		cgeomap.map.updateMarkers(data[0], function(){
			if (_callback) _callback();
		});
	});	
};
VhplabMap.prototype.setBaseLayer = function() {
	this.satelliteLayer.remove();
	this.tileLayer.addTo(this.map);
};
VhplabMap.prototype.setClickableMarker = function(_opts) {
	var url;
	if (typeof _opts.default_icon != "undefined") {
		url = _opts.default_icon;
	} else if ((typeof $("#formulaire .icon").attr("src") != "undefined")&&($("#formulaire .icon").attr("src") != "")) {
		url = $("#formulaire .icon").attr("src");
	} else {
		url = this.baseURL + 'plugins/vhplab/images/icons/default_icon.png';
	}
	console.log('setClickableMarker({ icon: '+ url +', latitude: '+ _opts.latitude +', longitude: '+ _opts.longitude +', zoom: '+ _opts.zoom +'});');
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
		console.log('setting ClickableMarker at geolocation position');
		navigator.geolocation.getCurrentPosition(function(position) {
			// success
			console.log('geolocation success: '+ position.coords.latitude +', '+ position.coords.longitude);
			cgeomap.map.addClickableMarker(position.coords.latitude, position.coords.longitude, '');
		}, function() {
			// error
			console.log('geolocation error');
			cgeomap.map.addClickableMarker(latitude, longitude, '');
		});
	} else {
		console.log('showing Marker');
		this.addClickableMarker(latitude, longitude, zoom);
	}
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
	
	/*
	if (visible==1) this.clickableMarker.addTo(this.map);
	*/
	
	//this.clickableMarker.setOpacity(visible);
};
VhplabMap.prototype.setSatelliteLayer = function() {
	this.tileLayer.remove();
	this.satelliteLayer.addTo(this.map);
};
VhplabMap.prototype.showLayer = function(_name, _fitBounds) {
	console.log('cgeomap.map.showLayer("'+ _name +'");');
	if (this.activeLayer != _name) {
		// Get layer
		var target = this.getLayer(_name);
		// Hide previous layer & and new one to leaflet map
		this.hideActiveLayer();
		this.map.addLayer(target.layer);
		// append navigation html
		if (_name != 'empty') cgeomap.appendNavigationList(target.navigationHtml, target.pagination, target.pages);
		// Store actual layer name
		this.activeLayer = _name;
		// Fit bounds to layer
		if (_fitBounds) {
			this.map.fitBounds(target.layer.getBounds());
			var zoom = this.map.getZoom()-2;
			if (zoom<=3) zoom = 3;
			this.map.setZoom(zoom);
		}
	}
};
VhplabMap.prototype.updateDistances = function(_lat, _lng) {
	$.each($(this.markers).data(), function(name, marker) {
		marker.setDistance(_lat, _lng);
	});
	//alert('sort list');
	var self = this;
	this.mapLayer.markerList.sort(function(a,b) {
		var ma = $(self.markers).data('marker_'+a);
		var mb = $(self.markers).data('marker_'+b);
		if (ma.distance < mb.distance) return -1;
		if (ma.distance > mb.distance) return 1;
		return 0;
	});
};
VhplabMap.prototype.updateMarker = function(_path, _data, _n, _layer) {
	var marker = $(this.markers).data('marker_'+_data.id);
	if (typeof marker == "undefined") {
		this.createMarker(_path, _data, _n, this.getLayer('editor'));
		// add marker to map layer if also visible in map layer 
		if ((this.map.auteur == 'none')||($("#user .data").data("auteur") == this.map.auteur)) {
			this.addMarkerToLayer($(this.markers).data('marker_'+ _data.id), _n, this.getLayer('map'));
		}
	} else {
		marker.updateData(_path, _data, this);
	}
};
VhplabMap.prototype.updateMarkers = function(_data, _layer, _callback) {
	console.log('cgeomap.map.updateMarkers();');
	// Empty none layer
	var target = this.getLayer(_layer);
	target.reset();
	// Count markers
	var count = $(_data.markers).length - 1;
	console.log('Total Markers = '+ $(_data.markers).length);
	// If _data has markers
	if ($(_data.markers).length>=1) {
		// Loop through each marker data element
		$.each(_data.markers, function(i, marker) {
			console.log('Looping through each marker to update: i = '+ i +', count = '+ count);
			console.log($(marker).toString());
			cgeomap.map.updateMarker(_data.link, marker, i, target);
			// Finish when all markers are looped
			if(i==count) {
				// Paginate only if needed
				(i>6) ? target.pagination = true : target.pagination = false;
				target.pages =  (i - i % 6) / 6;
				console.log('markerList: '+ target.markerList.toString());
				console.log('layer.length: '+ target.layer.getLayers().length);
				// Callback to bind actiosn after loading and creating markers
				if (_callback) _callback();
			}
		});
	} else {
		// Callback to bind actiosn after loading and creating markers
		if (_callback) _callback();
	}
	
};
VhplabMap.prototype.zoomListener = function(_opts) {
	$(this.zoomTag).val(this.map.getZoom());
};

// ************ //
// Vhplab Layer
// ************ //
function VhplabLayer() {
	this.layer =  new L.featureGroup();
	this.markerList = new Array();
	this.navigationHtml = '';
	this.pagination = false;
	this.pages = 0;
};
VhplabLayer.prototype.addToNavigationHtml = function(_html) {
	this.navigationHtml += _html;
};
VhplabLayer.prototype.reset = function() {
	this.layer.clearLayers();
	this.markerList = new Array();
	this.navigationHtml = '';
};
VhplabLayer.prototype.resetNavigationHtml = function(_html) {
	this.navigationHtml = _html;
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
	this.auteurs;
	this.data = {};
	this.content;
	this.loadded = false;
	this.open = false;
	this.num = null;
	this.map = null;
	this.infoWindow = null;
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
	typeof _opts.auteurs != "undefined" ? this.auteurs = _opts.auteurs.split(',').map(Number) : this.auteurs = new Array();
	typeof _opts.lesauteurs != "undefined" ? $(this.data).data('lesauteurs', _opts.lesauteurs) : $(this.data).data('lesauteurs', "");
	typeof _opts.soustitre != "undefined" ? $(this.data).data('soustitre', _opts.soustitre) : $(this.data).data('soustitre', "");
	typeof _opts.visibility != "undefined" ? $(this.data).data('visibility', _opts.visibility) : $(this.data).data('visibility', "default");
	this.parent = _parent;
	
	this.infoWindow = L.popup({
		maxWidth: 370,
		minWidth: 370,
		offset: [0, 0]
	});
	
	this.marker.setLatLng([this.lat, this.lng]);
	this.infoWindow.setContent('');
	this.infoWindow.setLatLng([this.lat, this.lng]);
	
	if (typeof _opts.category != "undefined") {
		var category_id, category_nom;
		typeof _opts.category.id != "undefined" ? category_id = _opts.category.id : category_id =  'category_00';
		typeof _opts.category.nom != "undefined" ? category_nom = _opts.category.nom : category_nom = 'default';
		$(this.data).data('category', {
			id: category_id,
			nom: category_nom,
		});
	} else {
		$(this.data).data('category', {
			id: 'category_00',
			nom: 'default',
		});
	}
	
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
	
	/* no los vamos a añadir automáticamente al crearlos */
	//this.marker.addTo(this.parent.map);
	
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
	typeof _data.url_qr != "undefined" ? $(this.data).data('url_qr', _data.url_qr) : $(this.data).data('url_qr', '');
	
	if (typeof _data.category != "undefined") {
		var category_id, category_nom;
		typeof _data.category.id != "undefined" ? category_id = _data.category.id : category_id =  'category_00';
		typeof _data.category.nom != "undefined" ? category_nom = _data.category.nom : category_nom = 'default';
		$(this.data).data('category', {
			id: category_id,
			nom: category_nom,
		});
	} else {
		$(this.data).data('category', {
			id: 'category_00',
			nom: 'default',
		});
	}
	
	// set window content
	this.content = document.createElement("div");
    this.content.className = "window_wrapper";
    this.content.id = "window_"+ this.id;
    var player = '';
    if (enclosure) player = '<span class="player" data-id_article="'+ this.id +'"></span>';
	this.content.innerHTML = '<hgroup><span class="toggle_content" data-id_article="'+ this.id +'"></span><h2>'+ player +''+ $(this.data).data('titre') +'</h2><h4>'+ $(this.data).data('soustitre') +'</h4></hgroup><div>'+ $(this.data).data('descriptif') +'</div>';
	this.bindPopupActions(this.content);
	this.infoWindow.setContent(this.content);
	
	// append article & open Popup 
	// open popup was repeated both in click and loadwindow this.openInfoWindow();
	
	// store is already loadded
	this.loadded = true;
};
VhplabMarker.prototype.openInfoWindow = function() {
	if(this.parent.open) {
		var open = $(this.parent.markers).data('marker_'+this.parent.open);
		if (typeof open != "undefined") open.closeInfoWindow();
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
	typeof _data.json != "undefined" ? this.json = _path + _data.json + '&var_mode=recalcul' : this.json = "";
	typeof _data.lat != "undefined" ? this.lat = parseFloat(_data.lat) : this.lat = 0.0;
	typeof _data.lng != "undefined" ? this.lng = parseFloat(_data.lng) : this.lng = 0.0;
	typeof _data.zoom != "undefined" ? this.zoom = parseInt(_data.zoom) : this.zoom = 0;
	typeof _data.titre != "undefined" ? $(this.data).data('titre', _data.titre) : $(this.data).data('titre', "");
	typeof _data.lesauteurs != "undefined" ? $(this.data).data('lesauteurs', _data.lesauteurs) : $(this.data).data('lesauteurs', "");
	typeof _data.soustitre != "undefined" ? $(this.data).data('soustitre', _data.soustitre) : $(this.data).data('soustitre', "");
	typeof _data.visibility != "undefined" ? $(this.data).data('visibility', _data.visibility) : $(this.data).data('visibility', "default");
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
	// get URL via alert(this.json);
	console.log('update marker data  URL: '+ this.json);
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
		var zoomName = 'leaflet-control-zoom';
		var container = L.DomUtil.create('div', zoomName + ' leaflet-bar');
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

//***********
// Map Type Custom Control
//***********
var vhplabTypeControl =  L.Control.Zoom.extend({
	options: {
    	position: 'bottomright'
 	 },
  	onAdd: function (map) {
		var typeName = 'leaflet-control-type';
    	var container = L.DomUtil.create('div', typeName +' leaflet-bar leaflet-control');
    	this._button  = this._createButton(
			'Satelite', 'changeType',
			typeName + '-in',  container, this.changeType,  this);
		this._map = map;
    	return container;
  	},
	changeType: function() {
		if (this._layer == 'street') {
			this._parent.tileLayer.remove();
			this._parent.satelliteLayer.addTo(this._map);
			this._layer = 'satellite';
			$('.leaflet-control-type a').html('Street');
			$('.cgeomap').addClass('clean');
		} else {
			this._parent.satelliteLayer.remove();
			this._parent.tileLayer.addTo(this._map);
			this._layer = 'street';
			$('.leaflet-control-type a').html('Satelite');
			$('.cgeomap').removeClass('clean');
		}
	},
	changeTypeTo: function(_type) {
		if ((_type == 'street')&&(this._layer != 'street')) {
			this._parent.satelliteLayer.remove();
			this._parent.tileLayer.addTo(this._map);
			this._layer = 'street';
			$('.leaflet-control-type a').html('Satelite');
			$('.cgeomap').removeClass('clean');
		} else if ((_type == 'satellite')&&(this._layer != 'satellite')) {
			this._parent.tileLayer.remove();
			this._parent.satelliteLayer.addTo(this._map);
			this._layer = 'satellite';
			$('.leaflet-control-type a').html('Street');
			$('.cgeomap').addClass('clean');
		}
	},
	setParent: function(_parent) {
		this._layer = 'street';
		this._parent = _parent;
	}
});