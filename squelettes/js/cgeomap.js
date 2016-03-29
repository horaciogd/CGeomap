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
	this.url_site = '';
	this.url_article = '';
  	this.map;
  	this.toggleContentDist = 0;
  	this.toggleContentOffset = -12;
};
VhplabInterface.prototype.bindNavigationListActions = function() {
	var self = this;
	$("#navigation .menu .list a.article").click(function(){
		var name = $(this).attr('name');
		var id = name.split('_');
		var marker = $(self.map.markers).data('marker_'+id[1]);
		marker.click();
	});
	$("#navigation .pagination .next").click(function(){
		self.paginateNavigation('next');
	});
	$("#navigation .pagination .prev").click(function(){
		self.paginateNavigation('prev');
	});
	$('#loading').fadeOut();
};
VhplabInterface.prototype.bindToggleContent = function() {
	var self = this;
	$('#toggle_content').click(function(){ self.toggleContent(); });
};
VhplabInterface.prototype.createNavigationElement = function(_tab, _pagination, _id, _titre, _soustitre) {
	return _tab +'<li class="group_'+ _pagination +'"><h3><a class="article" name="article_'+ _id +'">'+ _titre +'</a></h3><span>'+ _soustitre +'</span></li>\n';
};
VhplabInterface.prototype.createNavigationList = function() {
	var html = '\n';
	var num = 0;
	var pagination = 0;
	for (var i=0; i<this.map.markerList.length; i++) {
		var marker = $(this.map.markers).data('marker_'+ this.map.markerList[i]);
		pagination = (num - num%6)/6;
		html +=	this.createNavigationElement('\t\t\t\t', pagination, marker.id, $(marker.data).data('titre'), $(marker.data).data('soustitre'));
		num ++;
	}
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
VhplabInterface.prototype.initialize = function(_opts) {
	var self = this;
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	if (typeof _opts.url_article != "undefined") this.url_article = _opts.url_article;
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	
	// load custom map prototypes
	if (typeof _opts.custom_map_prototypes != "undefined") {
		$.getScript(_opts.custom_map_prototypes, function(data) {
			self.ready(_opts.map_opts);
		});
	// use standard prototypes
	} else {
		self.ready(_opts.map_opts);
	}
	
	// initialize soundManager
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
VhplabInterface.prototype.initContent = function() {
	var position = $("#content").position();
	this.toggleContentDist = $("#content").width() + position.left + this.toggleContentOffset;
	$('#content').css({ left: "-="+this.toggleContentDist });
	$("#content").data('visible', false);
};
VhplabInterface.prototype.paginateNavigation = function(_dir) {
	var pos = $('#navigation .menu .list').data('pagination');
	var last = $('#navigation .menu .list').data('last');
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
		custom: (typeof _opts.custom != "undefined") ? _opts.custom : false
	});
	this.bindToggleContent();
};
VhplabInterface.prototype.slideContent = function(_how, _callback) {
	var visible = $("#content").data('visible');
	if (_how=='show') {
		if (!visible) {
			$('#content').animate({
				left: "+="+this.toggleContentDist,
			}, "swing", function() {
				$('.cgeomap .window .toggle_content').removeClass('closed');
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
				$('.cgeomap .window .toggle_content').addClass('closed');
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
	if (visible) {
		$('#content').animate({
			left: "-="+this.toggleContentDist,
		}, "swing", function() {
			$('.cgeomap .window .toggle_content').addClass('closed');
			$('#toggle_content').addClass('closed');
		});
		$("#content").data('visible', false);
	} else {
		$('#content').animate({
			left: "+="+this.toggleContentDist,
		}, "swing", function() {
			$('.cgeomap .window .toggle_content').removeClass('closed');
			$('#toggle_content').removeClass('closed');
		});
		$("#content").data('visible', true);
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