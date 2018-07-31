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
VhplabMap.prototype.addMarkers = function(_data, _layer, _lat, _lng, _callback) {
	console.log('/* app prototypes */ cgeomap.map.addMarkers();');
	// Empty none layer
	var target = this.getLayer(_layer);
	target.reset();
	// Count markers
	var count = $(_data.markers).length - 1;
	var num = 0; 
	console.log('Total Markers = '+ $(_data.markers).length);
	// If _data has markers
	if ($(_data.markers).length>=1) {
		// Loop through each marker data element
		$.each(_data.markers, function(i, _marker) {
			console.log('Looping through each marker: i = '+ i +', count = '+ count);
			if (cgeomap.map.createMarker(_data.link, _marker, num, target, _lat, _lng)) num ++;
			// Finish when all markers are looped
			if(i==count) {
				console.log('Looping finished i == count');
				// Short markers by distance
				cgeomap.map.sortMarkersByDistance();
				console.log('markerList: '+ target.markerList.toString());
				console.log('layer.length: '+ target.layer.getLayers().length);
				if (_callback) _callback();
			}
		});
	} else {
		// Callback to bind actiosn after loading and creating markers
		if (_callback) _callback();
	}
};
VhplabMap.prototype.addMarkerToLayer = function(_marker, _num, _layer) {
	console.log('/* app prototypes */ cgeomap.map.addMarkerToLayer();');
	console.log('Add Marker: "'+ _marker.id +'" to layer');
	// Add marker to marker's list
	_layer.markerList.push(_marker.id);
	var visible = 'default';
	if (($(_marker.data).data('visibility')=='qr')||($(_marker.data).data('visibility')=='proximity')) {
		console.log('Check if added marker has just been found!');
		console.log('cgeomap.visibleNodes.indexOf('+ parseInt(_marker.id) +') = '+ cgeomap.visibleNodes.indexOf(parseInt(_marker.id)));
		if (cgeomap.visibleNodes.indexOf(parseInt(_marker.id)) != -1) {  
			console.log('Marker found!');
			visible = 'found';
			// Add marker to leaflet layer
			_layer.layer.addLayer(_marker.marker);
		} else {
			visible = 'hidden';
			console.log('marker '+ _marker.id +' is hidden');
		}
	} else {
		// Add marker to leaflet layer
		_layer.layer.addLayer(_marker.marker);
	}
	// Update navigation html
	_layer.addToNavigationHtml(cgeomap.createNavigationElement('\t\t\t\t',  _marker.id, $(_marker.data).data('titre'), $(_marker.data).data('soustitre'), _marker.distance, $(_marker.data).data('enclosure'), visible, $(_marker.data).data('category')));		
};
VhplabMap.prototype.bindActions = function() {
	console.log('/* app prototypes */ cgeomap.map.bindActions();');
	// Show map 
	this.map.addLayer(this.mapLayer.layer);
	// Screen width ???
	var width = parseInt(cgeomap.windowWidth);
	if (width>674) width = 674;
	// Bind button actions
	$("#navigation .bkmrk").on("click touchend", function(e){
		e.preventDefault();
		$('section').fadeOut('slow');
		$('footer').fadeOut('slow');
		$('nav').fadeOut('slow');
		cgeomap.scannQr();
	});
	var initialHref = window.location.href;
	var n = initialHref.lastIndexOf("/");
	var newUrl = initialHref.slice(0, n) + "/index.html";
	$("#reload").on("click touchend", function(e){
		e.preventDefault();
		// reset markers and reload cgeomap
		// cgeomap.reload();
		// Reload original app url (ie your index.html file)
  		window.location = newUrl;
		return false;
	});
	// Apppend navigation list
	cgeomap.appendNavigationList();
	// Sort content and start contineous geopositioning
	cgeomap.sortNavigationList(function(){
		// start contineous geolocation to follow user
		cgeomap.map.contineousGetCurrentPosition();	
		// Show	content
		cgeomap.slideContent('show');
		// Hide loading div
		$('#loading').delay(1000).fadeOut(1000, function(){
			$('#loading').remove();
		});
	});
};
VhplabMap.prototype.clickListener = function(_e) {
	// close infowindow easer 
	//if (!$('.cgeomap .leaflet-popup-content-wrapper').is(":hover")) self.closeOpenMarker();
};
VhplabMap.prototype.createMarker = function(_path, _markerData, _num, _layer, _lat, _lng) {
	console.log('/* app prototypes */ cgeomap.map.createMarker();');
	// create Marker
	console.log('Create Marker: "'+ _markerData.id);
	var marker = new VhplabMarker();
	marker.initialize(_path, _markerData, this);
	// Set marker distance to map center
	marker.setDistance(_lat, _lng);
	console.log('marker.distance: '+ marker.distance);
	// If marker is within reach
	if ((marker.distance<=50000)||(_num<=50)) {
		console.log('marker is within reach');
		// Save marker as jQuery data
		$(this.markers).data('marker_'+ marker.id, marker);
		// Add marker to vhpLayer
		this.addMarkerToLayer(marker, _num, _layer);
		return true;
	} else {
		return false;
	}
};
VhplabMap.prototype.contineousGetCurrentPosition = function() {
	console.log('/* app prototypes */ cgeomap.map.contineousGetCurrentPosition();');
	if(navigator.geolocation) {
		cgeomap.map.locationWatch = navigator.geolocation.watchPosition(function(position) {
			// Geolocation success
			console.log('Geolocation success');
			// Geolocation succes UI feddback /* USAR CSS3 */
			$("#navigation hgroup .gps span").css('background-color', '#0bdec9');
			setTimeout(function(){ $("#navigation hgroup .gps span").css('background-color', 'rgba(255,255,255,0.8)'); }, 300);
			cgeomap.map.updateMap(position.coords.latitude, position.coords.longitude, false);
			cgeomap.map.updateDistances(position.coords.latitude, position.coords.longitude);
			//cgeomap.map.map.panTo(L.latLng(position.coords.latitude, position.coords.longitude));
		}, function(err) { 
		// Geolocation error
		}, {
 			enableHighAccuracy: true, 
			maximumAge : 20000, 
			timeout : 17000
		});
	}
};
VhplabMap.prototype.getPosition = function(_callback) {
	console.log('/* app prototypes */ cgeomap.map.getPosition();');
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			// Geolocation success
			console.log('getPosition success');
			// Geolocation succes UI feddback /* USAR CSS3 */
			$("#navigation hgroup .gps span").css('background-color', '#0bdec9');
			setTimeout(function(){ $("#navigation hgroup .gps span").css('background-color', 'rgba(255,255,255,0.8)'); }, 300);
			// Callback to bind actiosn after getting geolocation position
			if (_callback) _callback(position.coords.latitude, position.coords.longitude);
		}, function(err) {
			// Geolocation error
			console.log('getPosition error');
			console.log('ERROR(' + err.code + '): ' + err.message);
			var center = cgeomap.map.map.getCenter();
			// Callback to bind actiosn after getting geolocation position
			if (_callback) _callback(center.lat, center.lng);
		}, {
 			enableHighAccuracy: true, 
			maximumAge : 20000, 
			timeout : 17000
		});
	} else {
		// Callback to bind actiosn after getting geolocation position
		if (_callback) _callback(center.lat, center.lng);
	}
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
	this.locationControl = 0;
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
		cgeomap.map.clickListener(_e);
	});
	// Interface
	this.locationCircle1 = L.circle([0, 0], 2000, {
		color: '#2EA8E0',
		weight: 1,
		opacity: 0,
		fillColor: '#2EA8E0',
		fillOpacity: 0.0
	}).addTo(this.map);
	this.locationCircle2 = L.circle([0, 0], 500, {
		color: '#2EA8E0',
		weight: 2,
		opacity: 0,
		fillColor: '#2EA8E0',
		fillOpacity: 0.0
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
	// Load markers data
	console.log('/* app prototypes */ cgeomap.map.loadMarkers();');
	var url = this.markersURL;
	//if (this.auteur!='none') url += '&id_auteur='+ this.auteur;
	url += '&enclosure=true&offset='+ this.offset +'&limit='+ this.limit +'&callback=?';
	// Get URL via log 
	console.log('Markers URL: '+ url);
	// Get geolocation position
	this.getPosition(function(_lat, _lng) {
		// Update Map position
		cgeomap.map.updateMap(_lat, _lng, true);
		// Get Markers
		$.ajax({
			type: 'GET',
			url: url,
			async: false,
			crossDomain: true,
			jsonpCallback: 'jsonArticles',
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(_data, _textStatus, _jqXHR) {
				// console.log('Markers loaded via $.ajax!');
				// Get _data via log 
				// console.log('_data: '+  JSON.stringify(_data) );
				cgeomap.map.addMarkers(_data,'map', _lat, _lng, function() {
					cgeomap.map.bindActions();
					if (cgeomap.map.open!='') {
						var marker = $(cgeomap.map.markers).data('marker_'+cgeomap.map.open);
						if (typeof marker != "undefined") {
							marker.autoplay = true;
							cgeomap.toggleArticle("#article_"+ cgeomap.map.open +" header", true);
						}
					}
				});
			}, error: function (_xhr, _ajaxOptions, _thrownError) {
			
			}
		});
	});	
};
VhplabMap.prototype.myLocation = function(_callback) {
	console.log('/* app prototypes */ cgeomap.map.myLocation();');
	var self = this;
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(_position) {
			// geolocation success
			self.updateMap(_position.coords.latitude, _position.coords.longitude, true);
			if (_callback) _callback(_position);
		}, function(err) {
			// geolocation error
			if (_callback) _callback(_position);
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
			var first = $(this.markers).data('marker_'+this.mapLayer.markerList[0]);
			this.open = this.mapLayer.markerList[0];
			if (_autoplay) first.autoplay = true;
			first.click();
		}
	}
};
VhplabMap.prototype.sortMarkersByDistance = function() {
	console.log('/* app prototypes */ cgeomap.map.sortMarkersByDistance();');
	// Short markers by distance
	this.mapLayer.markerList.sort(function(a,b) {
		var ma = $(cgeomap.map.markers).data('marker_'+a);
		var mb = $(cgeomap.map.markers).data('marker_'+b);
		if (ma.dist < mb.dist) return -1;
		if (ma.dist > mb.dist) return 1;
		return 0;
	});
};
VhplabMap.prototype.updateDistances = function(_lat, _lng) {
	this.locationControl++;
	console.log('/* app prototypes */ cgeomap.map.updateDistances();');
	if (cgeomap.state == '') {
		cgeomap.state = 'shorting';
		$('#block').show();
		// Get marker order
		// var oldList = cgeomap.map.mapLayer.markerList.toString();
		if (cgeomap.navigationListOrder == '') {
			var oList = new Array();
			$("#content .listado_nodos .article").each(function(){
				var entryId = $(this).attr('id');
				var id = entryId.split("_"); 
				oList.push(id[1]);
		 	});
		 	cgeomap.navigationListOrder = oList.toString();
		 	console.log('cgeomap.navigationListOrder = '+ oList.toString());
		}
		// Set marker distances
		$.each($(this.markers).data(), function(name, marker) {
			marker.updateDistance(_lat, _lng);
		});
		// Short markers by distance
		this.sortMarkersByDistance();
		// Get new list
		var newList = cgeomap.map.mapLayer.markerList.toString();
		console.log('newList = '+ cgeomap.map.mapLayer.markerList.toString());
		// Return true if new list is different from the old list
		if ((cgeomap.navigationListOrder!=newList)&&(this.locationControl==1)) {
			// Navigation list needs to be shorted
			console.log('cgeomap.map.updateDistances - navigation list needs to be shorted');
			cgeomap.sortNavigationList();
		} else {
			console.log('everything in order only check autoplay');
			this.locationControl = 0;
			// only check autoplay if not detaching
			console.log('cgeomap.player.playing: '+cgeomap.player.playing);
			// Check autoplay if nothing is being played
			$('#block').hide();
			cgeomap.state = '';
			if (cgeomap.player.playing=='') {
				for (var i=0; i<this.mapLayer.markerList.length; i++) {
					var marker = $(this.markers).data('marker_'+ this.mapLayer.markerList[i]);
					console.log('marker_'+ this.mapLayer.markerList[i]);
					if (marker.checkAutoplay()) break;
				}
			}
		}
		console.log('markerList: '+ cgeomap.map.mapLayer.markerList.toString());
		console.log(' ');
	} else {
		$('#block').hide();
		cgeomap.state = '';
	}
};
VhplabMap.prototype.updateMap = function(_lat, _lng, _pan) {
	console.log('/* app prototypes */ cgeomap.map.updateMap();');
	console.log('Position: '+ _lat +' , '+ _lng +'.');
	this.locationCircle1.setLatLng([_lat, _lng]);
	this.locationCircle2.setLatLng([_lat, _lng]);
	this.locationCircle3.setLatLng([_lat, _lng]);
	if (_pan) {
		this.map.setZoom(17);
		this.map.panTo(L.latLng(_lat, _lng));
	}
	//this.updateDistances(_lat, _lng);
};
VhplabMap.prototype.updateMarker = function(_path, _data, _n, _layer) {
	console.log('/* app prototypes */ cgeomap.map.updateMarker();');
	var marker = $(this.markers).data('marker_'+_data.id);
	if (typeof marker == "undefined") {
		marker = new VhplabMarker();
		marker.initialize(_path, _data, this);
		marker.json += '&var_mode=recalcul';
		$(this.markers).data('marker_'+marker.id, marker);
		// Add marker to vhpLayer
		this.addMarkerToLayer(marker, _n, _layer);	
	} else {
		marker.updateData(_path, _data, this);
		// Add marker to vhpLayer
		this.addMarkerToLayer(marker, _n, _layer);	
	}
};
VhplabMap.prototype.updateMarkers = function(_data, _layer, _callback) {
	console.log('/* app prototypes */ cgeomap.map.addMarkers();');
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
			console.log('Looping through each marker: i = '+ i +', count = '+ count);
			cgeomap.map.updateMarker(_data.link, marker, i, target);
			// Finish when all markers are looped
			if(i==count) {
				// Paginate only if needed
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
VhplabMap.prototype.reloadMarkers = function(_callback) {
	console.log('/* app prototypes */ cgeomap.map.reloadMarkers();');
	this.closeOpenMarker();
	/*
	this.hideMarkers();
	this.mapLayer.markerList = new Array();
	this.hidden = new Array();
	this.markers = {};
	*/
	this.totalMarkers = 0;
	this.offset = 0;
	this.limit = 200;
	var self = this;
	// Reload markers data
	var url = this.markersURL;
	if (this.auteur!='none') url += '&id_auteur='+ this.auteur;
	url += '&enclosure=true&offset='+ this.offset +'&limit='+ this.limit +'&var_mode=recalcul&callback=?';
	// Get URL via log
	console.log('Markers URL: '+ url);
	$.getJSON(url, function(data){
		console.log('Markers reloaded!');
		self.updateMarkers(data[0], 'map', function(){
			if (_callback) _callback();
		});
	});
};

// ************ //
// Vhplab Marker
// ************ //
VhplabMarker.prototype.appendContent = function() {
	$('#article_'+ this.id +' .wrap_article').empty();
	var category = $(this.data).data('category');
	$('#article_'+ this.id +' .wrap_article').append('<div class="block_category">'+ category.nom +'</div><!-- category -->'+ $(this.data).data('texte'));
	$('#article_'+ this.id +' .header h2').removeClass('empty');
};
VhplabMarker.prototype.bindContentActions = function(_content) {
	$('#article_'+ this.id +' .header').data('loaded', true);
	cgeomap.bindModulesActions('#article_'+ this.id);
	// Mostrar el articulo y actualizar la cabecera
	this.showArticleHeaderActions();
	// Cambiar el estado del player si esta siendo reproducido
	var sound = $('#article_'+ this.id +' .header').data('sound');
	if (cgeomap.player.playing=='enclosure_'+sound) {
		$('#vhplab_player_'+ sound +' .play').hide();
		$('#vhplab_player_'+ sound +' .pause').show();
	}
};
VhplabMarker.prototype.bindPopupActions = function(_content) {
	/*
	$('a.fancybox', _content).on("click touchend", function(e){
		e.preventDefault();
		var img = $(this).attr('href');
		$.fancybox({ 'href' : img });
		return false;
	});
	*/
	$('.player', _content).on("click touchend", function(e){
		e.preventDefault();
		var id_article = $(this).data('id_article');
		$('#article_'+ id_article +' .header .player').trigger('click');
	});
	
	$('.toggle_content', _content).on("click touchend", function(e){
		e.preventDefault();
		cgeomap.toggleContent();
	});
};
VhplabMarker.prototype.checkAutoplay = function() {
	console.log('/* app prototypes */ marker.checkAutoplay();');
	if ((this.distance<=25)&&(this.autoplay)) {
		console.log('cgeomap.toggleArticle("#article_"+ this.id +" header", true)');
		cgeomap.toggleArticle("#article_"+ this.id +" header", true);
		//this.autoplay = false;
		return true;
	} else {
		return false;
	}
};
VhplabMarker.prototype.click = function() {
	if (!this.open) {
		var self = this;
		if (this.loadded) {
			var visible = $('#content .listado_nodos').data('visible');
			if (visible!='none') {
				$('#article_'+ visible +' .wrap_article').hide();
				$('header', '#article_'+ visible).removeClass('open');
			}
			$('#content .wrapper').scrollTo('#article_'+ this.id);
			this.showArticleHeaderActions();
			this.openInfoWindow();
		} else {
			$('footer .loading').show();
			$('#article_'+ this.id +' .header .loading').show();
			var sound = $('#article_'+ this.id +' header').data('sound');
			if ((typeof sound!="undefined")&&(this.autoplay)) cgeomap.play(sound, $('#article_'+ this.id +' .player'));
			this.getData(function(){
				var visible = $('#content .listado_nodos').data('visible');
				if (visible!='none') {
					$('#article_'+ visible +' .wrap_article').hide();
					$('header', '#article_'+ visible).removeClass('open');
				}
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
	//typeof _opts.category != "undefined" ? $(this.data).data('category', _opts.category) : $(this.data).data('category', "category_00");
	this.vibrate = false;
	this.autoplay = false;
	if ($(this.data).data('visibility')=='proximity') {
		this.vibrate = true;
		this.autoplay = true;
	}
	if (typeof _opts.enclosure != "undefined") {
		var enclosureIds = new Array();
		$.each(_opts.enclosure, function(u, enclosure) {
			console.log('/* app prototypes */ enclosure: '+ enclosure.id);
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
	/* este evento no parece funcionar la idea era utilizarlo para controlar el cierre del popup cuando pulsas en otra parte del mapa
	this.infoWindow.on('popupclose', function(e) {
		remoteLog('infoWindow popupclose event!');
	});
	*/
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
	var self = this;
	this.marker.on('click', function(e) {
		self.click();
	});
	this.hasDistance = false;
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
	var player = '';
	if (typeof _data.enclosure != "undefined") {
		player = '<span class="player" data-id_article="'+ this.id +'"></span>';
		var enclosureIds = $(this.data).data('enclosure');
		if (typeof enclosureIds != "undefined") {
			$.each(_data.enclosure, function(u, enclosure) {
				// Si el enclosure no existe todavia hay que crearlo
				if (enclosureIds.indexOf(enclosure.id) == -1) {  
					console.log('// app prototypes // enclosure: '+ enclosure.id);
					cgeomap.player.addTrack(enclosure);
					enclosureIds.push(enclosure.id);
				// Si el enclosure ya existe todo ok
				} else {
				
				}
			});
			$(this.data).data('enclosure', enclosureIds);
		// Como no hay ningun enclosure todavia hay que crearlos todos
		} else {
			enclosureIds = new Array();
			$.each(_data.enclosure, function(u, enclosure) {
				console.log('// app prototypes // enclosure: '+ enclosure.id);
				cgeomap.player.addTrack(enclosure);
				enclosureIds.push(enclosure.id);
			});
			$(this.data).data('enclosure', enclosureIds);
			// Ademas de esto seria necesario crear el player del header
		}
	}
	typeof _data.tags != "undefined" ? tags = _data.tags.split(",") : tags = false;
	$(this.data).data('tags', tags);
	typeof _data.url_qr != "undefined" ? $(this.data).data('url_qr', _data.url_qr) : $(this.data).data('url_qr', '');
	
	// set window content
	this.content = document.createElement("div");
    this.content.className = "window_wrapper";
    this.content.id = "window_"+ this.id;
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
	var base_fb_url = $('#navigation .user .facebook').data('base_href');
	$('#navigation .user .facebook').attr('href', base_fb_url + '/?nodo=' + this.id);
};
VhplabMarker.prototype.setDistance = function(_refLat, _refLng) {
	console.log('/* app prototypes */ marker.setDistance();');
	this.distance = L.latLng([this.lat, this.lng]).distanceTo([_refLat, _refLng]);
	this.dist = parseInt(this.distance/5);
	console.log('distance: '+ this.distance);
};
VhplabMarker.prototype.showArticleHeaderActions = function() {
	$('#article_'+ this.id +' .header').parent().parent().data('visible', this.id);
	$('#article_'+ this.id +' .header').addClass('open');
	$('#article_'+ this.id +' .wrap_article').show();
	$('#content .wrapper').scrollTo('#article_'+ this.id, 'slow', function(){
		cgeomap.navigationListActive = false;
		cgeomap.state = '';
	});	
};
VhplabMarker.prototype.updateDistance = function(_refLat, _refLng) {
	console.log('/* app prototypes */ marker.updateDistance();');
	this.setDistance(_refLat, _refLng);
	if (this.distance<1000) {
		$('#article_'+ this.id +' header .info .distance').html(parseInt(this.distance) + ' m');
	} else if (this.hasDistance == false) {
		$('#article_'+ this.id +' header .info .distance').html(parseInt((this.distance - this.distance%1000)/1000) + ' km');
		this.hasDistance = true;
		console.log('distance is very big! '+ parseInt((this.distance - this.distance%1000)/1000));
	}
	if ($(this.data).data('visibility')=='proximity') {
		if ((this.distance<100)&&(this.vibrate)) {
			console.log('/* proximity */ marker "'+ $(this.data).data('titre') +'" is near');
			console.log('autoplay: '+ this.autoplay);
			cgeomap.addToVisibleNodes(this.id, false);
			// $(this.data).data('visibility','default');
			this.vibrate = false;
			navigator.vibrate(500);
		} else if ((this.distance>40)&&(this.autoplay==false)) {
			console.log('/* proximity */ marker is far');
			this.autoplay = true;
		}
	}
};