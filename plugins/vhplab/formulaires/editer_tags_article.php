<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function formulaires_editer_tags_article_charger_dist($id_article='new', $retour=''){
	
	include_spip('inc/autoriser');
	
	$valeurs['tags'] = $tags;
	$valeurs['id_article'] = $id_article;
	
	if (!autoriser('modifier', 'article', $id_article))
		$valeurs['editable'] = false;

	return $valeurs;
}

function formulaires_editer_tags_article_verifier_dist($id_article='new', $retour=''){
	$erreurs = array();
	if (!_request('tags')) {
		$erreurs['tags'] = _T('vhplab:tags_campo_obligatorio');
	}
	return $erreurs;
}

function formulaires_editer_tags_article_traiter_dist($id_article='new', $retour=''){
	
	$message = array('editable'=>true, 'message_ok'=>'');
	
	$tags = _request('tags');
	$array_tags = split(',', $tags);
	
	// 4 insertamos as tags do artigo
		$txt = '4';
		for ($i=0; $i<count($array_tags); $i++) {
			$tag = trim($array_tags[$i]);
			$type = 'tags';
			if (strlen($tag)>3) {
				$result = sql_select("*", "spip_mots", "titre=" . sql_quote($tag));
				if ($row = sql_fetch($result)){
					$result = sql_insertq("spip_mots_liens", array('id_mot' =>$row['id_mot'], 'id_objet' => $id_article, 'objet' => 'article'));
					$message .= _T('vhplab:tags_insert_ok_1');
				} else {
					$result = sql_select("*", "spip_groupes_mots", "titre=" . sql_quote($type));
					if ($row = sql_fetch($result)) {
						$c = array(
							'titre' => $tag,
							'id_groupe' => $row['id_groupe'],
							'type' => $type,
							'maj' => $date,
						);
						$id_nova_mot = sql_insertq("spip_mots", $c);
						if ($id_nova_mot){
							$result = sql_insertq("spip_mots_liens", array('id_mot' => $id_nova_mot, 'id_objet' => $id_article, 'objet' => 'article'));
							$message .= _T('vhplab:tags_insert_ok_2');
						}
					}
				}
			}
		}
	
	// borra la cache pero no se como va:
	// http://programmer.spip.net/The-processes
	/*
	include_spip('inc/invalideur');
	suivre_invalideur("id='id_article/$id_article'");
	*/
	if ($retour) {
		include_spip('inc/headers');
		$message .= redirige_formulaire($retour);
	}
	
	return $message;
	
}

?>
