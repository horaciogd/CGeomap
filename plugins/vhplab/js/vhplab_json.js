/*
 * VHPlab base plugin
 * related JSON data
 *
 * Author:
 * Horacio González
 * (c) 2015 - Distribuído baixo licencia GNU/GPL
 *
 */

/* CHANGE TO JSON GENERAL FUNCTION */
//***********
// Vhplab Train Selector
//***********
function VhplabJsonSelector() {
	this.id = '';
	this.trainList = new Array();
	this.url_list = 'http://septr.escoitar.org/pasarela/exec/get_train_list_remote.php';
	this.url_train = 'http://septr.escoitar.org/pasarela/exec/get_train_remote.php';
};
VhplabJsonSelector.prototype.initialize = function(_opts) {
	if (typeof _opts.id != "undefined") this.id = _opts.id;
	var self = this;
	$(this.id + ' input.submit').hide();
	$(this.id + ' .value').dblclick(function(){
		$(this).hide();
		$(self.id + ' select').show();
	});
	$(this.id + ' select').change(function(){
		$(self.id + ' input.submit').show();
	});
	var value = $(this.id + ' .value').text();
	// get URL via alert(this.url_list+'?auth_key=tbuh5nt25iB9rWZDMqJL&callback=?');
	$.ajax({
		type: 'GET',
		url: this.url_list+'?auth_key=tbuh5nt25iB9rWZDMqJL&callback=?',
		async: false,
		crossDomain: true,
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(_data) {
			// alert(JSON.stringify(_data));
			$.each(_data.data, function(i, train) {
				var ville ='';
				var selected ='';
				if (train.ville) ville = ' - ' + train.ville;
				if ((value)&&(value!='')&&(train.id==value)) {
					selected = ' selected';
					$(self.id + ' .value').text(train.code + ville);
					// get URL via alert(self.url_train +'?auth_key=tbuh5nt25iB9rWZDMqJL&id='+ train.id +'&callback=?');
					$.ajax({
						type: 'GET',
						url: self.url_train +'?auth_key=tbuh5nt25iB9rWZDMqJL&id='+ train.id +'&callback=?',
						async: false,
						crossDomain: true,
						jsonpCallback: 'jsonCallback',
						contentType: "application/json",
						dataType: 'jsonp',
						success: function(_d) {
							// alert(JSON.stringify(_d));
							$(self.id + ' .info').empty();
							$.each(_d.data, function(i, t) {
								$(self.id + ' .info').append('<li><b>id:</b> '+ t.id +'</li>');
								$(self.id + ' .info').append('<li><b>code:</b> '+ t.code +'</li>');
								$(self.id + ' .info').append('<li><b>id_user:</b> '+ t.id_user +'</li>');
								$(self.id + ' .info').append('<li><b>ville:</b> '+ t.ville +'</li>');
								$(self.id + ' .info').append('<li><b>periode_ouverture:</b> '+ t.periode_ouverture +'</li>');
								$(self.id + ' .info').append('<li><b>horaires:</b> '+ t.horaires +'</li>');
								$(self.id + ' .info').append('<li><b>circuit:</b> '+ t.circuit +'</li>');
								$(self.id + ' .info').append('<li><b>duree:</b> '+ t.duree +'</li>');
								$(self.id + ' .info').append('<li><b>depart:</b> '+ t.depart +'</li>');
								$(self.id + ' .info').append('<li><b>langues_com:</b> '+ t.langues_com +'</li>');
								$(self.id + ' .info').append('<li><b>nb_places:</b> '+ t.nb_places +'</li>');
								$(self.id + ' .info').append('<li><b>tarif_indiv:</b> '+ t.tarif_indiv +'</li>');
								$(self.id + ' .info').append('<li><b>tarif_grp:</b> '+ t.tarif_grp +'</li>');
								$(self.id + ' .info').append('<li><b>parking:</b> '+ t.parking +'</li>');
								$(self.id + ' .info').append('<li><b>photo:</b> '+ t.photo +'</li>');
								$(self.id + ' .info').append('<li><b>latitude:</b> '+ t.latitude +'</li>');
								$(self.id + ' .info').append('<li><b>longitude:</b> '+ t.longitude +'</li>');
							});
							$(self.id + ' .hidde').hide();
						},
						error: function(e) {
							// alert(e.message);
						}
					});
				}
				$(self.id + ' select').append('<option value="'+ train.id +'"'+ selected +'>'+ train.code + ville +'</option>');
			});
		},
		error: function(e) {
			// alert(e.message);
		}
	});
};

/* get json data via alerts and text */
JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};
