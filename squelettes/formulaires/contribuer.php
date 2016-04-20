<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function formulaires_contribuer_charger_dist($id_article='new', $retour='', $ajaxload='oui'){
	include_spip('inc/autoriser');
	/* article */
	$valeurs['article'] = $article;
	/* title & subtitle */
	$valeurs['title'] = $title;
	$valeurs['subtitle'] = $subtitle;
	/* visibility */
	$valeurs['visibility'] = $options;
	/* icon */
	$valeurs['icon'] = $icon;
	/* modules */
	$valeurs['audiovisuel'] = $audiovisuel;
	$valeurs['delete_media'] = $delete_media;
	$valeurs['delete_audio'] = $delete_audio;
	/* qr */
	$valeurs['base_url'] = $base_url;
	$valeurs['qr_url'] = $qr_url;
	/* cartography */
	$valeurs['latitude'] = $latitude;
	$valeurs['longitude'] = $longitude;
	$valeurs['zoom'] = $zoom;
	$valeurs['address'] = $address;
	/* Ajax ??? */
	$valeurs['ajaxload'] = $ajaxload;
	if (!autoriser('modifier', 'article', $id_article)) $valeurs['editable'] = false;
	return $valeurs;
}

function formulaires_contribuer_verifier_dist($id_article='new', $retour='', $ajaxload='oui'){
	$erreurs = array();
	/* article */
	if (!_request('article')) $erreurs['article'] = _T('cgeomap:required_article');
	/* title & subtitle */
	if ((!_request('title'))||(_request('title')=='')) $erreurs['title'] = _T('cgeomap:title');
	if ((!_request('subtitle'))||(_request('subtitle')=='')) $erreurs['subtitle'] = _T('cgeomap:required_subtitle');
	/* visibility */
	if (!_request('visibility')) $erreurs['visibility'] = _T('cgeomap:required_visibility');
	/* icon */
	if (!_request('icon')) $erreurs['icon'] = _T('cgeomap:required_icon');
	/* modules */
	if (!_request('audiovisuel')) $erreurs['audiovisuel'] = _T('cgeomap:required_audiovisuel');
	if (!_request('delete_media')) $erreurs['delete_media'] = _T('cgeomap:required_delete_media');
	if (!_request('delete_audio')) $erreurs['delete_audio'] = _T('cgeomap:required_delete_audio');
	/* cartography */
	if (!_request('latitude')) $erreurs['latitude'] = _T('cgeomap:latitude_required');
	if (!_request('longitude')) $erreurs['longitude'] = _T('cgeomap:longitude_required');
	if (!_request('zoom')) $erreurs['zoom'] = _T('cgeomap:zoom_required');
	return $erreurs;
}

