/*
 * VHPlab plugin for Commons CGEOMAP project and media localization
 *
 * JavaScript document with the interface prototypes do not change use secondary prototype files
 *
 * Author:
 * Horacio González
 * (c) 2016 - Distribuído baixo licencia GNU/GPL
 *
 */

//***********
// Main Interface Object
//***********
var cgeomap;

//***********
// Vhplab Interface
//***********
function VhplabInterface() {
	this.state = '';
	this.navigationListActive = false;
	this.navigationListOrder = '';
	this.url_site = '';
	this.url_article = '';
	this.url_user = '';
	this.session = false;
	this.admin = false;
  	this.map;
  	this.toggleContentDist = 0;
  	this.toggleContentOffset = -12;
	this.form = new VhplabContribuerFrom();
	this.dragging = false;
	this.proximity_distance = 50;
	this.autoplay_distance = 20;
};
VhplabInterface.prototype.appendNavigationList = function(html, pagination, pages) {
	// console.log('cgeomap.appendNavigationList();');
	// console.log('html: '+ html);
	// console.log('pagination: '+ pagination);
	$('#navigation .menu .list').slideUp("fast", function(){
		$('#navigation .menu .list').empty();
		$('#navigation .menu .list').append(html);
		$('#navigation .menu .list').data('pagination', 0);
		$('#navigation .menu .list').data('last', pages);
		if (pagination) {
			$('#navigation .pagination').empty();
			$('#navigation .pagination').append("<span class=\"btn next\"></span><span class=\"btn prev\"></span>");
			$('#navigation .pagination').show();
			cgeomap.paginateNavigation(0);
		} else {
			 $('#navigation .pagination').hide();
		 }
		cgeomap.bindNavigationListActions();
		$('#navigation .menu .list').slideDown("slow");
	});
};
VhplabInterface.prototype.bindNavigationListActions = function() {
	$("#navigation .menu .list a.article").on("click touchend", function(e){
		e.preventDefault();
		if (cgeomap.dragging) return;	
		var name = $(this).attr('name');
		var id = name.split('_');
		var marker = $(cgeomap.map.markers).data('marker_'+id[1]);
		marker.click();
	});
	$("#navigation .pagination .next").on("click touchend", function(e){
		e.preventDefault();
		cgeomap.paginateNavigation('next');
	});
	$("#navigation .pagination .prev").on("click touchend", function(e){
		e.preventDefault();
		cgeomap.paginateNavigation('prev');
	});
	/* loading */
	$('#loading').delay(1000).fadeOut(1000);
};
VhplabInterface.prototype.bindNavigationButtons = function() {
	// console.log('/* cgeomap.bindNavigationButtons(); */');
	/* toggleLogin */
	$('#navigation .user .login').data("tgl","of");
	$('#navigation .user .login').on("click touchend", function(e) { 
		e.preventDefault();
		cgeomap.toggleLogin(this);
		return false;
	});
	/* phone preview */
	if ((cgeomap.map.auteur)&&(cgeomap.session)) {
		var url = this.url_site + 'spip.php?page=ajax-phone-iframe';
		$('#navigation .preview').on('click', function(){
			$.fancybox({
				'wrapCSS': 'fancybox-transparent',
    	   		href: url,
    	    	type: 'ajax',
				beforeShow : function() {
					$("#navigation .preview").addClass('preview_active');
    	    	},
				beforeClose : function() {
					$("#navigation .preview").removeClass('preview_active');
    	    	}
			});
			return false;
		});
	} else {
		$('#navigation .preview').remove();
	}
};
VhplabInterface.prototype.bindToggleContent = function() {
	$('#toggle_content').on("click touchend", function(e){ 
		e.preventDefault();
		cgeomap.toggleContent();
	});
};
VhplabInterface.prototype.createNavigationElement = function(_tab, _pagination, _id, _titre, _soustitre) {
	return _tab +'<li class="group_'+ _pagination +'"><h3><a class="article" name="article_'+ _id +'">'+ _titre +'</a></h3><span>'+ _soustitre +'</span></li>\n';
};
/*
VhplabInterface.prototype.createNavigationList = function() {

	// console.log('cgeomap.createNavigationList();');
	
	var html = '\n';
	var num = 0;
	var pagination = 0;
	var hidden = new Array();
	for (var i=0; i<this.map.mapMarkerList.length; i++) {
		var marker = $(this.map.markers).data('marker_'+ this.map.mapMarkerList[i]);
		// hide hidden (qr+proximity) markers if user is not the author
		if (($("#user .data").data("auteur")!=cgeomap.map.auteur)&&(($(marker.data).data('visibility')=='qr')||($(marker.data).data('visibility')=='proximity'))) {
			hidden.push(parseInt(marker.id));
		} else {
			pagination = (num - num%6)/6;
			html +=	this.createNavigationElement('\t\t\t\t', pagination, marker.id, $(marker.data).data('titre'), $(marker.data).data('lesauteurs'));
			num ++;
		}
	}
	this.map.hidden = hidden;
	$('#navigation .menu .list').empty();
	$('#navigation .menu .list').append(html);
	$('#navigation .menu .list').data('pagination', 0);
	$('#navigation .menu .list').data('last', pagination);
	if (pagination==0) {
		$('#navigation .pagination').remove();
	} else {
		this.paginateNavigation(0);
	}
};
*/
VhplabInterface.prototype.getCookie = function(_opts) {
	var name = "nodes=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
};
VhplabInterface.prototype.initialize = function(_opts) {
	
	// Avoid error if no _opts
	if (typeof _opts == "undefined") _opts = { };
	
	// Store url
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	if (this.url_site.slice(-1)!="/") this.url_site += "/";
	if (typeof _opts.url_article != "undefined") this.url_article = _opts.url_article;
	if (typeof _opts.url_user != "undefined") this.url_user = _opts.url_user;
	
	// preferences
	if (typeof _opts.proximity_distance != "undefined") this.proximity_distance = _opts.proximity_distance;
	if (typeof _opts.autoplay_distance != "undefined") this.autoplay_distance = _opts.autoplay_distance;
	
	// Map options
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	// load custom map prototypes
	// console.log('load custom map prototypes');
	if (typeof _opts.custom_map_prototypes != "undefined") {
		$.getScript(_opts.custom_map_prototypes, function(data) {
			cgeomap.ready(_opts.map_opts);
		});
	// use standard prototypes
	} else {
		cgeomap.ready(_opts.map_opts);
	}
	
};
VhplabInterface.prototype.initContent = function() {
	var position = $("#content").position();
	this.toggleContentDist = $("#content").width() + position.left + this.toggleContentOffset;
	$('#content').css({ left: "-="+this.toggleContentDist });
	$("#content").data('visible', false);
};
VhplabInterface.prototype.internalizeLink = function(_this){
	console.log('/* Original prototypes */ cgeomap.internalizeLink();');
	var url = $(_this).attr('href');
	var base = url.substr(0, cgeomap.url_site.length);
	console.log('url: ' + url);
	console.log('url_site: ' + cgeomap.url_site);
	console.log('base: ' + base);
	if (base==cgeomap.url_site) {
		var author = '';
		var nodo = '';
		var data = url.slice(cgeomap.url_site.length);
		console.log('data: ' + data);
		var clean_data = data.split('?');
		console.log('clean_data[0]: ' + clean_data[0]);
		console.log('clean_data[1]: ' + clean_data[1]);
		var submap = $("#navigation .preview").data('submap');
		
		if ((this.map.submap!='')&&(clean_data[0]!=this.map.submap+'/')) {
			console.log('LINK TO OTHER MAP');
			$(_this).parent().attr('class', 'submap');
			$(_this).attr("target", "_self");
		} else if (clean_data.length>=2) {
			console.log('LINK TO THIS MAP');
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
				e.preventDefault();
				var marker = $(cgeomap.map.markers).data('marker_'+ nodo);
				if (typeof marker != "undefined") {
					marker.click();
					return false;
				} else {
					return true;
				}
			});
		}
		
		if (typeof submap != "undefined") {
			var submap_data = submap.slice(cgeomap.url_site.length);
			if (submap_data.slice(-1)!="/") submap_data += "/";
			console.log('submap_data: ' + submap_data);
			if (clean_data[0]!=submap_data) {
				console.log('/* TRUE - submap link */');
				$(_this).parent().attr('class', 'submap');
			} else {
				console.log('/* TRUE - internal link */');
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
};
VhplabInterface.prototype.loadMap = function(_force, _callback) {
	
	// console.log('!!!!!! cgeomap.loadMap();');
	
	var self = this;
	cgeomap.createNavigationList();
	cgeomap.bindNavigationListActions();
	/*
	cgeomap.map.showMarkersExcept(cgeomap.map.hidden);
	cgeomap.map.map.removeLayer(cgeomap.map.clickableMarker);
	*/
	var marker = $(cgeomap.map.markers).data('marker_'+cgeomap.map.open);
	marker.click(_callback);
	$("#user .carte").addClass('on');
	$("#content").data('selected','carte');
	
	
};
VhplabInterface.prototype.paginateNavigation = function(_dir) {
	var pos = $('#navigation .menu .list').data('pagination');
	var last = $('#navigation .menu .list').data('last');
	
	
	// console.log('paginateNavigation - pos: '+ pos +', last: '+ last);
	
	
	if (_dir=='prev') {
		pos --;
	} else if (_dir=='next') {
		pos ++;
	} else {
		pos = _dir;
	}
	
	if ((pos>=0)&&(pos<=last)) {
		$('#navigation .menu .list li').hide();
		$('#navigation .menu .list li.group_'+ pos).show();
		$('#navigation .menu .list').data('pagination', pos);
		if (pos==0) {
			$("#navigation .pagination .prev").addClass('noPrev');
			if (last==1) $("#navigation .pagination .next").removeClass('noNext');
		} else if (pos==last) {
			$("#navigation .pagination .next").addClass('noNext');
			if (pos==1) $("#navigation .pagination .prev").removeClass('noPrev');
		} else {
			$("#navigation .pagination .prev").removeClass('noPrev');
			$("#navigation .pagination .next").removeClass('noNext');
		}
	}
};
VhplabInterface.prototype.ready = function(_opts) {
	// console.log('cgeomap.ready();');
	this.map = new VhplabMap();
	this.map.initialize({
		url: this.url_site,
		markers: (typeof _opts.markers != "undefined") ? _opts.markers : '',
		auteur: (typeof _opts.auteur != "undefined") ? _opts.auteur : 'none',
		visible: (typeof _opts.visible != "undefined") ? _opts.visible : 0,
		limit: (typeof _opts.limit != "undefined") ? _opts.limit : 300,
		id: (typeof _opts.id != "undefined") ? _opts.id : 'cgeomap',
		zoom: (typeof _opts.zoom != "undefined") ? _opts.zoom : 10,
		latitude: (typeof _opts.latitude != "undefined") ? _opts.latitude : 0.0,
		longitude: (typeof _opts.longitude != "undefined") ? _opts.longitude : 0.0,
		open: (typeof _opts.open != "undefined") ? _opts.open : false
	});
	this.bindToggleContent();
	this.bindNavigationButtons();
};
VhplabInterface.prototype.setCookie = function(_opts) {
	var d = new Date();
	var days = 2;
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "nodes="+ _opts.nodes +"; " + expires;
};
VhplabInterface.prototype.setVisibleNodes= function() {
	// console.log('cgeomap.setVisibleNodes();');
	var found = '';
	this.visibleNodes = new Array();
	// console.log('open: '+ this.map.open);
	// console.log('typeof open: '+ typeof this.map.open);
	if (typeof this.map.open != "boolean") {
		// console.log('found: '+ this.map.open);
		found = this.map.open;
		this.visibleNodes.push(parseInt(found));
	}
	var cookie = this.getCookie();
	var nodes = cookie.split(',');
	// console.log('nodes: '+ nodes.toString());
	for(var i=0; i<nodes.length; i++) {
		if ((found!=nodes[i])&&(!isNaN(nodes[i]))) this.visibleNodes.push(parseInt(nodes[i]));
	}
	// console.log('visibleNodes: '+ this.visibleNodes.toString());
	this.setCookie({
		nodes: this.visibleNodes.toString()
	});
};
VhplabInterface.prototype.shareOverrideOGMeta = function(){
	// Get URL via log
	// console.log('Marker FB metas URL: '+ this.map.baseURL +'spip.php?page=json-vhplab-geo-fbmetas&nodo='+ cgeomap.map.open);
	$.getJSON(this.map.baseURL +'spip.php?page=json-vhplab-geo-fbmetas&nodo='+ cgeomap.map.open, function(data) {
		$.each(data[0].marker, function(i, marker){
			var properties = '{ object: { "og:url": "';
			(typeof marker.url != "undefined") ? properties += marker.url : properties += $("meta[property='og:url']").attr("content");
			properties += '", "og:title": "';
			(typeof marker.title != "undefined") ? properties += marker.title : properties += $("meta[property='og:title']").attr("content");
			properties += '", "og:description": "';
			(typeof marker.description != "undefined") ? properties += marker.description : properties += $("meta[property='og:description']").attr("content");
			properties += '", "og:image": "';
			(typeof marker.image != "undefined") ? properties += marker.image : properties += $("meta[property='og:image']").attr("content");
			properties += '", "og:image:width": "';
			(typeof marker.width != "undefined") ? properties += marker.width : properties += $("meta[property='og:image:width']").attr("content");
			properties += '", "og:image:height": "';
			(typeof marker.height != "undefined") ? properties += marker.height : properties += $("meta[property='og:image:height']").attr("content");
			properties +=  '" } }';
			// console.log(properties);
			if (typeof FB != 'undefined') {
				FB.ui({
					method: 'share_open_graph',
					action_type: 'og.likes',
					action_properties: properties
				}, function (response) {
					// Action after response
					// console.log(response);
				});
			}
		});
	});
};
VhplabInterface.prototype.slideContent = function(_how, _callback) {
	var visible = $("#content").data('visible');
	if (_how=='show') {
		if (!visible) {
			$('#content').animate({
				left: "+="+this.toggleContentDist,
			}, "swing", function() {
				$('.cgeomap .leaflet-popup-content-wrapper .toggle_content').removeClass('closed');
				$('#toggle_content').removeClass('closed');
				$("#content").data('visible', true);
				if (_callback) _callback();
			});
		} else {
			if (_callback) _callback();
		}
	} else if (_how=='hide') {
		if (visible) {
			$('#content').animate({
				left: "-="+this.toggleContentDist,
			}, "swing", function() {
				$('.cgeomap .leaflet-popup-content-wrapper .toggle_content').addClass('closed');
				$('#toggle_content').addClass('closed');
				$("#content").data('visible', false);
				if (_callback) _callback();
			});
		} else {
			if (_callback) _callback();
		}
	}
};
VhplabInterface.prototype.toggleContent = function() {
	var visible = $("#content").data('visible');
	// console.log('visible: '+ visible);
	// console.log('toggleContentDist: '+ this.toggleContentDist);
	if (visible) {
		$('#content').animate({
			left: "-="+this.toggleContentDist,
		}, "swing", function() {
			$('.cgeomap .leaflet-popup-content-wrapper .toggle_content').addClass('closed');
			$('#toggle_content').addClass('closed');
		});
		$("#content").data('visible', false);
	} else {
		$('#content').animate({
			left: "+="+this.toggleContentDist,
		}, "swing", function() {
			$('.cgeomap .leaflet-popup-content-wrapper .toggle_content').removeClass('closed');
			$('#toggle_content').removeClass('closed');
		});
		$("#content").data('visible', true);
	}
};
VhplabInterface.prototype.parseURL = function() {
    var params = {};
    var params_txt = window.location.href.split('?');
    if (typeof params_txt[1] != "undefined")  {
    	var param_array = params_txt[1].split('&');
    	for(var i in param_array){
        	x = param_array[i].split('=');
        	params[x[0]] = x[1];
    	}
    	// console.log(JSON.stringify(params))
    	return params;
    }
};

//***********
// Vhplab Contribuer Formulary
//***********
function VhplabContribuerFrom() {
	this.url_form = '';
	this.url_upload = '';
	this.scrollTo = '';
	this.data = {};
	this.status = 'editer';
	this.trash = false;
	this.geo = false;
	this.icons;
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
	$('#'+ this.selector +' ul').append('<li class="volume volume-50" ></li>');
	$('#'+ this.selector +' ul').append('<li class="progress_bar" ><span></span></li>');
    this.bindActions();
};
VhplabPlayer.prototype.bindActions = function() {
	var self = this;
	$('#'+ this.selector +' .play').on("click touchend", function(e){
		e.preventDefault();
		self.play();
	});
	$('#'+ this.selector +' .pause').on("click touchend", function(e){
      	e.preventDefault();
      	self.pause();
	});
	$('#'+ this.selector +' .progress_bar').on("click touchend", function(e){
      	e.preventDefault();
      	var w = $(this).width();
		var x = e.clientX - $(this).offset().left;
		if (self.sound.playState) self.sound.setPosition(x*self.sound.duration/w);
	});
	$('#'+ this.selector +' .volume').on("click touchend", function(e){
		e.preventDefault();
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
			$('.cgeomap .leaflet-popup-content-wrapper .player').removeClass('active');
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
	$('.cgeomap .leaflet-popup-content-wrapper .player').removeClass('active');
};
VhplabPlayer.prototype.play = function() {
	this.sound.play();
	$('#'+ this.selector +' .play').hide();
	$('#'+ this.selector +' .pause').show();
	$('.cgeomap .leaflet-popup-content-wrapper .player').addClass('active');
};
VhplabPlayer.prototype.setVolume = function() {
	$('#'+ this.selector +' .volume').removeClass("volume-"+this.volume);
	this.volume += 25;
	if (this.volume>100) this.volume = 0;
	this.sound.setVolume(this.volume);
	$('#'+ this.selector +' .volume').addClass("volume-"+this.volume);
};
VhplabPlayer.prototype.milToTime = function(_mil) {
	var seconds = Math.floor((_mil / 1000) % 60);
	if (seconds<10) seconds = '0'+ seconds;
	var minutes = Math.floor((_mil / (60 * 1000)) % 60);
	if (minutes<10) minutes = '0'+ minutes;
	return minutes + ":" + seconds;
};