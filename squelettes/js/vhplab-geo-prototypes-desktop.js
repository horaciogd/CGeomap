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
VhplabMap.prototype.addNewMarkers = function(_data, _callback) {
	var n = this.offset;
	var self = this;
	var count = $(_data.markers).length - 1;
	var path = _data.link;
	if ($(_data.markers).length>=1) {
		var aportaciones = new Array();
		var list = new Array();
		// Loop through each marker data element
		$.each(_data.markers, function(i, marker) {
			n++;
			if (typeof $(this.markers).data('marker_'+marker.id) == "undefined") {
				self.addMarker(path, marker, n);
				aportaciones.push(parseInt(marker.id));
				var newMarker = $(self.markers).data('marker_'+marker.id);
				list.push(newMarker.marker.getLatLng());
			}
			if(i==count) {
				var loadded = self.markerList.length;
				self.hidden = aportaciones;
				var bounds = new L.latLngBounds(list);
				self.map.fitBounds(bounds);
				self.map.setZoom(self.map.getZoom()-1);
				if (_callback) _callback();
			}
		});
	} else {
		if (_callback) _callback();
	}
};
VhplabMap.prototype.bindActions = function() {
	cgeomap.loadArticleTemplate(function(){
		cgeomap.createNavigationList();
		cgeomap.bindNavigationListActions();
		cgeomap.map.openMarker();
	});
};
VhplabMap.prototype.clickListener = function(_e) {
	cgeomap.map.clickableMarker.setLatLng(_e.latlng);
	cgeomap.map.clickableMarker.addTo(cgeomap.map.map);
	cgeomap.map.map.panTo(_e.latlng);
	$(cgeomap.map.latitudeTag).val(_e.latlng.lat);
	$(cgeomap.map.longitudeTag).val(_e.latlng.lng);
	$(cgeomap.map.zoomTag).val(cgeomap.map.map.getZoom());
	$(".cartography label").addClass('new');
	$("#formulaire .wrap_cartography").data('ok',true);
	cgeomap.form.check();
};
VhplabMap.prototype.embedClickListener = function(_e) {
	cgeomap.map.map.panTo(_e.latlng);
};
VhplabMap.prototype.embedMoveendListener = function(_e) {
	var center = cgeomap.map.map.getCenter()
	$(cgeomap.map.latitudeTag).val(center.lat);
	$(cgeomap.map.longitudeTag).val(center.lng);
	$(cgeomap.map.zoomTag).val(cgeomap.map.map.getZoom());
	$(".cartography label").addClass('new');
};
VhplabMap.prototype.embedZoomListener = function(_e) {
	var center = cgeomap.map.map.getCenter()
	$(cgeomap.map.latitudeTag).val(center.lat);
	$(cgeomap.map.longitudeTag).val(center.lng);
	$(cgeomap.map.zoomTag).val(cgeomap.map.map.getZoom());
	$(".cartography label").addClass('new');
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
    this.geocoder._processResults = function(results, qry) {
       	cgeomap.map.clickableMarker.setLatLng([results[0].Y, results[0].X]);
		// cgeomap.map.clickableMarker.setOpacity(1);
       	cgeomap.map.clickableMarker.addTo(cgeomap.map.map);
		cgeomap.map.map.panTo([results[0].Y, results[0].X]);
		$(cgeomap.map.latitudeTag).val(results[0].Y);
		$(cgeomap.map.longitudeTag).val(results[0].X);
		$(cgeomap.map.zoomTag).val(cgeomap.map.map.getZoom());
		$(".cartography label").addClass('new');
		$("#formulaire .wrap_cartography").data('ok',true);
		cgeomap.form.check();
    }
	
	// Clickable Marker
	this.setInitialMarker(_opts);
    	
};
VhplabMap.prototype.loadNewMarkers = function(_url, _callback) {
	var self = this;
	// load markers data get URL via alert(_url);
	$.getJSON(_url, function(data){
		self.addNewMarkers(data[0], _callback);
	});					
};
VhplabMap.prototype.reloadMarkers = function(_url, _callback) {
	var self = this;
	// load markers data
	// get URL via alert(_url);
	$.getJSON(_url, function(data){
		//alert(data.toSource());
		self.updateMarkers(data[0], function(){
			if (_callback) _callback();
		});
	});
	$.getJSON(this.markersURL +'&offset='+ this.offset +'&limit='+ this.limit +'&var_mode=recalcul&callback=?', function(data){});		
};
VhplabMap.prototype.showMarkerJson = function(_markers) {
	var list = new Array();
	$.each(_markers, function(i, m) {
		var marker = $(cgeomap.map.markers).data('marker_'+ m.id);
		list.push(marker.marker.getLatLng());
		marker.marker.addTo(cgeomap.map.map);
	});
	var bounds = new L.latLngBounds(list);
	this.map.fitBounds(bounds);
	this.map.setZoom(this.map.getZoom()-1);
};
VhplabMap.prototype.updateMarkers = function(_data, _callback) {
	var n = this.offset;
	var self = this;
	var count = $(_data.markers).length - 1;
	var path = _data.link;
	// Loop through each marker data element
	$.each(_data.markers, function(i, marker) {
		n++;
		if (($("#user .data").data("auteur") != self.auteur)&&(typeof $(self.markers).data('marker_'+marker.id) == "undefined")) {
			self.hidden.push(parseInt(marker.id));
		}
		self.updateMarker(path, marker, n);
		if(i==count) {
			var loadded = self.markerList.length;
			self.offset = loadded;
			_callback();
		}
	});
};
VhplabMap.prototype.zoomListener = function(_e) {
	$(cgeomap.map.zoomTag).val(cgeomap.map.map.getZoom());
	$(".cartography label").addClass('new');
	$("#formulaire .wrap_cartography").data('ok',true);
	cgeomap.form.check();
};


