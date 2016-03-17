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
VhplabMap.prototype.initMapElements = function(_opts) {
	// Geocoder
	this.geocoder = new google.maps.Geocoder();
	// location
	this.locationCircle1;
	this.locationCircle2;
	this.locationMark;
	this.interval;
	// easer close window
	this.addClickListener(_opts);
	/*
	this.addClickListener(_opts);
	google.maps.event.addListener(this.map, 'click', function() {
		if (!$('.customWindow').is(":hover")) self.closeOpenMarker();
  	});
  	*/
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
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					self.updateDistances(position.coords.latitude, position.coords.longitude);
					var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					var circOptions1 = {
      					strokeColor: '#fff',
      					strokeOpacity: 1,
      					strokeWeight: 1.5,
      					fillColor: '#fff',
      					fillOpacity: 0.1,
      					map: self.map,
      					center: pos,
      					radius: 2000
    				};
    				var circOptions2 = {
      					strokeColor: '#fff',
      					strokeOpacity: 1,
      					strokeWeight: 2,
      					fillColor: '#fff',
      					fillOpacity: 0.2,
      					map: self.map,
      					center: pos,
      					radius: 500
    				};
    				var circOptions3 = {
      					strokeColor: '#fff',
      					strokeOpacity: 0.9,
      					strokeWeight: 2,
      					fillColor: '#fff',
      					fillOpacity: 0.4,
      					map: self.map,
      					center: pos,
      					radius: 10
    				};
    				self.locationCircle1 = new google.maps.Circle(circOptions1);
					self.locationCircle2 = new google.maps.Circle(circOptions2);
					self.locationMark = new google.maps.Circle(circOptions3);
					self.map.setCenter(pos);
					var loadded = self.markerList.length;
					self.bindActions();
					if (_callback) _callback();
				}, function() {
					var center = self.map.getCenter();
					self.updateDistances(center.lat(), center.lng());
      				var loadded = self.markerList.length;
					self.bindActions();
					if (_callback) _callback();
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
VhplabMap.prototype.myLocation = function(_callback) {
	var self = this;
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			self.updateDistances(position.coords.latitude, position.coords.longitude);
			self.map.panTo(pos);
			self.map.setZoom(16);
			self.locationCircle1.setCenter(pos);
			self.locationCircle2.setCenter(pos);
			self.locationMark.setCenter(pos);
			if (_callback) _callback();
		}, function(err) { 
			if (_callback) _callback();
		}, { enableHighAccuracy: true });
	}
};
VhplabMap.prototype.myLocationWatch = function(_activate) {
	var self = this;
	if(navigator.geolocation) {
		if (_activate) {
			options = {
 				enableHighAccuracy: true, 
				maximumAge        : 20000, 
				timeout           : 17000
			};
			self.interval = navigator.geolocation.watchPosition(function(position) {
				var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				self.locationCircle1.setCenter(pos);
				self.locationCircle2.setCenter(pos);
				self.locationMark.setCenter(pos);
				// self.map.panTo(pos);
			}, function(err) { }, options);
		} else {
			navigator.geolocation.clearWatch(self.interval);
		}
	}
};
VhplabMap.prototype.addClickListener = function(_opts) {
	var self = this;
	this.formularyClickListener = google.maps.event.addListener(this.map, 'click', function(e) {
		if (!$('.cgeomap .window').is(":hover")) self.closeOpenMarker();
	});
};

// ************ //
// Vhplab Marker
// ************ //
VhplabMarker.prototype.click = function() {
	if(!this.open) {
		var self = this;
		if (this.loadded) {
			$('#content .wrapper').scrollTo('#article_'+ $(this.data).data('id_article'));
			this.openInfoWindow();
		} else {
			$('footer .loading').show();
			this.getData(function(){
				$('#article_'+ $(self.data).data('id_article') +' header').data('loaded', true);
				$('#article_'+ $(self.data).data('id_article') +' header').trigger('click');
				$('footer .loading').hide();
			});
		}
	}
};
VhplabMarker.prototype.openInfoWindow = function() {
	if(this.parent.open) {
		var open = $(this.parent.markers).data('marker_'+this.parent.open);
		open.closeInfoWindow();
	}
	this.infoWindow.open(this.map, this.marker);
	this.open = true;
	this.parent.open = this.id;
	var base_fb_url = $('#navigation .user .facebook').data('base_href');
	$('#navigation .user .facebook').attr('href', base_fb_url + '/?nodo=' + this.id);
};
VhplabMarker.prototype.appendContent = function() {
	$('#article_'+ $(this.data).data('id_article') +' .wrap_article').empty();
	$('#article_'+ $(this.data).data('id_article') +' .wrap_article').append($(this.data).data('texte'));
	$('#article_'+ $(this.data).data('id_article') +' .wrap_article a.fancybox').fancybox();
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
				self.openInfoWindow();
				if (_callback) _callback();
			});
		});
	}
};

// ************ //
// InfoBox
// ************ //
InfoBox.prototype.bindActions = function(_content) {
	$('a.fancybox', this.div_).click(function(){
		var img = $(this).attr('href');
		$.fancybox({ 'href' : img });
		return false;
	});
};
InfoBox.prototype.panBox_ = function (disablePan) {
	var map;
	if (!disablePan) {
		map = this.getMap();
		if (map instanceof google.maps.Map) { // Only pan if attached to map, not panorama
			if (!map.getBounds().contains(this.position_)) {
      			// Marker not in visible area of map, so set center
      			// of map to the marker position first.
       			 map.setCenter(this.position_);
      		}
			map.panTo(this.position_);
		}
	}
};