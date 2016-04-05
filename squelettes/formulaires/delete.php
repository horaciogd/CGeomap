<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function formulaires_delete_charger_dist($id_article='new', $retour='', $ajaxload='oui'){
	include_spip('inc/autoriser');
	$valeurs['article'] = $article;
	$valeurs['ajaxload'] = $ajaxload;
	if (!autoriser('modifier', 'article', $id_article)) $valeurs['editable'] = false;
	return $valeurs;
}

function formulaires_delete_verifier_dist($id_article='new', $retour='', $ajaxload='oui'){
	$erreurs = array();
	if (!_request('article')) $erreurs['article'] = _T('cgeomap:required_article');
	return $erreurs;
}

function formulaires_delete_traiter_dist($id_article='new', $retour='', $ajaxload='oui'){
	include_spip('base/abstract_sql');
	include_spip('inc/texte');
	include_spip('action/editer_article');
	include_spip('inc/autoriser');
	$article = _request('article');
	include_spip('inc/autoriser');
	if (!autoriser('modifier', 'article', $article)) {
		$id_article = false;
		$result = sql_select('*', 'spip_auteurs_liens', 'id_objet='.intval($article).' AND objet='.sql_quote("article"));
		if ($row = sql_fetch($result)){
			if ($row['id_auteur'] == $id_auteur) $id_article = $article;
		}
	} else {
		$id_article = $article;
	}
	if ($id_article) {
		// 2 actualizampos los campos del articulo
		sql_updateq('spip_articles', array('statut' => 'poubelle'), 'id_article='.intval($id_article));
		// message
    	return array(
        	"editable" => true,
        	"message_ok" => _T('cgeomap:message_delete').':'.$id_article
		);
	} else {
		// message
    	return array(
        	"editable" => false,
        	"message_erreur" => _T('cgeomap:not_allowed')
		);
	}
}

?>