// ************ //
// Vhplab Marker
// ************ //
VhplabMarker.prototype.appendContent = function() {
	
	/* qr */
	$('#article .qr').remove();
	
	/* editer */
	if (($(this.data).data('autorise'))&&($(this.data).data('autorise')=='oui')) {
		$('#article .header .editer').data('href', $(this.data).data('url_editer'));
		$('#article .header .editer').data('visible', true);
		
		/* qr */
		if (($(this.data).data('url_qr')!='')&&($(this.data).data('visibility')=='qr')) $('#article .modules').after('<div class="qr"><img src="'+ $(this.data).data('url_qr') +'" /><a class="btn" target="_blank" href="'+ $(this.data).data('url_qr') +'">'+ _T.download_qr +'</a></div>');
		
	} else {
		$('#article .header .editer').data('visible', false);
	}
	
	/* URL */
	if (cgeomap.session == true) {
		var url_nodo = $(this.data).data('url_article');
		if (cgeomap.map.auteur!='none') {
			var parts = url_nodo.split("/");
			url_nodo = "http://";
			for (var i=2; i<parts.length; i++) {
				if (i == parts.length - 1) {
					var nodo = parts[i].split("?");
					url_nodo += "/spip.php?author="+ cgeomap.map.auteur +"&"+ nodo[1];
				 } else {
					url_nodo += "/"+ parts[i];
				 }
			}
		}
		$('#article header .permalink').attr('href', url_nodo);
		$('#article header .permalink').show();
	} else {
		$('#article header .permalink').hide();
	}
	
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
		$('#article .modules').append($(this.data).data('texte'));
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
				var url = $(this).attr('href');
				var base = url.substr(0, cgeomap.url_site.length);
				if (base==cgeomap.url_site) {
					var author = '';
					var nodo = '';
					var data = url.slice(cgeomap.url_site.length);
					var clean_data = data.split('?');
					var parameters = clean_data[1].split('&');
					for (var i = 0; i < parameters.length; i++) {
						var p = parameters[i].split('=');
						if (p[0]=='author') author = p[1];
						if (p[0]=='nodo') nodo = p[1];
					}
					$(this).attr('target','_self');
					$(this).click(function(){
						var marker = $(cgeomap.map.markers).data('marker_'+nodo);
						if (typeof marker != "undefined") {
							marker.click();
							return false;
						} else {
							return true;
						}
					});
				}
			});
		});	
	}
};
VhplabMarker.prototype.bindPopupActions = function(_content) {
	/*
	$('a.fancybox', _content).click(function(){
		var img = $(this).attr('href');
		$.fancybox({ 'href' : img });
		return false;
	});
	var visible = $("#content").data('visible');
	if (!visible) $('.toggle_content', _content).addClass('closed');
	$('.toggle_content', _content).click(function(){
		cgeomap.toggleContent();
	});
	*/
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
	if ($("#content").data('selected')!='carte') {	
		cgeomap.toggleUtilities('carte');
	}
	if (!this.open) {
		var self = this;
		if (this.loadded) {
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
			$('#loading_content').fadeIn();
			cgeomap.slideContent('hide', function() {
				// image size for automatic processing
				var width = 330;
				var height = 120;
				// get URL via alert(self.json +'&width='+ width +'&height='+ height);
				$.getJSON(self.json +'&width='+ width +'&height='+ height, function(data) {
					$('#loading_content').fadeOut();
					$.each(data[0].marker, function(i, marker){
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
		if (!this.infoWindow._isOpen) this.infoWindow.openOn(this.parent.map);
	}
};
VhplabMarker.prototype.openInfoWindow = function() {
	if(this.parent.open) {
		var open = $(this.parent.markers).data('marker_'+this.parent.open);
		open.closeInfoWindow();
	}
	if (jQuery.inArray(this.id, this.parent.hidden)>=0) this.marker.addTo(this.parent.map);
	this.parent.map.setView([this.lat, this.lng], this.zoom);
	this.infoWindow.openOn(this.parent.map);
	this.open = true;
	this.parent.open = this.id;
	var base_fb_url = $('#navigation .user .facebook').data('base_href');
	if (cgeomap.map.auteur!='none') {
		$('#navigation .user .facebook').attr('href', base_fb_url + encodeURIComponent(cgeomap.url_site + '?author='+ cgeomap.map.auteur +'&nodo=' + this.id));
	} else {
		$('#navigation .user .facebook').attr('href', base_fb_url + encodeURIComponent(cgeomap.url_site + '?nodo=' + this.id));
	}
};
		