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
VhplabMap.prototype.addMarkers = function(_data, _callback) {
	var n = this.offset;
	var self = this;
	var count = $(_data.markers).length - 1;
	var path = _data.link;
	// Loop through each marker data element
	$.each(_data.markers, function(i, marker) {
		n++;
		self.addMarker(path, marker);
		if(i==count) {
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					// geolocation success
					self.updateMap(position.coords.latitude, position.coords.longitude);
					self.map.panTo([position.coords.latitude, position.coords.longitude]);
					var loadded = self.markerList.length;
					self.bindActions();
					if (_callback) _callback();
					
				}, function() {
					// geolocation error
					var center = self.map.getCenter();
					self.updateDistances(center.lat, center.lng);
      				var loadded = self.markerList.length;
					self.bindActions();
					if (_callback) _callback();
   				}, {
 					enableHighAccuracy: true, 
					maximumAge : 20000, 
					timeout : 17000
				}); 
				self.locationWatch = navigator.geolocation.watchPosition(function(position) {
					// geolocation success
					self.updateMap(position.coords.latitude, position.coords.longitude);
				}, function(err) { 
					// geolocation error
				}, {
 					enableHighAccuracy: true, 
					maximumAge : 20000, 
					timeout : 17000
				});	
			}
		}
	});
};
VhplabMap.prototype.bindActions = function() {
	cgeomap.createNavigationList();
	cgeomap.bindNavigationListActions();
	cgeomap.slideContent('show');
	var width = parseInt(cgeomap.windowWidth);
	if (width>674) width = 674;
	$("#navigation .bkmrk").click(function(){
		$('#loading hgroup').hide();
		$('#loading').fadeIn("fast", function() {
			$(this).delay(600).queue(function () {
				cordova.plugins.barcodeScanner.scan(
					function (result) {
						var s = "Result: " + result.text + "<br/>" +
						"Format: " + result.format + "<br/>" +
						"Cancelled: " + result.cancelled;
						$('#loading').data('result', result.text.substr(cgeomap.url_site.length+14));
						//cgeomap.addToVisibleNodes(result.text.substr(cgeomap.url_site.length+14), true);
						//$('#loading').fadeout("fast");
						//$('#loading hgroup').show();
					}, 
					function (error) {
						alert("Scanning failed: " + error);
					}
				);
				$(this).dequeue();
			});
		});
	});
	$("#reload").click(function(){
		cgeomap.reload();
	});
	$('#loading').fadeOut();
	cgeomap.map.openMarker(true);
};
VhplabMap.prototype.clickListener = function(_e) {
	// close infowindow easer 
	//if (!$('.cgeomap .leaflet-popup-content-wrapper').is(":hover")) self.closeOpenMarker();
};
VhplabMap.prototype.initialize = function(_opts) {
	if (typeof _opts.offset != "undefined") this.offset = _opts.offset;
	if (typeof _opts.limit != "undefined") this.limit = _opts.limit;
	if (typeof _opts.url != "undefined") this.baseURL = _opts.url;
	if (typeof _opts.markers != "undefined") this.markersURL = this.baseURL + _opts.markers;
	if (typeof _opts.auteur != "undefined") this.auteur = _opts.auteur;
	if (typeof _opts.latitudeTag != "undefined") this.latitudeTag = _opts.latitudeTag;
	if (typeof _opts.longitudeTag != "undefined") this.longitudeTag = _opts.longitudeTag;
	if (typeof _opts.zoomTag != "undefined") this.zoomTag = _opts.zoomTag;
	if (typeof _opts.open != "undefined") this.open = _opts.open;
	// Visibility settings for qr nodes
	cgeomap.setVisibleNodes();
	this.createMap(_opts);
	this.initMapElements(_opts);
	if (this.markersURL != '') this.loadMarkers();
};
VhplabMap.prototype.initMapElements = function(_opts) {
	
	// Max Zoom Service
	
	// Map Zoom Custom Control
	
	// Geocoder
	this.geocoder = new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.OpenStreetMap()
    });
	
	// Clickable Marker
	
	// Resize markers on zoom
  	
	// Clusterer
	
	// Listeners
	this.map.on('click', function(_e){
		cegeomap.map.clickListener(_e);
	});
	
	// Interface
	this.locationCircle1 = L.circle([0, 0], 2000, {
		color: '#2EA8E0',
		weight: 1,
		opacity: 1,
		fillColor: '#2EA8E0',
		fillOpacity: 0.1
	}).addTo(this.map);
	this.locationCircle2 = L.circle([0, 0], 500, {
		color: '#2EA8E0',
		weight: 2,
		opacity: 1,
		fillColor: '#2EA8E0',
		fillOpacity: 0.2
	}).addTo(this.map);
	this.locationCircle3 = L.circle([0, 0], 10, {
		color: '#2EA8E0',
		weight: 3,
		opacity: 0.9,
		fillColor: '#2EA8E0',
		fillOpacity: 0.4
	}).addTo(this.map);
	
	this.locationWatch;
};
VhplabMap.prototype.loadMarkers = function() {
	var self = this;
	var url = this.markersURL;
	if (this.auteur!='none') url += '&id_auteur='+ this.auteur;
	url += '&enclosure=true&offset='+ this.offset +'&limit='+ this.limit +'&callback=?';
	// load markers data
	// get URL via alert(url);
	$.getJSON(url, function(data){
		self.addMarkers(data[0]);
	});					
};
VhplabMap.prototype.myLocation = function(_callback) {
	var self = this;
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			// geolocation success
			self.updateMap(position.coords.latitude, position.coords.longitude);
			// self.map.panTo([position.coords.latitude, position.coords.longitude]);
			if (_callback) _callback(position);
		}, function(err) {
			// geolocation error
			if (_callback) _callback(position);
		}, { 
			enableHighAccuracy: true, 
			maximumAge : 20000, 
			timeout : 17000
		});
	}
};
VhplabMap.prototype.openMarker = function(_autoplay) {
	if (this.open) {
		var marker = $(this.markers).data('marker_'+this.open);
		if (typeof marker != "undefined") {
			if (_autoplay) marker.autoplay = true;
			marker.click();
		} else {
			var first = $(this.markers).data('marker_'+this.markerList[0]);
			this.open = this.markerList[0];
			if (_autoplay) first.autoplay = true;
			first.click();
		}
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
	if (cgeomap.player.playing=='') {
		for (var i=0; i<this.markerList.length; i++) {
			var marker = $(this.markers).data('marker_'+ this.markerList[i]);
			if (marker.checkAutoplay()) break;
		}
	}
};
VhplabMap.prototype.updateMap = function(_lat, _lng) {
	//alert('updateMap');
	$("#navigation hgroup .gps span").css('background-color', '#0bdec9');
	setTimeout(function(){ $("#navigation hgroup .gps span").css('background-color', 'rgba(255,255,255,0.8)'); }, 300);
	this.locationCircle1.setLatLng([_lat, _lng]);
	this.locationCircle2.setLatLng([_lat, _lng]);
	this.locationCircle3.setLatLng([_lat, _lng]);
	this.updateDistances(_lat, _lng);
};
VhplabMap.prototype.updateMarker = function(_path, _data, _n) {
	var marker = $(this.markers).data('marker_'+_data.id);
	if (typeof marker == "undefined") {
		marker = new VhplabMarker();
		marker.initialize(_path, _data, this);
		marker.json += '&var_mode=recalcul';
		$(this.markers).data('marker_'+marker.id, marker);
		this.markerList.push(marker.id);
	} else {
		marker.updateData(_path, _data, this);
	}
};
VhplabMap.prototype.reloadMarkers = function(_callback) {
	this.closeOpenMarker();
	this.hideMarkers();
	this.markerList = new Array();
	this.hidden = new Array();
	this.markers = {};
	this.totalMarkers = 0;
	this.offset = 0;
	this.limit = 200;
	var self = this;
	var url = this.markersURL;
	if (this.auteur!='none') url += '&id_auteur='+ this.auteur;
	url += '&enclosure=true&offset='+ this.offset +'&limit='+ this.limit +'&var_mode=recalcul&callback=?';
	// load markers data
	// get URL via alert(url);
	$.getJSON(url, function(data){
		//alert(data.toSource());
		self.updateMarkers(data[0], function(){
			if (_callback) _callback();
		});
	});	
};

// ************ //
// Vhplab Marker
// ************ //
VhplabMarker.prototype.bindPopupActions = function(_content) {
	/*
	$('a.fancybox', _content).click(function(){
		var img = $(this).attr('href');
		$.fancybox({ 'href' : img });
		return false;
	});
	*/
	$('.player', _content).click(function(){
		var id_article = $(this).data('id_article');
		$('#article_'+ id_article +' .header .player').trigger('click');
	});
};
VhplabMarker.prototype.bindContentActions = function(_content) {
	$('#article_'+ this.id +' .wrap_article').show();
	$('#article_'+ this.id +' .header').addClass('open');
	$('#article_'+ this.id +' .header').data('loaded', true);
	$('#article_'+ this.id +' .header').parent().parent().data('visible', this.id);
	$('#content .wrapper').scrollTo('#article_'+ this.id);
	cgeomap.bindModulesActions('#article_'+ this.id);
	var sound = $('#article_'+ this.id +' .header').data('sound')
	if (cgeomap.player.playing=='enclosure_'+sound) {
		$('#vhplab_player_'+ sound +' .play').hide();
		$('#vhplab_player_'+ sound +' .pause').show();
	}
};
VhplabMarker.prototype.click = function() {
	if (!this.open) {
		var self = this;
		if (this.loadded) {
			$('#content .wrapper').scrollTo('#article_'+ this.id);
			this.openInfoWindow();
		} else {
			$('footer .loading').show();
			$('#article_'+ this.id +' .header .loading').show();
			var sound = $('#article_'+ this.id +' header').data('sound');
			if ((typeof sound!="undefined")&&(this.autoplay)) cgeomap.play(sound, $('#article_'+ this.id +' .player'));
			this.getData(function(){
				self.appendContent();
				self.bindContentActions();
				self.openInfoWindow();
				$('footer .loading').hide();
				$('#article_'+ self.id +' .header .loading').hide();
			});
		}
	} else {
		if (!this.infoWindow._isOpen) this.infoWindow.openOn(this.parent.map);
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
	this.vibrate = false;
	this.autoplay = false;
	if ($(this.data).data('visibility')=='proximity') {
		this.vibrate = true;
		this.autoplay = true;
	}
	if (typeof _opts.enclosure != "undefined") {
		var enclosureIds = new Array();
		$.each(_opts.enclosure, function(u, enclosure) {
			cgeomap.player.addTrack(enclosure);
			enclosureIds.push(enclosure.id);
		});
		$(this.data).data('enclosure', enclosureIds);
	}
	this.parent = _parent;
	
	var width = parseInt(cgeomap.windowWidth*0.75);
	if (width>370) width = 370;
	this.infoWindow = L.popup({
		maxWidth: width,
		minWidth: width,
		offset: [0, -8]
	});
	
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
VhplabMarker.prototype.appendContent = function() {
	$('#article_'+ this.id +' .wrap_article').empty();
	$('#article_'+ this.id +' .wrap_article').append($(this.data).data('texte'));	
	$('#article_'+ this.id +' .wrap_article a.fancybox').fancybox();
};
VhplabMarker.prototype.getData = function(_callback) {
	if (this.loadded) {
		if (_callback) _callback();
	} else {
		var self = this;
		var width = parseInt(cgeomap.windowWidth-34);
		if (width>=900) width = 900;
		// get URL via alert(this.json +'&width='+ width +'&link=false');
		$.getJSON(this.json +'&width='+ width +'&link=false', function(data) {
			$.each(data[0].marker, function(i, marker){
				self.loadWindowData(marker);
				if (_callback) _callback();
			});
		});
	}
};
VhplabMarker.prototype.setDistance = function(_refLat, _refLng) {
	this.distance = L.latLng([this.lat, this.lng]).distanceTo([_refLat, _refLng]);
	if (this.distance<1000) {
		$('#article_'+ this.id +' header .info .distance').html(parseInt(this.distance) + ' m');
	}
	if ((this.distance>150)&&($(this.data).data('visibility')=='proximity')) {
		this.vibrate = true;
		this.autoplay = true;
	} else if ((this.distance<=100)&&(this.vibrate)){
		if ($(this.data).data('visibility')=='proximity') {
			cgeomap.addToVisibleNodes(this.id, false);
			$(this.data).data('visibility','default');
		}
		this.vibrate = false;
		navigator.vibrate(500);
	}
	// alert('distance: '+ this.distance);
};
VhplabMarker.prototype.checkAutoplay = function() {
	if ((this.distance<=10)&&(this.autoplay)){
		$("#article_"+ this.id +" header").trigger("click");
		this.autoplay = false;
		return true;
	} else {
		return false;
	}
};