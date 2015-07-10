<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function formulaires_editer_json_article_charger_dist($id_article='new', $retour=''){
	
	include_spip('inc/autoriser');
	
	$valeurs['vhplab_json'] = $vhplab_json;
	$valeurs['id_article'] = $id_article;
	
	if (!autoriser('modifier', 'article', $id_article))
		$valeurs['editable'] = false;

	return $valeurs;
}

function formulaires_editer_json_article_verifier_dist($id_article='new', $retour=''){
	$erreurs = array();
	if (!_request('vhplab_json')) {
		$erreurs['vhplab_json'] = _T('vhplab:json_required');
	}
	return $erreurs;
}

function formulaires_editer_json_article_traiter_dist($id_article='new', $retour=''){
	
	$message = array('editable'=>true, 'message_ok'=>'');
	
	$vhplab_json = _request('vhplab_json');
	$vhplab_json_num = intval($vhplab_json);
	
	if ($vhplab_json_num>0) {
		// comprobamos si el articulo ya ha sido relacionado con un id
		$result = sql_select('*', 'spip_vhplab_json_liens', 'id_objet='.intval($id_article).' AND objet='.sql_quote("article"));
		if ($row = sql_fetch($result)){
			// si el articulo ya ha sido relacionado con un id actualizamos el enlace
			sql_updateq('spip_vhplab_json', array('id_json' => $vhplab_json_num), 'id_vhplab_json='.intval($row['id_vhplab_json']));
			$message['message_ok'] = _T('vhplab:json_update_ok');
		} else {
			// si el articulo no ha sido relacionado con ningún id creamos un enlace
			$id_vhplab = sql_insertq("spip_vhplab_json", array( 'id_json' => $vhplab_json_num));
			sql_insertq('spip_vhplab_json_liens', array('id_vhplab_json' => intval($id_vhplab), 'id_objet' => intval($id_article), 'objet' => 'article'));
			$message['message_ok'] = _T('vhplab:json_insert_ok');
		}
	}
	
	if ($retour) {
		include_spip('inc/headers');
		$message['message_ok'] .= redirige_formulaire($retour);
	}
	
	return $message;
	
}

?>
