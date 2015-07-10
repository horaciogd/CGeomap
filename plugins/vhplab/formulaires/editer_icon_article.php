<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function formulaires_editer_icon_article_charger_dist($id_article='new', $retour='', $ajaxload='oui'){
	
	include_spip('inc/autoriser');
	
	$valeurs['vhplab_gis_icon_existant'] = $vhplab_gis_icon_existant;
	$valeurs['vhplab_gis_icon_precedent'] = $vhplab_gis_icon_precedent;
	$valeurs['vhplab_gis_icon'] = $vhplab_gis_icon;
	$valeurs['id_article'] = $id_article;
	$valeurs['ajaxload'] = $ajaxload;
	if (($GLOBALS['meta']['activer_logos'] != 'oui')&&(!autoriser('modifier', 'article', $id_article))) $valeurs['editable'] = false;
	
	return $valeurs;
	
}

function formulaires_editer_icon_article_verifier_dist($id_article='new', $retour='', $ajaxload='oui'){
	$erreurs = array();
	if (!_request('vhplab_gis_icon_existant')) {
		if (!_request('vhplab_gis_icon')) {
			$erreurs['vhplab_gis_icon'] = _T('vhplab:icon_required');
		} else {
			$erreurs['vhplab_gis_icon_existant'] = _T('vhplab:no_icon_selected');
		}
	}
	return $erreurs;
}

function formulaires_editer_icon_article_traiter_dist($id_article='new', $retour='', $ajaxload='oui'){
	
	
	$message = array('editable'=>true, 'message_ok'=>'');
	
	if (!_request('vhplab_gis_icon_existant')) {
		$vhplab_gis_icon = _request('vhplab_gis_icon');
	} else {
		if ((_request('vhplab_gis_icon_precedent'))&&(_request('vhplab_gis_icon_precedent')!='')) {
			$vhplab_gis_icon_precedent = preg_split('/_/', _request('vhplab_gis_icon_precedent'));
			sql_delete("spip_mots_liens", "id_mot='$vhplab_gis_icon_precedent[1]' AND id_objet='$id_article'");
		}
		$vhplab_gis_icon_existant = preg_split('/_/', _request('vhplab_gis_icon_existant'));
		// asociamos a palabra chave ao artigo para vincular o icono existente ao mesmo
		sql_insertq('spip_mots_liens', array('id_mot' => intval($vhplab_gis_icon_existant[1]), 'id_objet' => intval($id_article), 'objet' => 'article'));
	}
	
    // message
    return array(
        "editable" => true,
        "message_ok" => _T('vhplab:icon_ok')
    );
	
}

?>
