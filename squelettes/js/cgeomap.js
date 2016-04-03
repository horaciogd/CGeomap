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
		html +=	this.createNavigationElement('\t\t\t\t', pagination, marker.id, $(marker.data).data('titre'), $(marker.data).data('lesauteurs'));
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
	
	// store url
	if (typeof _opts.url_site != "undefined") this.url_site = _opts.url_site;
	if (typeof _opts.url_article != "undefined") this.url_article = _opts.url_article;
	if (typeof _opts.url_user != "undefined") this.url_user = _opts.url_user;
	
	if (typeof _opts.map_opts == "undefined") _opts.map_opts = { };
	
	// initialize formulary
	this.form.initialize(_opts);
	
	var self = this;
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
VhplabInterface.prototype.loadContributions = function() {
	$("#content").data('selected','contributions');
	$("#user .utilities .contributions").addClass('on');
};
VhplabInterface.prototype.loadEmbed = function() {
	$("#content").data('selected','embed');
	$("#user .utilities .embed").addClass('on');
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
VhplabInterface.prototype.loadMap = function(_callback) {
	var self = this;
	var recalcul =  $("#formulaire").data('recalcul');
	if (recalcul) {
		// get URL via alert(self.url_site +'spip.php?page=json-vhplab-geo-articles&id_rubrique=1&id_article='+ recalcul +'&offset=0&limit=300&var_mode=recalcul&callback=?');
		this.map.reloadMarkers(self.url_site +'spip.php?page=json-vhplab-geo-articles&id_rubrique=1&id_article='+ recalcul +'&offset=0&limit=300&var_mode=recalcul&callback=?', function(){
			cgeomap.map.map.setZoom(10);
			$("#formulaire").data('recalcul', false);
			cgeomap.map.showMarkers();
			var marker = $(cgeomap.map.markers).data('marker_'+cgeomap.map.open);
			marker.click(_callback);
		});
	} else {
		$("#article").slideDown("slow");
		this.map.showMarkers();
		if (_callback) _callback();
	}
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
		visible: (typeof _opts.visible != "undefined") ? _opts.visible : 0,
		limit: (typeof _opts.limit != "undefined") ? _opts.limit : 300,
		id: (typeof _opts.id != "undefined") ? _opts.id : 'cgeomap',
		zoom: (typeof _opts.zoom != "undefined") ? _opts.zoom : 10,
		latitude: (typeof _opts.latitude != "undefined") ? _opts.latitude : 0.0,
		longitude: (typeof _opts.longitude != "undefined") ? _opts.longitude : 0.0,
		open: (typeof _opts.open != "undefined") ? _opts.open : false,
		custom: (typeof _opts.custom != "undefined") ? _opts.custom : false,
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
VhplabInterface.prototype.toggleLogin = function(_me) {
 	if (!this.session) {
		var tgl =  $(_me).data("tgl");
		if (tgl=="on") {
			$('#user .login').slideUp();
			$(_me).data("tgl","off");
		} else {
			$('#user .login').slideDown();
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
				hide = "#user .navigation";
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
		$(hide).slideUp("fast", function(){
			$("#user .utilities a").removeClass('on');
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
		});
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
	$(_container +" .modules_list").append(this.createModule(_type, _T.module_label_audio, _n, '', _T.module_help_sound));
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
	$(_container +" .modules_list").append(this.createModule(_type, _T.module_label_image, _n, '', _T.module_help_image));
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
		//$("#formulaire .content").mCustomScrollbar("update");
	}
};
VhplabContribuerFrom.prototype.createTextModule = function(_container, _type, _n) {
	$(_container +" .modules_list").append(this.createModule(_type, _T.module_label_text, _n, '\t\t\t\t\t\t\t', _T.module_help_text));
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
				$("#formulaire .content").mCustomScrollbar("update");
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
					if (cgeomap.form.geo) {
						cgeomap.map.map.off('click');
						cgeomap.map.map.off('zoomend');
					}
					cgeomap.map.clickableMarker.setOpacity(0);
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
		cgeomap.map.map.off('click');
		cgeomap.map.map.off('zoomend');
		//cgeomap.map.map.off('click', cgeomap.map.clickListener);
		//cgeomap.map.map.off('zoomend', cgeomap.map.zoomListener);
		this.geo = false;
	} else {
		$(".wrap_cartography").show();
		cgeomap.map.map.on('click', function(_e){
			cgeomap.map.clickListener(_e);
		});
		cgeomap.map.map.on('zoomend', function(_e){
			cgeomap.map.zoomListener(_e);
		});
		//cgeomap.map.map.on('click', cgeomap.map.clickListener);
		//cgeomap.map.map.on('zoomend', cgeomap.map.zoomListener);
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