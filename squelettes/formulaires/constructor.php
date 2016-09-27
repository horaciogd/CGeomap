<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function formulaires_constructor_charger_dist($id_auteur='new', $retour='', $ajaxload='oui'){
	include_spip('inc/autoriser');
	include_spip('base/abstract_sql');
	$result = sql_select('*', 'spip_auteurs', 'nom LIKE' .sql_quote('%explorer%'));
	$n = sql_count($result);
	$valeurs = array(
		'nom'=>'explorer_'.$n,
		'login'=>'explorer_'.$n,
		'email'=>'info@cgeomap.eu',
		'pass'=>'guestcgeo',
		'editable'=>true
	);
	if (!autoriser('webmestre')) $valeurs['editable'] = false;
	return $valeurs;
}

function formulaires_constructor_verifier_dist($id_auteur='new', $retour='', $ajaxload='oui'){
	$erreurs = array();
	if (!_request('nom')) $erreurs['nom'] = _T('cgeomap:required_nom');
	if (!_request('email')) $erreurs['email'] = _T('cgeomap:required_email');
	if (!_request('login')) $erreurs['login'] = _T('cgeomap:required_login');
	if (!_request('pass')) $erreurs['pass'] = _T('cgeomap:required_pass');
	if (!_request('base_url')) $erreurs['base_url'] = _T('cgeomap:required_base_url');
	if (!_request('qr_url')) $erreurs['qr_url'] = _T('cgeomap:required_qr_url');
	if (!_request('image')) $erreurs['image'] = _T('cgeomap:required_image');
	return $erreurs;
}

function formulaires_constructor_traiter_dist($id_auteur='new', $retour='', $ajaxload='oui'){
	include_spip('base/abstract_sql');
	include_spip('inc/texte');
	include_spip('inc/auth');
	include_spip('action/editer_auteur');
	include_spip('action/editer_article');
	include_spip('action/editer_document');
	include_spip('inc/autoriser');
	
	$nom = _request('nom');
	$email = _request('email');
	$login = _request('login');
	$pass = _request('pass');
	$base_url = _request('base_url');
	$qr_url = _request('qr_url');
	$image = _request('image');
	$ajouter_documents = charger_fonction('ajouter_documents', 'action');
	$id_editeur = $GLOBALS['visiteur_session']['id_auteur'];
	
	if (autoriser('webmestre')) {
		$id_auteur = auteur_inserer('spip');
		if ($id_auteur) {
			auteur_modifier($id_auteur, array(
				'nom'=> $nom,
				'email'=> $email,
				'statut'=>'1comite')
			);
			auth_modifier_login('spip', $login, $id_auteur);
			auth_modifier_pass('spip', $login, $pass, $id_auteur);
			// primera entrada
			$rubrique = 1;
			// 1 creamos un articulo vacio
			$id_article = insert_article($rubrique);
			if ($id_article) {
				auteur_associer($id_auteur, array('article' => intval($id_article)));
				auteur_dissocier($id_editeur, array('article' => intval($id_article)));
				// 2 actualizampos los campos del articulo
				sql_updateq('spip_articles', array(
					'titre' => 'Bienvenida',
					'soustitre' => 'Tu primer artículo',
					'id_rubrique' => $rubrique,
					'statut' => 'publie',
					'date' => date('Y-m-d H:i:s')),
					'id_article='.intval($id_article)
				);
				// 3 insertamos las coordenadas del articulo
				$latitude = rand(-90000, 90000)/1000;
				$longitude = rand(-180000, 180000)/1000;
				$zoom = 8;
				$id_vhplab_gis = sql_insertq("spip_vhplab_gis", array( 'latitude' => $latitude, 'longitude' => $longitude, 'zoom' => $zoom, 'address' => ''));
				sql_insertq('spip_vhplab_gis_liens', array('id_vhplab_gis' => intval($id_vhplab_gis), 'id_objet' => intval($id_article), 'objet' => 'article'));
				// 5 asociamos las palabras clave al articulo
				sql_insertq('spip_mots_liens', array( 'id_mot' => 1, 'id_objet' => intval($id_article), 'objet' => 'article'));
				sql_insertq('spip_mots_liens', array( 'id_mot' => 5, 'id_objet' => intval($id_article), 'objet' => 'article'));
				// 6 hacemos una copia de la imagen inicial
				$file = array('name' => 'cgeomap_explorer_banner_1100x591.jpg', 'tmp_name' => $image);
				$id_document = $ajouter_documents('new', array(0 => $file), 'article', intval($id_article), 'image');
				sql_updateq('spip_documents', array('statut' => 'publie', 'date_publication' => date('Y-m-d H:i:s')), 'id_document='.intval($id_document[0]));
				sql_insertq('spip_documents_liens', array('id_document' => intval($id_document[0]), 'id_objet' => intval($id), 'objet' => 'article', 'vu' => 'oui'));
				// 7 procesamos los módulos y actualizamos el texto del artículo
				$texte = '<block class="audiovisuel">
<module class="text" name="Bienvenid@ a CGeomap!">Con tu cuenta Explorer podrás empezar a construir rutas audiovisuales locativas y cartografiar tu entorno.</module>
<module class="media" name="Explorer"><image'.$id_document[0].'></module>
<module class="text" name="Edita y publica contenidos">Este editor online te permitirá posicionar contenidos audiovisuales, accessibles desde tu smartphone (web app) y/o con la app CGeomap para Android y IOS. 
Para aprender a crear entradas locativas en pocos minutos, accede a la página de tutoriales (icono de información en la esquina superior derecha del editor).</module>
<module class="text" name="Contacta con nosotr@s">Estamos a tu disposición para ayudarte a crear con CGeomap, ¡la tierra, el mar y las nubes esperan tus contenidos!.</module>
</block>';
				sql_updateq('spip_articles', array('texte' => $texte), 'id_article='.intval($id_article));
				// 8 creamos el qr y lo adjuntamos como documento
				$file = array('name' => 'article_'.$id_article.'_qr.png', 'tmp_name' => $qr_url.urlencode($base_url.'author='.$id_auteur.'&nodo='.$id_article));
				$descriptif = "qr";
				$id_document = $ajouter_documents('new', array(0 => $file), 'article', intval($id_article), 'image');
				sql_updateq('spip_documents', array('descriptif' => $descriptif, 'statut' => 'publie', 'date_publication' => date('Y-m-d H:i:s')), 'id_document='.intval($id_document[0]));
				sql_insertq('spip_documents_liens', array('id_document' => intval($id_document[0]), 'id_objet' => intval($id_article), 'objet' => 'article', 'vu' => 'oui'));

			}
		}
	}
}

?>