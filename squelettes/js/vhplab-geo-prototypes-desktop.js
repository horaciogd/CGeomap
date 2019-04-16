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
/*
VhplabMap.prototype.addEditorMarkers = function(_data, _callback) {
	
	// console.log('addEditorMarkers();');
	
	// Empty editor layer
	var html = '';
	var num = 0;
	var pagination = 0;
	this.editorLayer.clearLayers();
	this.editorMarkerList = new Array();
	var count = $(_data.markers).length - 1;
	// console.log('Total Markers = '+ $(_data.markers).length);
	var path = _data.link;
	
	if ($(_data.markers).length>=1) {
		// Loop through each marker data element
		$.each(_data.markers, function(i, _marker) {
			
			// console.log('i = '+ i +', count = '+ count);
			
			// create Marker
			var marker = new VhplabMarker();
			marker.initialize(_data.link, _marker, cgeomap.map);
			// console.log('Create Marker: "'+ marker.id);
			
			// Marker object saved as jQuery data
			$(cgeomap.map.markers).data('marker_'+ marker.id, marker);
			
			// Add marker to List of all Markers 'editor'
			cgeomap.map.editorMarkerList.push(marker.id);
	
			// Add marker to Layer of all Markers 'editor'
			// console.log('Add Marker: "'+ marker.id +'" to layer');
			cgeomap.map.editorLayer.addLayer(marker.marker);
			
			// Create all Markers navigation entry
			pagination = (num - num%6)/6;
			html +=	cgeomap.createNavigationElement('\t\t\t\t', pagination, marker.id, $(marker.data).data('titre'), $(marker.data).data('lesauteurs'));
			num ++;
			
			if(i==count) {
				//var loadded = cgeomap.map.editorMarkerList.length;
				(pagination==0) ? cgeomap.map.editorPagination = false : cgeomap.map.editorPagination = true;
				
				// console.log('editorMarkerListMarkers: '+ cgeomap.map.editorMarkerList.toString());
				// console.log('editorLayer.length: '+ cgeomap.map.editorLayer.getLayers().length);
			
				cgeomap.map.editorNavigation = html;
				if (_callback) _callback();
			}
			
		});
	} else {
		if (_callback) _callback();
	}
	
};
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
	*/
