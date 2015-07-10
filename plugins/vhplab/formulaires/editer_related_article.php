<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function formulaires_editer_related_article_charger_dist($id_article='new', $retour=''){
	
	include_spip('inc/autoriser');
	
	$valeurs['related'] = $related;
	$valeurs['id_article'] = $id_article;
	$valeurs['delete_related'] = $delete_related;
	
	if (!autoriser('modifier', 'article', $id_article))
		$valeurs['editable'] = false;

	return $valeurs;
}

function formulaires_editer_related_article_verifier_dist($id_article='new', $retour=''){
	$erreurs = array();
	if ((!_request('related'))&&(!_request('delete_related'))) {
		$erreurs['related'] = _T('vhplab:related_required');
	} else if ((!is_numeric(_request('related')))&&(!_request('delete_related'))) {
		$erreurs['related'] = _T('vhplab:related_number');
	}
	return $erreurs;
}

function formulaires_editer_related_article_traiter_dist($id_article='new', $retour=''){
	
	$message = array('editable'=>true, 'message_ok'=>'');
	
	$related = _request('related');
	$related_num = intval($related);
	$delete_related = _request('delete_related');
	$delete_related_num = explode(' ', $delete_related);
	
	if ($related_num>0) {
		// insertamos as coordenadas do artigo
		$result = sql_select('*', 'spip_vhplab_related', 'id_objet_related='.intval($related_num).' AND objet_related='.sql_quote("article"));
		
		if ($row = sql_fetch($result)){
			$already = sql_select('*', 'spip_vhplab_related_liens', 'id_objet='.intval($id_article).' AND objet='.sql_quote("article").' AND id_vhplab_related='.intval($row['id_vhplab_related']));
			if ($r = sql_fetch($already)){
				$message['message_ok'] = _T('vhplab:related_already_ok');
			} else {
				sql_insertq('spip_vhplab_related_liens', array('id_vhplab_related' => intval($row['id_vhplab_related']), 'id_objet' => intval($id_article), 'objet' => 'article'));
				$message['message_ok'] = _T('vhplab:related_insert_ok');
			}
		} else {
			$id_vhplab = sql_insertq("spip_vhplab_related", array('id_objet_related' => $related_num, 'objet_related' => 'article'));
			sql_insertq('spip_vhplab_related_liens', array('id_vhplab_related' => intval($id_vhplab), 'id_objet' => intval($id_article), 'objet' => 'article'));
			$message['message_ok'] = _T('vhplab:related_insert_ok');
		}
	}
	
	if (count($delete_related_num)>0) {
		for($i=0; $i<count($delete_related_num); $i++) {
			$result = sql_select('*', 'spip_vhplab_related', 'id_objet_related='.intval($delete_related_num[$i]).' AND objet_related='.sql_quote("article"));
			if ($row = sql_fetch($result)) {
				$already = sql_select('*', 'spip_vhplab_related_liens', 'id_objet='.intval($id_article).' AND objet='.sql_quote("article").' AND id_vhplab_related='.intval($row['id_vhplab_related']));
				if ($r = sql_fetch($already)) {
					sql_delete('spip_vhplab_related_liens', 'id_objet='.intval($id_article).' AND objet='.sql_quote("article").' AND id_vhplab_related='.intval($row['id_vhplab_related']));
					$message['message_ok'] .= _T('vhplab:related_deleted_ok');
				}
			}
		}
	}
	
	if ($retour) {
		include_spip('inc/headers');
		$message['message_ok'] .= redirige_formulaire($retour);
	}
	
	return $message;
	
}

?>