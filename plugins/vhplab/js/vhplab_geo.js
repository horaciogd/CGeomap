/*
 * VHPlab base plugin
 * lat, lng, zoom
 *
 * Author:
 * Horacio González
 * (c) 2015 - Distribuído baixo licencia GNU/GPL
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
	this.clickableMarker = null;
	this.clickListener = null;
	this.zoomListener = null;
	this.msgWindow = new InfoBox();
	this.baseURL = ''; 
	this.markersURL = '';
	this.offset = 0;
	this.limit = 200;
	this.latitudeTag = "#vhplab_latitude";
	this.longitudeTag = "#vhplab_longitude";
	this.zoomTag = "#vhplab_zoom";
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
	if ((typeof _opts.custom != "undefined")&&(_opts.custom)) {
		var self = this;
		// ger URL via alert(this.baseURL +'spip.php?page=json-styled-map');
		$.getJSON(this.baseURL +'spip.php?page=json-styled-map', function(data){
			self.createMap(_opts);
			self.createStyle(_opts, data);
			self.initMapElements(_opts);
			if (self.markersURL != '')  self.loadMarkers();
		});
	} else {
		this.createMap(_opts);
		this.initMapElements(_opts);
		if (this.markersURL != '') this.loadMarkers();
	}
};
VhplabMap.prototype.createMap = function(_opts) {
	var mapDiv = document.getElementById(_opts.id);
	var mapOptions = {
		zoom: _opts.zoom,
		center: new google.maps.LatLng(_opts.latitude, _opts.longitude),
		disableDefaultUI: true,
		mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'custom_map']
	};
	this.map = new google.maps.Map(mapDiv, mapOptions);
};
VhplabMap.prototype.createStyle = function(_opts, _data) {
	var style = new google.maps.StyledMapType(_data, {name: "custom"});
	this.map.mapTypes.set('custom_map', style);
	this.map.setMapTypeId('custom_map');
};
VhplabMap.prototype.initMapElements = function(_opts) {
	// Max Zoom Service
	this.maxZoomService = new google.maps.MaxZoomService();
	// Map Zoom Custom Control
	this.ZoomControl = new VhplabZoomControl();
	this.ZoomControl.initialize(this.map, this.maxZoomService);
	// Geocoder
	this.geocoder = new google.maps.Geocoder();
	if ((typeof _opts.formulaire != "undefined")&&(_opts.formulaire==true)) {
		// Clickable Marker
		var markerOptions = {
			visible: false,
			map: this.map
		};
		this.clickableMarker = new google.maps.Marker(markerOptions);
		this.addClickListener(_opts);
		this.addZoomListener(_opts);
		this.setInitialMarker(_opts);
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
VhplabMap.prototype.addMarkers = function(_data, _callback) {
	var n = this.offset;
	var self = this;
	var count = $(_data.markers).length - 1;
	var path = _data.link;
	$.each(_data.markers, function(i, marker) {
		n++;
		self.addMarker(path, marker);
		if(i==count) {
			var loadded = self.markerList.length;
			self.bindActions();
			if (_callback) _callback();
		}
	});
};
VhplabMap.prototype.addMarker = function(_path, _data) {
	var marker = new VhplabMarker();
	marker.loadBasicData(_path, _data, this);
	marker.setMap(this.map);
	$(this.markers).data('marker_'+marker.id, marker);
	this.markerList.push(marker.id);
};
VhplabMap.prototype.hideMarkers = function(_exception) {
	if (typeof _exception != "undefined") {
		$.each($(this.markers).data(),function(i, e) {
			if (jQuery.inArray(e.id, _exception)<0) e.marker.setVisible(false);
		});
	} else {
		$.each($(this.markers).data(),function(i, e) {
			e.marker.setVisible(false);
		});
	}
};
VhplabMap.prototype.showMarkers = function(_exception) {
	if (typeof _exception != "undefined") {
		$.each($(this.markers).data(),function(i, e) {
			if (jQuery.inArray(e.id, _exception)>=0) e.marker.setVisible(true);
		});
	} else {
		$.each($(this.markers).data(),function(i, e) {
			e.marker.setVisible(true);
		});
	}
};
VhplabMap.prototype.bindActions = function() {
	if (this.open) {
		var marker = $(this.markers).data('marker_'+this.open);
		marker.click();
	}
};
VhplabMap.prototype.codeAddress = function(_address) {
	self = this;
	this.geocoder.geocode( { 'address': _address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			self.map.setCenter(results[0].geometry.location);
			self.clickableMarker.setPosition(results[0].geometry.location);
			$("#Vhplab_latitude").val(results[0].geometry.location.lat());
			$("#Vhplab_longitude").val(results[0].geometry.location.lng());
		} else {
      		alert('Geocode was not successful for the following reason: ' + status);
		}
	});
};
VhplabMap.prototype.addClickListener = function(_opts) {
	var self = this;
	google.maps.event.addListener(this.map, 'click', function(e) {
		self.clickableMarker.setPosition(e.latLng);
        self.clickableMarker.setVisible(true);
		self.map.panTo(e.latLng);
		$(self.latitudeTag).val(e.latLng.lat());
		$(self.longitudeTag).val(e.latLng.lng());
		$(self.zoomTag).val(self.map.getZoom());
	});
};
VhplabMap.prototype.addZoomListener = function(_opts) {
	var self = this;
	google.maps.event.addListener(this.map, 'zoom_changed', function() {
		var zoom = self.map.getZoom();
		$(self.zoomTag).val(zoom);
	});
};
VhplabMap.prototype.removeListeners = function() {
	google.maps.event.removeListener(this.clickListener);
	google.maps.event.removeListener(this.zoomListener);
};
VhplabMap.prototype.removeClickListener = function(_opts) {
	google.maps.event.removeListener(this.clickListener);
};
VhplabMap.prototype.removeZoomListener = function(_opts) {
	google.maps.event.removeListener(this.zoomListener);
};
VhplabMap.prototype.setInitialMarker = function(_opts) {
	var self = this;
	if ((navigator.geolocation)&&(_opts.latitude==0.0)&&(_opts.longitude==0.0)) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setCenter(pos);
			self.clickableMarker.setPosition(pos);
        	self.clickableMarker.setVisible(true);
			$(self.latitudeTag).val(pos.lat());
			$(self.longitudeTag).val(pos.lng());
			$(self.zoomTag).val(self.map.getZoom());
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		var pos = this.map.getCenter();
		this.clickableMarker.setPosition(pos);
		this.clickableMarker.setVisible(true);
		$(self.latitudeTag).val(pos.lat());
		$(self.longitudeTag).val(pos.lng());
		$(self.zoomTag).val(this.map.getZoom());
	}
};

// ************ //
// Vhplab Marker
// ************ //
function VhplabMarker() {
	this.id = null;
	this.json = null;
	this.lat = 0.0;
	this.lng = 0.0;
	this.zoom = 0;
	this.titre = '';
	this.soustitre ='';
	this.icon ='';
	this.data = {};
	this.loadded = false;
	this.open = false;
	this.map = null;
	this.infoWindow = new InfoBox();
	this.marker = new google.maps.Marker();
	this.parent = null;
	this.clickListener;
};
VhplabMarker.prototype.loadBasicData = function(_path, _data, _parent) {
	typeof _data.id != "undefined" ? this.id = parseInt(_data.id) : this.id = 0;
	typeof _data.json != "undefined" ? this.json = _path + _data.json : this.json = "";
	typeof _data.lat != "undefined" ? this.lat = parseFloat(_data.lat) : this.lat = 0.0;
	typeof _data.lng != "undefined" ? this.lng = parseFloat(_data.lng) : this.lng = 0.0;
	typeof _data.zoom != "undefined" ? this.zoom = parseInt(_data.zoom) : this.zoom = 0;
	typeof _data.titre != "undefined" ? this.titre = _data.titre : this.titre = "";
	typeof _data.soustitre != "undefined" ? this.soustitre = _data.soustitre : this.soustitre = "";
	typeof _data.icon.url != "undefined" ? this.icon = _path + _data.icon.url : this.icon = _path + "";
	this.parent = _parent;
	this.marker.setOptions({
		position: new google.maps.LatLng(this.lat, this.lng),
		optimized: false
	});
	if (typeof _data.icon != "undefined") {
		var width, height;
		typeof _data.icon.width != "undefined" ? width = parseInt(_data.icon.width) : width = 32;
		typeof _data.icon.height != "undefined" ? height = parseInt(_data.icon.height) : height = 32;
    	this.marker.setIcon({
			url: this.icon,
			size: new google.maps.Size(width, height),
			scaledSize: new google.maps.Size(width/2, height/2),
			anchor: new google.maps.Point(width/4, height/2),
		});
	}
	var self = this;
	this.clickListener = google.maps.event.addListener(this.marker, 'click', function() {
		self.click();
	});
};
VhplabMarker.prototype.updateData = function(_path, _data, _parent) {
	this.data = {};
	this.loadded = false;
	this.open = false;
	this.infoWindow = new InfoBox();
	typeof _data.lat != "undefined" ? lat = parseFloat(_data.lat) : lat = 0.0;
	typeof _data.lng != "undefined" ? lng = parseFloat(_data.lng) : lng = 0.0;
	typeof _data.id != "undefined" ? this.id = parseInt(_data.id) : this.id = 0;
	typeof _data.json != "undefined" ? this.json = _path + _data.json + '&var_mode=recalcul' : this.json = "";
	this.parent = _parent;
	this.marker.setOptions({
		position: new google.maps.LatLng(lat, lng),
		optimized: false
	});
	// retina icon @2x trick
    if ((window.devicePixelRatio >= 2)&&(typeof _data.icon2x != "undefined")) {
    	this.marker.setIcon({
			url: _path + _data.icon2x,
			size: new google.maps.Size(80, 80),
			scaledSize: new google.maps.Size(40, 40),
			anchor: new google.maps.Point(20, 40),
		});
	} else if (typeof _data.icon != "undefined") {
		this.marker.setIcon({
			url: _path + _data.icon,
			size: new google.maps.Size(40, 40),
			scaledSize: new google.maps.Size(40, 40),
			anchor: new google.maps.Point(20, 40),
		});
	}
	var self = this;
	$.getJSON(this.json, function(data) {
		$.each(data[0].marker, function(i, marker){
			self.loadWindowData(marker);
		});
	});
};
VhplabMarker.prototype.loadWindowData = function(_data) {
	// alert('loadWindowData: '+ JSON.stringify(_data));
	typeof _data.id_article != "undefined" ? $(this.data).data('id_article', parseInt(_data.id_article)) : $(this.data).data('id_article', 0);
	typeof _data.soustitre != "undefined" ? $(this.data).data('soustitre', _data.soustitre) : $(this.data).data('soustitre', "");
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
	typeof _data.url_article != "undefined" ? $(this.data).data('url_article', _data.url_article) : $(this.data).data('url_article', "");
	typeof _data.url_editer != "undefined" ? $(this.data).data('url_editer', _data.url_editer) : $(this.data).data('url_editer', "");
	typeof _data.url_editer_ajax != "undefined" ? $(this.data).data('url_editer_ajax', _data.url_editer_ajax) : $(this.data).data('url_editer_ajax', "");
	typeof _data.autorise != "undefined" ? $(this.data).data('autorise', _data.autorise) : $(this.data).data('autorise', false);
	typeof _data.icon != "undefined" ? $(this.data).data('icon', _data.icon) : $(this.data).data('icon', false);
	typeof _data.image != "undefined" ? image = _data.image : image = false;
	$(this.data).data('image', image);
	typeof _data.enclosure != "undefined" ? enclosure = _data.enclosure : enclosure = false;
	$(this.data).data('enclosure', enclosure);
	typeof _data.tags != "undefined" ? tags = _data.tags.split(",") : tags = false;
	$(this.data).data('tags', tags);
	var content = '<hgroup><h2>'+ this.titre +'</h2><h3>'+ this.soustitre +'</h3></hgroup><div>'+ $(this.data).data('descriptif') +'</div>';
	this.infoWindow.setOptions({
		id: $(this.data).data('id_article'),
		content: content,
		position: this.marker.getPosition(),
		map: this.map,
	});
	this.loadded = true;
};
VhplabMarker.prototype.setMap = function(_map) {
	this.map = _map;
	this.marker.setMap(this.map);
};
VhplabMarker.prototype.initialize = function(_path, _opts) {
	typeof _opts.id != "undefined" ? this.id = parseInt(_opts.id) : this.id = 0;
	typeof _opts.json != "undefined" ? this.json = _path + _opts.json : this.json = "";
	typeof _opts.lat != "undefined" ? this.lat = parseFloat(_opts.lat) : this.lat = 0.0;
	typeof _opts.lng != "undefined" ? this.lng = parseFloat(_opts.lng) : this.lng = 0.0;
	typeof _opts.zoom != "undefined" ? this.zoom = parseInt(_opts.zoom) : this.zoom = 0;
	typeof _opts.titre != "undefined" ? this.titre = _opts.titre : this.titre = "";
	typeof _opts.soustitre != "undefined" ? this.soustitre = _opts.soustitre : this.soustitre = "";
	typeof _opts.icon.url != "undefined" ? this.icon = _path + _opts.icon.url : this.icon = false;
	this.parent = _parent;
	this.marker.setOptions({
		position: new google.maps.LatLng(this.lat, this.lng),
		optimized: false
	});
	if (typeof _data.icon != "undefined") {
		var width, height;
		typeof _data.icon.width != "undefined" ? width = parseInt(_data.icon.width) : width = 32;
		typeof _data.icon.height != "undefined" ? height = parseInt(_data.icon.height) : height = 32;
    	this.marker.setIcon({
			url: this.icon,
			size: new google.maps.Size(width, height),
			scaledSize: new google.maps.Size(width/2, height/2),
			anchor: new google.maps.Point(width/4, height/2),
		});
	}
	var self = this;
	this.clickListener = google.maps.event.addListener(this.marker, 'click', function() {
		self.click();
	});
};
VhplabMarker.prototype.click = function(_k) {
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
	this.infoWindow.show();
	this.open = true;
	this.parent.open = this.id;
};
VhplabMarker.prototype.closeInfoWindow = function() {
	if (this.open) {
		this.infoWindow.hide();
		this.open = false;
	}
};

// ************ //
// InfoBox
// ************ //
function InfoBox() {
	google.maps.OverlayView.call(this);
	this.position = null;
	this.content = null;
	this.title = null;
	this.id = null;
	this.storeMap = null;
	this.offsetVertical = 0;
	this.offsetHorizontal = -114;
	this.height = 0;
	this.width = 390;
	this.arrowOffset = 78;
	this.windowOffset = 90;
	this.arrowDiv = null;
};
InfoBox.prototype = new google.maps.OverlayView();
InfoBox.prototype.setOptions = function(opts) {
	this.position = opts.position;
	this.content = opts.content;
	if (typeof opts.arrowOffset != "undefined") this.arrowOffset += opts.arrowOffset;
	this.id = opts.id;
	this.storeMap = opts.map;
};
InfoBox.prototype.setWidth = function(width) {
	this.width = width;
};
InfoBox.prototype.setOffsetHorizontal = function(ofset) {
	this.offsetHorizontal = ofset;
	this.arrowOffset = ofset*(-1) - 17;
};
InfoBox.prototype.remove = function() {
  if (this.div) {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
};
InfoBox.prototype.draw = function() {
	this.createElement();
	if (!this.div) return;
	var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position);
	if (!pixPosition) return;
	this.div.style.width = this.width + "px";
	this.div.style.left = parseInt(pixPosition.x + this.offsetHorizontal) + "px";
	this.div.style.top = parseInt(pixPosition.y + this.offsetVertical - this.windowOffset) + "px";
	this.div.style.display = 'block';
	var windowHeight = $('#window_'+ this.id).height();
	if (this.offsetVertical != windowHeight*(-1)) {
		this.offsetVertical = -$('#window_'+ this.id).height();
		this.div.style.top = parseInt(pixPosition.y + this.offsetVertical - this.windowOffset) + "px";
		this.panMap();
	}
};
InfoBox.prototype.createElement = function() {
	var panes = this.getPanes();
	var div = this.div;
	if (!div) {
		div = this.div = document.createElement("div");
		div.className = "window";
		div.id = "window_"+ this.id;
		div.style.position = "absolute";
		var wrapper = document.createElement("div");
		wrapper.className = "wrapper";
		var content = document.createElement("div");
		content.className = "content";
		content.innerHTML = this.content;
		var close = document.createElement("div");
		close.className = "close";
		this.arrow = document.createElement("div");
		this.arrow.className = "arrow";
		this.arrow.style.left = this.arrowOffset+"px";
		function removeInfoBox(ib) {
			return function() {
			ib.setMap(null);
		};
	}
	google.maps.event.addDomListener(close, 'click', removeInfoBox(this));
	wrapper.appendChild(close);
	wrapper.appendChild(content);
	div.appendChild(wrapper);
	div.appendChild(this.arrow);
	div.style.display = 'none';
	panes.floatPane.appendChild(div);
	this.panMap();
	this.bindActions(div);
	} else if (div.parentNode != panes.floatPane) {
		div.parentNode.removeChild(div);
		panes.floatPane.appendChild(div);
	} else {
	}
};
InfoBox.prototype.panMap = function() {
	// if we go beyond map, pan map
	var map = this.storeMap;
	var bounds = map.getBounds();
	if (!bounds) return;
	// The position of the infowindow
	var position = this.position;
	// The dimension of the infowindow
	var iwWidth = this.width;
	var iwHeight = this.height;
	// The offset position of the infowindow
	var iwOffsetX = this.offsetHorizontal;
	var iwOffsetY = this.offsetVertical;
	// Padding on the infowindow
	var padX = 0;
	var padY = 0;
	// The degrees per pixel
	var mapDiv = map.getDiv();
	var mapWidth = mapDiv.offsetWidth;
	var mapHeight = mapDiv.offsetHeight;
	var boundsSpan = bounds.toSpan();
	var longSpan = boundsSpan.lng();
	var latSpan = boundsSpan.lat();
	var degPixelX = longSpan / mapWidth;
	var degPixelY = latSpan / mapHeight;
	// The bounds of the map
	var mapWestLng = bounds.getSouthWest().lng();
	var mapEastLng = bounds.getNorthEast().lng();
	var mapNorthLat = bounds.getNorthEast().lat();
	var mapSouthLat = bounds.getSouthWest().lat();
	var tempMapNorthLat = mapSouthLat + (mapNorthLat-mapSouthLat) * 0.7;
	var tempMapSouthLat = mapSouthLat + (mapNorthLat-mapSouthLat) * 0.3;
	var mapNorthLat = tempMapNorthLat;
	var mapSouthLat = tempMapSouthLat;
	var tempMapWestLng = mapEastLng + (mapWestLng-mapEastLng) * 0.7;
	var tempMapEastLng = mapEastLng + (mapWestLng-mapEastLng) * 0.3;
	var mapWestLng = tempMapWestLng;
	var mapEastLng = tempMapEastLng; 
	// The bounds of the infowindow
	var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
	var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
	var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
	var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
	// calculate center shift
	var shiftLng =
		(iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
		(iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
	var shiftLat =
		(iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
		(iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);
	// The center of the map
	var center = map.getCenter();
	// The new map center
	var centerX = center.lng() - shiftLng;
	var centerY = center.lat() - shiftLat;
	// center the map to the new shifted center
	map.setCenter(new google.maps.LatLng(centerY, centerX));
	// Remove the listener after panning is complete.
};
InfoBox.prototype.hide = function() {
	this.setMap(null);
};
InfoBox.prototype.show = function() {
	this.setMap(this.storeMap);
};
InfoBox.prototype.bindActions = function(_content) {

};

//***********
// Map Zoom Custom Control
//***********  
function VhplabZoomControl() {
	this.controlUI;
	this.zoomInButton;
	this.zoomOutButton;
	this.zoomOutListener;
	this.zoomInListener;
};
VhplabZoomControl.prototype.initialize = function(_map, _service) {
	var control = this;
	control.appendTo(_map);
};
VhplabZoomControl.prototype.appendTo = function(_map) {
	var control = this;
	// Container
	this.controlUI = document.createElement("div");
	this.controlUI.id = "mapZoomControl";
    // zoomIn Button
	this.zoomInButton = document.createElement("div");
	this.zoomInButton.className = "mapUiZoomButton mapUiBtn";
	this.zoomInButton.id = "mapZoomIn";
	this.zoomInButton.innerHTML="+";
	this.zoomInListener = google.maps.event.addDomListener(this.zoomInButton, 'click', function() {
		control.zoomIn(_map);
	});
    // zoomOut Button
	this.zoomOutButton = document.createElement("div");
	this.zoomOutButton.className = "mapUiZoomButton mapUiBtn";
	this.zoomOutButton.id = "mapZoomOut";
	this.zoomOutButton.innerHTML="-";
	this.zoomOutListener = google.maps.event.addDomListener(this.zoomOutButton, 'click', function() {
		control.zoomOut(_map);
	});
    this.controlUI.appendChild(this.zoomInButton);
	this.controlUI.appendChild(this.zoomOutButton);
	this.controlUI.index = 1;
	_map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.controlUI);
};
VhplabZoomControl.prototype.zoomIn = function(_map) {
	_map.setZoom(_map.getZoom() + 1);
};
VhplabZoomControl.prototype.zoomOut = function(_map) {
	_map.setZoom(_map.getZoom() - 1);
};