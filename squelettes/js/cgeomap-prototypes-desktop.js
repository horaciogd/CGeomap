/*
 * VHPlab plugin for Commons CGEOMAP project and media localization
 *
 * JavaScript document to alter map prototypes
 *
 * Author:
 * Horacio González
 * (c) 2016 - Distribuído baixo licencia GNU/GPL
 *
 */
 
//***********
// Vhplab Interface
//***********
VhplabInterface.prototype.bindContributionsActions = function(_callback) {
	var aportaciones = new Array();
	$("#contributions li").each(function(){
		aportaciones.push($(this).data("id"));
	});
	$("#contributions a").click(function(){
		var container = $(this).parent().parent();
		var id = $(container).data('id');
		var marker = $(cgeomap.map.markers).data('marker_'+id);
		marker.click();
	});
	$("#contributions .delete").click(function(){
		var container = $(this).parent();
		var id = $(container).data('id');
		cgeomap.submitDelete(id);
	});
	$("#contributions").data('loaded', true);
	$("#contributions").data('aportaciones', aportaciones);
	if (_callback) _callback(aportaciones);
};
VhplabInterface.prototype.bindEmbedActions = function(_callback) {
	$("#embed").data('loadded', true);
	$("#embed .wrap_iframe").hide();
	$("#embed .wrap_iframe").data('visible', false);
	cgeomap.toggleGeoEmbed(true);
	/* form */
	$("#embed form").submit(function() {
		return false;
	});
	/* auteur */
	$("#embed .wrap_auteur select").change(function(){
		cgeomap.changeEmbedAuteur();
		cgeomap.urlEmbed(true);
	});
    /* tags 
	$("#embed .wrap_tags select").change(function(){
		cgeomap.urlEmbed(true);
	}); */
	/* meta_tags
	$("#embed .wrap_meta_tags select").change(function(){
		cgeomap.urlEmbed(true);
	}); */
	/* recherche */
	$("#embed .wrap_recherche .field_box input").blur(function(){
		cgeomap.updateEmbedRechercheField(this);
	});
	if (_callback) _callback();
};
VhplabInterface.prototype.changeEmbedAuteur = function() {
	$("#embed .wrap_tags select").empty();
	$("#embed .wrap_tags select").append('<option value="none"> </option>');
	$("#embed .wrap_meta_tags select").empty();
	$("#embed .wrap_meta_tags select").append('<option value="none"> </option>');
	var auteur = $("#embed .wrap_auteur select").val();
	if ((auteur != 0)&&(auteur != 'none')) {
		var url_tags = cgeomap.url_site + 'spip.php?page=json-tags-exilio&auteur=' + auteur + '&callback=?';
		// get URL via alert(url_tags);
		$.ajax({
			type: 'GET',
			url: url_tags,
			async: false,
			crossDomain: true,
			jsonpCallback: 'jsonTags',
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(_data, _textStatus, _jqXHR) {
				// get _data via alert(_data.toSource());
				$("#embed .wrap_tags").show();
				if ($(_data.tags).length>=1) {
					$.each(_data.tags, function(i, tag) {
						$("#embed .wrap_tags select").append('<option value="'+tag.id_mot+'">'+tag.name+'</option>');
					});
				} else {
					$("#embed .wrap_tags").hide();
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
			}
		});
		var url_meta_tags = cgeomap.url_site + 'spip.php?page=json-meta_tags-exilio&auteur=' + auteur + '&callback=?';
		// get URL via alert(url_meta_tags);
		$.ajax({
			type: 'GET',
			url: url_meta_tags,
			async: false,
			crossDomain: true,
			jsonpCallback: 'jsonMetaTags',
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(_data, _textStatus, _jqXHR) {
				// get _data via alert(_data.toSource());
				$("#embed .wrap_meta_tags").show();
				if ($(_data.meta_tags).length>=1) {
					$.each(_data.meta_tags, function(i, meta_tag) {
						$("#embed .wrap_meta_tags select").append('<option value="'+meta_tag.id_mot+'">'+meta_tag.name+'</option>');
					});
				} else {
					$("#embed .wrap_meta_tags").hide();
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
			}
		});
	} else {
		var url_tags = cgeomap.url_site + 'spip.php?page=json-tags-exilio&callback=?';
		// get URL via alert(url_tags);
		$.ajax({
			type: 'GET',
			url: url_tags,
			async: false,
			crossDomain: true,
			jsonpCallback: 'jsonTags',
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(_data, _textStatus, _jqXHR) {
				// get _data via alert(_data.toSource());
				$("#embed .wrap_tags").show();
				if ($(_data.tags).length>=1) {
					$.each(_data.tags, function(i, tag) {
						$("#embed .wrap_tags select").append('<option value="'+tag.id_mot+'">'+tag.name+'</option>');
					});
				} else {
					$("#embed .wrap_tags").hide();
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
			}
		});
		var url_meta_tags = cgeomap.url_site + 'spip.php?page=json-meta_tags-exilio&callback=?';
		// get URL via alert(url_meta_tags);
		$.ajax({
			type: 'GET',
			url: url_meta_tags,
			async: false,
			crossDomain: true,
			jsonpCallback: 'jsonMetaTags',
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(_data, _textStatus, _jqXHR) {
				// get _data via alert(_data.toSource());
				$("#embed .wrap_meta_tags").show();
				if ($(_data.meta_tags).length>=1) {
					$.each(_data.meta_tags, function(i, meta_tag) {
						$("#embed .wrap_meta_tags select").append('<option value="'+meta_tag.id_mot+'">'+meta_tag.name+'</option>');
					});
				} else {
					$("#embed .wrap_meta_tags").hide();
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
			}
		});
	}
};
VhplabInterface.prototype.initialize = function(_opts) {
	
	// Store url
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	if (this.url_site.slice(-1)!="/") this.url_site += "/";
	if (typeof _opts.url_article != "undefined") this.url_article = _opts.url_article;
	if (typeof _opts.url_user != "undefined") this.url_user = _opts.url_user;
	if (typeof _opts.url_embed != "undefined") this.url_embed = _opts.url_embed;
	
	$("#navigation").data('visible', true);
	$("#navigation .toggle_button").click(function(){
		cgeomap.toggleMapNavigation();
	});
	
	$('#navigation .user .facebook').click(function(){
		cgeomap.shareOverrideOGMeta();
		return false;
	});	
	// initialize formulary
	this.form.initialize(_opts);
	
	// Map options
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	// load custom map prototypes
	// console.log('load custom map prototypes');
	if (typeof _opts.custom_map_prototypes != "undefined") {
		$.getScript(_opts.custom_map_prototypes, function(data) {
		
			// Load article template
			cgeomap.loadArticleTemplate(function(){
				// Load user
 				cgeomap.loadUser(function(){
 					// Initialize map	
					cgeomap.ready(_opts.map_opts);
				});
			});
		
		});
	// Use standard prototypes
	} else {
		cgeomap.ready(_opts.map_opts);
	}
	
	// Initialize soundManager
	soundManager.setup({
		// disable or enable debug output
		debugMode: true,
  		// use HTML5 audio for MP3/MP4, if available
  		preferFlash: false,
  		useFlashBlock: true,
  		// path to directory containing SM2 SWF
  		url: 'swf/',
  		// optional: enable MPEG-4/AAC support (requires flash 9)
  		flashVersion: 9
  	});
  	
	this.initContent();
};
VhplabInterface.prototype.loadArticleTemplate = function(_callback) {
	// console.log('/* Desktop prototypes */ cgeomap.loadArticleTemplate()');
	// Get URL via log
	// console.log('Article Template URL: '+ this.url_article);
 	$("#content .wrapper").load(this.url_article, function() {
 		/* Article */
 		$('#article').hide();
 		$('#article .header .editer').hide();
 		$('#article .header .editer').click(function() { 
 			$(this).fadeOut('fast', function(){
 				cgeomap.toggleUtilities($(this).attr('name'), true);
 			});
 		});
		$("#article .scroll").mCustomScrollbar({
			scrollInertia: 150,
			theme: "dark-thick"
		});
		/* Formulaire */
		$('#formulaire').hide();
		/* Contributions */
		$('#contributions').hide();
		$("#contributions").data('loaded', false);
		/* Embed */
		$('#embed').hide();
		$("#embed").data('loaded', false);
		/* Callback */
		if(_callback) _callback();
	});
};
VhplabInterface.prototype.loadContributions = function() {
	// console.log('loadContributions();'); 
	$("#content").data('selected','contributions');
	$("#user .utilities .contributions").addClass('on');
	var url = $("#user .utilities .contributions").data("href");
	var loaded = $("#contributions").data('loaded');
	var recalcul = $("#formulaire").data('recalcul');
	
	// deleted marker
	if ((recalcul)&&(recalcul=='none')) {
		// console.log('Case A deleted marker (THIS IS HAPENING)');
		// remove marker from marker list
		var deleted = $("#formulaire").data('deleted');
		$(cgeomap.map.markers).removeData('marker_'+ deleted);
		// If contributions are not in marker list
		if ((this.map.auteur != 'none')&&($("#user .data").data("auteur") != this.map.auteur)) {
			// console.log('Contributions are not in marker list (auteur!=editor)');
			// we only need to erase marker from contributions (editorLayer)
			this.map.removeFromLayer(deleted, 'editor');
		// If contributions are in marker list
		} else {
			// console.log('Contributions are in marker list');
			// we need to erase marker from both contributions (editorLayer) & map (mapLayer)
			this.map.removeFromLayer(deleted, 'editor');
			this.map.removeFromLayer(deleted, 'map');
		}
		// reload conributions
		$("#contributions ol").empty();
		var url_conributions = $("#user .utilities .contributions").data("href") + '&var_mode=recalcul';
		// get URL via LOG
		// console.log('Load: '+ url_conributions);	
		$("#contributions ol").load(url_conributions, function() {
			cgeomap.bindContributionsActions();
			$('#loading_content').fadeOut();
			$("#formulaire").data('recalcul', false);
			cgeomap.map.activeLayer = 'map';
			cgeomap.map.showLayer('editor', true);
			$("#contributions").slideDown("slow",function(){
				$("#contributions").mCustomScrollbar({
					scrollInertia: 150,
					theme: "dark-thick"
				});
			});
			cgeomap.map.forceCache();
		});
	} else if (loaded) {
		// console.log('Case B already loaded');
		this.map.closeOpenMarker();
		cgeomap.map.showLayer('editor', true);
		// Show contributions
		$("#contributions").slideDown("slow",function(){
			$("#contributions").mCustomScrollbar({
				scrollInertia: 150,
				theme: "dark-thick"
			});
		});
	} else {
		// console.log('Case C first time');
		// Close marker, empty contributions & show loading
		$('#loading_content').fadeIn();
		this.map.closeOpenMarker();
		$("#contributions ol").empty();
		// If contributions are not in marker list
		if ((this.map.auteur != 'none')&&($("#user .data").data("auteur") != this.map.auteur)) {
			// console.log('Contributions are not in marker list (auteur!=editor)');
			var markersURL = this.map.markersURL + '&id_auteur='+ $("#user .data").data("auteur") + '&offset='+ this.map.offset +'&limit='+ this.map.limit +'&callback=?';
			// get URL via LOG
			// console.log('markersURL'+ markersURL);
			this.map.loadEditorMarkers(markersURL, function(){
				// get URL via LOG
				// console.log('Load: '+ url);	
				$("#contributions ol").load(url, function() {
					cgeomap.bindContributionsActions(function(_a){
						// Add markers to editor Layer if needed
						// console.log('editorLayer has '+ cgeomap.map.editorLayer.layer.getLayers().length +' Markers');
						cgeomap.map.showLayer('editor', true);
						$('#loading_content').fadeOut();
						$("#contributions").slideDown("slow",function(){
							$("#contributions").mCustomScrollbar({
								scrollInertia: 150,
								theme: "dark-thick"
							});
						});
					});
				});
			});
		// contributions are in marker list
		} else {
			// console.log('Contributions are in marker list');
			// get URL via LOG
			// console.log('Load: '+ url);	
			$("#contributions ol").load(url, function() {
				cgeomap.bindContributionsActions(function(){
					// Add markers to editor Layer if needed
					// console.log('editorLayer has '+ cgeomap.map.editorLayer.layer.getLayers().length +' Markers');
					if (cgeomap.map.editorLayer.layer.getLayers().length==0) cgeomap.map.addMarkersToEditorLayer();
					cgeomap.map.showLayer('editor', true);
					// Show contributions
					$('#loading_content').fadeOut();
					$("#contributions").slideDown("slow",function(){
						$("#contributions").mCustomScrollbar({
							scrollInertia: 150,
							theme: "dark-thick"
						});
					});
				});
			});
		}
	}
};
VhplabInterface.prototype.loadContribuer = function() {
	cgeomap.form.load();
	$("#content").data('selected','contribuer');
	$("#user .utilities .contribuer").addClass('on');
};
VhplabInterface.prototype.loadEditer = function() {
	cgeomap.form.load($('#article .header .editer').data('href'));
	$("#content").data('selected','editer');
};
VhplabInterface.prototype.loadEmbed = function() {
	$("#content").data('selected','embed');
	$("#user .utilities .embed").addClass('on');
	var loaded = $("#embed").data('loaded');
	if (loaded) {
		//alert('embed loaded');
		if ($("#navigation").data('visible')) cgeomap.toggleNavigation();
		this.map.closeOpenMarker();
		this.hideAllMarkers();
		$("#categoryControl").fadeOut();
		this.slideUtilities('embed', 'show');
	} else {
		// alert('load embed');
		$('#loading_content').fadeIn();
		$("#embed").empty();
		$("#embed").load(this.url_embed, function() {
			cgeomap.bindEmbedActions(function(){
				cgeomap.map.closeOpenMarker();
				cgeomap.map.hideMarkers();
				$("#categoryControl").fadeOut();
				$("#embed").slideDown("slow");
				// if ($("#navigation").data('visible')) cgeomap.toggleNavigation();
				$('#loading_content').fadeOut();
			});
		});
	}
	
	
};
VhplabInterface.prototype.loadMap = function(_force, _callback) {
	// console.log('cgeomap.loadMap();');
	var self = this;
	var recalcul =  $("#formulaire").data('recalcul');
	
	/* A marker was edited or added  */
	if (recalcul) {
		// console.log('A marker was edited or added');
		// Update both contributions (Mis Aportaciones - editorLayer) & map (Mapa - mapLayer)
		/* we are loading the map with an open marker but setting the layer to editor */
		this.map.reloadMarkers(recalcul, function(){
			$("#formulaire").data('recalcul', false);
			$("#contributions ol").empty();
			var url_conributions = $("#user .utilities .contributions").data("href") + '&var_mode=recalcul';
			// get URL via LOG
			// console.log('Load: '+ url_conributions);	
			$("#contributions ol").load(url_conributions, function() {
				cgeomap.bindContributionsActions();
			});
			$('#loading_content').fadeOut();
		
			// If editor layer was previously loaded rebuild it
			if ($("#contributions").data('loaded')) {
				cgeomap.map.rebuildLayer('editor');
				cgeomap.map.showLayer('editor', false);
				var marker = $(cgeomap.map.markers).data('marker_'+recalcul);
				marker.click(_callback);
				
			// If editor layer was not loaded it is not posible to rebuild it
			} else {
			
				// If contributions are not in marker list load from json
				if ((cgeomap.map.auteur != 'none')&&($("#user .data").data("auteur") != cgeomap.map.auteur)) {
					// console.log('Contributions are not in marker list (auteur!=editor)');
					var markersURL = cgeomap.map.markersURL + '&id_auteur='+ $("#user .data").data("auteur") + '&offset='+ cgeomap.map.offset +'&limit='+ cgeomap.map.limit +'&var_mode=recalcul&callback=?';
					// get URL via LOG
					// console.log('markersURL'+ markersURL);
					cgeomap.map.loadEditorMarkers(markersURL, function(){
						cgeomap.map.showLayer('editor', false);
						$("#user .contributions").addClass('on');
						var marker = $(cgeomap.map.markers).data('marker_'+recalcul);
						marker.click(_callback);
					});
					
				// If contributions are in marker list
				} else {
					// console.log('Contributions are in marker list');
					cgeomap.map.addMarkersToEditorLayer();
					cgeomap.map.showLayer('editor', false);
					$("#user .contributions").addClass('on');
					var marker = $(cgeomap.map.markers).data('marker_'+recalcul);
					marker.click(_callback);
				}
			}
			
		});
		
	/* No marker was edited or added  */
	} else {
		// console.log('No need to recalul markers');
		
		var selected = $("#content").data('selected');
		// console.log('Active Layer ' + this.map.activeLayer +', previows utility was: '+ selected);
		
		$("#article").slideDown("slow");
		if (((this.map.activeLayer!='none')&&(this.map.activeLayer!='editor'))||(_force)) this.map.showLayer('map', true);
		
		if (_callback) _callback();
	}
	if (this.map.activeLayer=='none') {
		$("#user .carte").addClass('on');
	} else if (this.map.activeLayer=='editor') {
		$("#user .contributions").addClass('on');
	} 
	$("#content").data('selected','carte');
};
VhplabInterface.prototype.loadUtilities = function(_target, _force, _callback) {
	switch (_target) {
		case 'carte':
			cgeomap.loadMap(_force, _callback);
			break;
		case 'contributions':
			cgeomap.loadContributions();
			if (_callback) _callback();
			break;
			case 'contribuer':
			cgeomap.loadContribuer();
			if (_callback) _callback();
			break;
		case 'editer':
			cgeomap.loadEditer();
			break;
		case 'embed':
			cgeomap.loadEmbed();
			if (_callback) _callback();
			break;
	}
};
VhplabInterface.prototype.loadUser = function(_callback) {
	// console.log('/* Desktop prototypes */ cgeomap.loadUser()');
	// get URL via log
	// console.log('url_user: '+ this.url_user);
	$.get(this.url_user, function(_html) {
		$("body").prepend('<div id="sending_login"></div>');
		$("#sending_login").html(_html);
		/* Session & Admin */
		if ($("#sending_login .data").data("session") == "ok") {
			cgeomap.session = true;
			// console.log('cgeomap.session = true;');
			var content = $( "#sending_login" ).html();
			$( "#sending_login" ).remove();
			$("#user").html(content);
			if ($("#user .data").data("admin") == "ok") cgeomap.admin = true;
			/* Login */
			$('#user .login').hide();
			/* Utilities  */
			$("#user .utilities a").click(function() { 
				cgeomap.toggleUtilities($(this).attr('name'), true);
			});
			if(_callback) _callback();
		} else {
			$('#loading').fadeOut(500);
		}
	});
};
VhplabInterface.prototype.ready = function(_opts) {
 	this.map = new VhplabMap();
	this.map.initialize({
		url: this.url_site,
		markers: (typeof _opts.markers != "undefined") ? _opts.markers : '',
		auteur: (typeof _opts.auteur != "undefined") ? _opts.auteur : 'none',
		limit: (typeof _opts.limit != "undefined") ? _opts.limit : 300,
		id: (typeof _opts.id != "undefined") ? _opts.id : 'cgeomap',
		zoom: (typeof _opts.zoom != "undefined") ? _opts.zoom : 10,
		latitude: (typeof _opts.latitude != "undefined") ? _opts.latitude : 0.0,
		longitude: (typeof _opts.longitude != "undefined") ? _opts.longitude : 0.0,
		open: (typeof _opts.open != "undefined") ? _opts.open : false,
		latitudeTag: (typeof _opts.latitudeTag != "undefined") ? _opts.latitudeTag : '.cartography .latitude',
		longitudeTag: (typeof _opts.longitudeTag != "undefined") ? _opts.longitudeTag : '.cartography .longitude',
		zoomTag: (typeof _opts.zoomTag != "undefined") ? _opts.zoomTag : '.cartography .zoom'
	});
	this.bindToggleContent();
};
VhplabInterface.prototype.removeRecherche = function(_me, _container) {
	$('.value_box', '#embed .wrap_recherche').empty();
	$(".value_box", '#embed .wrap_recherche').hide();
	$(".field_box", '#embed .wrap_recherche').show("slow");
	$(".field_box input", '#embed .wrap_recherche').focus();
	cgeomap.urlEmbed();
};
VhplabInterface.prototype.submitDelete = function(id_article) {
	if (confirm(_T.message_eliminar)) {
		$("body").prepend('<div id="sending_data"><div></div></div>');
		$.getJSON(this.url_site+'spip.php?page=json-delete', function(data){
			var formData = {
				page:'json-delete',
				formulaire_action:'delete',
				formulaire_action_args: data[0].formulaire_action_args,
				article: id_article,
			};
			// alert(formData.toSource());
			$.getJSON(cgeomap.url_site+'spip.php?page=json-delete', formData, function(response){
				// alert(response.toSource());
				// $('body').html(data);
				if (typeof(response[0].message_ok)!="undefined") {
					var text = response[0].message_ok.split(":");
					$("#formulaire").data('recalcul', 'none');
					$("#formulaire").data('deleted', id_article);
					$("#content").data('selected', 'none');
					$("#contributions").data('loadded', 'false');
					
					var deleted = $(cgeomap.map.markers).data('marker_'+text[1]);
					//cgeomap.map.map.removeLayer(deleted.marker);
					$(cgeomap.map.markers).removeData('marker_'+text[1]);
					
					// console.log('submitDelete indexOf');
					
					cgeomap.map.removeFromLayer(parseInt(text[1]), 'editor');
					//var index = cgeomap.map.mapMarkerList.indexOf(parseInt(text[1]));
					//if (index > -1) cgeomap.map.mapMarkerList.splice(index, 1);
					
					$('#contributions').slideUp("fast", function(){
						$("#sending_data").fadeOut("slow", function(){
							$("#sending_data").remove();
							cgeomap.loadUtilities('contributions', true);
						});
					});
				} else {
					alert(response[0].message_erreur);
					window.location.href = cgeomap.url_site;
				}
			});
		});
	}
};
VhplabInterface.prototype.toggleGeoEmbed = function(_t) {
	if (!_t) {
		$(".wrap_cartography").hide();
		cgeomap.map.map.off('click', cgeomap.map.embedClickListener);
		cgeomap.map.map.off('zoomend', cgeomap.map.embedZoomListener);
		cgeomap.map.map.off('moveend', cgeomap.map.embedMoveendListener);
	} else {
		$(".wrap_cartography").show();
		cgeomap.map.map.on('click', cgeomap.map.embedClickListener);
		cgeomap.map.map.on('zoomend', cgeomap.map.embedZoomListener);
		cgeomap.map.map.on('moveend', cgeomap.map.embedMoveendListener);
	}
};
VhplabInterface.prototype.toggleLogin = function(_me) {
 	var selected = $("#content").data('selected');
 	if (!this.session) {
		var tgl =  $(_me).data("tgl");
		if (tgl=="on") {
			$('#user .login').slideUp();
			$( "#article" ).animate({
				top: 19,
			});
			$(_me).data("tgl","off");
		} else {
			$('#user .login').slideDown();
			$( "#article" ).animate({
				top: 109,
			});
			$(_me).data("tgl","on");
		}
	} else {
		var tgl =  $(_me).data("tgl");
		if (tgl=="on") {
			$('#user .login').slideUp();
			switch (selected) {
				case 'carte':
					$( "#article" ).animate({
						top: 39,
					});
					$( "#formulaire" ).css('top', 39);
					$( "#contributions" ).css('top', 39);
					break;
				case 'contributions':
					$( "#contributions" ).animate({
						top: 39,
					});
					$( "#formulaire" ).css('top', 39);
					$( "#article" ).css('top', 39);
					break;
				case 'contribuer':
					$( "#formulaire" ).animate({
						top: 39,
					});
					$( "#article" ).css('top', 39);
					$( "#contributions" ).css('top', 39);
					break;
				case 'editer':
					$( "#formulaire" ).animate({
						top: 39,
					});
					$( "#article" ).css('top', 39);
					$( "#contributions" ).css('top', 39);
					break;
				case 'embed':
					$( "#formulaire" ).css('top', 39);
					$( "#article" ).css('top', 39);
					$( "#contributions" ).css('top', 39);
					break;
			}
			$(_me).data("tgl","off");
		} else {
			$('#user .login').slideDown();
			switch (selected) {
				case 'carte':
					$( "#article" ).animate({
						top: 77,
					});
					$( "#formulaire" ).css('top', 77);
					$( "#contributions" ).css('top', 77);
					break;
				case 'contributions':
					$( "#contributions" ).animate({
						top: 77,
					});
					$( "#formulaire" ).css('top', 77);
					$( "#article" ).css('top', 77);
					break;
				case 'contribuer':
					$( "#formulaire" ).animate({
						top: 77,
					});
					$( "#article" ).css('top', 77);
					$( "#contributions" ).css('top', 77);
					break;
				case 'editer':
					$( "#formulaire" ).animate({
						top: 77,
					});
					$( "#article" ).css('top', 77);
					$( "#contributions" ).css('top', 77);
					break;
				case 'embed':
					$( "#formulaire" ).css('top', 77);
					$( "#article" ).css('top', 77);
					$( "#contributions" ).css('top', 77);
					break;
			}
			$(_me).data("tgl","on");
		}
	}
};
VhplabInterface.prototype.toggleMapNavigation = function() {
	var visible = $("#navigation").data('visible');
	if (visible) {
		$("#navigation .articles").slideUp();
		$("#navigation hgroup").fadeOut();
		$("#navigation").data('visible', false);
		$("#navigation .toggle_button").addClass('closed');
		$("#navigation").animate({ top: "-=145"}, "swing", function() {
		});
	} else {
		$("#navigation .articles").slideDown();
		$("#navigation").data('visible', true);
		$("#navigation hgroup").fadeIn();
		$("#navigation .toggle_button").removeClass('closed');
		$("#navigation").animate({ top: "+=145"}, "swing", function() {
		});
	}
};
VhplabInterface.prototype.toggleUtilities = function(_target, _force, _callback) {
	// console.log('toggleUtilities();');
	var selected = $("#content").data('selected');
	if (_target!=selected) {
		var hide = "";
		switch (selected) {
			case 'carte':
				hide = "#article";
				break;
			case 'contributions':
				hide = "#contributions";
				break;
			case 'contribuer':
				/*
				var recalcul =  $("#formulaire").data('recalcul');
				// if selected is contribuer & recalcul is false the editor did not save new entry
				// console.log('selected = contribuer');
				// console.log('recalcul = '+ recalcul);
				*/
				if (this.form.geo) this.form.toggleGeo();
				cgeomap.map.typeControl.changeTypeTo('street');
				$('.leaflet-control-type').hide();
				hide = "#formulaire";
				break;
			case 'editer':
				/*
				var recalcul =  $("#formulaire").data('recalcul');
				// if selected is editer & recalcul is false the editor did not save edited entry
				// console.log('selected = editer');
				// console.log('recalcul = '+ recalcul);
				*/
				if (this.form.geo) this.form.toggleGeo();
				cgeomap.map.typeControl.changeTypeTo('street');
				$('.leaflet-control-type').hide();
				hide = "#formulaire";
				break;
			case 'embed':
				hide = "#embed";
				this.map.emptyLayer.reset();
				break;
		}
		if ($(hide).is(":visible")) {
			// hide editer button first when visible
			if (($('#article .header .editer').is(":visible"))&&(hide=="#article")) {
				$('#article .header .editer').fadeOut("fast", function(){
					// hide selected content and show new content
					$(hide).slideUp("fast", function(){
						$("#user .utilities a").removeClass('on');
						cgeomap.loadUtilities(_target, _force, _callback);
					});
				});
			} else {
				// hide selected content and show new content
				$(hide).slideUp("fast", function(){
					$("#user .utilities a").removeClass('on');
					cgeomap.loadUtilities(_target, _force, _callback);
				});
			}
		} else {
			// show new content
			cgeomap.loadUtilities(_target, _force, _callback);
		}
	} else if ((_target=='carte')&&(this.map.activeLayer=='editor')) {
		$("#user .utilities a").removeClass('on');
		$("#user .carte").addClass('on');
		// console.log('Volver a mostrar todos');
		this.map.showLayer('map', true);
		if (_callback) _callback();
	}
	
};
VhplabInterface.prototype.updateEmbedMap = function(_url) {
	// console.log('updateEmbedMap();');
	$("body").prepend('<div id="sending_data"><div></div></div>');
	this.map.closeOpenMarker();
	// get URL via alert(_url);
	// console.log('_url ='+ _url);
	$.ajax({
		type: 'GET',
		url: _url,
		async: false,
		crossDomain: true,
		jsonpCallback: 'jsonArticles',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(_data, _textStatus, _jqXHR) {
			// get _data via alert(_data.toSource());
			if ($(_data.markers).length>=1) {
				cgeomap.map.showMarkerJson(_data.link, _data.markers);
				$('.error', '#embed .wrap_iframe').empty();
				var msg = _T.message_embed_1+' '+ $(_data.markers).length +' '+_T.message_embed_2;
				if ($(_data.markers).length>=2) msg += 's';
				$('.msg', '#embed .wrap_iframe').html(msg);
				$("#sending_data").fadeOut("slow", function(){
					$("#sending_data").remove();
				});
				
			} else {
				$('.error', '#embed .wrap_iframe').html(_T.error_no_markers);
				$('.msg', '#embed .wrap_iframe').empty();
				$("#sending_data").fadeOut("slow", function(){
					$("#sending_data").remove();
				});
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
		}
	});
};
VhplabInterface.prototype.updateEmbedRechercheField = function(_me) {
	var value = $(_me).val();
	if ((typeof(value)!='undefined')&&(value!="")) {
		if (value.length>3) {
    		$('.value_box', '#embed .wrap_recherche').empty();
    		$('.value_box', '#embed .wrap_recherche').append('<a class="value new">'+value.trim()+'</a>');
			$('.value_box a', '#embed .wrap_recherche').dblclick(function(){
				cgeomap.removeRecherche(this);
			});
			$(".field_box", '#embed .wrap_recherche').hide();
			$(".value_box", '#embed .wrap_recherche').show("slow");
			$(_me).val('');
			cgeomap.urlEmbed(true);
		} else {
			$(".error", '#embed .wrap_recherche').text(_T.error_tag_recherche);
			$(".error", '#embed .wrap_recherche').show();
			$(".error", '#embed .wrap_recherche').delay(1600).fadeOut("slow", function() {
				$(this).text("");
			});
		}
	}
};
VhplabInterface.prototype.urlEmbed = function(_reload) {
	var auteur = $("#embed .wrap_auteur select").val();
	/*
	var tag = $("#embed .wrap_tags select").val();
	var meta_tag = $("#embed .wrap_meta_tags select").val();
	*/
	var recherche = $("#embed .wrap_recherche .value_box a").html();
	var latitude = $("#embed .wrap_cartography .latitude").val();
	var longitude = $("#embed .wrap_cartography .longitude").val();
	var zoom = $("#embed .wrap_cartography .zoom").val();
	var url = cgeomap.url_site + 'spip.php?page=map';
	var url_markers = cgeomap.url_site + 'spip.php?page=json-vhplab-geo-recherche-articles';
	if ((auteur != 0)&&(auteur != 'none')) {
		url += '&auteur=' + auteur;
		url_markers += '&auteur=' + auteur;
	}
	/*
	if ((tag != 0)&&(tag != 'none')) {
		url += '&tag=' + tag;
		url_markers += '&tag=' + tag;
	}
	if ((meta_tag != 0)&&(meta_tag != 'none')) {
		url += '&meta_tag=' + meta_tag;
		url_markers += '&meta_tag=' + meta_tag;
	}
	*/
	if ((typeof recherche != "undefined")&&(recherche != '')) {
		url += '&recherche=' + recherche;
		url_markers += '&recherche=' + recherche;
	}
	if ((typeof latitude!= "undefined")&&(latitude != '')&&(typeof longitude != "undefined")&&(longitude != '')) url += '&center=' + latitude +','+ longitude;
	if ((typeof zoom != "undefined")&&(zoom != '')) url += '&zoom=' + zoom;
	url_markers += '&callback=?';
	$("#embed .wrap_iframe .url").attr('href', url);
	$("#embed .wrap_iframe code").text('<iframe width="940px" height="600px" src="'+ url +'"></iframe>');
	// get URL via alert(url_markers);
	if (_reload) cgeomap.updateEmbedMap(url_markers);
	var visible = $("#embed .wrap_iframe").data('visible');
	if(!visible) $("#embed .wrap_iframe").slideDown();
};

//***********
// Vhplab Contribuer Formulary
//***********
VhplabContribuerFrom.prototype.activateInputField = function(_me) {
	var container = $(_me).parent().parent();
	$(container).data('ok', false);
	if ($(".field_box", container).attr("class")){
		$(".value_box", container).hide();
		$(".field_box", container).show("slow");
		$(".field_box input", container).focus();
	}
};
VhplabContribuerFrom.prototype.addLinkToModule = function(_me) {
	var container = $(_me).parent();
	$(container).append('\n' + this.createLink('link', 'Dirección', 'Texto', '\t\t\t\t\t\t\t\t\t\t'));
	this.bindLinkModuleActions($(" li:last", container));
    $(_me).hide();
};
VhplabContribuerFrom.prototype.bindActions = function() {
	/* submit */
	$("#formulaire form").submit(function() {
		if (cgeomap.form.status == 'geocoder') {
			var address = $("#formulaire .address").val();
			cgeomap.map.codeAddress(address);
			return false;
		} else if (cgeomap.form.status == 'text') {
			return false;
		} else {
			return cgeomap.form.submit();
		}
	});
	$(".submit .btn").css('opacity','0.4');
	
	/* title & subtitle */
    $("#formulaire .wrap_title .edit").dblclick(function(){ cgeomap.form.activateInputField(this) });
    $("#formulaire .wrap_subtitle .edit").dblclick(function(){ cgeomap.form.activateInputField(this) });
	$("#formulaire .wrap_title input").focus( function(){ cgeomap.form.status = 'text'; });
	$("#formulaire .wrap_subtitle input").focus( function(){ cgeomap.form.status = 'text'; });
	$("#formulaire .wrap_title input").blur(function(){
		$("#formulaire .wrap_subtitle .edit").trigger("dblclick");
		cgeomap.form.updateInputField(this);
		cgeomap.form.status = 'editer';
    });
    $("#formulaire .wrap_subtitle input").blur(function(){
		cgeomap.form.updateInputField(this);
		cgeomap.form.status = 'editer';
    });
    $("#formulaire .wrap_title input").attr('maxlength', 25);
    $("#formulaire .wrap_subtitle input").attr('maxlength', 45);
    
    /* visibility */
    $("#formulaire .visibility .btn").click(function(){ cgeomap.form.toggleVisible(this); });
    
    /* category */
    $("#formulaire .category li").click(function(){ cgeomap.form.toggleCategory(this); });
    
    /* modules */
    $(".module_button").click(function(){ cgeomap.form.createNewModule(this); });
    $( "#formulaire .audiovisuel ul").sortable({
    	axis: "y",
    	handle: "span",
    	// connectWith: ".trash",
    	change: function(event, ui) { cgeomap.form.sortableChange(ui.item, "#formulaire .audiovisuel"); },
    	start: function(event, ui) { cgeomap.form.sortableStart(ui.item, "#formulaire .audiovisuel"); },
    	stop: function(event, ui) { cgeomap.form.sortableStop(ui.item, "#formulaire .audiovisuel"); }
    });
    
     /* scroll */
    $("#formulaire .scroll").mCustomScrollbar({
		scrollInertia: 150,
		theme: "dark-thick",
		callbacks:{
    		onUpdate:function(){
      			// console.log("Scrollbars updated");
      			cgeomap.form.scrollContent();
    		}
    	}
	});

    /* cartography */
	cgeomap.form.toggleGeo();
	$("#formulaire .address").focus( function(){
		cgeomap.form.status = 'geocoder';
	});
	$("#formulaire .address").blur( function(){
		cgeomap.form.status = 'editer';
	});
	
	/* icon */
	//this.setIcon(0);
};
VhplabContribuerFrom.prototype.bindEachModuleActions = function(_block) {
	var audio_modules = 0;
	var media_modules = 0;
	var text_modules = 0;
	var link_modules = 0;
	var video_modules = 0;
	var container = ".content ."+_block;
	$(".module", "#formulaire "+ container).each(function(){
		if ($(this).hasClass("audio")) {
			/* audio data */
			$(this).data('audio', $(".value_box a", this).data('id'));
   			$(this).data('ok', true);
   			/* context */
			var c = container +" .audio_"+ audio_modules;
			/* bind audio actions */
			cgeomap.form.bindMediaModuleActions(c, 'audio', audio_modules);
			soundManager.onready(function() {
				// soundManager.createSound() etc. may now be called
				var player = new VhplabPlayer();
				player.init({
					id: 'new_audio_'+audio_modules,
					url: $('.value_box a', c).attr("href")
				});
				$('.value_box', c).empty();
				player.appendTo($('.value_box', c));
				$('.value_box', c).append('<div class="btn remove_media"><span>'+_T.eliminar+'</span></div>');
			});
			$('.value_box', c).show();
			$('.field_box', c).hide();
			/* bind remove actions */
			$('.remove_media span', c).click(function(){
				$('.value_box', c).empty();
				$('.fileinput', c).show();
				$('.progress-bar', c).css('width',0);
				$('.progress', c).hide();
				$('.field_box', c).show();
				cgeomap.form.deleteMedia(c, 'audio');
				$(c).data('ok', false);
				$(c).data('audio', '');
				$(".submit .btn").css('opacity','0.4');
			});
   			audio_modules++;
		} else if ($(this).hasClass("media")) {
			/* image data */
			$(this).data('media',$(".value_box img", this).data('id'));
   			$(this).data('ok', true);
			/* context */
			var c = container +" .media_"+ media_modules;
			/* bind media actions */
			cgeomap.form.bindMediaModuleActions(c, 'media', audio_modules); ////?????
			/* bind remove actions */
			$('.remove_media span', c).click(function(){
				$('.value_box', c).empty();
				$('.fileinput', c).show();
				$('.progress-bar', c).css('width',0);
				$('.progress', c).hide();
				$('.field_box', c).show();
				cgeomap.form.deleteMedia(c, 'media');
				$(c).data('ok', false);
				$(c).data('media', '');
				$(".submit .btn").css('opacity','0.4');
			});
   			media_modules++;
		} else if ($(this).hasClass("text")) {
			/* bind text actions */
			cgeomap.form.bindTextModuleActions(container +" .text_"+ text_modules);
			$(this).data('ok', true);
   			text_modules++;
		} else if ($(this).hasClass("link")) {
			/* bind link actions */
			cgeomap.form.bindLinkModuleActions(container +" .link_"+ link_modules +" ul li");
			$(this).data('ok', true);
   			link_modules++;
		} else if ($(this).hasClass("video")) {
			
			/* video data */
			$(this).data('video',$(".value_box img", this).data('id'));
   			$(this).data('ok', true);
   			
			/* context */
			var c = container +" .video_"+ video_modules;
			var channel = $('.channel a', c).data('channel');
			var id = $('.channel a', c).data('id');
			
    		$(".channel .value", c).attr("class","value new");
			$(".channel .value", c).show("slow");
    		$(".channel input", c).hide();
    		
    		$(c).data('link', true);
			var frame = $(c).data('frame');
			if (frame) $(c).data('ok', true);
			$(c).data('id',id);
				
			/* youtube */
			if (channel=='youtube'){
				$(".channel .value", c).text('https://www.youtube.com/watch?v='+ id);
    			$(".channel .value", c).attr('href', 'https://www.youtube.com/watch?v='+ id);
    			$(".channel input", c).val('https://www.youtube.com/watch?v='+ id);
				// console.log('it is a youtube link '+ id);
       			$(".btn", c).removeClass("selected");
				$("button[name='select-youtube']", c).addClass("selected");
				$(c).data('channel','youtube');
			/* vimeo */
			} else {
				$(".channel .value", c).text('https://vimeo.com/'+ id);
    			$(".channel .value", c).attr('href', 'https://vimeo.com/'+ id);
    			$(".channel input", c).val('https://vimeo.com/'+ id);
				// console.log('it is a vimeo link '+ id);
       			$(".btn", c).removeClass("selected");
				$("button[name='select-vimeo']", c).addClass("selected");
				$(c).data('channel','vimeo');
    		}
		
			/* bind media actions */
			cgeomap.form.bindVideoModuleActions(c, 'video', video_modules);
			/* bind remove actions */
			$('.remove_video span', c).click(function(){
				$('.value_box', c).empty();
				$('.fileinput', c).show();
				$('.progress-bar', c).css('width',0);
				$('.progress', c).hide();
				$('.field_box', c).show();
				cgeomap.form.deleteVideo(c, 'media');
				$(c).data('ok', false);
				$(c).data('video', '');
				$(".submit .btn").css('opacity','0.4');
			});
   			video_modules++;
   			
		}
	});
	$("#add_link_module").data('n_'+_block, link_modules);
	$("#add_text_module").data('n_'+_block, text_modules);
	$("#add_media_module").data('n_'+_block, media_modules);
	$("#add_audio_module").data('n_'+_block, audio_modules);
	$("#add_video_module").data('n_'+_block, video_modules);
};
VhplabContribuerFrom.prototype.bindLinkModuleActions = function(_context) {
	$(_context).each(function(){
		if ($(this).hasClass("add")) {
			$(this).click( function(){
    			cgeomap.form.addLinkToModule(this);
    			$(this).parent().parent().parent().data('ok',false);
				$(".submit .btn").css('opacity','0.4');
    		});
		} else {
			var field = $('.field_box input:first-child', this);
			cgeomap.form.resizeFields(field, 0.5, 0.5);
			$('.field_box input', this).blur(function(){
				cgeomap.form.form_status = 'editer';
				cgeomap.form.updateLinkField(this);
    		});
    		$('.field_box input', this).focus( function(){
    			cgeomap.form.form_status = 'text';
    			cgeomap.form.resizeFields(this, 0.7, 0.3);
    		});
    		$(".value_box .value", this).dblclick(function(){
    			var container = $(this).parent().parent();
	 			if ($(".field_box", container).attr("class")){
	 				$(".value_box", container).hide();
	 				$(".field_box", container).show("slow");
	 			}
    		});
    		$('.value_box .remove', this).click(function(){
    			var c = $(this).parent().parent().parent().parent().parent();
    			var list = $(this).parent().parent().parent();
    			if($('li', list).length<=2) {
    				$(c).data('ok',false);
					$(".submit .btn").css('opacity','0.4');
    			}
    			$(this).parent().parent().remove();
        	});
        }
	});
};
VhplabContribuerFrom.prototype.bindMediaModuleActions = function(_context, _class, _n) {
	// console.log('bindMediaModuleActions(); '+ _context);
	$(_context +" .fileupload").fileupload({
        url: cgeomap.form.url_upload,
        dataType: 'json',
        done: function (e, data) {
        	// alert($(data).toSource());
        	if (!$('.error', _context).data('error')) {
            	$.each(data.result.files, function (index, file) {
            		cgeomap.form.bindUploadedMediaActions(file, _class, _context, _n);
            	});
            }
        },
        submit: function (e, data) {
        	$.each(data.files, function (index, file) {
        		cgeomap.form.checkExtension(file, _class, _context +" .field_box");
    		});
		},
        progressall: function (e, data) {
            cgeomap.form.progressAnimation(data, _context);
        }
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
};
VhplabContribuerFrom.prototype.bindModuleHeaderActions = function(_context) {
	$(_context +" header h5").dblclick( function(){
	 	cgeomap.form.editName(this);
	});
	/*
	$(_context +" header span" ).hover(
		function() {
			$(this).addClass("hover");
		}, function() {
			$(this).removeClass("hover");
		}
	);
	*/
	$(_context +" header input").blur( function(){
		cgeomap.form.updateHeaderField(this, "h5");
    });
	$(_context +" .delete").click(function() { cgeomap.form.deleteModule(this); });
};
VhplabContribuerFrom.prototype.bindTextModuleActions = function(_context) {
	$(_context +" .field_box textarea").data('limit', 500);
	$(_context +" .field_box textarea").data('container', _context);
	$(_context +" .field_box textarea").blur(function(){
		cgeomap.form.updateTextField(this, function(){
			cgeomap.form.check();
		});
    });
    $(_context +" .value_box .value").dblclick(function(){
    	var container = $(this).parent().parent();
		if ($(".field_box", container).attr("class")){
			$(".value_box", container).hide();
			$(".field_box", container).show("slow");
			//$(".erreur_message", container).remove();
		}
	});
};
VhplabContribuerFrom.prototype.bindUploadedFrameActions = function(_data, _class, _container, _n) {
	// alert($(_data).toSource());
	$('fieldset:first .value_box', _container).append('<img src="'+_data.thumbnailUrl+'" width="330px" height="120px"/><div class="btn remove_media"><span>'+_T.eliminar+'</span></div>');
	$('fieldset:first .value_box', _container).show();
	$('fieldset:first .field_box', _container).hide();
	$(_container).data('frame', true);
	var link = $(_container).data('link');
	if (link) {
		$(_container).data('ok', true);
		$(_container).removeClass('wrong-module');
		$(".erreur_message", _container).remove();
	}
	this.check();
	$(_container).data(_class, _data); 	
	var del = _data.deleteUrl;
	$('fieldset:first .remove_media span', _container).click(function(){
		$('fieldset:first .value_box', _container).empty();
		$('fieldset:first .fileinput', _container).show();
		$('fieldset:first .progress-bar', _container).css('width',0);
		$('fieldset:first .progress', _container).hide();
		$('fieldset:first .field_box', _container).show();
		$.ajax({url: del, type: 'DELETE'});
		$(_container).data('ok', false);
		$(_container).addClass('wrong-module');
		$(_container).data(_class, '');
		$(".submit .btn").css('opacity','0.4');
	});
};
VhplabContribuerFrom.prototype.bindUploadedMediaActions = function(_data, _class, _container, _n) {
	// alert($(_data).toSource());
	if ((_class=='media')||(_class=='video')) {
		$('.value_box', _container).append('<img src="'+_data.thumbnailUrl+'" width="330px" /><div class="btn remove_media"><span>'+_T.eliminar+'</span></div>');
	} else if (_class=='audio') {
		soundManager.onready(function() {
			// soundManager.createSound() etc. may now be called
			var player = new VhplabPlayer();
			player.init({
				id: 'new_audio_'+_n,
				url: _data.url
			});
			player.appendTo($('.value_box', _container));
			$('.value_box', _container).append('<div class="btn remove_media"><span>'+_T.eliminar+'</span></div>');
		});
	}
	$('.value_box', _container).show();
	$('.field_box', _container).hide();
	$(_container).data('ok', true);
	$(_container).removeClass('wrong-module');
	this.check();
	$(_container).data(_class, _data); 	
	var del = _data.deleteUrl;
	$('.remove_media span', _container).click(function(){
		$('.value_box', _container).empty();
		$('.fileinput', _container).show();
		$('.progress-bar', _container).css('width',0);
		$('.progress', _container).hide();
		$('.field_box', _container).show();
		$.ajax({url: del, type: 'DELETE'});
		$(_container).data('ok', false);
		$(_container).addClass('wrong-module');
		$(_container).data(_class, '');
		$(".submit .btn").css('opacity','0.4');
	});
};
VhplabContribuerFrom.prototype.bindVideoModuleActions = function(_context, _class, _n) {
	// console.log('bindVideoModuleActions(); '+ _context);
	$(_context +" .fileupload").fileupload({
        url: cgeomap.form.url_upload,
        dataType: 'json',
        done: function (e, data) {
        	// alert($(data).toSource());
        	if (!$('.error', _context).data('error')) {
            	$.each(data.result.files, function (index, file) {
            		cgeomap.form.bindUploadedFrameActions(file, _class, _context, _n);
            	});
            }
        },
        submit: function (e, data) {
        	$.each(data.files, function (index, file) {
        		cgeomap.form.checkExtension(file, _class, _context +" fieldset:first");
    		});
		},
        progressall: function (e, data) {
            cgeomap.form.progressAnimation(data, _context);
        }
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	/*
    $(_context +" .channel .btn").click(function(){
    	cgeomap.form.toggleVideoChannel(this);
    });
    */
	$(_context +" .channel input").blur(function(){
		cgeomap.form.form_status = 'editer';
		cgeomap.form.updateVideoChannelField(this);
	});
	$(_context +" .channel input").focus( function(){
		cgeomap.form.form_status = 'text';
	});
	$(_context +" .channel .value").click(function(){
		return false;
	});	
	$(_context +" .channel .value").dblclick(function(){
		var fieldset = $(this).parent().parent().parent();
		$(".value", fieldset).hide();
		$("input", fieldset).show("slow");
		return false;
	});	
};
VhplabContribuerFrom.prototype.check = function() {
	/* title & subtitle */
	var title = $("#formulaire .wrap_title").data('ok');
	var subtitle = $("#formulaire .wrap_subtitle").data('ok');
	/* visibility */
	var visibility = $("#formulaire .visibility").data('ok');
	/* modules */
	var num_audiovisuel = $("#formulaire .audiovisuel li.module").length;
	var modules_audiovisuel = true;
	$("#formulaire .audiovisuel li.module").each(function(index, module){
		modules_audiovisuel = modules_audiovisuel && $(module).data('ok');
	});
	/* cartography */
	var cartography = $("#formulaire .wrap_cartography").data('ok');
	if ((title)&&(subtitle)&&(visibility)&&(modules_audiovisuel)&&(cartography)) {
		$(".submit .btn").css('opacity','1');
	} else {
		$(".submit .btn").css('opacity','0.4');
		// alert('title:'+ title +' subtitle:'+ subtitle +' options:'+ options +' modules_audiovisuel:'+ modules_audiovisuel +' cartography'+cartography);
	}
};
VhplabContribuerFrom.prototype.checkExtension = function(_data, _class, _container) {
	if ((_class=='media')||(_class=='video')) {
		var name = _data.name.toLowerCase(); 
		
		// console.log('checkExtension media indexOf');
		var ext = name.substring(name.lastIndexOf(".") + 1);
		
		// Checking Extension
		if (ext == "gif" || ext == "png" || ext == "jpg" || ext == "jpeg" ) {
			$('.error', _container).empty();
			$('.error', _container).data('error', false);
			$('.btn', _container).hide();
			$('.progress', _container).show();
			return true;
		} else {
			$('.error', _container).text(_T.message_extension_1);
			$('.error', _container).data('error', true);
			return false;
		}
	} else if (_class=='audio') {
		var name = _data.name.toLowerCase(); 
		
		
		// console.log('checkExtension audio indexOf');
		var ext = name.substring(name.lastIndexOf(".") + 1);
		
		// Checking Extension
		if (ext == "wav" || ext == "ogg" || ext == "mp3" ) {
			$('.error', _container).empty();
			$('.error', _container).data('error', false);
			$('.btn', _container).hide();
			$('.progress', _container).show();
			return true;
		} else {
			$('.error', _container).text(_T.message_extension_2);
			$('.error', _container).data('error', true);
			return false;
		}
	}
};
VhplabContribuerFrom.prototype.cleanUploads = function(_uploads) {
	for(i=0; i<_uploads.length; i++) {
		$.ajax({url: _uploads[i], type: 'DELETE'});
	}
};
VhplabContribuerFrom.prototype.createAudioModule = function(_container, _type, _n) {
	$(_container +" .modules_list").append(this.createModule(_type, _T.module_label_audio, _n, '', _T.help_sound));
	$(_container +" ."+ _type +"_"+ _n +" .content").append(this.createField('\t\t\t\t', '', this.createMediaInput('', _T.seleciona_audio)));
	this.bindMediaModuleActions(_container +" ."+ _type +"_"+ _n, _type, _n);
};
VhplabContribuerFrom.prototype.createField = function(_tab, _value, _input) {
	var html = '';
	html +=	_tab +'<div class="value_box hidden">\n';
	html +=	_tab +'\t'+ _value +'\n'
	html += _tab +'</div>\n';
	html +=	_tab +'<div class="field_box">\n';
	html +=	_tab +'\t'+ _input +'\n'
	html +=	_tab +'</div>\n';
	return html;	
};
VhplabContribuerFrom.prototype.createLink = function(_class, _url, _text, _tab) {
	var fields = '<fieldset>\n';
	fields += _tab +'\t\t\t<input type="text" class="form-control url_'+ _class +'" name="url_'+ _class +'" placeholder="'+ _url +'">\n';
	fields += _tab +'\t\t\t<input type="text" class="form-control text_'+ _class +'" name="text_'+ _class +'" placeholder="'+ _text +'">\n';
	fields += _tab +'\t\t</fieldset>';
	var text = '<a href="'+ _url +'" class="value spip_out" target="_blank">'+ _text +'</a><span class="remove btn">-</span>';
	var html = _tab +'<li>\n'+ this.createField(_tab +'\t', text, fields) +'\n'+_tab+'</li>\n'+_tab;
	return html; 
};
VhplabContribuerFrom.prototype.createVideoLink = function(_class, _url, _text, _tab) {
	var fields = '\n';
	fields += _tab +'\t\t\t<ul class="field_box channel">\n';
	fields += _tab +'\t\t\t\t<li><input type="text" class="form-control url_'+ _class +'" name="url_'+ _class +'" placeholder="'+ _url +'"><label for="url_'+ _class +'"><a href="'+ _url +'" class="value spip_out" target="_blank">'+ _text +'</a></label></li>\n';
	fields += _tab +'\t\t\t\t<li class="select"><button type="button" class="btn select-platform" name="select-youtube" value="youtube"></button><label for="select-youtube">youtube</label></li>\n';
	fields += _tab +'\t\t\t\t<li class="select"><button type="button" class="btn select-platform" name="select-vimeo" value="vimeo"></button><label for="select-vimeo">vimeo</label></li>\n';
	fields += _tab +'\t\t\t</ul>\n';
	var html = _tab +'<fieldset>\n'+ fields + _tab +'\t\t</fieldset>';
	return html; 
};
VhplabContribuerFrom.prototype.createLinkList = function(_tab) {
	var html = '<ul class="spip">\n';
	html +=	_tab +'\t<li class="add btn">+</li>\n';
	html += _tab +'</ul><!-- spip -->\n';
	return html;
};
VhplabContribuerFrom.prototype.createLinkModule = function(_container, _type, _n) {
	$(_container +" .modules_list").append(this.createModule(_type, _T.module_label_links, _n, '\t\t\t\t\t\t\t\t', _T.help_link));
	$(_container +" ."+ _type +"_"+ _n +" .content").append(this.createLinkList('\t\t\t\t\t\t\t\t'));
	$(_container +" ."+ _type +"_"+ _n +" ul .add").hide();
	$(_container +" ."+ _type +"_"+ _n +" ul").append('\t' + this.createLink(_type, _T.module_label_address, _T.module_label_text, '\t\t\t\t\t\t\t'));
	// alert(_container +" ."+ _type +"_"+ _n +" ul li");
	this.bindLinkModuleActions(_container +" ."+ _type +"_"+ _n +" ul li");
};
VhplabContribuerFrom.prototype.createMediaInput = function(_tab, _text) {
	var html = '\n';
	html +=	_tab +'<span class="btn fileinput">\n';
	html += _tab +'\t<span>'+ _text +'</span>\n';
	html +=	_tab +'\t<input class="fileupload" type="file" name="files[]" multiple>\n';
	html += _tab +'</span>\n';
	html +=	_tab +'<div class="progress hidden">\n';
	html += _tab +'\t<div class="progress-bar"></div>\n';
	html +=	_tab +'</div>\n';
	html +=	_tab +'<span class="error"></span>\n';
	return html;
};
VhplabContribuerFrom.prototype.createMediaModule = function(_container, _type, _n) {
	$(_container +" .modules_list").append(this.createModule(_type, _T.module_label_image, _n, '', _T.help_image));
	$(_container +" ."+ _type +"_"+ _n +" .content").append(this.createField('\t\t\t\t', '', this.createMediaInput('', _T.seleciona_imagen)));
   	this.bindMediaModuleActions(_container +" ."+ _type +"_"+ _n, _type, _n);
};
VhplabContribuerFrom.prototype.createVideoModule = function(_container, _type, _n) {
	// console.log('createVideoModule(); '+ _container +' '+ _type +' '+ _n);
	$(_container +" .modules_list").append(this.createModule(_type, _T.module_label_video_image, _n, '', _T.help_video_image));
	$(_container +" ."+ _type +"_"+ _n +" .content").append('\t\t\t\t<fieldset>\n'+ this.createField('\t\t\t\t', '', this.createMediaInput('', _T.seleciona_imagen)) +'\t\t\t\t</fieldset>\n');
	$(_container +" ."+ _type +"_"+ _n +" .content").append(this.createVideoLink(_type, '_url', '','\t\t\t\t'));
	this.bindVideoModuleActions(_container +" ."+ _type +"_"+ _n, _type, _n);
};
VhplabContribuerFrom.prototype.createModule = function(_class, _text, _n, _tab, _help) {
	var html = '\t<li class="'+ _class +' '+ _class +'_'+ _n +' module">\n';
	html +=	_tab +'\t\t<header title="'+ _T.help_handler +'">\n';
	html +=	_tab +'\t\t<span></span>\n';
	html += _tab +'\t\t\t<h5 title="'+ _help +'">'+ _text +'</h5>\n';
	html += _tab +'\t\t\t<input name="header_field" class="hidden" value="'+ _text +'" type="text">\n';
	html +=	_tab +'\t\t</header>\n';
	html += _tab +'\t\t<div class="content">\n';
	html += _tab +'\t\t\t<span class=\"delete\"></span>\n';
	html += _tab +'\t\t</div>\n';
	html +=	_tab +'\t</li><!-- '+ _class +' '+ _class +'_'+ _n +' module -->\n';
	return html;
};
VhplabContribuerFrom.prototype.createNewModule = function(_me) {
	var type = $(_me).data("type");
	var n = $(_me).data('n_audiovisuel');
	var container = "#formulaire .content .audiovisuel";
	// console.log('createNewModule: '+ type +' '+ $(container +" li.module").length);
	if ($(container +" li.module").length<=25) {
		switch(type) {
			case 'text':
				this.createTextModule(container, type, n);
				break;
			case 'link':
				this.createLinkModule(container, type, n);
				break;
			case 'media':
				this.createMediaModule(container, type, n);
				break;
			case 'audio':
				this.createAudioModule(container, type, n);
				break;
			case 'video':
				this.createVideoModule(container, type, n);
				break;
		}
		this.bindModuleHeaderActions(container +" ."+ type +"_"+ n);
		$(container +" ."+ type +"_"+ n).data('ok', false);
		$(".submit .btn").css('opacity','0.4');
		$(_me).data('n_audiovisuel', n+1);
		this.scrollTo = 'bottom';
		$("#formulaire .scroll").mCustomScrollbar("update");
	}
};
VhplabContribuerFrom.prototype.createTextModule = function(_container, _type, _n) {

	// console.log('_container: ' + _container);
	// console.log('createTextModule: '+ this.createModule(_type, _T.module_label_text, _n, '\t\t\t\t\t\t\t', _T.help_text));
	
	
	$(_container +" .modules_list").append(this.createModule(_type, _T.module_label_text, _n, '\t\t\t\t\t\t\t', _T.help_text));
	$(_container +" ."+ _type +"_"+ _n +" .content").append(this.createField('\t\t\t\t', '<p class="value" name="text"></p><span class="error"></span>', '\t\t\t\t\t<textarea class="form-control text" name="text" rows="6"></textarea>\n'));
	this.bindTextModuleActions(_container +" ."+ _type +"_"+ _n);
};
VhplabContribuerFrom.prototype.deleteMedia = function(_c, _type) {
	var delete_media;
	(typeof $("#formulaire .id_article").data('delete-media') != "undefined") ? delete_media = $("#formulaire .id_article").data('delete-media') + ":" : delete_media = "";
	delete_media += $(_c).data(_type);
	$("#formulaire .id_article").data('delete-media', delete_media);
	// alert('delete_media: '+delete_media);	
};
VhplabContribuerFrom.prototype.deleteModule = function(_me) {
	var container = $(_me).parent().parent();
	var clase = $(container).attr('class');
	var type = clase.split(" ");
	if ((type[0]=="media")||(type[0]=="audio")) {
		if (($("#formulaire .id_article").val()!='oui')&&(typeof $(container).data(type[0])=="number")) {
			this.deleteMedia(container, type[0]);
		} else {
			$('.remove_media span', container).trigger('click');
		}
	}
	$(container).remove();
	$("#formulaire .scroll").mCustomScrollbar("update");
	this.check();
};
VhplabContribuerFrom.prototype.editName = function(_me) {
	$(_me).hide();
	$("input", $(_me).parent()).show("slow");
};
VhplabContribuerFrom.prototype.getModulesData = function(_wrapper) {
	var return_data = {};
	var num = $("#formulaire "+ _wrapper +" li.module").length;
	var modules = true;
	var modules_data = new Array();
	var clean_uploads = new Array();
	// alert("#formulaire "+ _wrapper +" li.module ||| num:"+ $("#formulaire "+ _wrapper +" li.module").length);
	$("#formulaire "+ _wrapper +" li.module").each(function(index, module){
		modules = modules && $(module).data('ok');
		var get_type = $(module).attr('class');
		var type = get_type.split(" "); 
		var header = $("header h5", module).text();
		if ($(module).data('ok')) {
			switch (type[0]) {
				case 'link':
					var links = new Array();
					$(".value_box a", module).each(function(index, link){
						links.push({text: $(link).text(), href: $(link).attr('href')});
					});
					modules_data.push({type: 'link', data: links, header: header});
					break;
				case 'text':
					modules_data.push({type: 'text', data: $(".value_box .value", module).text(), header: header});
					break;
				case 'media':
					var data = $(module).data('media');
					var delete_data = $(module).data('delete-media');
					modules_data.push({type: 'media', data: data, header: header, delete_data: delete_data});
					if (typeof data.deleteUrl != "undefined") clean_uploads.push(data.deleteUrl);
					break;
				case 'audio':
					var data = $(module).data('audio');
					var delete_data = $(module).data('delete-audio');
					modules_data.push({type: 'audio', data: data, header: header, delete_data: delete_data});
					if (typeof data.deleteUrl != "undefined") clean_uploads.push(data.deleteUrl);
					break;
				case 'video':
					var data = $(module).data('video');
					var delete_data = $(module).data('delete-video');
					var id_data = $(module).data('id');
					var channel_data = $(module).data('channel');
					modules_data.push({type: 'video', data: data, id_data: id_data, channel_data: channel_data, header: header, delete_data: delete_data});
					if (typeof data.deleteUrl != "undefined") clean_uploads.push(data.deleteUrl);
					break;
				default:
					alert(type);
			}
		} else {
			$(this).addClass('wrong-module');
		}
	});
	$(return_data).data('num', num);
	$(return_data).data('modules', modules);
	$(return_data).data('modules_data', modules_data);
	$(return_data).data('clean_uploads', clean_uploads);
	return return_data;
};
VhplabContribuerFrom.prototype.initData = function() {
	/* title & subtitle */
	$("#formulaire .wrap_title").data('ok', true);
	$("#formulaire .wrap_subtitle").data('ok', true);
	/* visibility */
	this.toggleVisible($("#formulaire .visibility .select-"+ $("#formulaire .visibility").data('visibility')));
	/* category */
	this.toggleCategory($("#formulaire .category li").has(".select-"+ $("#formulaire .category").data('category')));
	/* modules */
	this.bindModuleHeaderActions("#formulaire .modules");
	this.bindEachModuleActions('audiovisuel');
	/* cartography */
	$("#formulaire .wrap_cartography").data('ok',true);
	cgeomap.map.setClickableMarker({
		latitude: $("#formulaire .wrap_cartography .latitude").val(),
		longitude: $("#formulaire .wrap_cartography .longitude").val(),
		zoom: $("#formulaire .wrap_cartography .zoom").val()
	});
	cgeomap.map.showLayer('empty', false);
	/* callback */
	this.check();
};
VhplabContribuerFrom.prototype.initialize = function(_opts) {
	if (typeof _opts.url_site != "undefined") {
		var url_site = _opts.url_site;
		if (url_site.slice(-1)!="/") url_site += "/";
		this.url_form = url_site + 'spip.php?page=ajax-contribuer';
		this.url_json = url_site + 'spip.php?page=json-contribuer';
		this.url_upload = url_site + 'jQuery-File-Upload/server/php/';
	}
};
VhplabContribuerFrom.prototype.load = function(_url) {
	// console.log('/* Desktop prototype */ cgeomap.load(_url);');
	$("#formulaire").empty();
	// new
	if (_url) {
		// get url via log
		// console.log('url: '+ _url);
		$("#formulaire").load(_url, function() {
			if(cgeomap.map.open) {
				var open = $(cgeomap.map.markers).data('marker_'+cgeomap.map.open);
				open.closeInfoWindow();
			}
			cgeomap.form.initData();
			cgeomap.form.bindActions();
			$("#formulaire").slideDown("slow",function(){
				// cgeomap.map.setSatelliteLayer();
				$('.leaflet-control-type').show();
				cgeomap.map.typeControl.changeTypeTo('satellite');
			});
		});
	// contribuer
	} else {
		// get url via log
		// console.log('this.url_form: ' + this.url_form);
		$("#formulaire").load(this.url_form, function() {
			if(cgeomap.map.open) {
				var open = $(cgeomap.map.markers).data('marker_'+cgeomap.map.open);
				open.closeInfoWindow();
			}
			cgeomap.form.resetData();
			cgeomap.form.bindActions();
			$("#formulaire").slideDown("slow",function(){
				// cgeomap.map.setSatelliteLayer();
				$('.leaflet-control-type').show();
				cgeomap.map.typeControl.changeTypeTo('satellite');
			});
		});
	}
};
VhplabContribuerFrom.prototype.progressAnimation = function(_data, _container) {
	var progress = parseInt(_data.loaded / _data.total * 100, 10);
	$(_container +' .progress-bar').css('width', progress + '%');
};
VhplabContribuerFrom.prototype.resetData = function() {
	/* title & subtitle */
	$("#formulaire .wrap_title").data('ok', false);
	$("#formulaire .wrap_subtitle").data('ok', false);
	/* visibility */
	this.toggleVisible($("#formulaire .visibility .select-default"));
	/* category */
	this.toggleCategory($("#formulaire .category li").has(".select-category_00"));
	/* modules */
	$("#add_link_module").data('n_audiovisuel', 0);
	$("#add_text_module").data('n_audiovisuel', 0);
	$("#add_media_module").data('n_audiovisuel', 0);
	$("#add_audio_module").data('n_audiovisuel', 0);
	/* cartography */
	cgeomap.map.setClickableMarker({
		position: 'geolocation'
	});
	cgeomap.map.showLayer('empty', false);
	/* callback */
	this.check();
};
VhplabContribuerFrom.prototype.resizeFields = function(_me, _p1, _p2) {
	var container = $(_me).parent().parent();
	var width = $(container).width();
	var padding = 6;
	var border = 1;
	var margin = 6;
	var ofset = padding * 4 + border * 4 + margin;
	// alert(width +' '+ parseInt((width-ofset)*_p1) +' '+ parseInt((width-ofset)*_p2));
	$(_me).css("width", parseInt((width-ofset)*_p1) +"px");
	$(_me).siblings().css("width", parseInt((width-ofset)*_p2) +"px");
};
VhplabContribuerFrom.prototype.scrollContent = function() {
	if (this.scrollTo != '') {
		$("#formulaire .scroll").mCustomScrollbar("scrollTo", this.scrollTo, { 
			scrollInertia: 600,
			scrollEasing:"easeOut"
		});
		this.scrollTo = '';
	}
};
VhplabContribuerFrom.prototype.setIcon = function(_n) {
	if (typeof this.icons == "undefined") {
		this.icons = new Array();
		var icons_data = $("#formulaire header .icon").data('icons');
		var icons = icons_data.split(",");
		for (var i=0; i<icons.length; i++) {
			var icon = icons[i].split(" ");
			var new_icon = {};
			$(new_icon).data('category', icon[0]);
			$(new_icon).data('id', icon[1]);
			$(new_icon).data('src', icon[2]);
			this.icons.push(new_icon);
		}
	}
	if (this.icons.length>_n) {
		$("#formulaire .header .icon").data("id_icon", $(this.icons[_n]).data('id'));
		$("#formulaire .header .icon").attr("src", $(this.icons[_n]).data('src'));
		$("#formulaire .header .icon").attr("width", 60);
		$("#formulaire .header .icon").attr("height", 60);
		var icon = L.icon({
			iconUrl: $(this.icons[_n]).data('src'),
    		iconRetinaUrl: $(this.icons[_n]).data('src'),
    		iconSize: [60, 60],
    		iconAnchor: [30, 60]
		});
		cgeomap.map.clickableMarker.setIcon(icon);
	}
};
VhplabContribuerFrom.prototype.sortableChange = function(_me, _container) {
	if (this.trash) {
		var container = $(_me).parent();
		if (!$(_container +" li").first().hasClass("trash")) {
			$(_me).addClass("transparent");
		} else {
			$(_me).removeClass("transparent");
		}
	}
};
VhplabContribuerFrom.prototype.sortableStart = function(_me, _container) {
	$(_me).addClass("dragging");
	if (this.trash) $(_container+" .trash").addClass("trash-active");
};
VhplabContribuerFrom.prototype.sortableStop = function(_me, _container) {
	$(_me).removeClass("dragging");
	if (this.trash) {
		$(_container+" .trash").removeClass("trash-active");
		var container = $(_me).parent();
		$(_container +" .trash li").each(function(){
			if (typeof $(this).attr("class") != "undefined") {
				$(_container +" .trash").empty();
				$(_container +" .trash").append("<li></li>");
				$("#formulaire .scroll").mCustomScrollbar("update");
				cgeomap.form.check();
				// alert('trash'); 
			}
		});
	}
};
VhplabContribuerFrom.prototype.submit = function() {
	// console.log('/* Desktop prototypes */ cgeomap.form.submit()');
	/* title & subtitle */
	var title = $("#formulaire .wrap_title").data('ok');
	var subtitle = $("#formulaire .wrap_subtitle").data('ok');
	/* options */
	var visibility = $("#formulaire .visibility").data('ok');
	var category = $("#formulaire .category").data('ok');
	/* modules */
	var audiovisuel_modules = this.getModulesData(".audiovisuel");
	var delete_media = false;
	var delete_audio = false;
	/* cartography */
	var cartography = $("#formulaire .wrap_cartography").data('ok');
	// alert($(audiovisuel_modules).toSource());
	if ((title)&&(subtitle)&&(visibility)&&(category)&&($(audiovisuel_modules).data('num')>0)&&($(audiovisuel_modules).data('modules'))&&(cartography)) {
		$("body").prepend('<div id="sending_data"><div></div></div>');
		$(".submit .btn").hide();
		var id_article = 'new';
		// id_article when editing and delete media if old media was deleted in modules
		if ($("#formulaire .id_article").val()!='oui') {
			id_article = $("#formulaire .id_article").val();
			if (typeof $("#formulaire .id_article").data('delete-media') != "undefined") delete_media = $("#formulaire .id_article").data('delete-media');
			if (typeof $("#formulaire .id_article").data('delete-audio') != "undefined") delete_audio = $("#formulaire .id_article").data('delete-audio');
		}
		var audiovisuel = $(audiovisuel_modules).data('modules_data');
		// no audiovisual module added
		if ((typeof audiovisuel == "undefined")||($(audiovisuel).length == 0)) audiovisuel = false;
		var self = this;
		// get URL via log
		// console.log('get url_json:'+ this.url_json);
		// console.log('get url_qr: https://debug.cgeomap.eu/phpqrcode/myQr.php?data='+ encodeURIComponent('https://debug.cgeomap.eu/monumenta/?author=1&node=2'));
		$.getJSON(this.url_json, function(data){
			// console.log('json data: '+  JSON.stringify(data));
			var submap_url = $("#formulaire .submap_url").val();
			// console.log('get submap_url:'+ submap_url);
			if ((submap_url != '')&&(submap_url.slice(-1) != "/")) submap_url += "/";
			var formData = {
				page:'json-contribuer',
				formulaire_action:'contribuer',
				formulaire_action_args: data[0].formulaire_action_args,
				article: id_article,
				title: $("#formulaire .wrap_title .value").text(),
				subtitle: $("#formulaire .wrap_subtitle .value").text(),
				submap: $("#formulaire .submap").val(),
				visibility: $("#formulaire .visibility").data('visibility'),
				category: $("#formulaire .category").data('category'),
				icon: $("#formulaire header .icon").data("id_icon"),
				latitude: $("#formulaire .latitude").val(),
				longitude: $("#formulaire .longitude").val(),
				zoom: $("#formulaire .zoom").val(),
				address: $("#formulaire .address").val(),
				audiovisuel: audiovisuel,
				base_url: $("#formulaire .base_url").val(),
				qr_url: $("#formulaire .qr_url").val(),
				submap_url: submap_url,
				delete_media: delete_media,
				delete_audio: delete_audio
			};
			// get URL via log
			// console.log('url_form:'+ cgeomap.form.url_form);
			// Get formData via log
			// console.log('formData: '+  JSON.stringify(formData) );
			$.getJSON(cgeomap.form.url_form, formData, function(response){
				// Get response via log
				// console.log('response: '+  JSON.stringify(response) );
				if (typeof(response[0].message_ok)!="undefined") {
					cgeomap.form.cleanUploads($(audiovisuel_modules).data('clean_uploads'));
					$("#formulaire").empty();
					var text = response[0].message_ok.split(":");
					var updateURL = response[0].update +'&id_article='+ text[2] +'&var_mode=recalcul';
					cgeomap.map.open = text[2];
					// console.log('updateURL:'+ updateURL);
					$("#formulaire").load(updateURL, function() {
						$("#formulaire").empty();
					});
					$("#formulaire").data('recalcul', text[2]);
					if (cgeomap.form.geo) cgeomap.form.toggleGeo();
					// Load map
					cgeomap.toggleUtilities('carte', true, function(){
						// console.log('cgeomap.toggleUtilities.calback() in form.submit();');
						$("#article").slideDown("fast");
						$("#sending_data").fadeOut("slow", function(){
							$("#sending_data").remove();
						});
					});
				} else {
					alert(response[0].message_erreur);
					// console.log('url_base:'+ cgeomap.form.url_base);
					window.location.href = cgeomap.url_site + "spip.php?page=editar";
				}
			});
		});
	} else {
		//alert('incorrecto');
		// alert('title: '+ title +', subtitle: '+ subtitle +', visibility:'+ visibility +', audiovisuel_modules: '+ $(audiovisuel_modules).data('modules') +' '+ $(audiovisuel_modules).data('num') + ', cartography: '+cartography);
		if (title==false) $(".value_box .value", "#formulaire .wrap_title").addClass("wrong");
		if (subtitle==false) $(".value_box .value", "#formulaire .wrap_subtitle").addClass("wrong");
	}
	return false;
};
VhplabContribuerFrom.prototype.toggleGeo = function() {
	if (this.geo) {
		$(".wrap_cartography").hide();
		cgeomap.map.map.off('click', cgeomap.map.clickListener);
		cgeomap.map.map.off('zoomend', cgeomap.map.zoomListener);
		this.geo = false;
	} else {
		$(".wrap_cartography").show();
		cgeomap.map.map.on('click', cgeomap.map.clickListener);
		cgeomap.map.map.on('zoomend', cgeomap.map.zoomListener);
		this.geo = true;
	}
};
VhplabContribuerFrom.prototype.toggleVisible = function(_me) {
	$(".visibility .btn").removeClass("selected");
	$(_me).addClass("selected");
	$("#formulaire .visibility").data('ok', true);
	$("#formulaire .visibility").data('visibility', $(_me).val());
	var n_visibility = $(_me).data('n') - 1;
	var n_category = $("#formulaire .category .selected .btn").data('n');
	if (typeof n_category == "undefined") n_category = 1;
	var n = (n_category-1)*3 + n_visibility;
	// console.log('toggleVisible n_visibility: '+ n_visibility +', n_category: '+ n_category);
	//$("#formulaire .block_modules").show();
	//cgeomap.form.toggleModule(".wrap_content .audiovisuel .toggle");
	this.check();
	this.setIcon(n);
};
VhplabContribuerFrom.prototype.toggleCategory = function(_me) {
	$(".category li").removeClass("selected");
	$(_me).addClass("selected");
	$("#formulaire .category").data('ok', true);
	$("#formulaire .category").data('category', $(".btn", _me).val());
	var n_visibility = $("#formulaire .visibility .selected").data('n') - 1;
	var n_category = $(".btn", _me).data('n');
	var n = (n_category-1)*3 + n_visibility;
	this.check();
	this.setIcon(n);
};
VhplabContribuerFrom.prototype.toggleVideoChannel = function(_me) {
	// console.log('toggleVideoChannel();');
	var c = $(_me).parent().parent();
	$(".btn", c).removeClass("selected");
	$(_me).addClass("selected");
	$(c).data('ok', true);
	$(c).data('chanel', $(_me).val());
	this.check();
};
VhplabContribuerFrom.prototype.updateHeaderField = function(_me, _tag) {
	// alert('updateHeaderField');
	var container = $(_me).parent();
	var old = $(_tag, container).text();
	var value = $(_me).val();
	var limit = $(_me).data('limit');
	// alert(limit);
	if ((typeof(value)!='undefined')&&(value != "")&&(value!=old)) {
    	if ((typeof(limit)!='undefined')&&(value.length>limit)) value = value.slice(0, limit-3) + '...';
    	
    	$(_tag, container).text(value);
    	$(_tag, container).attr("class","value new");
		$("input", container).hide();
		$(_tag, container).show("slow");
	} else if ((value != "")&&(value==old)) {
		$("input", container).hide();
		$(_tag, container).show("slow");
	}
};
VhplabContribuerFrom.prototype.updateInputField = function(_me) {
	var container = $(_me).parent().parent();
	var old = $(".value_box .value", container).text();
	var value = $(_me).val();
	if ((typeof(value)!='undefined')&&(value != "")&&(value!=old)) {
    	$(".value_box .value", container).text(value);
    	$(".value_box .value", container).attr("class","value new");
		$(".value_box .value", container).removeClass("wrong");
		$(".field_box", container).hide();
		$(".value_box .new", container).show();
		$(".value_box", container).show("slow");
		$(container).data('ok', true);
		this.check();
	} else if ((value != "")&&(value==old)) {
		$(".field_box", container).hide();
		$(".value_box .new", container).show();
		$(".value_box .value", container).removeClass("wrong");
		$(".value_box", container).show("slow");
		$(container).data('ok', true);
		this.check();
	}
};
VhplabContribuerFrom.prototype.updateLinkField = function(_me) {
	var name = $(_me).attr('name');
	var container = $(_me).parent().parent().parent();
	var url = $(".field_box .url_link", container).val();
	var ok_url = false;
	var text = $(".field_box .text_link", container).val();
	var ok_text = false;
	if ((typeof(url)!='undefined')&&(url!="")) {
		ok_url = true;
		$(".erreur_message", container).remove();
		var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i');
		if (!pattern.test(url)) {
			url = 'https://' + url;
			if (pattern.test(url)) {
				$(".field_box .url_link", container).attr('value', url);
			} else {
				$(".field_box", container).append('<span class="erreur_message">La dirección es incorrecta</span>');
    			ok_url = false;
			}  
		}
	}
	if ((typeof(text)!='undefined')&&(text!="")) {
		if (text.length>=100) text = text.slice(0,100);
		ok_text = true;
	}
	if ((ok_url)&&(ok_text)) {
    	$(".value_box .value", container).text(text);
    	$(".value_box .value", container).attr('href', url);
    	$(".value_box .value", container).attr("class","value new");
		$(".field_box", container).hide();
		$(".value_box .new", container).show();
		$(".value_box", container).show("slow");
		$(".add", $(container).parent()).show("slow");
		$(container).parent().parent().parent().data('ok',true);
		$(container).parent().parent().parent().removeClass("wrong-module");
		this.check();
	}
};
VhplabContribuerFrom.prototype.updateVideoChannelField = function(_me) {
	// console.log('updateVideoChannelField();');
	var url = $(_me).val();
	var fieldset = $(_me).parent().parent().parent();
	var module = $(_me).parent().parent().parent().parent().parent();
	// console.log('url: '+ url);
	var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	if (url.match(p)){
		/* youtube */
		var data = url.split('watch?v=');
       	// console.log('it is a youtube link '+ data[1]);
    	$(".value", fieldset).text('https://www.youtube.com/watch?v='+ data[1]);
    	$(".value", fieldset).attr('href', url);
    	$(".value", fieldset).attr("class","value new");
		$(".value", fieldset).show("slow");
    	$(_me).hide();
    	$(".btn", fieldset).removeClass("selected");
		$("button[name='select-youtube']", fieldset).addClass("selected");
		$(module).data('channel', 'youtube');
		$(module).data('link', true);
		$(".erreur_message", fieldset).remove();
		var frame = $(module).data('frame');
		if (frame) {
			$(module).data('ok', true);
			$(module).removeClass("wrong-module");
			//alert('ok');
		} else {
    		$(fieldset).append('<span class="erreur_message">'+ _T.error_image +'</span>');
		}
		$(module).data('id',data[1]);
		$(module).data('channel','youtube');
		this.check();
	} else {
		p = /^(https\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/;
		if (url.match(p)){
			/* vimeo */
       		var data = url.split('vimeo.com/');
       		// console.log('it is a vimeo link '+ data[1]);
       		$(".value", fieldset).text('https://vimeo.com/'+ data[1]);
    		$(".value", fieldset).attr('href', url);
    		$(".value", fieldset).attr("class","value new");
			$(".value", fieldset).show("slow");
    		$(_me).hide();
    		$(".btn", fieldset).removeClass("selected");
			$("button[name='select-vimeo']", fieldset).addClass("selected");
			$(module).data('channel', 'vimeo');
			$(module).data('link', true);
			$(".erreur_message", fieldset).remove();
			var frame = $(module).data('frame');
			if (frame) {
				$(module).data('ok', true);
				$(module).removeClass("wrong-module");
				//alert('ok');
			} else {
    			$(fieldset).append('<span class="erreur_message">'+ _T.error_image +'</span>');
			}
			$(module).data('id',data[1]);
			$(module).data('channel','vimeo');
			this.check();
       	} else {
			$(".erreur_message", fieldset).remove();
    		$(fieldset).append('<span class="erreur_message">'+ _T.error_address +'</span>');
			$(module).data('link', false);
			$(module).data('ok', false);
			$(module).addClass("wrong-module");
    	}
    }
    
};
VhplabContribuerFrom.prototype.updateTextField = function(_me, _check) {
	/* Variables */
	// Los datos que controlan el funcionamiento del campo se almacenan como .data() en el mismo
	var container = $(_me).data('container');
	var old = $(".value_box .value", container).text();
	var value = $(_me).val();
	var min = $(_me).data('min');
	var limit = $(_me).data('limit');
	// alert('container: '+ container +' old: '+ old +' value: '+ value +' min: '+ min +' limit: '+ limit);
	/* Comprobación */
	// la única comprobación que se hace es que el texto no esté vacío, podría añadirse un .data('check') para hacer una comprobacion del texto
	if ((typeof(value)!='undefined')&&(value != "")) {
		/* Mínimo */
		// Tamaño mínimo de texto
		if ((typeof(min)!='undefined')&&(value.length<=min)) {
			$(".error", container).text(_T.message_min_1 +' '+  min +' '+ _T.message_min_2);
			$(".error", container).show();
			$(".error", container).delay(3000).fadeOut("slow", function() {
				$(this).text("");
			});
			$(container).data('ok', false);
		} else {
			/* Máximo */
			// Tamaño máximo de texto
			if ((typeof(limit)!='undefined')&&(value.length>=limit)) {
    			value = value.slice(0, limit-1) + ' (...)';
    			$(_me).attr("value", value);
    			$(".error", container).text(_T.message_limit_1 +' '+  min +' '+ _T.message_limit_2);
				$(".error", container).show();
				$(".error", container).delay(3000).fadeOut("slow", function() {
					$(this).text("");
				});
    		}
    		$(".value_box .value", container).text(value);
    		$(".value_box .value", container).attr("class","value new");
			$(".field_box", container).hide();
			$(".value_box .new", container).show();
			$(".value_box", container).show("slow");
			$(container).data('ok', true);
			$(container).removeClass("wrong-module");
			
			/* Check del formulario global */
			// El check se recibe de la variable para poder utilizar el campo en distintos formularios
			_check();
		}
	} else if ((value==old)&&(value != "")) {
		$(".field_box", container).hide();
		$(".value_box .new", container).show();
		$(".value_box", container).show("slow");
		$(container).removeClass("wrong-module");
	}
};
