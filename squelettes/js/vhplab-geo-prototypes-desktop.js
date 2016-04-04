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
VhplabMap.prototype.bindActions = function() {
	cgeomap.createNavigationList();
	cgeomap.bindNavigationListActions();
	cgeomap.loadArticleTemplate(function(){
		cgeomap.map.openMarker();
	});
};
VhplabMap.prototype.clickListener = function(_e) {
	this.clickableMarker.setLatLng(_e.latlng);
	this.clickableMarker.setOpacity(1);
	this.map.panTo(_e.latlng);
	$(this.latitudeTag).val(_e.latlng.lat);
	$(this.longitudeTag).val(_e.latlng.lng);
	$(this.zoomTag).val(this.map.getZoom());
	$(".cartography label").addClass('new');
	$("#formulaire .wrap_cartography").data('ok',true);
	cgeomap.form.check();
};
VhplabMap.prototype.openMarker = function() {
	if (this.open) {
		var marker = $(this.markers).data('marker_'+this.open);
		marker.click();
	}
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
		cgeomap.map.clickableMarker.setOpacity(1);
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
VhplabMap.prototype.zoomListener = function(_e) {
	$(this.zoomTag).val(this.map.getZoom());
	$(".cartography label").addClass('new');
	$("#formulaire .wrap_cartography").data('ok',true);
	cgeomap.form.check();
};


// ************ //
// Vhplab Marker
// ************ //
VhplabMarker.prototype.appendContent = function() {
	/* editer */
	if (($(this.data).data('autorise'))&&($(this.data).data('autorise')=='oui')) {
		$('#article .header .editer').data('href', $(this.data).data('url_editer'));
		$('#article .header .editer').data('visible', true);
		$('#article .header .editer').show();
	} else {
		$('#article .header .editer').data('visible', false);
		$('#article .header .editer').hide();
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
			var player = new VhplabPlayer();
			player.init({
				id: i,
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
				var base = url.substr(0, cgeomap.url_site.length + 14);
				if (base==cgeomap.url_site+"spip.php?nodo="){
					var id = url.split("=");
					$(this).click(function(){
						var marker = $(cgeomap.map.markers).data('marker_'+id[1]);
						marker.click();
						return false;
					});
				}
			});
		});	
	}
};
VhplabMarker.prototype.bindPopupActions = function(_content) {
	$('a.fancybox', _content).click(function(){
		var img = $(this).attr('href');
		$.fancybox({ 'href' : img });
		return false;
	});
};
VhplabMarker.prototype.click = function(_callback) {
	if(!this.open) {
		var self = this;
		if (this.loadded) {
			cgeomap.slideContent('hide', function() {
				self.appendContent();
				cgeomap.slideContent('show');
				self.openInfoWindow();
				$("#article .scroll").mCustomScrollbar("update");
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
						cgeomap.slideContent('show');
						self.openInfoWindow();
						if(_callback) _callback();
						$("#article .scroll").mCustomScrollbar("update");
					});
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
	this.parent.map.setView([this.lat, this.lng], this.zoom);
	this.infoWindow.openOn(this.parent.map);
	this.open = true;
	this.parent.open = this.id;
	var base_fb_url = $('#navigation .user .facebook').data('base_href');
	$('#navigation .user .facebook').attr('href', base_fb_url + '/?nodo=' + this.id);
};