function formulaires_contribuer_traiter_dist($id_article='new', $retour='', $ajaxload='oui'){
	include_spip('inc/autoriser');
	include_spip('base/abstract_sql');
	include_spip('inc/texte');
	include_spip('action/editer_article');
	include_spip('action/editer_document');
	include_spip('medias/action/supprimer_document');
	/* article */
	$article = _request('article');
	/* title & subtitle */
	$title = _request('title');
	$subtitle = _request('subtitle');
	/* visibility */
	$visibility = _request('visibility');
	/* icon */
	$icon = _request('icon');
	/* modules */
	$audiovisuel = _request('audiovisuel');
	$delete_media = _request('delete_media');
	$delete_audio = _request('delete_audio');
	/* qr */
	$base_url = _request('base_url');
	$qr_url = _request('qr_url');
	/* cartography */
	$latitude = _request('latitude');
	$longitude = _request('longitude');
	$zoom = _request('zoom');
	$address = _request('address');
	// otra informacion
	$date = date('Y-m-d H:i:s', time());
	$id_auteur = $GLOBALS['visiteur_session']['id_auteur'];
	$rubrique = 1;
	
	// 1 creamos un articulo vacio si se trata de una entrada nueva
	if (($article=='new')||($article==0)) {
		$id_article = insert_article($rubrique);
	} else {
		if (!autoriser('modifier', 'article', $article)) {
			$id_article = false;
			$result = sql_select('*', 'spip_auteurs_liens', 'id_objet='.intval($article).' AND objet='.sql_quote("article"));
			if ($row = sql_fetch($result)){
				if ($row['id_auteur'] == $id_auteur) $id_article = $article;
			}
		} else {
			$id_article = $article;
		}
	}
	
	if ($id_article) {
		// 2 actualizampos los campos del articulo
		sql_updateq('spip_articles', array('titre' => $title, 'soustitre' => $subtitle, 'id_rubrique' => $rubrique, 'statut' => 'publie', 'date' => $date), 'id_article='.intval($id_article));
		
		// 3 insertamos las coordenadas del articulo
		$result = sql_select('*', 'spip_vhplab_gis_liens', 'id_objet='.intval($id_article).' AND objet='.sql_quote("article"));
		if ($row = sql_fetch($result)){
			sql_updateq('spip_vhplab_gis', array('latitude' => $latitude, 'longitude' => $longitude, 'zoom' => $zoom, 'address' => $address), 'id_vhplab_gis='.intval($row['id_vhplab_gis']));
		} else {
			$id_vhplab_gis = sql_insertq("spip_vhplab_gis", array( 'latitude' => $latitude, 'longitude' => $longitude, 'zoom' => $zoom, 'address' => $address));
			sql_insertq('spip_vhplab_gis_liens', array('id_vhplab_gis' => intval($id_vhplab_gis), 'id_objet' => intval($id_article), 'objet' => 'article'));
		}
		
		// 4 desasociamos todas las palabras clave que pudiese tener el articulo
		sql_delete("spip_mots_liens", "id_objet='".intval($id_article)."' AND objet='article'");
		
		// 5 asociamos las palabras clave al articulo
		if ($visibility == 'default') sql_insertq('spip_mots_liens', array( 'id_mot' => 1, 'id_objet' => intval($id_article), 'objet' => 'article'));
		if ($visibility == 'qr') sql_insertq('spip_mots_liens', array( 'id_mot' => 2, 'id_objet' => intval($id_article), 'objet' => 'article'));
		if ($visibility == 'proximity') sql_insertq('spip_mots_liens', array( 'id_mot' => 3, 'id_objet' => intval($id_article), 'objet' => 'article'));
		sql_insertq('spip_mots_liens', array( 'id_mot' => intval($icon), 'id_objet' => intval($id_article), 'objet' => 'article'));
		
		// 7 procesamos los módulos y actualizamos el texto del artículo
		$texte = '';
		$texte .= "\n<block class=\"audiovisuel\">".vhplab_process_modules($audiovisuel, $id_article)."\n</block>";
		sql_updateq('spip_articles', array('texte' => $texte), 'id_article='.intval($id_article));
		
		// 8 creamos el qr y lo adjuntamos como documento
		$id_qr = '';
		$doc_result = sql_select('*', 'spip_documents_liens', 'id_objet='.intval($id_article).' AND objet='.sql_quote("article"));
		while ($doc = sql_fetch($doc_result)){
			$qr_result = sql_select('*', 'spip_documents', 'id_document='.intval($doc['id_document']).' AND descriptif='.sql_quote("qr"));
			if ($qr = sql_fetch($qr_result)){
				$id_qr = $doc['id_document'];
			}
		}
		$ajouter_documents = charger_fonction('ajouter_documents', 'action');
		$file = array('name' => 'article_'.$id_article.'_qr.png', 'tmp_name' => $qr_url.urlencode($base_url.$id_article));
		$descriptif = "qr";
		if ($id_qr!='') {
			//$id_document = $ajouter_documents($id_qr, array(0 => $file), 'article', intval($id_article), 'image');
			//sql_updateq('spip_documents', array('descriptif' => $descriptif), 'id_document='.intval($id_document[0]));
		} else {
			$id_document = $ajouter_documents('new', array(0 => $file), 'article', intval($id_article), 'image');
			sql_updateq('spip_documents', array('descriptif' => $descriptif), 'id_document='.intval($id_document[0]));
		}
		
		// 10 eliminamos los documentos borrados
		$supprimer_document = charger_fonction('supprimer_document','action');
		if ($delete_media!=false) {
			$media_list = explode(":", $delete_media);
			if (is_array($media_list)) {
				foreach ($media_list as $media) {
					sql_delete('spip_documents_liens', 'id_document='.$media);
					$supprimer_document($media);
					spip_log("supprimer document ".$media, 'upload');
				}
				unset($media);
			}
			unset($media_list);
		}
		if ($delete_audio!=false) {
			$audio_list = explode(":", $delete_audio);
			if (is_array($audio_list)) {
				foreach ($audio_list as $audio) {
					sql_delete('spip_documents_liens', 'id_document='.$audio);
					$supprimer_document($audio);
					spip_log("supprimer document ($type)".$audio, 'upload');
				}
				unset($audio);
			}
			unset($audio_list);
		}
				
		// ?
		$audiovisuel = '';
		
		// message
    	return array(
        	"editable" => true,
        	"message_ok" => _T('cgeomap:message_thanks').':'._T('cgeomap:message_ok').':'.$id_article
		);
    
	} else {
		// ?
		$audiovisuel = '';
		
		// message
    	return array(
        	"editable" => false,
        	"message_erreur" => _T('cgeomap:message_not_allowed')
		);
	}
}

