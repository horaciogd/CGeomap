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
VhplabInterface.prototype.addToVisibleNodes= function(_nodo, _open) {
	// console.log('/* app prototypes */ cgeomap.addToVisibleNodes();');
	this.visibleNodes = new Array();
	this.visibleNodes.push(parseInt(_nodo));
	var cookie = this.getCookie();
	// console.log('cookie: '+ cookie);
	if (cookie!='none') {
		var nodes = cookie.split(',');
		for(var i=0; i<nodes.length; i++) {
			if ((_nodo!=nodes[i])&&(!isNaN(nodes[i]))) this.visibleNodes.push(parseInt(nodes[i]));
		}
		this.setCookie({
			nodes: this.visibleNodes.toString()
		});
	}
	// console.log('show article header #article_'+ _nodo);
	// Add marker to leaflet layer
	var marker = $(this.map.markers).data('marker_'+ _nodo);
	marker.autoplay = true;
	// console.log('titre: '+ $(marker.data).data('titre'));
	this.map.mapLayer.layer.addLayer(marker.marker);
	// console.log('layer.length: '+ this.map.mapLayer.layer.getLayers().length);
	
	if ($("#article_"+ _nodo).is(":visible")==false) {
		$("#article_"+ _nodo).show("fast", function(){
			// console.log('add new class');
  			$("#article_"+ _nodo +" header h2").addClass('new');
  			if (_open) {
  				window.setTimeout(function(){
					cgeomap.toggleArticle("#article_"+ _nodo +" header", true);
				}, 1000 );
  			}
		});
	} else {
		if (_open) cgeomap.toggleArticle("#article_"+ _nodo +" header", true);
	}
};
VhplabInterface.prototype.appendNavigationList = function() {
	// console.log('/* app prototypes */ cgeomap.appendNavigationList();');
	$('#content ul').empty();
	// console.log('append html to #content ul: <code>'+ this.map.mapLayer.navigationHtml+'</code>');
	$('#content ul').append(this.map.mapLayer.navigationHtml);
	this.bindNavigationListActions();
};
VhplabInterface.prototype.bindModulesActions = function(_context) {
	/* header */
	$(_context +" .modules_list header").hover(function() {
    		$('.toggle', this).addClass('hover');
  		}, function() {
    		$('.toggle', this).removeClass('hover');
  	});
	/* audio */
  	$(_context +" .modules_list .audio").each(function(i){
		var sound = $('a', this).data("id");
		$('.content', this).empty();
		cgeomap.player.appendTo($('.content', this), sound);
	});
	/* internal link */
	$(_context +" .modules_list .link").each(function(i){
		// console.log('/* internal link in bindModulesActions */');
		$('.content li a', this).each(function(u){
			cgeomap.internalizeLink(this,(_context=='#select'));
		});
	});
	/* fancybox */
	$(_context +' .wrap_article a.fancybox').fancybox();
	/* video */
	$(_context +' .wrap_article .vimeo').each(function(i){
		$(this).empty();
		$(this).append("<iframe src='"+ $(this).attr("href") +"' width='"+ $(this).data('w') +"' height='"+ $(this).data('h') +"' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>");
	});
};
VhplabInterface.prototype.bindNavigationListActions = function() {
	// console.log('/* app prototypes */ cgeomap.bindNavigationListActions();');
	//$('#content ul li.article .wrap_article').hide();
	$('#content .listado_nodos .header .loading').hide();
	$('#content .listado_nodos').data('visible','none');
	$('#content .listado_nodos .header').data('visible', false);
	$('#content .listado_nodos .header').data('loaded', false);
	$("#content .listado_nodos .header .player").on("click touchend", function(e){
		e.preventDefault();
		var sound = $(this).parent().parent().parent().data('sound');
		cgeomap.play(sound, this);
	});
	$('footer .loading').hide();
	$("#content .listado_nodos .header").on("click touchend", function(e){
		e.preventDefault();
		if (cgeomap.dragging) return;
		if ($(".player:hover", this).length == 0) {
			cgeomap.toggleArticle(this, false);
		}
	});
	var height = $( window ).height();
	$("#content .wrapper .bottom").css("height", height*0.75 +"px");
	$("#content .wrapper .bottom").on("click touchend", function(e){
		e.preventDefault();
		if (cgeomap.dragging) return;
		var first = $("#content .listado_nodos li:first").attr("id");
		$('#content .wrapper').scrollTo('#'+ first);
	});
	// Cambiar el estado del player en las cabeceras si algun audio si esta siendo reproducido
	if (cgeomap.player.playing!='') {
		$("#content .listado_nodos .header").each(function(i){
			var sound = $(this).data('sound');
			if (cgeomap.player.playing=='enclosure_'+sound) $(".player", this).addClass('active');
		});
	}
};
VhplabInterface.prototype.bindToggleContent = function() {
	$("footer .toggle_map").on("click touchend", function(e){
		e.preventDefault();
		cgeomap.toggleContent();
	});
};
VhplabInterface.prototype.continueInitialize = function(_opts) {
	// console.log('/* app prototypes */ cgeomap.continueInitialize();');
	// Map options
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	// Load custom map prototypes
	if (typeof _opts.custom_map_prototypes != "undefined") {
		// console.log('$.getScript('+ _opts.custom_map_prototypes +');');
		$.getScript(_opts.custom_map_prototypes, function(data) {
			cgeomap.ready(_opts.map_opts);
		});
	// Use standard prototypes
	} else {
		cgeomap.ready(_opts.map_opts);
	}
  	this.toggleContentOffset = 0;
	this.initContent();
	$("footer .location_reload").on("click touchend", function(e){
		e.preventDefault();
		// console.log.log('/* app prototypes */ .location_reload.click();');
		$('footer .loading').show();
		cgeomap.map.myLocation(function(_location) {
			$('footer .loading').hide();
		});
	});
};
VhplabInterface.prototype.createNavigationElement = function(_tab, _id, _titre, _soustitre, _distance, _enclosure, _visible, _category) {
	var html = '';
	html += _tab +'<li id="article_'+ _id +'" class="article '+ _visible +' '+ _category.id +'">\n';
	typeof _enclosure != "undefined" ? html += _tab +'\t<header class="header btn" data-sound="'+_enclosure.toString()+'" data-id="'+_id+'">\n' : html += _tab +'\t<header class="header btn" data-id="'+_id+'">\n';
	html +=	_tab +'\t\t<hgroup>\n';
	var txt_dist = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	if (_distance != null) {
		_distance - _distance%1000 > 0 ? txt_dist = parseInt((_distance - _distance%1000)/1000) + ' km' : txt_dist = parseInt(_distance) + ' m';
	}
	html +=	_tab +'\t\t\t<span class="loading"></span>\n';
	var txt_enclosure = '';
	if (typeof _enclosure != "undefined") txt_enclosure += '<span class="player_icon"></span><span class="player btn" ></span>';
	html +=	_tab +'\t\t\t<h2 class="empty">'+ _titre +'</h2><div class="info">'+ txt_enclosure +'<span class="distance">'+ txt_dist +'</span></div>\n';
	html +=	_tab +'\t\t</hgroup>\n';
	html += _tab +'\t</header>\n';
	html += _tab +'\t<div class="wrap_article">\n';
	html += _tab +'\t</div><!-- wrap_article -->\n';
	html += _tab +'</li>\n';
	return html;
};
VhplabInterface.prototype.createNavigationList = function(_append) {
	// console.log('/* app prototypes */ cgeomap.createNavigationList();');
	var html = '\n';
	for (var i=0; i<this.map.mapLayer.markerList.length; i++) {
		var marker = $(this.map.markers).data('marker_'+ this.map.mapLayer.markerList[i]);
		var visible = 'default';
		if (($(marker.data).data('visibility')=='qr')||($(marker.data).data('visibility')=='proximity')) {
			//if ($.inArray(parseInt(marker.id), this.visibleNodes) != -1) {  
			if (this.visibleNodes.indexOf(parseInt(marker.id)) != -1) {  
				visible = 'found';
			} else {
				visible = 'hidden';
				//this.map.map.removeLayer(marker.marker);
				// Markers are in mapLayer now
				// console.log('marker '+ marker.id +' is hidden');
				this.map.mapLayer.layer.removeLayer(marker.marker);
			}
		}
		// console.log('marker '+ marker.id +' - '+ marker.distance);
		html +=	this.createNavigationElement('\t\t\t\t',  marker.id, $(marker.data).data('titre'), $(marker.data).data('soustitre'), marker.distance, $(marker.data).data('enclosure'), visible, $(_marker.data).data('category'));
	}
	// console.log('html:'+ html);
	this.map.mapLayer.resetNavigationHtml(html);
	if (_append) this.appendNavigationList();
};
VhplabInterface.prototype.getCookie = function(_opts) {
	var name = "nodes=";
    // var ca = document.cookie.split(';');
    var cookie = window.localStorage.getItem("cookie");
    // alert('getCookie: '+ cookie);
    if(cookie!=null) {
		var ca = cookie.split(';');
		for(var i=0; i<ca.length; i++) {
        	var c = ca[i];
        	while (c.charAt(0)==' ') c = c.substring(1);
        	if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    	}
    }
    return "";
};
VhplabInterface.prototype.initialize = function(_opts) {
	// console.log('/* app prototypes */ cgeomap.initialize();');
	// Store url
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	if (this.url_site.slice(-1)!="/") this.url_site += "/";
	if (typeof _opts.url_submap != "undefined") this.url_submap = _opts.url_submap;
	// preferences
	if (typeof _opts.proximity_distance != "undefined") this.proximity_distance = _opts.proximity_distance;
	if (typeof _opts.autoplay_distance != "undefined") this.autoplay_distance = _opts.autoplay_distance;
	// Store width
	this.windowWidth = parseInt($(window).width());
	// Check author
	// console.log('auteur: '+ _opts.map_opts.auteur);
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
  	// Create Transparent Player
  	this.player = new VhplabTransparentPlayer();
	this.player.addTrack({
		"id": "click",
		"url": "libs/cgeomap/silencio.mp3",
		"type": "audio/mpeg"
	});
	this.player.addTrack({
		"id": "proximity",
		"url": "libs/cgeomap/nueva_entrada.mp3",
		"type": "audio/mpeg"
	});
	soundManager.load('enclosure_click');
	soundManager.load('enclosure_proximity');
	/* old select file */
	// console.log('$("#select").load('+ this.url_site +'spip.php?page=ajax-select);');
	var width = parseInt(cgeomap.windowWidth-54);
	if (width>=900) width = 900;
	/* old ajax-article file */
	// get URL via log
	// console.log('$("#select").load('+ this.url_site+'spip.php?page=ajax-article&id_article=1' +'&width='+ width +'&link=false);');
	if (typeof _opts.initial_article != "undefined") this.initial_article = _opts.initial_article;
	$('#select').empty();
	
	var parametros = cgeomap.parseURL();
	if ((typeof parametros != "undefined")&&(typeof parametros.nodo != "undefined")) _opts.map_opts.open = parametros.nodo;
	
	if (typeof _opts.map_opts.open != "undefined") {
		/*
		$("#select").append('<div class="wrapper"><h1 class="center">Nueva entrada encontrada!</h1></div>');
		$('#select').append('<div class="welcome"><span class="btn go">go</span></div>');
		$("#select").slideDown('fast', function(){
			$("#select .welcome .btn").click(function(){
				soundManager.stopAll();
				soundManager.play('enclosure_click');
				$("#select").fadeOut('fast', function(){
					$("#select").remove();
					cgeomap.continueInitialize(_opts);
				});
			});
		});
		*/
		$("#select").load(this.url_site +'spip.php?page=ajax-found', function() {
			$("#select").slideDown('fast', function(){
				$("#select .welcome .btn").on("click touchend", function(e){
					e.preventDefault();
					cgeomap.wellcomeClick(_opts);
				});
			});
		});
	} else {
		/* get article data from regular json-vhplab-geo-article */
		var url = this.url_site +'spip.php?page=json-vhplab-geo-article&id_article=';
		(typeof _opts.initial_article != "undefined") ? url += _opts.initial_article : url += '1';
		url += '&width='+ width +'&link=false';
		// get URL via log
		// console.log('url json: '+ url);
		// console.log(' ');
		$.getJSON(url, function(data) {
			$.each(data[0].marker, function(i, marker){
				$("#select").append('<div class="wrapper"></div>');
				$("#select .wrapper").append(marker.texte);
				cgeomap.bindModulesActions('#select');
				$.each(marker.enclosure, function(u, enclosure) {
					cgeomap.player.addTrack(enclosure);
				});
				$('#select').append('<div class="welcome"><span class="btn go">'+_T.go+'</span></div>');
				$("#select").slideDown('fast', function(){
					$("#select .welcome .btn").on("click touchend", function(e){
						e.preventDefault();
						cgeomap.wellcomeClick(_opts);
					});
				});
			});
		});
	}
	$("body").on("touchmove", function(){
		cgeomap.dragging = true;
	});
	$("body").on("touchstart", function(){
		cgeomap.dragging = false;
	});
};
VhplabInterface.prototype.initContent = function() {
	var position = $("#content").position();
	this.toggleContentDist = $("#content").width() + position.left + this.toggleContentOffset;
	$('#content').css({ left: "-=" + this.toggleContentDist });
	$("#content").data('visible', false);
};
VhplabInterface.prototype.orientationchange = function() {
	
	//cgeomap.addToVisibleNodes(data[1], true);
	/*
	if (window.orientation<90) {
		//$('#loading').fadeOut("fast");
		//alert('orientationchange <90');
		//alert(typeof $('#navigation').data('result') +' '+ $('#navigation').data('result'));
		if ((typeof $('#navigation').data('result')!="undefined")&&($('#navigation').data('result')!='')) {
			cgeomap.addToVisibleNodes($('#navigation').data('result'), true);
			//$('#loading').delay(600).fadeOut("slow");
			//window.removeEventListener("orientationchange");
			$('#navigation').data('result','');
			$('section').show();
			$('footer').show();
			$('nav').show();
		} else {
			$('section').show();
			$('footer').show();
			$('nav').show();
		}
	}
	*/
};
VhplabInterface.prototype.play = function(_sound, _button) {
	// console.log('/* app prototypes */ cgeomap.play(_sound, _button);');
	// console.log(JSON.stringify(_sound));
	if (typeof _sound == "number") {
		this.player.toggle(_sound, _button);
	} else if (typeof _sound == "string"){
		// console.log('sound is a string');
		var list = _sound.split(",");
		this.player.toggleList(list, _button);
	}
};
VhplabInterface.prototype.reload = function() {
	$('footer .loading').show();
	navigator.geolocation.clearWatch(cgeomap.map.locationWatch);
	// console.log('/* app prototypes */ cgeomap.reload();');
	this.map.reloadMarkers(function() {
		/* This is to restart visibility */
		cgeomap.setCookie({
			nodes: 'none'
		});
		this.visibleNodes = new Array();
		cgeomap.createNavigationList(true);
		// First geolocation to short markers
		cgeomap.map.firstGetCurrentPosition();
		// contineous geolocation to follow user
		cgeomap.map.contineousGetCurrentPosition();
		$('footer .loading').hide();
	});
};
VhplabInterface.prototype.scannQr = function() {
	var initialHref = window.location.href;
	var n = initialHref.lastIndexOf("/");
	var newUrl = initialHref.slice(0, n) + "/load.html";
	cordova.plugins.barcodeScanner.scan(function (result) {
		var str = result.text.split('spip.php?author=');
		if (str.length==2) {
			var data = str[1].split('&nodo=');
			// alert('1 URL: '+ result.text +', data length: '+ data.length);
			if (data.length==2) {
				cgeomap.setLoad({
					load: data[1]
				});
				window.location = newUrl;
				// cgeomap.addToVisibleNodes(data[1], true);
				/*
				if ( cgeomap.auteur == data[0]) {
					$('#navigation').data('result', data[1]);
					// add to visible nodes when orientation change!
					cgeomap.addToVisibleNodes(data[1], true);
				} else {
					// alert('Este QR corresponde a otra ruta! cgeomap.auteur: '+ cgeomap.auteur +'data[0]: '+  data[0]);
					$('section').show();
					$('footer').show();
					$('nav').show();			
				}
				*/
			} else {
				// alert('2 URL: '+ result.text +', data length: '+ data.length);
				cgeomap.setLoad({
					load: 'none'
				});	
				window.location = newUrl;
			}
		} else {
			// alert('3 URL: '+ result.text +', str length: '+ str.length);
			cgeomap.setLoad({
				load: 'none'
			});
			window.location = newUrl;
		}
	}, function (error) {
		cgeomap.setLoad({
			load: 'none'
		});
		window.location = newUrl;
	}, {
          preferFrontCamera : false, // iOS and Android
          showTorchButton : true, // iOS and Android
          resultDisplayDuration: 1500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
    });
	/*var site = $('#app').empty();
	var url = this.url_site +'spip.php?page=ajax-app';
	$("#app").load(url, function() {
		alert('testing deep clone 4');
		$('section').fadeIn('slow');
		$('footer').fadeIn('slow');
		$('nav').fadeIn('slow');
	});
	*/
};
VhplabInterface.prototype.setCookie = function(_opts) {
	var d = new Date();
	var days = 2;
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires="+d.toUTCString();	
    window.localStorage.setItem("cookie", "nodes="+ _opts.nodes +"; " + expires);
};
VhplabInterface.prototype.setLoad = function(_opts) {
	var d = new Date();
    d.setTime(d.getTime() + 5000);
    var expires = "expires="+d.toUTCString();	
    window.localStorage.setItem("load", "load="+ _opts.load +"; " + expires);
};
VhplabInterface.prototype.sortNavigationList = function(_callback) {
	// console.log('/* app prototypes */ cgeomap.sortNavigationList();');
	// console.log('markerList: '+ this.map.mapLayer.markerList.toString());
	this.state = 'detaching';
	cgeomap.detachOne(_callback);
	/*
	var list = new Array();
	for (var i=0; i<this.map.mapLayer.markerList.length; i++) {
		// console.log(i +" $('#article_"+ this.map.mapLayer.markerList[i] +").detach();");
		if ($('#article_'+ this.map.mapLayer.markerList[i] +' .header h2').hasClass('new')) {
			$('#article_'+ this.map.mapLayer.markerList[i] +' .header h2').removeClass('new');
			$('#article_'+ this.map.mapLayer.markerList[i] +' .header h2').addClass('empty');
			// console.log('Avoiding new class to restar css animation');
		}	
		list.push($('#article_'+ this.map.mapLayer.markerList[i]).detach());
		if (i == this.map.mapLayer.markerList.length - 1) {
			// console.log(i +" = "+ (this.map.mapLayer.markerList.length -1) +" $('#content ul').empty();");
			$('#listado_nodos').empty();
			for (var u=0; u<list.length; u++) {
				list[u].appendTo('#listado_nodos');
				// console.log("list["+ u +"].appendTo('#content ul');");
				list[u] = null;
				if (u == list.length - 1) {
					// console.log(u +" = "+ (list.length - 1) +" detach loop finished");
					this.state = '';
					$('#block').hide();
				}
			}
		}
	}
	*/
	// var li = $('#article_'+ this.map.mapLayer.markerList[i]).detach();
};
VhplabInterface.prototype.detachOne = function(_callback) {
	$("#content .listado_nodos .article").each(function(i){
		var entryId = $(this).attr('id');
		var id = cgeomap.map.mapLayer.markerList[i];
		if (entryId != 'article_'+ id) {
			if ($('#article_'+ id +' .header h2').hasClass('new')) {
				$('#article_'+ id +' .header h2').removeClass('new');
				$('#article_'+ id +' .header h2').addClass('empty');
				// console.log('Avoiding new class to restar css animation');
			}
			var li = $('#article_'+ id).detach();
			$(li).insertBefore(this);
			li = null;
			// console.log("No detach loop, only #article_"+ id +" was reordered");
			// console.log("i: "+ i +" length: "+ cgeomap.map.mapLayer.markerList.length);
			cgeomap.detachOne(_callback);
			return false;
		} else if (i == cgeomap.map.mapLayer.markerList.length - 1) {
			// console.log("everything is in order");
			cgeomap.state = '';
			cgeomap.navigationListOrder = '';
			$('#block').hide();
			if (_callback) _callback();
			return true;
		}
	});
};
VhplabInterface.prototype.toggleArticle = function(_me, _autoplay) {
	// console.log('/* app prototypes */ cgeomap.toggleArticle();');
	// Don't act if detaching
	// console.log('state: ' + this.state + ' - navigationListActive: ' + this.navigationListActive);
	if ((this.state == '')&&(!this.navigationListActive)) {
		this.state = 'toggleArticle';
		this.navigationListActive = true;
		var visible = $(_me).parent().parent().data('visible');
		var id = $(_me).data('id');
		// Hide if article is vissible
		if (visible==id) {
			// console.log('Hide');
			if (_autoplay) {
				// Autoplay audio and remove autoplay
				cgeomap.autoplaySound(id, $(this.map.markers).data('marker_'+ id));
			} else {
				// console.log('Hide article '+ id);
				$('#article_'+ id +' .wrap_article').hide('fast', function(){
					cgeomap.navigationListActive = false;
					cgeomap.state = '';
				});
				$(_me).removeClass('open');
				$(_me).parent().parent().data('visible', 'none');
				var marker = $(cgeomap.map.markers).data('marker_'+id);
				marker.closeInfoWindow();
			}
		// Show if article is hidden
		} else {
			// console.log('Show');
			if (visible!='none') {
				$('#article_'+ visible +' .wrap_article').hide();
				$('header', '#article_'+ visible).removeClass('open');
			}
			var loaded = $(_me).data('loaded');
			var marker = $(this.map.markers).data('marker_'+ id);
			// console.log('marker_'+ id +' loaded: '+ loaded);
			// Load if article has not been loaded
			if (!loaded) {
				// console.log('Toggle Article needs to load article '+ id);
				$('#article_'+ id +' .header h2').removeClass('new');
				$('#article_'+ id +' .header h2').addClass('blink');
				$('#article_'+ id +' .header .loading').show();
				$('footer .loading').show();
				marker.getData(function(){
					marker.appendContent();
					marker.bindContentActions();
					marker.openInfoWindow();
					// Autoplay audio and remove autoplay
					cgeomap.autoplaySound(id, marker);
					// Remove loading feedback
					$('#article_'+ id +' .header h2').removeClass('blink');
					$('#article_'+ id +' .header .loading').hide();
					$('footer .loading').hide();
				});
			} else {
				// console.log('The article '+ id +' was already loadded');
				marker.showArticleHeaderActions();
				marker.openInfoWindow();
				// Autoplay audio and remove autoplay
				cgeomap.autoplaySound(id, marker);
			}
		}
	}
};
VhplabInterface.prototype.toggleContent = function() {
	var visible = $("#content").data('visible');
	var self = this;
	if (visible) {
		$('#content').animate({
			left: "-=" + this.toggleContentDist,
		}, "swing", function() {
			$('.cgeomap .leaflet-popup-content-wrapper .toggle_content').addClass('closed');
			$('footer .toggle_map').addClass('toggle_list');
			$('footer .toggle_map').removeClass('toggle_map');
			$('footer .location_reload').addClass('location_button');
			$('footer .location_reload').removeClass('location_reload');
		});
		$("#content").data('visible', false);
	} else {
		$('#content').animate({
			left: "+=" + this.toggleContentDist,
		}, "swing", function() {
			$('.cgeomap .leaflet-popup-content-wrapper .toggle_content').removeClass('closed');
			$('footer .toggle_list').addClass('toggle_map');
			$('footer .toggle_list').removeClass('toggle_list');
			$('footer .location_button').addClass('location_reload');
			$('footer .location_button').removeClass('location_button');
		});
		$("#content").data('visible', true);
	}
};
VhplabInterface.prototype.autoplaySound = function(_id, _marker) {
	var sound = $('#article_'+ _id +' header').data('sound');
	if ((typeof sound!="undefined")&&(_marker.autoplay)) {
		if (typeof sound=="number") {
			// console.log('autoplay sound '+ sound);
			cgeomap.play(sound, $('#article_'+ sound +' .player'));
		} else {
			var a = sound.split(',');
			// console.log('autoplay sound '+ a[0]);
			cgeomap.play(parseInt(a[0]), $('#article_'+ a[0] +' .player'));
		}
	}
	_marker.autoplay = false;
};
VhplabInterface.prototype.internalizeLink = function(_this, _avoid){
	// console.log('/* app prototypes */ cgeomap.internalizeLink();');
	if (_avoid) {
		/* hide links in #select article */
		$(_this).on("click touchend", function(e){
			return false;
			e.preventDefault();
		});
		 $(_this).parent().parent().parent().parent().hide();
	} else {
		var url = $(_this).attr('href');
		// console.log('url: ' + url);
		var ref_url = cgeomap.url_site;
		// console.log('ref_url: ' + ref_url);
		if ((typeof cgeomap.url_submap != "undefined")&&(cgeomap.url_submap != '')) ref_url = cgeomap.url_submap;
		// console.log('ref_url: ' + ref_url);
		var base = url.substr(0, ref_url.length);
		// console.log('base: ' + base);
		if (base==ref_url) {
			var author = '';
			var nodo = '';
			var data = url.slice(ref_url.length);
			// console.log('data: ' + data);
			var clean_data = data.split('?');
			// console.log('clean_data[0]: ' + clean_data[0]);
			// console.log('clean_data[1]: ' + clean_data[1]);
			var submap = $("#navigation .preview").data('submap');
			// console.log('submap:' + submap);
			if ((this.map.submap!='')&&(clean_data[0]!='')&&(clean_data[0]!=this.map.submap+'/')) {
				// console.log('LINK TO OTHER MAP');
				$(_this).parent().attr('class', 'submap');
				$(_this).attr("target", "_self");
			} else if (clean_data.length>=2) {
				// console.log('LINK TO THIS MAP');
				// console.log('/* HAS DATA */');
				var parameters = clean_data[1].split('&');
				// console.log('parameters: ' + parameters);
				for (var i = 0; i < parameters.length; i++) {
					var p = parameters[i].split('=');
					if (p[0]=='author') author = p[1];
					if (p[0]=='nodo') nodo = p[1];
				}
				// console.log('author: ' + author);
				// console.log('nodo: ' + nodo);
				$(_this).parent().attr('class', 'internal');
				$(_this).attr('target','_self');
				$(_this).on("click touchend", function(e){
					// console.log('click - '+ nodo);
					e.preventDefault();
					var marker = $(cgeomap.map.markers).data('marker_'+ nodo);
					if (typeof marker != "undefined") {
						if ($("#article_"+ nodo).is(":visible")==false) {
							$("#article_"+ nodo).show("fast", function(){
								// console.log('add new class');
  								$("#article_"+ nodo +" header h2").addClass('new');
  								window.setTimeout(function(){
  									cgeomap.toggleArticle("#article_"+ nodo +" header", true);
  								}, 1000 );
							});
						} else {
							cgeomap.toggleArticle("#article_"+ nodo +" header", true);
						}
						return false;
					} else {
						// console.log('undefined marker');
						return true;
					}
				});
			}
			
			if (typeof submap != "undefined") {
				var submap_data = submap.slice(cgeomap.url_site.length);
				if (submap_data.slice(-1)!="/") submap_data += "/";
				// console.log('submap_data: ' + submap_data);
				if (clean_data[0]!=submap_data) {
					// console.log('/* TRUE - submap link */');
					$(_this).parent().attr('class', 'submap');
				} else {
					// console.log('/* TRUE - internal link */');
					$(_this).parent().attr('class', 'internal');
				}
			}
		} else {
			// console.log('$(_this).fancybox()');
			if (url.indexOf("#cgeomapiframe")>=0) {
				var new_url = url.substring(0, url.length - 14);
				// console.log('new_url: '+ new_url);
				$(_this).fancybox({
					beforeLoad: function () {
						this.href = new_url;
	    			},
					'width'				: '100%',
					'height'			: '100%',
	        		'arrows'     		: false,
	        		'autoScale'     	: false,
	        		'transitionIn'		: 'none',
					'transitionOut'		: 'none',
					'type'				: 'iframe'
				});
				$(_this).parent().attr('class', 'iframe');
			} else {
				$(_this).parent().attr('class', 'external');
				$(_this).attr("target", "_blank");
			}
		}
	}
};
VhplabInterface.prototype.wellcomeClick = function(_opts) {
	soundManager.stopAll();
	soundManager.play('enclosure_click',{
		onfinish:function() {
			$("#select").remove();
			cgeomap.continueInitialize(_opts);
		}
	});
	$("#select").animate({ opacity: 0.0 }, 'fast');
};
		
