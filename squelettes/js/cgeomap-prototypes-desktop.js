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
	if (typeof _opts.url_article != "undefined") this.url_article = _opts.url_article;
	if (typeof _opts.url_user != "undefined") this.url_user = _opts.url_user;
	if (typeof _opts.url_embed != "undefined") this.url_embed = _opts.url_embed;
	
	// initialize formulary
	this.form.initialize(_opts);
	
	// Map options
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	// load custom map prototypes console.log('load custom map prototypes');
	if (typeof _opts.custom_map_prototypes != "undefined") {
		$.getScript(_opts.custom_map_prototypes, function(data) {
			cgeomap.ready(_opts.map_opts);
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
VhplabInterface.prototype.ready = function(_opts) {
 	this.map = new VhplabMap();
	this.map.initialize({
		url: this.url_site,
		markers: (typeof _opts.markers != "undefined") ? _opts.markers : '',
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
VhplabInterface.prototype.loadArticleTemplate = function(_callback) {
	// get URL via alert(this.url_article);
 	$("#content .wrapper").load(this.url_article, function() {
 		/* Article */
 		$('#article').hide();
 		$('#article .header .editer').hide();
 		$('#article .header .editer').click(function() { 
 			$(this).fadeOut('fast', function(){
 				cgeomap.toggleUtilities($(this).attr('name'));
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
		/* User */
 		cgeomap.loadUser();
		if(_callback) _callback();
	});
};
VhplabInterface.prototype.loadContributions = function() {
	$("#content").data('selected','contributions');
	$("#user .utilities .contributions").addClass('on');
	var url = $("#user .utilities .contributions").data("href");
	var loaded = $("#contributions").data('loaded');
	var recalcul = $("#formulaire").data('recalcul');
	if (recalcul) {
		$('#loading_content').fadeIn();
		this.map.open = false;
		url += '&var_mode=recalcul';
		$("#contributions ol").empty();
		// get url via alert(url);
		$("#contributions ol").load(url, function() {
			if (recalcul!='none') {
				var url_markers = cgeomap.map.markersURL +'&offset='+ cgeomap.map.offset +'&limit='+ cgeomap.map.limit +'&id_article='+ recalcul +'&var_mode=recalcul&callback=?';
				// get url_markers via alert(url_markers);
				cgeomap.map.reloadMarkers(url_markers, function(){
					$("#formulaire").data('recalcul', false);
					cgeomap.createNavigationList();
					cgeomap.bindNavigationListActions();
					cgeomap.bindContributionsActions(function(_a){
						cgeomap.map.hideMarkers(_a);
						$('#loading_content').fadeOut();
						$("#contributions").slideDown("slow",function(){
							$("#contributions").mCustomScrollbar({
								scrollInertia: 150,
								theme: "dark-thick"
							});
						});
					});
				});
			} else {
				$("#formulaire").data('recalcul', false);
				cgeomap.createNavigationList();
				cgeomap.bindNavigationListActions();
				cgeomap.bindContributionsActions(function(_a){
					cgeomap.map.hideMarkers(_a);
					$('#loading_content').fadeOut();
					$("#contributions").slideDown("slow",function(){
						$("#contributions").mCustomScrollbar({
							scrollInertia: 150,
							theme: "dark-thick"
						});
					});
				});
			}
		});
	} else if (loaded) {
		this.map.closeOpenMarker();
		var aportaciones = $("#user .articles").data('aportaciones');
		this.map.hideMarkers(aportaciones);
		$("#contributions").slideDown("slow",function(){
			$("#contributions").mCustomScrollbar({
				scrollInertia: 150,
				theme: "dark-thick"
			});
		});
	} else {
		$('#loading_content').fadeIn();
		this.map.closeOpenMarker();
		$("#contributions ol").empty();
		$("#contributions ol").load(url, function() {
			cgeomap.bindContributionsActions(function(_a){
				cgeomap.map.hideMarkers(_a);
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
	
};
VhplabInterface.prototype.loadEmbed = function() {
	$("#content").data('selected','embed');
	$("#user .utilities .embed").addClass('on');
	var loaded = $("#embed").data('loaded');
	var recalcul =  $("#formulaire").data('recalcul');
	if (recalcul) {
		this.map.open = false;
		var url_aportaciones = $("#user .aportaciones").data("href");
		$('#loading_content').fadeIn();
		url += '&var_mode=recalcul';
		$("#user .articles ol").empty();
		// get url via alert(url_aportaciones);
		$("#user .articles ol").load(url_aportaciones, function() {
			var url_markers = cgeomap.map.markersURL +'&offset='+ cgeomap.map.offset +'&limit='+ cgeomap.map.limit +'&id_article='+ recalcul +'&var_mode=recalcul&callback=?';
			// get url_markers via alert(url_markers);
			cgeomap.map.reloadMarkers(url_markers, function(){
				$("#formulaire").data('recalcul', false);
				cgeomap.createNavigationList({
					hide: true
				});
				cgeomap.bindNavigationList();
				cgeomap.bindAportacionesActions();
				$("#embed").empty();
				$("#embed").load(cgeomap.url_embed, function() {
					cgeomap.bindEmbedActions(function(){
						cgeomap.hideAllMarkers();
						$("#categoryControl").fadeOut();
						cgeomap.slideUtilities('embed', 'show');
						if ($("#navigation").data('visible')) cgeomap.toggleNavigation();
						$('#loading_content').fadeOut();
					});
				});
			});
		});
	} else if (loaded) {
		alert('embed loaded');
		if ($("#navigation").data('visible')) cgeomap.toggleNavigation();
		this.map.closeOpenMarker();
		this.hideAllMarkers();
		$("#categoryControl").fadeOut();
		this.slideUtilities('embed', 'show');
	} else {
		alert('load embed');
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
VhplabInterface.prototype.loadContribuer = function() {
	cgeomap.form.load();
	$("#content").data('selected','contribuer');
	$("#user .utilities .contribuer").addClass('on');
};
VhplabInterface.prototype.loadEditer = function() {
	cgeomap.form.load($('#article .header .editer').data('href'));
	$("#content").data('selected','editer');
};
VhplabInterface.prototype.loadUtilities = function(_target, _callback) {
	switch (_target) {
		case 'carte':
			cgeomap.loadMap(_callback);
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
	// get URL via alert(this.url_user);
	$("#user").load(this.url_user, function() {
		/* Session & Admin */
		if ($("#user .utilities").data("session") == "ok") cgeomap.session = true;
		if ($("#user .utilities").data("admin") == "ok") cgeomap.admin = true;
		/* Login */
		$('#user .login').hide();
		/* Utilities  */
		//$("#content").data('selected','carte');
		//$("#user .utilities .carte").addClass('on');
		$("#user .utilities a").click(function() { 
			cgeomap.toggleUtilities($(this).attr('name'));
		});
	});
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
					$("#content").data('selected', 'none');
					$("#contributions").data('loadded', 'false');
					var deleted = $(cgeomap.map.markers).data('marker_'+text[1]);
					cgeomap.map.map.removeLayer(deleted.marker);
					$(cgeomap.map.markers).removeData('marker_'+text[1]);
					var index = cgeomap.map.markerList.indexOf(parseInt(text[1]));
					if (index > -1) cgeomap.map.markerList.splice(index, 1);
					$('#contributions').slideUp("fast", function(){
						$("#sending_data").fadeOut("slow", function(){
							$("#sending_data").remove();
							cgeomap.loadUtilities('contributions');
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
 	if (!this.session) {
		var tgl =  $(_me).data("tgl");
		if (tgl=="on") {
			$('#user .login').slideUp();
			$( "#article" ).animate({
				top: 39,
			});
			$(_me).data("tgl","off");
		} else {
			$('#user .login').slideDown();
			$( "#article" ).animate({
				top: 77,
			});
			$(_me).data("tgl","on");
		}
	}
};
VhplabInterface.prototype.toggleUtilities = function(_target, _callback) {
	var selected = $("#content").data('selected');
	// alert('target: '+ _target +' selected: '+ selected);
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
				hide = "#formulaire";
				break;
			case 'editer':
				hide = "#formulaire";
				break;
			case 'embed':
				hide = "#embed";
				break;
		}
		if ($(hide).is(":visible")) {
			// hide editer button first when visible
			if (($('#article .header .editer').is(":visible"))&&(hide=="#article")) {
				$('#article .header .editer').fadeOut("fast", function(){
					// hide selected content and show new content
					$(hide).slideUp("fast", function(){
						$("#user .utilities a").removeClass('on');
						cgeomap.loadUtilities(_target, _callback);
					});
				});
			} else {
				// hide selected content and show new content
				$(hide).slideUp("fast", function(){
					$("#user .utilities a").removeClass('on');
					cgeomap.loadUtilities(_target, _callback);
				});
			}
		} else {
			// show new content
			cgeomap.loadUtilities(_target, _callback);
		}
	}
};
VhplabInterface.prototype.updateEmbedMap = function(_url) {
	$("body").prepend('<div id="sending_data"><div></div></div>');
	this.map.closeOpenMarker();
	// get URL via alert(_url);
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
				cgeomap.map.showMarkerJson(_data.markers);
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
    $("#formulaire .wrap_title input").attr('maxlength', 20);
    $("#formulaire .wrap_subtitle input").attr('maxlength', 45);
    
    /* visibility */
    $("#formulaire .visibility .btn").click(function(){ cgeomap.form.toggleVisible(this); });
    
    /* modules */
    $(".module_button").click(function(){ cgeomap.form.createNewModule(this); });
    $( "#formulaire .audiovisuel ul").sortable({
    	axis: "y",
    	handle: "h5",
    	// connectWith: ".trash",
    	change: function(event, ui) { cgeomap.form.sortableChange(ui.item, "#formulaire .audiovisuel"); },
    	start: function(event, ui) { cgeomap.form.sortableStart(ui.item, "#formulaire .audiovisuel"); },
    	stop: function(event, ui) { cgeomap.form.sortableStop(ui.item, "#formulaire .audiovisuel"); }
    });
    
     /* scroll */
    $("#formulaire .scroll").mCustomScrollbar({
		scrollInertia: 150,
		theme: "dark-thick"
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
			cgeomap.form.bindMediaModuleActions(c, 'media', audio_modules);
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
		}
	});
	$("#add_link_module").data('n_'+_block, link_modules);
	$("#add_text_module").data('n_'+_block, text_modules);
	$("#add_media_module").data('n_'+_block, media_modules);
	$("#add_audio_module").data('n_'+_block, audio_modules);
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
    			if($('li', list).size()<=2) {
    				$(c).data('ok',false);
					$(".submit .btn").css('opacity','0.4');
    			}
    			$(this).parent().parent().remove();
        	});
        }
	});
};
VhplabContribuerFrom.prototype.bindMediaModuleActions = function(_context, _class, _n) {
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
        		cgeomap.form.checkExtension(file, _class, _context);
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
	$(_context +" header h5" ).hover(
		function() {
			$(this).parent().addClass("hover");
		}, function() {
			$(this).parent().removeClass("hover");
		}
	);
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
VhplabContribuerFrom.prototype.bindUploadedMediaActions = function(_data, _class, _container, _n) {
	// alert($(_data).toSource());
	if (_class=='media') {
		$('.value_box', _container).append('<img src="'+_data.thumbnailUrl+'" width="330px" height="120px"/><div class="btn remove_media"><span>'+_T.eliminar+'</span></div>');
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
		$(_container).data(_class, '');
		$(".submit .btn").css('opacity','0.4');
	});
};
VhplabContribuerFrom.prototype.check = function() {
	/* title & subtitle */
	var title = $("#formulaire .wrap_title").data('ok');
	var subtitle = $("#formulaire .wrap_subtitle").data('ok');
	/* visibility */
	var visibility = $("#formulaire .visibility").data('ok');
	/* modules */
	var num_audiovisuel = $("#formulaire .audiovisuel li.module").size();
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
	if (_class=='media') {
		var name = _data.name.toLowerCase(); 
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
VhplabContribuerFrom.prototype.createModule = function(_class, _text, _n, _tab, _help) {
	var html = '\t<li class="'+ _class +' '+ _class +'_'+ _n +' module">\n';
	html +=	_tab +'\t\t<header title="'+ _T.help_handler +'">\n';
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
	if ($(container +" li.module").size()<=25) {
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
		}
		this.bindModuleHeaderActions(container +" ."+ type +"_"+ n);
		$(container +" ."+ type +"_"+ n).data('ok', false);
		$(".submit .btn").css('opacity','0.4');
		$(_me).data('n_audiovisuel', n+1);
		$("#formulaire .scroll").mCustomScrollbar("update");
	}
};
VhplabContribuerFrom.prototype.createTextModule = function(_container, _type, _n) {
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
	var num = $("#formulaire "+ _wrapper +" li.module").size();
	var modules = true;
	var modules_data = new Array();
	var clean_uploads = new Array();
	// alert("#formulaire "+ _wrapper +" li.module ||| num:"+ $("#formulaire "+ _wrapper +" li.module").size());
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
				default:
					alert(type);
			}
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
	/* modules */
	this.bindModuleHeaderActions("#formulaire .modules");
	this.bindEachModuleActions('audiovisuel');
	/* cartography */
	$("#formulaire .wrap_cartography").data('ok',true);
	cgeomap.map.setInitialMarker({
		latitude: $("#formulaire .wrap_cartography .latitude").val(),
		longitude: $("#formulaire .wrap_cartography .longitude").val(),
		zoom: $("#formulaire .wrap_cartography .zoom").val()
	});
	/* callback */
	this.check();
};
VhplabContribuerFrom.prototype.initialize = function(_opts) {
	if (typeof _opts.url_site != "undefined") {
		this.url_form = _opts.url_site + 'spip.php?page=ajax-contribuer';
		this.url_json = _opts.url_site + 'spip.php?page=json-contribuer';
		this.url_upload = _opts.url_site + 'jQuery-File-Upload/server/php/';
	}
};
VhplabContribuerFrom.prototype.load = function(_url) {
	$("#formulaire").empty();
	// new
	if (_url) {
		// get url via alert('url: '+ _url);
		$("#formulaire").load(_url, function() {
			if(cgeomap.map.open) {
				var open = $(cgeomap.map.markers).data('marker_'+cgeomap.map.open);
				open.closeInfoWindow();
			}
			cgeomap.map.hideMarkers();
			cgeomap.form.initData();
			cgeomap.form.bindActions();
			$("#formulaire").slideDown("slow",function(){
			
			});
		});
	// contribuer
	} else {
		// get url via alert('url: '+ this.url_form);
		$("#formulaire").load(this.url_form, function() {
			if(cgeomap.map.open) {
				var open = $(cgeomap.map.markers).data('marker_'+cgeomap.map.open);
				open.closeInfoWindow();
			}
			cgeomap.map.hideMarkers();
			cgeomap.form.resetData();
			cgeomap.form.bindActions();
			$("#formulaire").slideDown("slow",function(){
			
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
	/* modules */
	$("#add_link_module").data('n_audiovisuel', 0);
	$("#add_text_module").data('n_audiovisuel', 0);
	$("#add_media_module").data('n_audiovisuel', 0);
	$("#add_audio_module").data('n_audiovisuel', 0);
	/* cartography */
	$("#formulaire .latitude").val('');
	$("#formulaire .longitude").val('');
	$("#formulaire .zoom").val('');
	$("#formulaire .wrap_cartography").data('ok',false);
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
VhplabContribuerFrom.prototype.setIcon = function(_n) {
	if (typeof this.icons == "undefined") {
		this.icons = new Array();
		var icons_data = $("#formulaire header .icon").data('icons');
		var icons = icons_data.split(",");
		for (var i=0; i<icons.length; i++) {
			var icon = icons[i].split(" ");
			var new_icon = {};
			$(new_icon).data('id', icon[0]);
			$(new_icon).data('src', icon[1]);
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
	/* title & subtitle */
	var title = $("#formulaire .wrap_title").data('ok');
	var subtitle = $("#formulaire .wrap_subtitle").data('ok');
	/* options */
	var visibility = $("#formulaire .visibility").data('ok');
	/* modules */
	var audiovisuel_modules = this.getModulesData(".audiovisuel");
	var delete_media = false;
	var delete_audio = false;
	/* cartography */
	var cartography = $("#formulaire .wrap_cartography").data('ok');
	// alert($(audiovisuel_modules).toSource());
	if ((title)&&(subtitle)&&(visibility)&&($(audiovisuel_modules).data('num')>0)&&($(audiovisuel_modules).data('modules'))&&(cartography)) {
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
		if ((typeof audiovisuel == "undefined")||($(audiovisuel).size() == 0)) audiovisuel = false;
		var self = this;
		// get URL via alert(this.url_json);
		$.getJSON(this.url_json, function(data){
			// alert($(data).toSource());
			var formData = {
				page:'json-contribuer',
				formulaire_action:'contribuer',
				formulaire_action_args: data[0].formulaire_action_args,
				article: id_article,
				title: $("#formulaire .wrap_title .value").text(),
				subtitle: $("#formulaire .wrap_subtitle .value").text(),
				visibility: $("#formulaire .visibility").data('visibility'),
				icon: $("#formulaire header .icon").data("id_icon"),
				latitude: $("#formulaire .latitude").val(),
				longitude: $("#formulaire .longitude").val(),
				zoom: $("#formulaire .zoom").val(),
				address: $("#formulaire .address").val(),
				audiovisuel: audiovisuel,
				base_url: $("#formulaire .base_url").val(),
				qr_url: $("#formulaire .qr_url").val(),
				delete_media: delete_media,
				delete_audio: delete_audio
			};
			// alert($(formData).toSource());
			$.getJSON(cgeomap.form.url_form, formData, function(response){
				// alert($(response).toSource());
				if (typeof(response[0].message_ok)!="undefined") {
					cgeomap.form.cleanUploads($(audiovisuel_modules).data('clean_uploads'));
					$("#formulaire").empty();
					var text = response[0].message_ok.split(":");
					var updateURL = response[0].update +'&id_article='+ text[2] +'&var_mode=recalcul';
					cgeomap.map.open = text[2];
					// get URL via alert(updateURL);
					$("#formulaire").load(updateURL, function() {
						$("#formulaire").empty();
					});
					$("#formulaire").data('recalcul', text[2]);
					if (cgeomap.form.geo) cgeomap.form.toggleGeo();
					cgeomap.map.map.removeLayer(cgeomap.map.clickableMarker);
					cgeomap.toggleUtilities('carte', function(){
						$("#article").slideDown("fast");
						$("#sending_data").fadeOut("slow", function(){
							$("#sending_data").remove();
						});
					});
				} else {
					alert(response[0].message_erreur);
					window.location.href = cgeomap.form.url_base;
				}
			});
		});
	} else {
		//alert('incorrecto');
		alert('title: '+ title +', subtitle: '+ subtitle +', visibility:'+ visibility +', audiovisuel_modules: '+ $(audiovisuel_modules).data('modules') +' '+ $(audiovisuel_modules).data('num') + ', cartography: '+cartography);
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
	//$("#formulaire .block_modules").show();
	//cgeomap.form.toggleModule(".wrap_content .audiovisuel .toggle");
	this.check();
	this.setIcon($(_me).data('n')-1);
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
		$(".field_box", container).hide();
		$(".value_box .new", container).show();
		$(".value_box", container).show("slow");
		$(container).data('ok', true);
		this.check();
	} else if ((value != "")&&(value==old)) {
		$(".field_box", container).hide();
		$(".value_box .new", container).show();
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
			url = 'http://' + url;
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
		this.check();
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
			/* Check del formulario global */
			// El check se recibe de la variable para poder utilizar el campo en distintos formularios
			_check();
		}
	} else if ((value==old)&&(value != "")) {
		$(".field_box", container).hide();
		$(".value_box .new", container).show();
		$(".value_box", container).show("slow");
	}
};

//***********
// Vhplab Player
//***********
function VhplabPlayer() {
	this.sound;
	this.soundURL;
	this.selector;
	this.id;
	this.volume = 50;
};
VhplabPlayer.prototype.appendTo = function(_container) {
	$(_container).append('<div class="vhplab_player" id="'+ this.selector +'"></div>');
	$('#'+ this.selector).append('<ul></ul>');
	$('#'+ this.selector +' ul').append('<li class="play" ></li>');
	$('#'+ this.selector +' ul').append('<li class="pause" ></li>');
	$('#'+ this.selector +' ul').append('<li class="position" >00:00</li>');
	$('#'+ this.selector +' ul').append('<li class="duration" >00:00</li>');
	$('#'+ this.selector +' ul').append('<li class="volume" ></li>');
	$('#'+ this.selector +' ul').append('<li class="progress_bar" ><span></span></li>');
    this.bindActions();
};
VhplabPlayer.prototype.bindActions = function() {
	var self = this;
	$('#'+ this.selector +' .play').click(function(){
		self.play();
	});
	$('#'+ this.selector +' .pause').click(function(){
      	self.pause();
	});
	$('#'+ this.selector +' .progress_bar').click(function(e){
      	var w = $(this).width();
		var x = e.clientX - $(this).offset().left;
		if (self.sound.playState) self.sound.setPosition(x*self.sound.duration/w);
	});
	$('#'+ this.selector +' .volume').click(function(){
		self.setVolume();
	});
	$('#'+ this.selector +' .pause').hide();
};
VhplabPlayer.prototype.init = function(_opts) {
	typeof _opts.id != "undefined" ? this.id = _opts.id : this.id = 0;
	typeof _opts.url != "undefined" ? this.soundURL = _opts.url : this.soundURL = '';
	typeof _opts.selector != "undefined" ? this.selector = _opts.selector : this.selector = 'player_' + this.id;
	// create sound
	var self = this;
    this.sound = soundManager.createSound({
		id:'exilioSound_' + (self.id),
		url: self.soundURL,
		onload: function() {
			$('#'+ self.selector +' .duration').text(self.milToTime(this.duration));
		},
		onplay: function() {
		},
		onresume: function() {
		},
		onpause: function() {
		},
		onfinish: function() {
			$('#'+ self.selector +' .play').show();
			$('#'+ self.selector +' .pause').hide();
			$('#'+ self.selector +" .progress_bar span").css('width', 0 +'%');
		},
		whileplaying: function() {
			$('#'+ self.selector +' .position').text(self.milToTime(this.position));
			var percent = this.position / this.duration * 100;
			$('#'+ self.selector +" .progress_bar span").css('width', percent +'%');
		}
	});
};
VhplabPlayer.prototype.pause = function() {
	this.sound.pause();
	$('#'+ this.selector +' .play').show();
	$('#'+ this.selector +' .pause').hide();
};
VhplabPlayer.prototype.play = function() {
	this.sound.play();
	$('#'+ this.selector +' .play').hide();
	$('#'+ this.selector +' .pause').show();
};
VhplabPlayer.prototype.setVolume = function() {
	this.volume += 25;
	if (this.volume>100) this.volume = 0;
	this.sound.setVolume(this.volume);
	switch (this.volume) {
		case 0:
			$('#'+ this.selector +' .volume').css("background-position", "-111px 0");
			break;
		case 25:
			$('#'+ this.selector +' .volume').css("background-position", "-129px 0");
			break;
		case 50:
			$('#'+ this.selector +' .volume').css("background-position", "-150px 0");
			break;
		case 75:
			$('#'+ this.selector +' .volume').css("background-position", "-171px 0");
			break;
		case 100:
			$('#'+ this.selector +' .volume').css("background-position", "-193px 0");
			break;
	}
};
VhplabPlayer.prototype.milToTime = function(_mil) {
	var seconds = Math.floor((_mil / 1000) % 60);
	if (seconds<10) seconds = '0'+ seconds;
	var minutes = Math.floor((_mil / (60 * 1000)) % 60);
	if (minutes<10) minutes = '0'+ minutes;
	return minutes + ":" + seconds;
};