function vhplab_process_modules($modules, $id) {
	// 9 revisamos los módulos para asociar los documentos subidos en el formulario 
	// del articulo y crear el texto corespondiente al mismo
	$ajouter_documents = charger_fonction('ajouter_documents', 'action');
	$txt = '';
	if ($modules!="false") {
		foreach ($modules as $module) {
			switch($module['type']) {
				case 'media':
					if (is_array($module['data'])) {
						$file = array('name' => $module['data']['name'], 'tmp_name' => $module['data']['mediumUrl']);
						$id_document = $ajouter_documents('new', array(0 => $file), 'article', intval($id), 'image');
						$txt .= "\n<module class=\"media\" name=\"".$module['header']."\"><image".$id_document[0]."></module>";
					} else {
						$txt .= "\n<module class=\"media\" name=\"".$module['header']."\"><image".$module['data']."></module>";
					}
					if (isset($module['delete_data'])) {
						if ($delete_data = intval($module['delete_data'])) {
							sql_delete('spip_documents_liens', 'id_document='.$delete_data);
							$supprimer_document = charger_fonction('supprimer_document','action');
							$supprimer_document($delete_data);
							spip_log("supprimer document ($type)".$delete_data, 'upload');
						}
					}
					break;
				case 'audio':
					if (is_array($module['data'])) {
						$file = array('name' => $module['data']['name'], 'tmp_name' => $module['data']['url']);
						$id_document = $ajouter_documents('new', array(0 => $file), 'article', intval($id), 'document');
						$txt .= "\n<module class=\"audio\" name=\"".$module['header']."\"><audio".$id_document[0]."></module>";
					} else {
						$txt .= "\n<module class=\"audio\" name=\"".$module['header']."\"><audio".$module['data']."></module>";
					}
					if (isset($module['delete_data'])) {
						if ($delete_data = intval($module['delete_data'])) {
							sql_delete('spip_documents_liens', 'id_document='.$delete_data);
							$supprimer_document = charger_fonction('supprimer_document','action');
							$supprimer_document($delete_data);
							spip_log("supprimer document ($type)".$delete_data, 'upload');
						}
					}
					break;
				case 'text':
					$txt .= "\n<module class=\"text\" name=\"".$module['header']."\">".$module['data']."</module>";
					break;
				case 'link':
					$txt .= "\n<module class=\"link\" name=\"".$module['header']."\">";
					foreach ($module['data'] as $link) {
						$txt .= "\n-* [".$link['text']."->".$link['href']."]";
					}
					$txt .= "\n</module>";
					break;
			}
		}
	}
	return $txt;
}
?>