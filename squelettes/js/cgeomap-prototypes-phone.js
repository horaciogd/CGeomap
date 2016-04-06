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
			var base = url.substr(0, cgeomap.url_site.length + 14);
			if (base==cgeomap.url_site+"spip.php?nodo="){
				var id = url.split("=");
				$(this).click(function(){
					$("#article_"+ id[1] +" .header").trigger('click');
					// var marker = $(cgeomap.map.markers).data('marker_'+id[1]);
					// marker.click();
					return false;
				});
			}
		});
	});	
};
VhplabInterface.prototype.bindNavigationListActions = function() {
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
			cgeomap.toggleArticle(this);
		}
	});
	var height = $( window ).height();
	$("#content .wrapper .bottom").css("height", height*0.75 +"px");
	$("#content .wrapper .bottom").click(function(e){
		var first = $("#content .listado_nodos li:first").attr("id");
		$('#content .wrapper').scrollTo('#'+ first);
	});
};
VhplabInterface.prototype.bindToggleContent = function() {
	var self = this;
	$("footer .toggle_map").click(function(){
		self.toggleContent();
	});
};
VhplabInterface.prototype.createNavigationElement = function(_tab, _id, _titre, _soustitre, _distance, _enclosure, _visible) {
	var html = '';
	html += _tab +'<li id="article_'+ _id +'" class="article '+ _visible +'">\n';
	typeof _enclosure != "undefined" ? html += _tab +'\t<header class="header btn" data-sound="'+_enclosure.toString()+'" data-id="'+_id+'">\n' : html += _tab +'\t<header class="header btn" data-id="'+_id+'">\n';
	html +=	_tab +'\t\t<hgroup>\n';
	var txt_dist = '';
	_distance - _distance%1000 > 0 ? txt_dist = parseInt((_distance - _distance%1000)/1000) + ' km' : txt_dist = parseInt(_distance) + ' m';
	html +=	_tab +'\t\t\t<span class="loading"></span>\n';
	var txt_enclosure = '';
	if (typeof _enclosure != "undefined") txt_enclosure += '<span class="player_icon"></span><span class="player btn" ></span>';
	html +=	_tab +'\t\t\t<h2>'+ _titre +'</h2><div class="info">'+ txt_enclosure +'<span class="distance">'+ txt_dist +'</span></div>\n';
	html +=	_tab +'\t\t</hgroup>\n';
	html += _tab +'\t</header>\n';
	html += _tab +'\t<div class="wrap_article">\n';
	html += _tab +'\t</div><!-- wrap_article -->\n';
	html += _tab +'</li>\n';
	return html;
};
VhplabInterface.prototype.createNavigationList = function(_opts) {
	var html = '\n';
	for (var i=0; i<this.map.markerList.length; i++) {
		var marker = $(this.map.markers).data('marker_'+ this.map.markerList[i]);
		var visible = 'default';
		if (($(marker.data).data('visible')=='qr')||($(marker.data).data('visible')=='proximity')) {
			if (this.visibleNodes.indexOf(parseInt(marker.id)) != -1) {  
				visible = 'found';
			} else {
				visible = 'hidden';
				// marker.marker.setOpacity(0);
				this.map.map.removeLayer(marker.marker);
			}
		}
		html +=	this.createNavigationElement('\t\t\t\t',  marker.id, $(marker.data).data('titre'), $(marker.data).data('soustitre'), marker.distance, $(marker.data).data('enclosure'), visible);
	}
	$('#content ul').empty();
	$('#content ul').append(html);
};
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

	// Store url
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	
	// Visibility settings for qr nodes
	(typeof _opts.open != "undefined") ? this.open = _opts.open : this.open = false;
	this.setVisibleNodes();
	
	// Map options
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	// load custom map prototypes
	if (typeof _opts.custom_map_prototypes != "undefined") {
		$.getScript(_opts.custom_map_prototypes, function(data) {
			cgeomap.ready(_opts.map_opts);
		});
	// use standard prototypes
	} else {
		cgeomap.ready(_opts.map_opts);
	}
	
  	this.toggleContentOffset = 0;
	this.initContent();
	
	$("footer .location_reload").click(function(){
		$('footer .loading').show();
		cgeomap.map.myLocation(function() {
			cgeomap.createNavigationList({visible: true});
			cgeomap.bindNavigationListActions();
			$('footer .loading').hide();
		});
	});
	
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
};
VhplabInterface.prototype.initContent = function() {
	var position = $("#content").position();
	this.toggleContentDist = $("#content").width() + position.left + this.toggleContentOffset;
	$('#content').css({ left: "-=" + this.toggleContentDist });
	$("#content").data('visible', false);
};
VhplabInterface.prototype.play = function(_sound, _button) {
	if (typeof _sound == "number") {
		this.player.toggle(_sound, _button);
	} else if (typeof _sound == "string"){
		var list = sound.split(",");
		this.player.toggleList(_sound, _button);
	}
};
VhplabInterface.prototype.setCookie = function(_opts) {
	var d = new Date();
	var days = 2;
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "nodes="+ _opts.nodes +"; " + expires;
};
VhplabInterface.prototype.setVisibleNodes= function() {
	var found = '';
	this.visibleNodes = new Array();
	if (this.open) {
		found = this.open;
		this.visibleNodes.push(parseInt(found));
	}
	var cookie = this.getCookie();
	var nodes = cookie.split(',');
	for(var i=0; i<nodes.length; i++) {
		if ((found!=nodes[i])&&(!isNaN(nodes[i]))) this.visibleNodes.push(parseInt(nodes[i]));
	}
	this.setCookie({
		nodes: this.visibleNodes.toString()
	});
};
VhplabInterface.prototype.toggleArticle = function(_me) {
	//alert('toggleArticle');
	var visible = $(_me).parent().parent().data('visible');
	var id = $(_me).data('id');
	/*
	var sound = $('#article_'+ id +' header').data('sound');
	if (typeof sound!="undefined") {
		cgeomap.play(sound, $('#article_'+ id +' .player'));
	}
	*/
	if (visible==id) {
		$('#article_'+ id +' .wrap_article').hide();
		$(_me).removeClass('open');
		$(_me).parent().parent().data('visible', 'none');
	} else {
		if (visible!='none') {
			$('#article_'+ visible +' .wrap_article').hide();
			$('header', '#article_'+ visible).removeClass('open');
		}
		var loaded = $(_me).data('loaded');
		if (!loaded) {
			$('#article_'+ id +' hgroup .loading').show();
			$('footer .loading').show();
			var marker = $(this.map.markers).data('marker_'+ id);
			marker.getData(function(){
				marker.bindContentActions();
			});
		} else {
			$('#article_'+ id +' .wrap_article').show();
			$(_me).addClass('open');
			$(_me).parent().parent().data('visible', id);
			$('#content .wrapper').scrollTo('#article_'+ id);
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
			$('.cgeomap .window .toggle_content').addClass('closed');
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
			$('.cgeomap .window .toggle_content').removeClass('closed');
			$('footer .toggle_list').addClass('toggle_map');
			$('footer .toggle_list').removeClass('toggle_list');
			$('footer .location_button').addClass('location_reload');
			$('footer .location_button').removeClass('location_button');
		});
		$("#content").data('visible', true);
	}
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
VhplabTransparentPlayer.prototype.play = function(_sound) {
	$('#vhplab_player_'+ _sound +' .play').hide();
	$('#vhplab_player_'+ _sound +' .pause').show();
	soundManager.stopAll();
	soundManager.play('enclosure_' + _sound);
	this.playing = 'enclosure_' + _sound;
};
VhplabTransparentPlayer.prototype.stop = function() {
	var sound = this.playing.split('_');
	$('#vhplab_player_'+ sound[1] +' .play').show();
	$('#vhplab_player_'+ sound[1] +' .pause').hide();
	$('#vhplab_player_'+ sound[1] +' .progress_bar span').css('width', 0 +'%');
	soundManager.stopAll();
	this.playing = '';
};
VhplabTransparentPlayer.prototype.moveTo = function(_x, _w) {
	var soundObj = soundManager.getSoundById(this.playing);
	if (soundObj.playState) soundObj.setPosition(_x*soundObj.duration/_w);
};
VhplabTransparentPlayer.prototype.toggle = function(_sound, _button) {
	if (this.playing=='') {
		$(_button).addClass('active');
		$('.window_wrapper .player').addClass('active');
		this.play(_sound);
	} else if (this.playing=='enclosure_'+_sound) {
		$(_button).removeClass('active');
		$('.window_wrapper .player').removeClass('active');
		this.stop();
		this.queue = false;
	} else {
		$("#content ul li.article .header .player").each(function(){
			$(this).removeClass('active');
		});
		$(_button).addClass('active');
		$('.window_wrapper .player').addClass('active');
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
		$('.window_wrapper .player').addClass('active');
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
			$('.window_wrapper .player').removeClass('active');
			this.stop();
			this.queue = false;
		}  else {
			$("#content ul li.article header .player").each(function(){
				$(this).removeClass('active');
			});
			$(_button).addClass('active');
			$('.window_wrapper .player').addClass('active');
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
		$('.window_wrapper .player').removeClass('active');
		this.playing = '';
	}
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
VhplabTransparentPlayer.prototype.milToTime = function(_mil) {
	var seconds = Math.floor((_mil / 1000) % 60);
	if (seconds<10) seconds = '0'+ seconds;
	var minutes = Math.floor((_mil / (60 * 1000)) % 60);
	if (minutes<10) minutes = '0'+ minutes;
	return minutes + ":" + seconds;
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
}
