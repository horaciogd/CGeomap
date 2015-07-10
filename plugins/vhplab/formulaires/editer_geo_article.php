<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function formulaires_editer_geo_article_charger_dist($id_article='new', $retour='', $ajaxload='oui'){
	
	include_spip('inc/autoriser');
	
	$valeurs['vhplab_latitude'] = $latitude;
	$valeurs['vhplab_longitude'] = $longitude;
	$valeurs['vhplab_zoom'] = $zoom;
	$valeurs['vhplab_address'] = $address;
	$valeurs['id_article'] = $id_article;
	$valeurs['ajaxload'] = $ajaxload;
	
	if (!autoriser('modifier', 'article', $id_article))
		$valeurs['editable'] = false;

	return $valeurs;
}

function formulaires_editer_geo_article_verifier_dist($id_article='new', $retour='', $ajaxload='oui'){
	$erreurs = array();
	if (!_request('vhplab_latitude')) $erreurs['vhplab_latitude'] = _T('vhplab:latitude_required');
	if (!_request('vhplab_longitude')) $erreurs['vhplab_longitude'] = _T('vhplab:longitude_required');
	if (!_request('vhplab_zoom')) $erreurs['vhplab_zoom'] = _T('vhplab:zoom_required');
	// if (!_request('vhplab_address')) $erreurs['vhplab_address'] = _T('vhplab:address_required');
	return $erreurs;
}

function formulaires_editer_geo_article_traiter_dist($id_article='new', $retour='', $ajaxload='oui'){
	
	$message = array('editable'=>true, 'message_ok'=>'');
	
	$vhplab_latitude = _request('vhplab_latitude');
	$vhplab_longitude = _request('vhplab_longitude');
	$vhplab_zoom = _request('vhplab_zoom');
	(!_request('vhplab_address')) ? $vhplab_address = _request('vhplab_address') : $vhplab_address = '';
	
	// insertamos as coordenadas do artigo
	$result = sql_select('*', 'spip_vhplab_gis_liens', 'id_objet='.intval($id_article).' AND objet='.sql_quote("article"));
	if ($row = sql_fetch($result)){
		sql_updateq('spip_vhplab_gis', array('latitude' => $vhplab_latitude, 'longitude' => $vhplab_longitude, 'zoom' => $vhplab_zoom, 'address' => $vhplab_address), 'id_vhplab_gis='.intval($row['id_vhplab_gis']));
	} else {
		$id_vhplab_gis = sql_insertq("spip_vhplab_gis", array( 'latitude' => $vhplab_latitude, 'longitude' => $vhplab_longitude, 'zoom' => $vhplab_zoom, 'address' => $vhplab_address));
		sql_insertq('spip_vhplab_gis_liens', array('id_vhplab_gis' => intval($id_vhplab_gis), 'id_objet' => intval($id_article), 'objet' => 'article'));
	}
	
    // message
    return array(
        "editable" => true,
        "message_ok" => _T('vhplab:message_ok')
    );
	
}

?>
