/*
 * VHPlab base plugin
 * related articles
 *
 * Author:
 * Horacio González
 * (c) 2016 - Distribuído baixo licencia GNU/GPL
 *
 */

/* THIS IS RELATED MAY BE SOME JSON MISSING */
//***********
// Vhplab Related formulary
//***********
function VhplabRelatedForm() {
	this.id = '';
};
VhplabRelatedForm.prototype.initialize = function(_opts) {
	if (typeof _opts.id != "undefined") this.id = _opts.id;
	var self = this;
	$(this.id + ' .hidde').hide();
	$(this.id + ' input.submit').hide();
	$(this.id + ' input[type="text"]').blur(function(){
		$(self.id + ' input.submit').show();
	});
	$(this.id + ' .remove_related').dblclick(function(){
		var value = $(self.id + ' input[name="delete_related"]').val();
		var new_value = $(this).data('id_objet_related');
		$(self.id + ' input[name="delete_related"]').val(value+' '+new_value);
		$(this).hide();
		//$(self.id + ' input.submit').show();
		$(self.id + ' form').submit();
	});
};