//***********
// Vhplab Transparent Player
//***********	
function VhplabTransparentPlayer() {
	var self = this;
	this.volume = 50;
	this.trackIdList = new Array();
	this.playing = '';
	this.queue = false;
};
VhplabTransparentPlayer.prototype.addTrack = function(_enclosure) {
	//alert(enclosure.id+' '+enclosure.url);
	this.trackIdList.push(_enclosure.id);
	var self = this;
	soundManager.createSound({
		id: 'enclosure_' + _enclosure.id,
		url: _enclosure.url,
		onload: function() {
			var sound = self.playing.split('_');
      		$('#vhplab_player_'+ sound[1] +' .duration').text(self.milToTime(this.duration));
 		},
		onplay: function() {
		},
		onresume: function() {
		},
		onpause: function() {
		},
		onfinish: function() {
			var sound = self.playing.split('_');
      		$('#vhplab_player_'+ sound[1] +' .play').show();
      		$('#vhplab_player_'+ sound[1] +' .pause').hide();
      		$('#vhplab_player_'+ sound[1] +' .progress_bar span').css('width', 0 +'%');
      		self.shiftQueue();
		},
		whileplaying: function() {
			var sound = self.playing.split('_');
			$('#vhplab_player_'+ sound[1] +' .position').text(self.milToTime(this.position));
       		var percent = this.position / this.duration * 100;
			$('#vhplab_player_'+ sound[1] +' .progress_bar span').css('width', percent +'%');
			$('#vhplab_player_'+ sound[1] +' .duration').text(self.milToTime(this.duration));
		}
	});	
};
VhplabTransparentPlayer.prototype.appendTo = function(_container, _sound) {
	$(_container).append('<div class="vhplab_player" id="vhplab_player_'+ _sound +'"></div>');
	$('.vhplab_player', _container).append('<ul></ul>');
	$('.vhplab_player ul', _container).append('<li class="play" ></li>');
	$('.vhplab_player ul', _container).append('<li class="pause" ></li>');
	$('.vhplab_player ul', _container).append('<li class="position" >00:00</li>');
	$('.vhplab_player ul', _container).append('<li class="duration" >00:00</li>');
	$('.vhplab_player ul', _container).append('<li class="progress_bar" ><span></span></li>');
    this.bindActions(_container, _sound);
};
VhplabTransparentPlayer.prototype.bindActions = function(_container, _sound) {
	var self = this;
    $('.vhplab_player ul .play', _container).on("click touchend", function(e){
		e.preventDefault();
		var article = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
		self.toggle(_sound, $('.player', article));
    });
    $('.vhplab_player ul .pause', _container).on("click touchend", function(e){
		e.preventDefault();
		var article = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
		self.toggle(_sound, $('.player', article));
    });
    $('.vhplab_player ul .progress_bar', _container).on("click touchend", function(e){
		e.preventDefault();
 		var w = $(this).width();
		var x = e.clientX - $(this).offset().left;
		self.moveTo(x, w);
	});
 	$('.vhplab_player ul .pause', _container).hide();
};
VhplabTransparentPlayer.prototype.moveTo = function(_x, _w) {
	var soundObj = soundManager.getSoundById(this.playing);
	if (soundObj.playState) soundObj.setPosition(_x*soundObj.duration/_w);
};
VhplabTransparentPlayer.prototype.milToTime = function(_mil) {
	var seconds = Math.floor((_mil / 1000) % 60);
	if (seconds<10) seconds = '0'+ seconds;
	var minutes = Math.floor((_mil / (60 * 1000)) % 60);
	if (minutes<10) minutes = '0'+ minutes;
	return minutes + ":" + seconds;
};
VhplabTransparentPlayer.prototype.play = function(_sound) {
	$('#vhplab_player_'+ _sound +' .play').hide();
	$('#vhplab_player_'+ _sound +' .pause').show();
	$('.cgeomap .leaflet-popup-content-wrapper .player').addClass('active');
	soundManager.stopAll();
	soundManager.play('enclosure_' + _sound);
	this.playing = 'enclosure_' + _sound;
};
VhplabTransparentPlayer.prototype.shiftQueue = function() {
	if (this.queue) {
		var sound = this.queue.shift();
		this.play(sound);
		if (this.queue.length==0) {
			this.queue = false;
		}
	} else {
		$("#content ul li.article header .player").each(function(){
			$(this).removeClass('active');
		});
		$('.cgeomap .leaflet-popup-content-wrapper .player').removeClass('active');
		this.playing = '';
	}
};
VhplabTransparentPlayer.prototype.stop = function() {
	var sound = this.playing.split('_');
	$('#vhplab_player_'+ sound[1] +' .play').show();
	$('#vhplab_player_'+ sound[1] +' .pause').hide();
	$('.cgeomap .leaflet-popup-content-wrapper .player').removeClass('active');
	$('#vhplab_player_'+ sound[1] +' .progress_bar span').css('width', 0 +'%');
	soundManager.stopAll();
	this.playing = '';
};
VhplabTransparentPlayer.prototype.toggle = function(_sound, _button) {
	if (this.playing=='') {
		$(_button).addClass('active');
		this.play(_sound);
	} else if (this.playing=='enclosure_'+_sound) {
		$(_button).removeClass('active');
		this.stop();
		this.queue = false;
	} else {
		$("#content ul li.article .header .player").each(function(){
			$(this).removeClass('active');
		});
		$(_button).addClass('active');
		$('.cgeomap .leaflet-popup-content-wrapper .player').addClass('active');
		var oldSound = this.playing.split('_');
		$('#vhplab_player_'+ oldSound[1] +' .play').show();
		$('#vhplab_player_'+ oldSound[1] +' .pause').hide();
		$('#vhplab_player_'+ oldSound[1] +' .progress_bar span').css('width', 0 +'%');
		this.play(_sound);
	}
};
VhplabTransparentPlayer.prototype.toggleList = function(_list, _button) {
	// console.log('/* app prototypes */ cgeomap.player.play(_list, _button);');
	// console.log(JSON.stringify(_list));
	if (this.playing=='') {
		$(_button).addClass('active');
		$('.cgeomap .leaflet-popup-content-wrapper .player').addClass('active');
		var sound = _list.shift();
		this.play(sound);
		this.queue = _list;
	} else {
		var isPlaying = false;
		for (var i = 0; i<_list.length; i++) { 
			if (this.playing=='enclosure_'+_list[i]) isPlaying=true;
		}
		if (isPlaying) {
			$(_button).removeClass('active');
			$('.cgeomap .leaflet-popup-content-wrapper .player').removeClass('active');
			this.stop();
			this.queue = false;
		}  else {
			$("#content ul li.article header .player").each(function(){
				$(this).removeClass('active');
			});
			$(_button).addClass('active');
			$('.cgeomap .leaflet-popup-content-wrapper .player').addClass('active');
			var oldSound = this.playing.split('_');
			$('#vhplab_player_'+ oldSound[1] +' .play').show();
			$('#vhplab_player_'+ oldSound[1] +' .pause').hide();
			$('#vhplab_player_'+ oldSound[1] +' .progress_bar span').css('width', 0 +'%');
			var sound = _list.shift();
			this.play(sound);
			this.queue = _list;
		}
	}
};

/* scrollTo */
$.fn.scrollTo = function( target, options, callback ){
	if (typeof options == 'function' && arguments.length == 2) { callback = options; options = target; }
	var settings = $.extend({
		scrollTarget  : target,
		offsetTop     : 50,
		duration      : 500,
		easing        : 'swing'
	}, options);
	return this.each(function(){
		var scrollPane = $(this);
		var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
		var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
		scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
			if (typeof callback == 'function') { callback.call(this); }
		});
	});
};