<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function formulaires_batch_charger_dist($id_article='new', $retour='', $ajaxload='oui'){
	include_spip('inc/autoriser');
	/* markers */
	$valeurs['markers'] = $markers;
	if (!autoriser('webmestre')) $valeurs['editable'] = false;
	return $valeurs;
}

function formulaires_batch_verifier_dist($id_article='new', $retour='', $ajaxload='oui'){
	$erreurs = array();
	/* markers */
	if (!_request('markers')) $erreurs['markers'] = _T('cgeomap:required_markers');
	return $erreurs;
}

function formulaires_batch_traiter_dist($id_article='new', $retour='', $ajaxload='oui'){
	include_spip('inc/autoriser');
	include_spip('base/abstract_sql');
	include_spip('inc/texte');
	include_spip('action/editer_article');
	include_spip('action/editer_document');
	include_spip('medias/action/supprimer_document');
	/* markers */
	$markers = _request('markers');
	// otra informacion
	$id_auteur = $GLOBALS['visiteur_session']['id_auteur'];
	$rubrique = 1;
	$auteur_id = 3;
	$visibility_id = 1;
	$category_id = 8;
	$icon_id = 5;
	
	$lines = explode ("\r", $markers);
	if (is_array($lines)) {
		for ($i=0; $i<=count($lines); $i++) {
			$data = explode("#", $lines[$i]);
			if ((is_array($data))&&(count($data)==3)) {
				// 1 creamos un articulo vacio
   				$id_article = insert_article($rubrique);
   				if ($id_article) {
   				
   					// 2 actualizampos los campos del articulo
					sql_updateq('spip_articles', array('titre' => trim($data[0]), 'soustitre' => trim($data[1]), 'id_rubrique' => $rubrique, 'statut' => 'publie', 'date' => date('Y-m-d H:i:s')), 'id_article='.intval($id_article));
					
					// 3 insertamos las coordenadas del articulo
					$geo = explode (" ", trim($data[2]));
					if (is_array($geo)) {
						$id_vhplab_gis = sql_insertq("spip_vhplab_gis", array( 'latitude' => $geo[0], 'longitude' => $geo[1], 'zoom' => 10, 'address' => ''));
						sql_insertq('spip_vhplab_gis_liens', array('id_vhplab_gis' => intval($id_vhplab_gis), 'id_objet' => intval($id_article), 'objet' => 'article'));
					}
					
					// 4 desasociamos todos loss autores que pudiese tener asociados el articulo
					sql_delete("spip_auteurs_liens", "id_objet='".intval($id_article)."' AND objet='article'");
					// asociamos el autor adecuado al articulo
					sql_insertq('spip_auteurs_liens', array( 'id_auteur' => intval($auteur_id), 'id_objet' => intval($id_article), 'objet' => 'article', 'vu' => 'non'));
		
					// 5 asociamos las palabras clave al articulo
					sql_insertq('spip_mots_liens', array( 'id_mot' => intval($visibility_id), 'id_objet' => intval($id_article), 'objet' => 'article'));
					sql_insertq('spip_mots_liens', array( 'id_mot' => intval($category_id), 'id_objet' => intval($id_article), 'objet' => 'article'));
					sql_insertq('spip_mots_liens', array( 'id_mot' => intval($icon_id), 'id_objet' => intval($id_article), 'objet' => 'article'));
					
					// 8 creamos el qr y lo adjuntamos como documento
					$id_qr = '';
					$doc_result = sql_select('*', 'spip_documents_liens', 'id_objet='.intval($id_article).' AND objet='.sql_quote("article"));
					while ($doc = sql_fetch($doc_result)) {
						$qr_result = sql_select('*', 'spip_documents', 'id_document='.intval($doc['id_document']).' AND descriptif='.sql_quote("qr"));
						if ($qr = sql_fetch($qr_result)){
							$id_qr = $doc['id_document'];
						}
					}
					$ajouter_documents = charger_fonction('ajouter_documents', 'action');
					$file = array('name' => 'article_'.$id_article.'_qr.png', 'tmp_name' => $qr_url.urlencode($base_url.'spip.php?author='.$id_auteur.'&nodo='.$id_article));
					$descriptif = "qr";
					if ($id_qr!='') {
						$url = $qr_url.urlencode($base_url.'spip.php?author='.$id_auteur.'&nodo='.$id_article);
						$img = 'IMG/png/'.'article_'.$id_article.'_qr.png';
						file_put_contents($img, file_get_contents($url));
					} else {
						$id_document = $ajouter_documents('new', array(0 => $file), 'article', intval($id_article), 'image');
						sql_updateq('spip_documents', array('descriptif' => $descriptif, 'statut' => 'publie', 'date_publication' => date('Y-m-d H:i:s')), 'id_document='.intval($id_document[0]));
						sql_insertq('spip_documents_liens', array('id_document' => intval($id_document[0]), 'id_objet' => intval($id_article), 'objet' => 'article', 'vu' => 'oui'));
					}
					
				}
			}
		}
	}
	
	// message
    return array(
       	"editable" => true,
       	"message" => count($lines),
	);
}

?>