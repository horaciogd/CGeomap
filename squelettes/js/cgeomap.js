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
	this.url_user = '';
	this.session = false;
	this.admin = false;
  	this.map;
  	this.toggleContentDist = 0;
  	this.toggleContentOffset = -12;
	this.form = new VhplabContribuerFrom();
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
	/* toggleLogin */
	$('#navigation .user .login').data("tgl","of");
	$('#navigation .user .login').click(function() { 
		cgeomap.toggleLogin(this);
		return false;
	});
	/* loading */
	$('#loading').delay(1000).fadeOut("slow");
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
	var hidden = new Array();
	for (var i=0; i<this.map.markerList.length; i++) {
		var marker = $(this.map.markers).data('marker_'+ this.map.markerList[i]);
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
VhplabInterface.prototype.initialize = function(_opts) {
	
	// avoid error if no _opts
	if (typeof _opts == "undefined") _opts = { };
	
	// Store url
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	if (this.url_site.slice(-1)!="/") this.url_site += "/";
	if (typeof _opts.url_article != "undefined") this.url_article = _opts.url_article;
	if (typeof _opts.url_user != "undefined") this.url_user = _opts.url_user;
	
	// Map options
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	// load custom map prototypes console.log('load custom map prototypes');
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
VhplabInterface.prototype.loadMap = function(_callback) {
	var self = this;
	cgeomap.createNavigationList();
	cgeomap.bindNavigationListActions();
	cgeomap.map.showMarkersExcept(cgeomap.map.hidden);
	cgeomap.map.map.removeLayer(cgeomap.map.clickableMarker);
	var marker = $(cgeomap.map.markers).data('marker_'+cgeomap.map.open);
	marker.click(_callback);
	$("#user .carte").addClass('on');
	$("#content").data('selected','carte');
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

//***********
// Vhplab Contribuer Formulary
//***********
function VhplabContribuerFrom() {
	this.url_form = '';
	this.url_upload = '';
	this.data = {};
	this.status = 'editer';
	this.trash = false;
	this.geo = false;
	this.icons;
};
