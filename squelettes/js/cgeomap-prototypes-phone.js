/*
 * VHPlab plugin for Commons CGEOMAP project and media localization
 *
 * JavaScript document to alter map prototypes
 *
 * Author:
 * Horacio González
 * (c) 2013 - Distribuído baixo licencia GNU/GPL
 *
 */

VhplabInterface.prototype.init = function(_opts) {

	var self = this;
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	// if (typeof _opts.url_article != "undefined") this.url_article = _opts.url_article;
	// if (typeof _opts.url_user != "undefined") this.url_user = _opts.url_user;
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
	
  	this.toggleContentOffset = 0;
	this.initContent();
	
	var self = this;
	$("footer .location_reload").click(function(){
		$('footer .loading').show();
		self.map.myLocation(function() {
			self.createNavigationList({visible: true});
			self.bindNavigationListActions();
			$('footer .loading').hide();
		});
	});
	
};
VhplabInterface.prototype.initContent = function() {
	var position = $("#content").position();
	this.toggleContentDist = $("#content").width() + position.left + this.toggleContentOffset;
	$('#content').css({ left: "-=" + this.toggleContentDist });
	$("#content").data('visible', false);
};
VhplabInterface.prototype.createNavigationList = function(_opts) {
	var html = '\n';
	var num = 0;
	for (var i=0; i<this.map.markerList.length; i++) {
		var marker = $(this.map.markers).data('marker_'+ this.map.markerList[i]);
		html +=	this.createNavigationElement('\t\t\t\t',  marker.id, marker.titre, marker.soustitre, marker.distance);
		num ++;
	}
	$('#content ul').empty();
	$('#content ul').append(html);
};
VhplabInterface.prototype.bindNavigationListActions = function() {
	$('#content ul li.article .wrap_article').hide();
	$('#content ul li.article hgroup .loading').hide();
	$('#content ul').data('visible','none');
	$('#content ul li.article header').data('visible', false);
	$('#content ul li.article header').data('loaded', false);
	$('footer .loading').hide();
	var self = this;
	$("#content li header").click(function(e){
		self.toggleArticle(this);
	});
};
VhplabInterface.prototype.createNavigationElement = function(_tab, _id, _titre, _soustitre, _distance) {
	var html = '';
	html += _tab +'<li id="article_'+ _id +'" class="article">\n';
	html += _tab +'\t<header data-id="'+_id+'" class="btn">\n';
	html +=	_tab +'\t\t<hgroup>\n';
	var txt_dist = '';
	_distance - _distance%1000 > 0 ? txt_dist = parseInt((_distance - _distance%1000)/1000) + ' km' : txt_dist = parseInt(_distance) + ' m';
	html +=	_tab +'\t\t\t<span class="loading"></span>\n';
	html +=	_tab +'\t\t\t<h2>'+ _titre +'</h2><span class="distance">'+ txt_dist +'</span>\n';
	html +=	_tab +'\t\t</hgroup>\n';
	html += _tab +'\t</header>\n';
	html += _tab +'\t<div class="wrap_article">\n';
	html += _tab +'\t</div><!-- wrap_article -->\n';
	html += _tab +'</li>\n';
	return html;
};
VhplabInterface.prototype.toggleArticle = function(_me) {
	var visible = $(_me).parent().parent().data('visible');
	var id = $(_me).data('id');
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
				$('#article_'+ id +' hgroup .loading').hide();
				$('footer .loading').hide();
				$('#article_'+ id +' .wrap_article').show();
				$(_me).addClass('open');
				$(_me).data('loaded', true);
				$(_me).parent().parent().data('visible', id);
				$('#content .wrapper').scrollTo('#article_'+ id);
			});
		} else {
			$('#article_'+ id +' .wrap_article').show();
			$(_me).addClass('open');
			$(_me).parent().parent().data('visible', id);
			$('#content .wrapper').scrollTo('#article_'+ id);
		}
	}
};
VhplabInterface.prototype.bindToggleContent = function() {
	var self = this;
	$("footer .toggle_map").click(function(){
		self.toggleContent();
	});
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
			self.map.myLocationWatch(true);
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
			self.map.myLocationWatch(false);
		});
		$("#content").data('visible', true);
	}
};


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