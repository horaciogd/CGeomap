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
VhplabMap.prototype.addMarkerToLayer = function(_marker, _num, _layer) {
	// console.log('/* Map prototype */ cgeomap.addMarkerToLayer();');
	// Add marker to marker's list
	_layer.markerList.push(_marker.id);
	// Check visibility
	if (($(_marker.data).data('visibility')=='qr')&&(cgeomap.visibleNodes.indexOf(parseInt(_marker.id)) < 0)){
		// QR Marker will be hidden
		// console.log('Marker: '+ _marker.id +'" is qr');
		return false;
	} else {
		// Add marker to leaflet layer
		// console.log('Add Marker: "'+ _marker.id +'" to layer');
		_layer.layer.addLayer(_marker.marker);
		// Update navigation html
		_layer.addToNavigationHtml(cgeomap.createNavigationElement('\t\t\t\t', (_num - _num % 6) / 6, _marker.id, $(_marker.data).data('titre'), $(_marker.data).data('lesauteurs')));		
		return true;
	}
};
VhplabMap.prototype.bindActions = function() {
	// console.log('/* Map prototype */ cgeomap.map.bindActions();');
	$('#loading_content').fadeOut();
	$('#loading').fadeOut();
	cgeomap.map.showLayer('map', false);
	cgeomap.map.openMarker();
};
VhplabMap.prototype.initialize = function(_opts) {
	if (typeof _opts.url != "undefined") this.baseURL = _opts.url;
	if (typeof _opts.markers != "undefined") this.markersURL = this.baseURL + _opts.markers;
	if ((typeof _opts.recherche != "undefined")&&(_opts.recherche != false)) this.markersURL +=  '&recherche=' + _opts.recherche;
	if ((typeof _opts.auteur != "undefined")&&(_opts.auteur != false)) this.markersURL +=  '&auteur=' + _opts.auteur;
	if ((typeof _opts.categoria != "undefined")&&(_opts.categoria != false)) this.markersURL +=  '&categoria=' + _opts.categoria;
	if ((typeof _opts.tag != "undefined")&&(_opts.tag != false)) this.markersURL +=  '&tag=' + _opts.tag;
	if ((typeof _opts.meta_tag != "undefined")&&(_opts.meta_tag != false)) this.markersURL +=  '&meta_tag=' + _opts.meta_tag;
	if (typeof _opts.open != "undefined") this.open = _opts.open;
	// Visibility settings for qr nodes
	cgeomap.setVisibleNodes();
	this.createMap(_opts);
	this.initMapElements(_opts);
	if (this.markersURL != '') this.loadMarkers();
};
VhplabMap.prototype.initMapElements = function(_opts) {
	
	// Map Zoom Custom Control
	this.zoomControl = new vhplabZoomControl();
	this.zoomControl.setParent(this);
	this.map.addControl(this.zoomControl);
	
	this.typeControl = new vhplabTypeControl();
	this.typeControl.setParent(this);
	this.map.addControl(this.typeControl);
	
	// Map Loading Custom Control
	this.loadingControl = new vhplabLoadingControl();
	this.map.addControl(this.loadingControl);

};
VhplabMap.prototype.loadMarkers = function() {
	// console.log('/* Map prototype */ cgeomap.map.loadMarkers();');
	var url = this.markersURL +'&callback=?';
	/* Load article template */
	cgeomap.loadArticleTemplate(function(){
		// Get URL via log
		// console.log('Markers URL: '+ url);
		$.ajax({
			type: 'GET',
			url: url,
			async: false,
			crossDomain: true,
			jsonpCallback: 'jsonArticles',
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(_data, _textStatus, _jqXHR) {
				// Get _data via log // toSource no EXISTE !!!! //
				// console.log('_data: '+ _data.toSource());
				cgeomap.map.submap = _data.submap;
				cgeomap.map.addMarkers(_data, 'map', function(){
					cgeomap.map.bindActions();
				});
			},
			error: function (xhr, ajaxOptions, thrownError) {
			}
		});		
	});
};
VhplabMap.prototype.showLayer = function(_name, _fitBounds) {
	// console.log('/* Map prototype */ cgeomap.map.showLayer("'+ _name +'");');
	if (this.activeLayer != _name) {
		// Get layer
		var target = this.getLayer(_name);
		// Hide previous layer & and new one to leaflet map
		this.hideActiveLayer();
		this.map.addLayer(target.layer);
		// append navigation html
		cgeomap.appendNavigationList(target.navigationHtml, target.pagination, target.pages);
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

// ************ //
// Vhplab Marker
// ************ //
VhplabMarker.prototype.appendContent = function() {
	
	/* icon */
	var icon = $(this.data).data('icon');
	$('#article header img').attr('src', icon.url);
	$('#article header img').attr('width', icon.width/2);
	$('#article header img').attr('height', icon.height/2);
	
	/* title & subtitle */
	$('#article .titre').html($(this.data).data('titre'));
	$('#article .soustitre').html($(this.data).data('soustitre'));
	
	/* texte */
	$('#article .texte').empty();
	
	/* modules */
	soundManager.stopAll();
	$('#article .modules_list ul li.audio').each(function(i){
		soundManager.destroySound('cgeomap_sound_' + i);
	});
	$('#article .modules').empty();
	var t = $(this.data).data('texte');
	/* texte */
	if(t.search("<div class='block_modules")==(-1)) {
		$('#article .texte').html($(this.data).data('texte'));
		$('#article .texte a.fancybox').fancybox();
		
	/* modules */
	} else {
		var category = $(this.data).data('category');
		$('#article .modules').append('<div class="block_category '+ category.id +'">'+ category.nom +'</div><!-- category -->'+ $(this.data).data('texte'));
		$("#article .modules_list header").hover(function() {
    			$('.toggle', this).addClass('hover');
  			}, function() {
    			$('.toggle', this).removeClass('hover');
  		});
  		$('#article .modules_list .audio').each(function(i){
			var url = $('a', this).attr("href");
			var sound_id = $('a', this).data("id");
			var player = new VhplabPlayer();
			player.init({
				id: sound_id,
				url: url
			});
			$('.content', this).empty();
			player.appendTo($('.content', this));
		});
		$("#article .modules_list a.fancybox").fancybox();
		$('#article .modules_list .link').each(function(i){
			/* internal link */
			$('.content li a', this).each(function(u){
				cgeomap.internalizeLink(this);
			});
		});
		// console.log('/* fancybox */');
		$("#article .modules_list .vimeo").fancybox({
			beforeLoad: function () {
				this.href += '?autoplay=1'
    		},
			'width'				: $("#article .modules_list .vimeo").data('width'),
			'height'			: $("#article .modules_list .vimeo").data('height'),
        	'arrows'     		: false,
        	'autoScale'     	: false,
        	'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'				: 'iframe'
		});
	
	}
};
VhplabMarker.prototype.bindPopupActions = function(_content) {
	$('.player', _content).click(function(){
		var audio_module = $('#article .block_modules .audio:first');
		if ($(this).hasClass('active')) {
			$('.pause', audio_module).trigger('click');
		} else {
			$('.play', audio_module).trigger('click');
		}
	});
};
VhplabMarker.prototype.click = function(_callback) {
	/*
	if (!this.open) {
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
	} else {
		if (!this.infoWindow._isOpen) this.infoWindow.openOn(this.parent.map);
	}
	*/
	// console.log('Marker click();');
	// console.log('marker.id = '+ this.id);
	if (!this.open) {
		// console.log('marker.open = false');
		var self = this;
		if (this.loadded) {
			// console.log('marker.loadded = true');
			cgeomap.slideContent('hide', function() {
				self.appendContent();
				cgeomap.slideContent('show', function() {
					if ($('#article .header .editer').data('visible')) $('#article .header .editer').fadeIn("slow");
					$("#article .scroll").mCustomScrollbar("update");
					if (_callback) _callback();
				});
				self.openInfoWindow();
			});
		} else {
			// console.log('marker.loadded = false');
			$('#loading_content').fadeIn();
			cgeomap.slideContent('hide', function() {
				// image size for automatic processing
				var width = 330;
				var height = 120;
				// Get URL via log
				// console.log('Marker json URL: '+ self.json +'&width='+ width +'&height='+ height);
				$.getJSON(self.json +'&width='+ width +'&height='+ height, function(data) {
					$('#loading_content').fadeOut();
					$.each(data[0].marker, function(i, marker){
						// console.log('Each loop: '+ i +' marker id '+ marker.id_article);
						self.loadWindowData(marker);
						self.appendContent();
						cgeomap.slideContent('show', function() {
							if ($('#article .header .editer').data('visible')) $('#article .header .editer').fadeIn("slow");
							$("#article .scroll").mCustomScrollbar("update");
							if (_callback) _callback();
						});
						self.openInfoWindow();
					});
				});
			});
		}
	} else {
		// console.log('marker.open = true');
		if (!this.infoWindow._isOpen) this.infoWindow.openOn(this.parent.map);
		if (_callback) _callback();
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