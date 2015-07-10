<?php
/*
 * VHPlab base plugin
 * lat lng, tags, related articles, related JSON data, extra fields, etc
 *
 * Author:
 * Horacio Gonz‡lez
 * (c) 2015 - Distribu’do baixo licencia GNU/GPL
 *
 */

// --------------------------------
// inserta no head da parte PRIVADA
// --------------------------------
function vhplab_header_prive($flux) {
	if ((_request('exec')=='article')||(_request('exec')=='configurer_vhplab')) {
		if (function_exists('lire_config')) $key = lire_config("vhplab/api_key");
		$flux .= '
		<!-- VHPlab plugin spip 3.0 -->
		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key='.$key.'&sensor=true"></script>
		<link rel="stylesheet" type="text/css" media="all" href="'._DIR_PLUGIN_VHPLAB.'css/vhplab.css" />
		<script type="text/javascript" src="'._DIR_PLUGIN_VHPLAB.'js/vhplab_geo.js"></script>
		<script type="text/javascript" src="'._DIR_PLUGIN_VHPLAB.'js/cgeomap.js"></script>
		';
	}
	return $flux;
}

// --------------------------------
// inserta o formulario para modificar os doatos xeogr‡ficos dun artigo
// --------------------------------
function vhplab_affiche_milieu($flux) {
	if ($flux['args']['exec'] == 'article') {
		$contexte['id_article'] = $flux["args"]["id_article"];
		$affiche = recuperer_fond('prive/squelettes/fields_article', $contexte, array('ajax'=>true));
		if (($p = strpos($flux['data'],'<!--affiche_milieu-->'))!==false) {
			$flux['data'] = substr_replace($flux['data'], $affiche, $p, 0);
		}
	}
    return $flux;
}

// --------------------------------
// inserta o formulario para modificar o iconos do marcador dun artigo
// --------------------------------
function vhplab_affiche_gauche($flux){
	if ($flux['args']['exec'] == 'article') {
		$contexte['id_article'] = $flux["args"]["id_article"];
		$affiche = recuperer_fond('prive/squelettes/icon_article', $contexte, array('ajax'=>true));
		$flux['data'] .= $affiche;
    }
    return $flux;
}

// --------------------------------
// inserta no head da parte PUBLICA
// --------------------------------
function vhplab_affichage_final($flux){
	if ((strpos($flux, '<div id="map_') == true)&&(function_exists('lire_config'))) {
		$key = lire_config("vhplab/api_key");
		$incHead = '<!-- VHPlab GIS plugin spip 3.0 '.generer_url_public('vhplab.js').' -->
		<link rel="stylesheet" href="'._DIR_PLUGIN_VHPLAB.'css/vhplab.css" type="text/css" />
		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key='.$key.'&sensor=true"></script>
		<script type="text/javascript" src="'._DIR_PLUGIN_VHPLAB.'js/vhplab.js"></script>
	';
		return substr_replace($flux, $incHead, strpos($flux, '</head>'), 0);
	} else {
		return $flux;
	}
}

function vhplab_insert_head($flux){
	if (function_exists('lire_config')) {
		$key = lire_config("vhplab/api_key");
		$flux .= '<!-- VHPlab GIS plugin spip 3.0 '.generer_url_public('vhplab.js').' -->
		<link rel="stylesheet" href="'._DIR_PLUGIN_VHPLAB.'css/vhplab.css" type="text/css" />
		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key='.$key.'&sensor=true"></script>
		<script type="text/javascript" src="'._DIR_PLUGIN_VHPLAB.'js/vhplab.js"></script>
	';
	}
	return $flux;
}

?>