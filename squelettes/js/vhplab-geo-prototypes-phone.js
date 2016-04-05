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
					/*
					$("#navigation hgroup .gps span").css('background-color', '#ed9128');
					setTimeout(function(){ $("#navigation hgroup .gps span").css('background-color', '#fff'); }, 300);
					*/
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
	$('#loading').fadeOut();
};
VhplabMap.prototype.clickListener = function(_e) {
	// close infowindow easer 
	if (!$('.cgeomap .leaflet-popup-content-wrapper').is(":hover")) self.closeOpenMarker();
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
	// load markers data
	// get URL via alert(this.markersURL +'&sound=true&offset='+ this.offset +'&limit='+ this.limit +'&callback=?');
	$.getJSON(this.markersURL +'&sound=true&offset='+ this.offset +'&limit='+ this.limit +'&callback=?', function(data){
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
			if (_callback) _callback();
		}, function(err) {
			// geolocation error
			if (_callback) _callback();
		}, { 
			enableHighAccuracy: true, 
			maximumAge : 20000, 
			timeout : 17000
		});
	}
};
VhplabMap.prototype.updateMap = function(_lat, _lng) {
	//alert('updateMap');
	/*
	$("#navigation hgroup .gps span").css('background-color', '#ed9128');
	setTimeout(function(){ $("#navigation hgroup .gps span").css('background-color', '#fff'); }, 300);
	*/
	this.locationCircle1.setLatLng([_lat, _lng]);
	this.locationCircle2.setLatLng([_lat, _lng]);
	this.locationCircle3.setLatLng([_lat, _lng]);
	this.updateDistances(_lat, _lng);
};

// ************ //
// Vhplab Marker
// ************ //
VhplabMarker.prototype.bindPopupActions = function(_content) {
	$('a.fancybox', _content).click(function(){
		var img = $(this).attr('href');
		$.fancybox({ 'href' : img });
		return false;
	});
};
VhplabMarker.prototype.bindContentActions = function(_content) {
	$('#article_'+ this.id +' hgroup .loading').hide();
	$('footer .loading').hide();
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
	if(!this.open) {
		var self = this;
		if (this.loadded) {
			$('#content .wrapper').scrollTo('#article_'+ this.id);
			this.openInfoWindow();
		} else {
			$('footer .loading').show();
			this.getData(function(){
				$('#article_'+ $(self.data).data('id') +' header').data('loaded', true);
				$('#article_'+ $(self.data).data('id') +' header').trigger('click');
				$('footer .loading').hide();
			});
		}
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
	if (typeof _opts.enclosure != "undefined") {
		var enclosureIds = new Array();
		$.each(_opts.enclosure, function(u, enclosure) {
			cgeomap.player.addTrack(enclosure);
			enclosureIds.push(enclosure.id);
		});
		$(this.data).data('enclosure', enclosureIds);
	}
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
		this.appendContent();
		this.openInfoWindow();
		if (_callback) _callback();
	} else {
		var self = this;
		var width = parseInt($(window).width()-24);
		if (width>=900) width = 900;
		// get URL via alert(this.json +'&width='+ width +'&link=false');
		$.getJSON(this.json +'&width='+ width +'&link=false', function(data) {
			$.each(data[0].marker, function(i, marker){
				self.loadWindowData(marker);
				self.appendContent();
				if (_callback) _callback();
			});
		});
	}
};