VhplabMap.prototype.addMarkerToLayer = function(_marker, _num, _layer) {
	// console.log('/* Desktop prototype */ cgeomap.addMarkerToLayer();');
	// Add marker to marker's list
	_layer.markerList.push(_marker.id);
	if ($(_marker.data).data('visibility')=='qr') {
		// QR Marker will be hidden
		// console.log('Marker: '+ _marker.id +'" is qr');
		// console.log('Editor: '+ $("#user .data").data("auteur"));
		// console.log('Marker auteurs: ' + _marker.auteurs.toString());
		if ( _marker.auteurs.indexOf($("#user .data").data("auteur")) > -1) {
			// console.log('Editor is the author');
			
			// Add marker to leaflet layer
			// console.log('Add Marker: "'+ _marker.id +'" to layer');
			_layer.layer.addLayer(_marker.marker);
			// Update navigation html
			_layer.addToNavigationHtml(cgeomap.createNavigationElement('\t\t\t\t', (_num - _num % 6) / 6, _marker.id, $(_marker.data).data('titre'), $(_marker.data).data('lesauteurs')));		
			return true;
		
		} else {
			// console.log('Editor is NOT the author');
			return false;
		}
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
	// console.log('cgeomap.map.bindActions();');
	cgeomap.bindNavigationButtons();
	cgeomap.map.showLayer('map', false);
	$("#user .carte").addClass('on');
	cgeomap.map.openMarker();
};
VhplabMap.prototype.clickListener = function(_e) {
	cgeomap.map.updateClickableMarker(_e.latlng.lat, _e.latlng.lng);
	cgeomap.form.check();
};
VhplabMap.prototype.embedClickListener = function(_e) {
	// console.log('embedClickListener();');
	cgeomap.map.map.panTo(_e.latlng);
};
VhplabMap.prototype.embedMoveendListener = function(_e) {
	// console.log('embedMoveendListener();');
	var center = cgeomap.map.map.getCenter()
	$(cgeomap.map.latitudeTag).val(center.lat);
	$(cgeomap.map.longitudeTag).val(center.lng);
	$(cgeomap.map.zoomTag).val(cgeomap.map.map.getZoom());
	cgeomap.urlEmbed(false);
};
VhplabMap.prototype.embedZoomListener = function(_e) {
	// console.log('embedZoomListener();');
	var center = cgeomap.map.map.getCenter()
	$(cgeomap.map.latitudeTag).val(center.lat);
	$(cgeomap.map.longitudeTag).val(center.lng);
	$(cgeomap.map.zoomTag).val(cgeomap.map.map.getZoom());
	cgeomap.urlEmbed(false);
};
VhplabMap.prototype.forceCache = function() {
	// console.log('forceCache();');
	// Set URL
	var cache_auteur_url = this.markersURL +'&id_auteur='+ $("#user .data").data("auteur") +'&offset='+ this.offset +'&limit='+ this.limit +'&var_mode=recalcul&callback=?'
	var cache_url = this.markersURL + '&offset='+ this.offset +'&limit='+ this.limit +'&var_mode=recalcul&callback=?'	
	
	// Load cache_auteur_url to renew cache
	// Get URL via LOG
	// console.log('Force cache_auteur_url: '+ cache_auteur_url);
	$.ajax({
		type: 'GET',
		url: cache_auteur_url,
		async: false,
		crossDomain: true,
		jsonpCallback: 'jsonArticles',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(_data, _textStatus, _jqXHR) {
			// console.log('cache_auteur_url renewed');
			
			// Load cache_url to renew cache
			// Get URL via LOG
			// console.log('Force cache_url: '+ cache_url);
			$.ajax({
				type: 'GET',
				url: cache_url,
				async: false,
				crossDomain: true,
				jsonpCallback: 'jsonArticles',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(_data, _textStatus, _jqXHR) {
					// console.log('cache_url renewed');
				},error: function (_xhr, _ajaxOptions, _thrownError) {
					// console.log('cache_url error:'+_thrownError);
				}
			});
	
		},error: function (_xhr, _ajaxOptions, _thrownError) {
			// console.log('cache_auteur_url error:'+_thrownError);
		}
	});
};
VhplabMap.prototype.initMapElements = function(_opts) {
	// Marker Layers
	
	// Max Zoom Service
	
	// Map Zoom Custom Control
	this.zoomControl = new vhplabZoomControl();
	this.zoomControl.setParent(this);
	this.map.addControl(this.zoomControl);
	
	this.typeControl = new vhplabTypeControl();
	this.typeControl.setParent(this);
	this.map.addControl(this.typeControl);

	// Geocoder
	this.geocoder = new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.OpenStreetMap()
    });
    this.geocoder._processResults = function(results, qry) {
    	// console.log(results.toSource());
    	if (typeof results[0] != "undefined") {
    		cgeomap.map.updateClickableMarker(results[0].Y, results[0].X);
			cgeomap.form.check();
		} else {
			alert(_T.message_geocoder);
		}
    }
	
	// Clickable Marker
	
	//this.setInitialMarker(_opts);
    	
};
VhplabMap.prototype.loadEditorMarkers = function(_url, _callback) {
	// console.log('cgeomap.map.loadEditorMarkers();');
	// load markers data
	$.getJSON(_url, function(data){
		cgeomap.map.addMarkers(data[0], 'editor', _callback);
	});					
};
VhplabMap.prototype.loadMarkers = function() {
	// Load markers data
	// console.log('/* desktop prototypes */ cgeomap.map.loadMarkers();');
	var url = this.markersURL;
	if (this.auteur!='none') url += '&id_auteur='+ this.auteur;
	url += '&offset='+ this.offset +'&limit='+ this.limit +'&callback=?';
	/* Load article template */
	//cgeomap.loadArticleTemplate(function(){
		/* Load user */
 		//cgeomap.loadUser(function(){
			
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
					// Get _data via log
					// console.log('_data: '+  JSON.stringify(_data) );
					cgeomap.map.addMarkers(_data, 'map', function(){
						/* Bind Actions */
						cgeomap.map.bindActions();
					});
				},error: function (xhr, ajaxOptions, thrownError) {
				}
			});
 		// });
	// });
};
VhplabMap.prototype.loadNewMarkers = function(_url, _callback) {
	var self = this;
	// load markers data get URL via alert(_url);
	$.getJSON(_url, function(data){
		self.addNewMarkers(data[0], _callback);
	});					
};
VhplabMap.prototype.reloadMarkers = function(_id, _callback) {
	// console.log('reloadMarkers();');
	// Set URL
	var new_marker_url = this.markersURL +'&id_article='+ _id +'&offset='+ this.offset +'&limit='+ this.limit +'&var_mode=recalcul&callback=?'
	// Load markers data
	// Get URL via LOG
	// console.log('Load new_marker: '+ new_marker_url);
	$.ajax({
		type: 'GET',
		url: new_marker_url,
		async: false,
		crossDomain: true,
		jsonpCallback: 'jsonArticles',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(_data, _textStatus, _jqXHR) {
			var count = $(_data.markers).length - 1;
			// console.log('Updating '+ $(_data.markers).length +' markers');
			$.each(_data.markers, function(i, marker) {
				// console.log('updateMarker('+ _data.link +', '+ marker +', '+ i +');');
				cgeomap.map.updateMarker(_data.link, marker, i);
				if(i==count) {
					// console.log('Updating finished ready to callback()');
					if (_callback) _callback();
					cgeomap.map.forceCache();
				}
			});
		},error: function (xhr, ajaxOptions, thrownError) {
		}
	});
};
VhplabMap.prototype.showMarkerJson = function(_url, _markers) {
	this.emptyLayer.reset();
	var count = $(_markers).length - 1;
	$.each(_markers, function(i, m) {
		var marker = $(cgeomap.map.markers).data('marker_'+ m.id);
		// console.log('typeof marker = '+ typeof marker);
		if (typeof marker != "undefined") {
			// Add marker to marker's list
			cgeomap.map.emptyLayer.markerList.push(marker.id);
			// Add marker to leaflet layer
			cgeomap.map.emptyLayer.layer.addLayer(marker.marker);
		} else {
			// create Marker
			var new_marker = new VhplabMarker();
			new_marker.initialize(_url, m, cgeomap.map);
			// console.log('Create Marker: "'+ new_marker.id);
			// Save marker as jQuery data
			$(cgeomap.map.markers).data('marker_'+ new_marker.id, new_marker);
			// Add marker to marker's list
			cgeomap.map.emptyLayer.markerList.push(new_marker.id);
			// Add marker to leaflet layer
			cgeomap.map.emptyLayer.layer.addLayer(new_marker.marker);
		}
		if (i==count) {
			cgeomap.map.map.fitBounds(cgeomap.map.emptyLayer.layer.getBounds());
			cgeomap.map.map.setZoom(cgeomap.map.map.getZoom()-2);
		}
	});
};
VhplabMap.prototype.updateClickableMarker = function(_lat, _lng, _zoom) {
	// console.log('updateClickableMarker();');
	this.clickableMarker.setLatLng([_lat, _lng]);
	((typeof _zoom != "undefined")&&(_zoom != '')) ? this.map.setView([_lat, _lng], _zoom) : this.map.panTo([_lat, _lng]);
	$(this.latitudeTag).val(_lat % 360);
	$(this.longitudeTag).val(_lng % 360);
	$(this.zoomTag).val(this.map.getZoom());
	$(".cartography label").addClass('new');
	$("#formulaire .wrap_cartography").data('ok',true);
};
/*
VhplabMap.prototype.updateMarkers = function(_data, _callback) {
	
	// console.log('updateMarkers();');
	
	// Update none layer
	var html = '';
	var num = 0;
	var pagination = 0;
	var count = $(_data.markers).length - 1;
	// console.log('Total Markers = '+ $(_data.markers).length);
	var path = _data.link;
	
	if ($(_data.markers).length>=1) {
		// Loop through each marker data element
		$.each(_data.markers, function(i, _marker) {
			
			// console.log('i = '+ i +', count = '+ count);
			
			self.updateMarker(path, marker, n);
		
			// Get marker from jQuery data
			var marker = $(cgeomap.map.markers).data('marker_'+_marker.id);
			
			// if marker doesn't exists create new marker
			if (typeof marker == "undefined") {
			
				// create Marker
				marker = new VhplabMarker();
				marker.initialize(_data.link, _marker, cgeomap.map);
				// console.log('Create Marker: "'+ marker.id);
			
				// Marker object saved as jQuery data
				$(cgeomap.map.markers).data('marker_'+ marker.id, marker);
			
				// Add marker to List of all Markers 'none'
				cgeomap.map.mapMarkerList.push(marker.id);
	
				// Add marker to Layer of all Markers 'none'
				// console.log('Add Marker: "'+ marker.id +'" to layer');
				cgeomap.map.mapLayer.addLayer(marker.marker);
			
			// if marker exists just update
			} else {
				marker.updateData(_path, _marker, cgeomap.map);
			}
	
			// Create all markers navigation entry
			pagination = (num - num%6)/6;
			html +=	cgeomap.createNavigationElement('\t\t\t\t', pagination, marker.id, $(marker.data).data('titre'), $(marker.data).data('lesauteurs'));
			num ++;
			
			if(i==count) {
				//var loadded = cgeomap.map.editorMarkerList.length;
				(pagination==0) ? cgeomap.map.mapPagination = false : cgeomap.map.mapPagination = true;
				
				// console.log('mapMarkerListMarkers: '+ cgeomap.map.mapMarkerList.toString());
				
				// console.log('mapLayer.length: '+ cgeomap.map.mapLayer.getLayers().length);
			
				cgeomap.map.mapNavigation = html;
				cgeomap.map.bindActions();
				if (_callback) _callback();
			}
			
		});
	} else {
		cgeomap.map.bindActions();
		if (_callback) _callback();
	}
	
};
*/
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
	// console.log('/* desktop prototypes */ cgeomap.map.appendContent();');
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
		// console.log('cgeomap.map.auteur: '+ cgeomap.map.auteur);
		/*
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
		// console.log('url_nodo:'+ url_nodo);
		*/
		
		var submap = $(this.data).data('submap');
		var url_nodo = submap.url;
		(cgeomap.map.auteur!='none') ? url_nodo += '?author='+ cgeomap.map.auteur +'&nodo='+ this.id : url_nodo += '?nodo=' + this.id; 
		// console.log('url_nodo: '+ url_nodo);
	
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
	// console.log('/* desktop prototypes */ Marker click();');
	// console.log('marker.id = '+ this.id);
	
	// console.log('activeLayer: '+ this.parent.activeLayer);
	// console.log('selected: '+ $("#content").data('selected'));
	
	var selected = $("#content").data('selected');
	var target = this.parent.getLayer(this.parent.activeLayer);
	var markerList = Array.from(target.markerList);
	// console.log('markerList:'+ target.markerList);
	// console.log(jQuery.inArray(this.id, markerList));
	if ((jQuery.inArray(this.id, markerList)<0)||($("#content").data('selected')!='carte')) {
		// console.log('Hay que cambiar de layer');
		cgeomap.toggleUtilities('carte', false);
	}
	/*
	if ($("#content").data('selected')!='carte') {	
		// console.log("'selected'!='carte'");
		// console.log("cgeomap.toggleUtilities('carte', false);");
		cgeomap.toggleUtilities('carte', false);
	}
	*/
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
	var submap = $(this.data).data('submap');
	if (cgeomap.map.auteur!='none') {
		//$('#navigation .user .facebook').attr('href', base_fb_url + encodeURIComponent(cgeomap.url_site + '?author='+ cgeomap.map.auteur +'&nodo=' + this.id));
		$('#navigation .user .facebook').attr('href', base_fb_url + encodeURIComponent(submap.url + '?author='+ cgeomap.map.auteur +'&nodo=' + this.id));
		// console.log('facebook href: '+ submap.url + '?author='+ cgeomap.map.auteur +'&nodo=' + this.id);
		
		
	} else {
		//$('#navigation .user .facebook').attr('href', base_fb_url + encodeURIComponent(cgeomap.url_site + '?nodo=' + this.id));
		$('#navigation .user .facebook').attr('href', base_fb_url + encodeURIComponent(submap.url + '?nodo=' + this.id));
		// console.log('facebook href: ' + submap.url + '?nodo=' + this.id);
		
		
	}
};
		