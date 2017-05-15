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
	// remoteLog('/* app prototypes */ cgeomap.addToVisibleNodes();');
	this.visibleNodes = new Array();
	this.visibleNodes.push(parseInt(_nodo));
	var cookie = this.getCookie();
	// remoteLog('cookie: '+ cookie);
	if (cookie!='none') {
		var nodes = cookie.split(',');
		for(var i=0; i<nodes.length; i++) {
			if ((_nodo!=nodes[i])&&(!isNaN(nodes[i]))) this.visibleNodes.push(parseInt(nodes[i]));
		}
		this.setCookie({
			nodes: this.visibleNodes.toString()
		});
	}
	// remoteLog('show article header #article_'+ _nodo);
	// Add marker to leaflet layer
	var marker = $(this.map.markers).data('marker_'+ _nodo);
	// remoteLog('titre: '+ $(marker.data).data('titre'));
	this.map.mapLayer.layer.addLayer(marker.marker);
	// remoteLog('layer.length: '+ this.map.mapLayer.layer.getLayers().length);
	
	if ($("#article_"+ _nodo).is(":visible")==false) {
		$("#article_"+ _nodo).show("fast", function(){
			// remoteLog('add new class');
  			$("#article_"+ _nodo +" header h2").addClass('new');
  			if (_open) $("#article_"+ _nodo +" header").trigger( "click" );
		});
	}
  	/*
	var sound = $('#article_'+ _nodo +' header').data('sound');
	if (typeof sound!="undefined") cgeomap.play(sound, $('#article_'+ _nodo +' .player'));
	*/
};
VhplabInterface.prototype.appendNavigationList = function() {
	// remoteLog('/* app prototypes */ cgeomap.appendNavigationList();');
	$('#content ul').empty();
	// remoteLog('append html to #content ul: <code>'+ this.map.mapLayer.navigationHtml+'</code>');
	$('#content ul').append(this.map.mapLayer.navigationHtml);
	this.bindNavigationListActions();
};
VhplabInterface.prototype.bindModulesActions = function(_context) {
	$(_context +" .modules_list header").hover(function() {
    		$('.toggle', this).addClass('hover');
  		}, function() {
    		$('.toggle', this).removeClass('hover');
  	});
  	$(_context +" .modules_list .audio").each(function(i){
		var sound = $('a', this).data("id");
		$('.content', this).empty();
		cgeomap.player.appendTo($('.content', this), sound);
	});
	$(_context +" .modules_list .link").each(function(i){
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
						$("#article_"+ nodo +" .header").trigger('click');
						return false;
					} else {
						return true;
					}
				});
			}
		});
	});	
};
VhplabInterface.prototype.bindNavigationListActions = function() {
	// remoteLog('/* app prototypes */ cgeomap.bindNavigationListActions();');
	//$('#content ul li.article .wrap_article').hide();
	$('#content .listado_nodos .header .loading').hide();
	$('#content .listado_nodos').data('visible','none');
	$('#content .listado_nodos .header').data('visible', false);
	$('#content .listado_nodos .header').data('loaded', false);
	$("#content .listado_nodos .header .player").click(function(){
		var sound = $(this).parent().parent().parent().data('sound');
		cgeomap.play(sound, this);
	});
	$('footer .loading').hide();
	$("#content .listado_nodos .header").click(function(e){
		if ($(".player:hover", this).length == 0) {
			cgeomap.toggleArticle(this, false);
		}
	});
	var height = $( window ).height();
	$("#content .wrapper .bottom").css("height", height*0.75 +"px");
	$("#content .wrapper .bottom").click(function(e){
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
	var self = this;
	$("footer .toggle_map").click(function(){
		self.toggleContent();
	});
};
VhplabInterface.prototype.continueInitialize = function(_opts) {
	// remoteLog('/* app prototypes */ cgeomap.continueInitialize();');
	// Map options
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	// Load custom map prototypes
	if (typeof _opts.custom_map_prototypes != "undefined") {
		// remoteLog('$.getScript('+ _opts.custom_map_prototypes +');');
		$.getScript(_opts.custom_map_prototypes, function(data) {
			cgeomap.ready(_opts.map_opts);
		});
	// Use standard prototypes
	} else {
		cgeomap.ready(_opts.map_opts);
	}
  	this.toggleContentOffset = 0;
	this.initContent();
	$("footer .location_reload").click(function(){
		// remoteLog.log('/* app prototypes */ .location_reload.click();');
		$('footer .loading').show();
		cgeomap.map.myLocation(function(_location) {
			cgeomap.map.map.setZoom(17);
			$('footer .loading').hide();
		});
	});
};
VhplabInterface.prototype.createNavigationElement = function(_tab, _id, _titre, _soustitre, _distance, _enclosure, _visible) {
	var html = '';
	html += _tab +'<li id="article_'+ _id +'" class="article '+ _visible +'">\n';
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
	// remoteLog('/* app prototypes */ cgeomap.createNavigationList();');
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
				// remoteLog('marker '+ marker.id +' is hidden');
				this.map.mapLayer.layer.removeLayer(marker.marker);
			}
		}
		// remoteLog('marker '+ marker.id +' - '+ marker.distance);
		html +=	this.createNavigationElement('\t\t\t\t',  marker.id, $(marker.data).data('titre'), $(marker.data).data('soustitre'), marker.distance, $(marker.data).data('enclosure'), visible);
	}
	// remoteLog('html:'+ html);
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
	// remoteLog('/* app prototypes */ cgeomap.initialize();');
	// Store url
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	if (this.url_site.slice(-1)!="/") this.url_site += "/";
	// Store width
	this.windowWidth = parseInt($(window).width());
	// Check author
	// remoteLog('auteur: '+ _opts.map_opts.auteur);
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
		"url": this.url_site +"/squelettes/silencio.mp3",
		"length": "44981",
		"type": "audio/mpeg"
	});	
	soundManager.load('enclosure_click');
	/* old select file */
	// remoteLog('$("#select").load('+ this.url_site +'spip.php?page=ajax-select);');
	var width = parseInt(cgeomap.windowWidth-54);
	if (width>=900) width = 900;
	/* old ajax-article file */
	// get URL via log
	// remoteLog('$("#select").load('+ this.url_site+'spip.php?page=ajax-article&id_article=1' +'&width='+ width +'&link=false);');
	$('#select').empty();
	/* get article data from regular json-vhplab-geo-article */
	var url = this.url_site +'spip.php?page=json-vhplab-geo-article&id_article=1&width='+ width +'&link=false';
	// get URL via log
	// remoteLog('url json: '+ url);
	// remoteLog(' ');
	$.getJSON(url, function(data) {
		$.each(data[0].marker, function(i, marker){
			$("#select").append('<div class="wrapper"></div>');
			$("#select .wrapper").append(marker.texte);
			cgeomap.bindModulesActions('#select');
			$.each(marker.enclosure, function(u, enclosure) {
				cgeomap.player.addTrack(enclosure);
			});
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
		});
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
	if (typeof _sound == "number") {
		this.player.toggle(_sound, _button);
	} else if (typeof _sound == "string"){
		var list = sound.split(",");
		this.player.toggleList(_sound, _button);
	}
};
VhplabInterface.prototype.reload = function() {
	$('footer .loading').show();
	navigator.geolocation.clearWatch(cgeomap.map.locationWatch);
	// remoteLogRestart();
	// remoteLog('/* app prototypes */ cgeomap.reload();');
	this.map.reloadMarkers(function() {
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
	cordova.plugins.barcodeScanner.scan(function (result) {
		// remoteLog('/* app prototypes */ cordova.plugins.barcodeScanner.scan();');
	
		var str = result.text.split('spip.php?author=');
		if (str.length==2) {
			var data = str[1].split('&nodo=');
			if (data.length==2) {
				
				// remoteLog('result: '+ data[0] +' '+ data[1]);
				$('section').show();
				$('footer').show();
				$('nav').show();	
						
				/* ojo se esta añadiendo sin revisar */
				cgeomap.addToVisibleNodes(data[1], true);
					
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
				// alert('URL: '+ result.text +', data length: '+ data.length);
				$('section').show();
				$('footer').show();
				$('nav').show();			
			}
		} else {
			// alert('URL: '+ result.text +', str length: '+ str.length);
			$('section').show();
			$('footer').show();
			$('nav').show();
		}
	}, function (error) {
		// alert("Scanning failed: " + error);
		$('section').show();
		$('footer').show();
		$('nav').show();
	});
};
VhplabInterface.prototype.setCookie = function(_opts) {
	var d = new Date();
	var days = 2;
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires="+d.toUTCString();	
    window.localStorage.setItem("cookie", "nodes="+ _opts.nodes +"; " + expires);
};
VhplabInterface.prototype.setVisibleNodes= function() {
	// remoteLog('/* app prototypes */ cgeomap.setVisibleNodes();');
	var found = '';
	this.visibleNodes = new Array();
	if (this.map.open) {
		// remoteLog('found: '+ this.map.open);
		found = this.map.open;
		this.visibleNodes.push(parseInt(found));
	}
	var cookie = this.getCookie();
	var nodes = cookie.split(',');
	// remoteLog('nodes: '+ nodes.toString());
	for(var i=0; i<nodes.length; i++) {
		if ((found!=nodes[i])&&(!isNaN(nodes[i]))) this.visibleNodes.push(parseInt(nodes[i]));
	}
	// remoteLog('visibleNodes: '+ this.visibleNodes.toString());
	this.setCookie({
		nodes: this.visibleNodes.toString()
	});
};
VhplabInterface.prototype.sortNavigationList = function(_callback) {
	// remoteLog('/* app prototypes */ cgeomap.sortNavigationList();');
	// remoteLog('markerList: '+ this.map.mapLayer.markerList.toString());
	this.state = 'detaching';
	cgeomap.detachOne(_callback);
	/*
	var list = new Array();
	for (var i=0; i<this.map.mapLayer.markerList.length; i++) {
		// remoteLog(i +" $('#article_"+ this.map.mapLayer.markerList[i] +").detach();");
		if ($('#article_'+ this.map.mapLayer.markerList[i] +' .header h2').hasClass('new')) {
			$('#article_'+ this.map.mapLayer.markerList[i] +' .header h2').removeClass('new');
			$('#article_'+ this.map.mapLayer.markerList[i] +' .header h2').addClass('empty');
			// remoteLog('Avoiding new class to restar css animation');
		}	
		list.push($('#article_'+ this.map.mapLayer.markerList[i]).detach());
		if (i == this.map.mapLayer.markerList.length - 1) {
			// remoteLog(i +" = "+ (this.map.mapLayer.markerList.length -1) +" $('#content ul').empty();");
			$('#listado_nodos').empty();
			for (var u=0; u<list.length; u++) {
				list[u].appendTo('#listado_nodos');
				// remoteLog("list["+ u +"].appendTo('#content ul');");
				list[u] = null;
				if (u == list.length - 1) {
					// remoteLog(u +" = "+ (list.length - 1) +" detach loop finished");
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
				console.log('Avoiding new class to restar css animation');
			}
			var li = $('#article_'+ id).detach();
			$(li).insertBefore(this);
			li = null;
			// remoteLog("No detach loop, only #article_"+ id +" was reordered");
			// remoteLog("i: "+ i +" length: "+ cgeomap.map.mapLayer.markerList.length);
			cgeomap.detachOne(_callback);
			return false;
		} else if (i == cgeomap.map.mapLayer.markerList.length - 1) {
			// remoteLog("everything is in order");
			cgeomap.state = '';
			cgeomap.navigationListOrder = '';
			$('#block').hide();
			if (_callback) _callback();
			return true;
		}
	});
};
VhplabInterface.prototype.toggleArticle = function(_me, _autoplay) {
	// remoteLog('/* app prototypes */ cgeomap.toggleArticle();');
	// Don't act if detaching
	// remoteLog('state: ' + this.state + ' - navigationListActive: ' + this.navigationListActive);
	if ((this.state == '')&&(!this.navigationListActive)) {
		this.state = 'toggleArticle';
		this.navigationListActive = true;
		var visible = $(_me).parent().parent().data('visible');
		var id = $(_me).data('id');
		// Hide if article is vissible
		if (visible==id) {
			if (_autoplay) {
				// Autoplay audio and remove autoplay
				cgeomap.autoplaySound(id, $(this.map.markers).data('marker_'+ id));
			} else {
				// remoteLog('Hide article '+ id);
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
			if (visible!='none') {
				$('#article_'+ visible +' .wrap_article').hide();
				$('header', '#article_'+ visible).removeClass('open');
			}
			var loaded = $(_me).data('loaded');
			var marker = $(this.map.markers).data('marker_'+ id);
			// Load if article has not been loaded
			if (!loaded) {
				// remoteLog('Toggle Article needs to load article '+ id);
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
				// remoteLog('The article '+ id +' was already loadded');
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
			// remoteLog('autoplay sound '+ sound);
			cgeomap.play(sound, $('#article_'+ sound +' .player'));
		} else {
			var a = sound.split(',');
			// remoteLog('autoplay sound '+ a[0]);
			cgeomap.play(parseInt(a[0]), $('#article_'+ a[0] +' .player'));
		}
	}
	_marker.autoplay = false;
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
    $('.vhplab_player ul .play', _container).click(function(){
		var article = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
		self.toggle(_sound, $('.player', article));
    });
    $('.vhplab_player ul .pause', _container).click(function(){
		var article = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
		self.toggle(_sound, $('.player', article));
    });
    $('.vhplab_player ul .progress_bar', _container).click(function(e){
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