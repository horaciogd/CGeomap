/*
 * VHPlab base plugin
 * lat lng, tags, related articles, related JSON data, extra fields, etc
 *
 * Author:
 * Horacio González
 * (c) 2015 - Distribuído baixo licencia GNU/GPL
 *
 */
function Vhplab_base() {
};

//***********
// VhplabBase Map
//***********
function VhplabBaseMap() {
	this.map = null;
	this.maxZoomService = null;
	this.ZoomControl = null;
	this.geocoder = null;
	this.markerList = new Array();
	this.markers = {};
	this.open = null;
	this.totalMarkers = 0;
	this.clickableMarker = null;
	this.msgWindow = new InfoBox();
	this.baseURL = ''; 
	this.markersURL = '';
	this.offset = 0;
	this.limit = 200;
};
VhplabBaseMap.prototype.initialize = function(_opts) {
	if (typeof _opts.offset != "undefined") this.offset = _opts.offset;
	if (typeof _opts.limit != "undefined") this.limit = _opts.limit;
	if (typeof _opts.url != "undefined") this.baseURL = _opts.url;
	if (typeof _opts.markers != "undefined") this.markersURL = this.baseURL + _opts.markers;
	if (typeof _opts.open != "undefined") this.open = _opts.open;
	if ((typeof _opts.custom != "undefined")&&(_opts.custom)) {
		var self = this;
		$.getJSON(this.baseURL +'spip.php?page=json-styled-map', function(data){
			self.createMap(_opts);
			// self.createStyle(_opts, data); ADD style option ?
			self.initMapElements(_opts);
			self.loadMarkers();
		});
	} else {
		this.createMap(_opts);
		this.initMapElements(_opts);
		this.loadMarkers();
	}
};
VhplabBaseMap.prototype.createMap = function(_opts) {
	var mapDiv = document.getElementById(_opts.tagId);
	var mapOptions = {
		zoom: _opts.zoom,
		center: new google.maps.LatLng(_opts.latitude, _opts.longitude),
		disableDefaultUI: true,
		mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'custom_map']
	};
	this.map = new google.maps.Map(mapDiv, mapOptions);
};
VhplabBaseMap.prototype.createStyle = function(_opts, _data) {
	var style = new google.maps.StyledMapType(_data, {name: "custom"});
	this.map.mapTypes.set('custom_map', style);
	this.map.setMapTypeId('custom_map');
};
VhplabBaseMap.prototype.initMapElements = function(_opts) {
	// Max Zoom Service
	this.maxZoomService = new google.maps.MaxZoomService();
	// Map Zoom Custom Control
	this.ZoomControl = new VhplabZoomControl();
	this.ZoomControl.initialize(this.map, this.maxZoomService);
	// Geocoder
	this.geocoder = new google.maps.Geocoder();
	// Clickable Marker
	var markerOptions = {
          visible: false,
          map: this.map
	};
	this.clickableMarker = new google.maps.Marker(markerOptions);
};
VhplabBaseMap.prototype.loadMarkers = function() {
	var self = this;
	// load markers data
	// get URL via alert(this.markersURL +'&offset='+ this.offset +'&limit='+ this.limit +'&callback=?');
	$.getJSON(this.markersURL +'&offset='+ this.offset +'&limit='+ this.limit +'&callback=?', function(data){
		self.addMarkers(data[0], function(){
			self.loadMarkers();
		}, function(){
			self.bindActions();
		});
	});					
};
VhplabBaseMap.prototype.reloadMarkers = function(_url, _callback) {
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
VhplabBaseMap.prototype.addMarkers = function(_data, _more, _callback) {
	var n = this.offset;
	var self = this;
	var count = $(_data.markers).length - 1;
	var path = _data.link;
	// Loop through each marker data element
	$.each(_data.markers, function(i, marker) {
		n++;
		self.addMarker(path, marker);
		if(i==count) {
			var loadded = self.markerList.length;
			self.bindActions();
			/*
			if (loadded==self.totalMarkers) {
				if (_callback) _callback();
			} else {*/
				self.offset = loadded;
				//if (_more) _more();
			//}
		}
	});
};
VhplabBaseMap.prototype.updateMarkers = function(_data, _more, _callback) {
	var n = this.offset;
	var self = this;
	var count = $(_data.markers).length - 1;
	var path = _data.link;
	// Loop through each marker data element
	$.each(_data.markers, function(i, marker) {
		n++;
		self.updateMarker(path, marker);
		if(i==count) {
			var loadded = self.markerList.length;
			self.offset = loadded;
			_callback();
		}
	});
};
VhplabBaseMap.prototype.addMarker = function(_path, _data) {
	var marker = new VhplabMarker();
	marker.loadBasicData(_path, _data, this);
	marker.setMap(this.map);
	$(this.markers).data('marker_'+marker.id, marker);
};
VhplabBaseMap.prototype.updateMarker = function(_path, _data) {
	var marker = $(this.markers).data('marker_'+_data.id);
	if (typeof marker == "undefined") {
		marker = new VhplabMarker();
		marker.loadBasicData(_path, _data, this);
		marker.setMap(this.map);
		$(this.markers).data('marker_'+marker.id, marker);
	} else {
		marker.updateData(_path, _data, this);
	}
};
VhplabBaseMap.prototype.hideMarkers = function(_exception) {
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
VhplabBaseMap.prototype.showMarkers = function(_exception) {
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
VhplabBaseMap.prototype.bindActions = function() {

};
VhplabBaseMap.prototype.codeAddress = function(_address) {
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
VhplabBaseMap.prototype.addClickListener = function(_opts) {
	var self = this;
	google.maps.event.addListener(this.map, 'click', function(e) {
		self.clickableMarker.setPosition(e.latLng);
        self.clickableMarker.setVisible(true);
		self.map.panTo(e.latLng);
		$("#Vhplab_latitude").val(e.latLng.lat());
		$("#Vhplab_longitude").val(e.latLng.lng());
		$("#Vhplab_zoom").val(self.map.getZoom());
	});
};
VhplabBaseMap.prototype.removeClickListener = function(_opts) {
	google.maps.event.clearListeners(this.map, 'click');
};
VhplabBaseMap.prototype.addZoomListener = function(_opts) {
	var self = this;
	google.maps.event.addListener(this.map, 'zoom_changed', function() {
		var zoom = self.map.getZoom();
		$("#Vhplab_zoom").val(zoom);
	});
};
VhplabBaseMap.prototype.removeZoomListener = function(_opts) {
	google.maps.event.clearListeners(this.map, 'zoom_changed');
};
VhplabBaseMap.prototype.setInitialMarker = function(_opts) {
	if ((navigator.geolocation)&&(_opts.latitude==0.0)&&(_opts.longitude==0.0)) {
		var self = this;
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setCenter(pos);
			self.clickableMarker.setPosition(pos);
        	self.clickableMarker.setVisible(true);
			$("#Vhplab_latitude").val(pos.lat());
			$("#Vhplab_longitude").val(pos.lng());
			$("#Vhplab_zoom").val(self.map.getZoom());
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		var pos = this.map.getCenter();
		this.clickableMarker.setPosition(pos);
		this.clickableMarker.setVisible(true);
		$("#Vhplab_latitude").val(pos.lat());
		$("#Vhplab_longitude").val(pos.lng());
		$("#Vhplab_zoom").val(this.map.getZoom());
	}
};

//***********
// Vhplab Map
//***********
function VhplabMap() {
	this.map = null;
	this.maxZoomService = null;
	this.ZoomControl = null;
	this.geocoder = null;
	this.clickableMarker = null;
	this.baseURL = null; 
	this.latitudeTag = "#vhplab_latitude";
	this.longitudeTag = "#vhplab_longitude";
	this.zoomTag = "#vhplab_zoom";
};
VhplabMap.prototype.initialize = function(_opts) {
	if (typeof _opts.url != "undefined") this.baseURL = _opts.url;
	if (typeof _opts.latitudeTag != "undefined") this.latitudeTag = _opts.latitudeTag;
	if (typeof _opts.longitudeTag != "undefined") this.longitudeTag = _opts.longitudeTag;
	if (typeof _opts.zoomTag != "undefined") this.zoomTag = _opts.zoomTag;
	if ((typeof _opts.custom != "undefined")&&(_opts.custom)) {
		var self = this;
		$.getJSON(this.baseURL +'spip.php?page=json-styled-map', function(data){
			self.createMap(_opts);
			self.createStyle(_opts, data);
			self.initMapElements(_opts);
		});
	} else {
		this.createMap(_opts);
		this.initMapElements(_opts);
	}
};
VhplabMap.prototype.createMap = function(_opts) {
	var mapDiv = document.getElementById(_opts.tagId);
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
	// Geocoder
	this.geocoder = new google.maps.Geocoder();
	// Map Zoom Custom Control
	this.ZoomControl = new VhplabZoomControl();
	this.ZoomControl.initialize(this.map, this.maxZoomService);
	// Clickable Marker
	var markerOptions = {
          visible: false,
          map: this.map
	};
	this.clickableMarker = new google.maps.Marker(markerOptions);
	this.addClickListener(_opts);
	this.addZoomListener(_opts);
	this.setInitialMarker(_opts);
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
}
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
VhplabMap.prototype.setInitialMarker = function(_opts) {
	if ((navigator.geolocation)&&(_opts.latitude==0.0)&&(_opts.longitude==0.0)) {
		var self = this;
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setCenter(pos);
			self.clickableMarker.setPosition(pos);
        	self.clickableMarker.setVisible(true);
			$("#vhplab_latitude").val(pos.lat());
			$("#vhplab_longitude").val(pos.lng());
			$("#vhplab_zoom").val(self.map.getZoom());
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		var pos = this.map.getCenter();
		this.clickableMarker.setPosition(pos);
		this.clickableMarker.setVisible(true);
		$("#vhplab_latitude").val(pos.lat());
		$("#vhplab_longitude").val(pos.lng());
		$("#vhplab_zoom").val(this.map.getZoom());
	}
};

// ************ //
// SoundMarker
// ************ //
function VhplabMarker() {
	this.id = null;
	this.json = null;
	this.data = {};
	this.num = null;
	this.loadded = false;
	this.open = false;
	this.enclosure = null;
	this.map = null;
	this.infoWindow = new InfoBox();
	this.marker = new google.maps.Marker();
	this.parent = null;
};
VhplabMarker.prototype.loadBasicData = function(_path, _data, _parent) {
	typeof _data.lat != "undefined" ? lat = parseFloat(_data.lat) : lat = 0.0;
	typeof _data.lng != "undefined" ? lng = parseFloat(_data.lng) : lng = 0.0;
	typeof _data.id != "undefined" ? this.id = parseInt(_data.id) : this.id = 0;
	typeof _data.json != "undefined" ? this.json = _path + _data.json : this.json = "";
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
	google.maps.event.addListener(this.marker, 'click', function() {
		self.openInfoWindow();
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
	typeof _data.id_article != "undefined" ? id_article = parseInt(_data.id_article) : id_article = 0;
	$(this.data).data('id_article', id_article);
	typeof _data.surtitre != "undefined" ? surtitre = _data.surtitre : surtitre = "";
	$(this.data).data('surtitre', surtitre);
	typeof _data.titre != "undefined" ? titre = _data.titre : titre = "";
	$(this.data).data('titre', titre);
	typeof _data.soustitre != "undefined" ? soustitre = _data.soustitre : soustitre = "";
	$(this.data).data('soustitre', soustitre);
	typeof _data.descriptif != "undefined" ? descriptif = _data.descriptif : descriptif = "";
	$(this.data).data('descriptif', descriptif);
	typeof _data.chapo != "undefined" ? chapo = _data.chapo : chapo = "";
	$(this.data).data('chapo', chapo);
	typeof _data.texte != "undefined" ? texte = _data.texte : texte = "";
	$(this.data).data('texte', texte);
	typeof _data.ps != "undefined" ? ps = _data.ps : ps = "";
	$(this.data).data('ps', ps);
	typeof _data.notes != "undefined" ? notes = _data.ps : notes = "";
	$(this.data).data('notes', notes);
	typeof _data.date != "undefined" ? date = _data.date : date = "";
	$(this.data).data('date', date);
	typeof _data.date_redac != "undefined" ? date_redac = _data.date_redac : date_redac = "";
	$(this.data).data('date_redac', date_redac);
	typeof _data.date_modif != "undefined" ? date_modif = _data.date_modif : date_modif = "";
	$(this.data).data('date_modif', date_modif);
	typeof _data.id_rubrique != "undefined" ? id_rubrique = parseInt(_data.id_rubrique) : id_rubrique = 0;
	$(this.data).data('id_rubrique', id_rubrique);
	typeof _data.id_secteur != "undefined" ? id_secteur = parseInt(_data.id_secteur) : id_secteur = 0;
	$(this.data).data('id_secteur', id_secteur);
	typeof _data.lien != "undefined" ? lien = _data.lien : lien = false;
	$(this.data).data('lien', lien);
	typeof _data.visites != "undefined" ? visites = parseInt(_data.visites) : visites = 0;
	$(this.data).data('visites', visites);
	typeof _data.popularite != "undefined" ? popularite = parseInt(_data.popularite) : popularite = 0;
	$(this.data).data('popularite', popularite);
	typeof _data.lang != "undefined" ? lang = _data.lang : lang = "";
	$(this.data).data('lang', lang);
	typeof _data.auteur != "undefined" ? auteur = _data.auteur : auteur = false;
	$(this.data).data('auteur', auteur);
	typeof _data.url_article != "undefined" ? url_article = _data.url_article : url_article = "";
	$(this.data).data('url_article', url_article);
	typeof _data.lat != "undefined" ? lat = parseFloat(_data.lat) : lat = 0.0;
	$(this.data).data('lat', lat);
	typeof _data.lng != "undefined" ? lng = parseFloat(_data.lng) : lng = 0.0;
	$(this.data).data('lng', lng);
	typeof _data.icon != "undefined" ? icon = _data.icon : icon = false;
	$(this.data).data('icon', icon);
	typeof _data.icon2x != "undefined" ? icon2x = _data.icon2x : icon2x = false;
	$(this.data).data('icon2x', icon2x);
	typeof _data.image != "undefined" ? image = _data.image : image = false;
	$(this.data).data('image', image);
	typeof _data.enclosure != "undefined" ? enclosure = _data.enclosure : enclosure = false;
	$(this.data).data('enclosure', enclosure);
	typeof _data.tags != "undefined" ? tags = _data.tags.split(",") : tags = false;
	$(this.data).data('tags', tags);
	var content = '<hgroup><h2>'+titre+'</h2><h3>'+soustitre+'</h3><img class="icon" src="'+icon+'" /></hgroup>';
	this.infoWindow.setOptions({
		id: id_article,
		title: titre,
		link: url_article,
		content: content,
		enclosure: enclosure.url,
		position: this.marker.getPosition(),
		map: this.map,
	});
	this.loadded = true;
};
VhplabMarker.prototype.setMap = function(_map) {
	this.map = _map;
	this.marker.setMap(this.map);
};
VhplabMarker.prototype.initialize = function(_opts) {
	if (typeof _opts.id != "undefined") this.id = _opts.id;
	if (typeof _opts.json != "undefined") this.json = _opts.json;
	if (typeof _opts.map != "undefined") this.map = _opts.map;
	typeof _opts.lat != "undefined" ? lat = parseFloat(_opts.lat) : lat = 0.0;
	typeof _opts.lng != "undefined" ? lng = parseFloat(_opts.lng) : lng = 0.0;
	this.marker.setOptions({
		position: new google.maps.LatLng(lat, lng),
		map: _opts.map,
		optimized: false
	});
	// retina icon @2x trick
    if ((window.devicePixelRatio >= 2)&&(typeof _opts.icon2x != "undefined")) {
    	this.marker.setIcon({
			url: opts.icon2x,
			size: new google.maps.Size(80, 80),
			scaledSize: new google.maps.Size(40, 40),
			anchor: new google.maps.Point(20, 40),
		});
	} else if (typeof _opts.icon != "undefined") {
		this.marker.setIcon({
			url: opts.icon,
			size: new google.maps.Size(40, 40),
			scaledSize: new google.maps.Size(40, 40),
			anchor: new google.maps.Point(20, 40),
		});
	}
	var self = this;
	google.maps.event.addListener(this.marker, 'click', function() {
		self.openInfoWindow();
	});
};
VhplabMarker.prototype.openInfoWindow = function() {
	if(!this.open) {
		var self = this;
		var visible = $("#map_content").data('visible');
		if (visible) {
			$('#map_content').animate({
				left: "-=370",
			});
			$('#map_content .button').addClass('closed');
			$("#map_content").data('visible', false);
		}
		if (this.loadded) {
			this.showInfoWindow();
		} else {
			// get URL via alert(this.json);
			$.getJSON(this.json, function(data) {
				$.each(data[0].marker, function(i, marker){
					self.loadWindowData(marker);
					self.showInfoWindow();
				});
			});
		}
	} else {
		this.infoWindow.show();
	}
};
VhplabMarker.prototype.showInfoWindow = function() {
	var visible = $("#map_content").data('visible');
	if (!visible) {
		this.appendMapContent();
		$('#map_content').animate({
			left: "+=370",
		});
		$('#map_content .button').removeClass('closed');
		$("#map_content").data('visible', true);
	}
	if(this.parent.openMarker) {
		//alert(this.parent.openMarker +" "+ $(this.parent.markers).data() +" "+ $(this.parent.markers).data('marker_'+this.parent.openMarker));
		var openMarker = $(this.parent.markers).data('marker_'+this.parent.openMarker);
		openMarker.hideInfoWindow();
	}
	this.infoWindow.show();
	this.open = true;
	this.parent.openMarker = this.id;
};
VhplabMarker.prototype.hideInfoWindow = function() {
	if (this.open) {
		this.infoWindow.hide();
		this.open = false;
	}
};
VhplabMarker.prototype.appendMapContent = function() {
	$('#map_content article header h2').text($(this.data).data('titre'));
	$('#map_content article header h3').text($(this.data).data('soustitre'));
	$('#map_content article header img').attr('src', $(this.data).data('icon'));
	if (($(this.data).data('autorise'))&&($(this.data).data('autorise')=='oui')) {
		$('#map_content article header .btn-editar').attr('href', $(this.data).data('url_editar'));
		$('#map_content article header .btn-editar').show();
	} else {
		$('#map_content article header .btn-editar').attr('href', '');
		$('#map_content article header .btn-editar').hide();
	}
	var categories = $(this.data).data('category');
	$("#wrap_category button").removeClass('btn-tag-selected');
	for(i=0; i<categories.length; i++) {
		$("#wrap_category .category_"+ categories[i]).addClass('btn-tag-selected');
	}
	$('#wrap_content_modules').empty();
	$('#wrap_content_modules').append($(this.data).data('texte'));
	$("#wrap_content_modules .toggle").click(function(){
		toggle_module(this);
	});
	soundManager.onready(function() {
		inlinePlayer = new InlinePlayer();
	});
	$("#wrap_content_modules a.fancybox").fancybox();
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
	this.offsetHorizontal = -195;
	this.height = 0;
	this.width = 390;
	this.arrowOffset = 178;
	this.windowOffset = 60;
	this.arrowDiv = null;
};
/* InfoBox extends GOverlay class from the Google Maps API */
InfoBox.prototype = new google.maps.OverlayView();
InfoBox.prototype.setOptions = function(opts) {
	this.position = opts.position;
	this.content = opts.content;
	this.title = opts.title;
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
/* Creates the DIV representing this InfoBox */
InfoBox.prototype.remove = function() {
  if (this.div) {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
};
/* Redraw the Bar based on the current projection and zoom level */
InfoBox.prototype.draw = function() {
  // Creates the element if it doesn't exist already.
  this.createElement();
  if (!this.div) return;
  // Calculate the DIV coordinates of two opposite corners of our bounds to
  // get the size and position of our Bar
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position);
  if (!pixPosition) return;
  // Now position our DIV based on the DIV coordinates of our bounds
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
/* Creates the DIV representing this InfoBox in the floatPane.  If the panes
 * object, retrieved by calling getPanes, is null, remove the element from the
 * DOM.  If the div exists, but its parent is not the floatPane, move the div
 * to the new pane.
 * Called from within draw.  Alternatively, this can be called specifically on
 * a panes_changed event.
 */
InfoBox.prototype.createElement = function() {
  var panes = this.getPanes();
  var div = this.div;
  if (!div) {
    // This does not handle changing panes.  You can set the map to be null and
    // then reset the map to move the div.
    div = this.div = document.createElement("div");
    div.className = "customWindow";
    div.id = "window_"+ this.id;
    div.style.position = "absolute";
    var contentDiv = document.createElement("div");
    contentDiv.className = "contentDiv";
    contentDiv.innerHTML = this.content;
    var topDiv = document.createElement("div");
    topDiv.className = "closeWrapper";
    var closeImg = document.createElement("div");
    closeImg.className = "closeImg";
    topDiv.appendChild(closeImg);
    this.arrowDiv = document.createElement("div");
    this.arrowDiv.className = "arrowDiv";
	this.arrowDiv.style.left = this.arrowOffset+"px";
	function removeInfoBox(ib) {
      return function() {
        ib.setMap(null);
      };
    }
    google.maps.event.addDomListener(closeImg, 'click', removeInfoBox(this));
	div.appendChild(topDiv);
    div.appendChild(contentDiv);
    div.appendChild(this.arrowDiv);
    div.style.display = 'none';
    panes.floatPane.appendChild(div);
    this.panMap();
    this.bindActions(div);
  } else if (div.parentNode != panes.floatPane) {
    // The panes have changed.  Move the div.
    div.parentNode.removeChild(div);
    panes.floatPane.appendChild(div);
  } else {
    // The panes have not changed, so no need to create or move the div.
  }
};
/* Pan the map to fit the InfoBox. */
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
/* Bind actions to window elements */
InfoBox.prototype.bindActions = function(_content) {

};

//***********
// Map Zoom Custom Control
//***********  
function VhplabZoomControl() {
	this.controlUI;
	this.zoomInButton;
	this.zoomOutButton;
	this.zoomLevels;
};
VhplabZoomControl.prototype.initialize = function(_map, _service) {
	var control = this;
	this.setZoomLevels(_map, _service, function(){
		control.appendTo(_map);
	});
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
	google.maps.event.addDomListener(this.zoomInButton, 'click', function() {
		control.zoomIn(_map);
	});
    // zoomOut Button
	this.zoomOutButton = document.createElement("div");
	this.zoomOutButton.className = "mapUiZoomButton mapUiBtn";
	this.zoomOutButton.id = "mapZoomOut";
	this.zoomOutButton.innerHTML="-";
	google.maps.event.addDomListener(this.zoomOutButton, 'click', function() {
		control.zoomOut(_map);
	});
    this.controlUI.appendChild(this.zoomInButton);
	this.controlUI.appendChild(this.zoomOutButton);
	this.controlUI.index = 1;
	_map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.controlUI);
}; 
VhplabZoomControl.prototype.setZoomLevels = function(_map, _service, callback) {
	var type = _map.getMapTypeId();
	var center = _map.getCenter();
	var defaultZoom = 18;
	var control = this;
	_service.getMaxZoomAtLatLng(center, function(r) {
		if (r.status != google.maps.MaxZoomStatus.OK) {
			control.zoomLevels = defaultZoom;
		} else {
			control.zoomLevels = r.zoom;
		}
		if (callback) callback();
	});
};
VhplabZoomControl.prototype.zoomIn = function(_map) {
	var actualZoom = _map.getZoom();
	if (actualZoom<this.zoomLevels) _map.setZoom(actualZoom+1);
	if ( $('li').hasClass('active') == true ) {
		// If a track is active, play or pause it depending on current state.
		$('li.active').data('track').marker.infoWindow.panCenter();
	}
};
VhplabZoomControl.prototype.zoomOut = function(_map) {
	var actualZoom = _map.getZoom();
	if (actualZoom>0) _map.setZoom(actualZoom-1);
	if ( $('li').hasClass('active') == true ) {
		// If a track is active, play or pause it depending on current state.
		$('li.active').data('track').marker.infoWindow.panCenter();
	}
};

/* CHANGE TO JSON GENERAL FUNCTION */
//***********
// Vhplab Train Selector
//***********
function VhplabTrainSelector() {
	this.id = '';
	this.trainList = new Array();
	this.url_list = 'http://septr.escoitar.org/pasarela/exec/get_train_list.php';
	this.url_train = 'http://septr.escoitar.org/pasarela/exec/get_train.php';
};
VhplabTrainSelector.prototype.initialize = function(_opts) {
	if (typeof _opts.id != "undefined") this.id = _opts.id;
	var self = this;
	$(this.id + ' .hidde').hide();
	$(this.id + ' input.submit').hide();
	$(this.id + ' .value').dblclick(function(){
		$(this).hide();
		$(self.id + ' select').show();
	});
	$(this.id + ' select').change(function(){
		$(self.id + ' input.submit').show();
	});
	var value = $(this.id + ' .value').text();
	$.post(this.url_list, { auth_key:'tbuh5nt25iB9rWZDMqJL'}, function(_data) {
		$.each(_data.data, function(i, train) {
			var ville ='';
			var selected ='';
			if (train.ville) ville = ' - ' + train.ville;
			if ((value)&&(value!='')&&(train.id==value)) {
				selected = ' selected';
				$(self.id + ' .value').text(train.code + ville);
				$.post(self.url_train, { auth_key:'tbuh5nt25iB9rWZDMqJL', id:train.id }, function(_d) {
					$(self.id + ' .info').empty();
					$.each(_d.data, function(i, t) {
						$(self.id + ' .info').append('<li><b>id:</b> '+ t.id +'</li>');
						$(self.id + ' .info').append('<li><b>code:</b> '+ t.code +'</li>');
						$(self.id + ' .info').append('<li><b>id_user:</b> '+ t.id_user +'</li>');
						$(self.id + ' .info').append('<li><b>ville:</b> '+ t.ville +'</li>');
						$(self.id + ' .info').append('<li><b>periode_ouverture:</b> '+ t.periode_ouverture +'</li>');
						$(self.id + ' .info').append('<li><b>horaires:</b> '+ t.horaires +'</li>');
						$(self.id + ' .info').append('<li><b>circuit:</b> '+ t.circuit +'</li>');
						$(self.id + ' .info').append('<li><b>duree:</b> '+ t.duree +'</li>');
						$(self.id + ' .info').append('<li><b>depart:</b> '+ t.depart +'</li>');
						$(self.id + ' .info').append('<li><b>langues_com:</b> '+ t.langues_com +'</li>');
						$(self.id + ' .info').append('<li><b>nb_places:</b> '+ t.nb_places +'</li>');
						$(self.id + ' .info').append('<li><b>tarif_indiv:</b> '+ t.tarif_indiv +'</li>');
						$(self.id + ' .info').append('<li><b>tarif_grp:</b> '+ t.tarif_grp +'</li>');
						$(self.id + ' .info').append('<li><b>parking:</b> '+ t.parking +'</li>');
						$(self.id + ' .info').append('<li><b>photo:</b> '+ t.photo +'</li>');
						$(self.id + ' .info').append('<li><b>latitude:</b> '+ t.latitude +'</li>');
						$(self.id + ' .info').append('<li><b>longitude:</b> '+ t.longitude +'</li>');
					});
				}, 'json');
			}
			$(self.id + ' select').append('<option value="'+ train.id +'"'+ selected +'>'+ train.code + ville +'</option>');
		});
	}, 'json');
};

/* THIS IS RELATED MAY BE SOME JSON MISSING */
//***********
// Vhplab Related formulary
//***********
function VhplabRelatedForm() {
	this.id = '';
};
VhplabRelatedForm.prototype.initialize = function(_opts) {
	if (typeof _opts.id != "undefined") this.id = _opts.id;
	var self = this;
	$(this.id + ' .hidde').hide();
	$(this.id + ' input.submit').hide();
	$(this.id + ' input[type="text"]').blur(function(){
		$(self.id + ' input.submit').show();
	});
	$(this.id + ' .remove_related').dblclick(function(){
		var value = $(self.id + ' input[name="delete_related"]').val();
		var new_value = $(this).data('id_objet_related');
		$(self.id + ' input[name="delete_related"]').val(value+' '+new_value);
		$(this).hide();
		//$(self.id + ' input.submit').show();
		$(self.id + ' form').submit();
	});
};

/* get json data via alerts and text */
JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};
