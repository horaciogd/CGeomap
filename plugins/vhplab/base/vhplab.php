<?php
/*
 * VHPlab base plugin
 * lat lng, tags, related articles, related JSON data, extra fields, etc
 *
 * Author:
 * Horacio Gonz‡lez
 * (c) 2016 - Distribu’do baixo licencia GNU/GPL
 *
 */
if (!defined('_ECRIRE_INC_VERSION')) return;


function vhplab_declarer_tables_interfaces($interface) {

	// jointures: lat, lng, address
	
	$interface['tables_jointures']['spip_vhplab_gis'][] = 'vhplab_gis_liens';
	$interface['tables_jointures']['spip_vhplab_gis_liens'][] = 'vhplab_gis';
	
	$interface['tables_jointures']['spip_articles'][] = 'vhplab_gis_liens';
	$interface['tables_jointures']['spip_auteurs'][] = 'vhplab_gis_liens';
	$interface['tables_jointures']['spip_breves'][] = 'vhplab_gis_liens';
	$interface['tables_jointures']['spip_documents'][] = 'vhplab_gis_liens';
	$interface['tables_jointures']['spip_groupes_mots'][] = 'vhplab_gis_liens';
	$interface['tables_jointures']['spip_mots'][] = 'vhplab_gis_liens';
	$interface['tables_jointures']['spip_rubriques'][] = 'vhplab_gis_liens';
	$interface['tables_jointures']['spip_syndic'][] = 'vhplab_gis_liens';
	
	// jointures: related articles
	
	$interface['tables_jointures']['spip_vhplab_related'][] = 'vhplab_related_liens';
	$interface['tables_jointures']['spip_vhplab_related_liens'][] = 'vhplab_related';
	
	$interface['tables_jointures']['spip_articles'][] = 'vhplab_related_liens';
	$interface['tables_jointures']['spip_breves'][] = 'vhplab_related_liens';
	
	// jointures: related JSON data
	
	$interface['tables_jointures']['spip_vhplab_json'][] = 'vhplab_json_liens';
	$interface['tables_jointures']['spip_vhplab_json_liens'][] = 'vhplab_json';
	
	$interface['tables_jointures']['spip_articles'][] = 'vhplab_json_liens';
	$interface['tables_jointures']['spip_breves'][] = 'vhplab_json_liens';

	// tables: lat, lng, address
	
	$interface['table_des_tables']['vhplab_gis'] = 'vhplab_gis';
	$interface['table_des_tables']['vhplab_gis_liens'] = 'vhplab_gis_liens';
	
	// tables: related articles
	
	$interface['table_des_tables']['vhplab_related'] = 'vhplab_related';
	$interface['table_des_tables']['vhplab_related_liens'] = 'vhplab_related_liens';
	
	// tables: related JSON data
	
	$interface['table_des_tables']['vhplab_json'] = 'vhplab_json';
	$interface['table_des_tables']['vhplab_json_liens'] = 'vhplab_json_liens';
	
	return $interface;
	
}


function vhplab_declarer_tables_objets_sql($tables){

	/* Declaraci—n de la tabla vhplab_gis: lat, lng, address */
	$tables['spip_vhplab_gis'] = array(
	
		/* Declaraci—n principal */
		'table_objet' => 'vhplab_gis',
		'table_objet_surnoms' => array('vhplab_gis'),
		'type' => 'vhplab_gis',
		'type_surnoms' => array('vhplab_gis'),

		/* Declaraci—n de la tabla */
		'field' => array(
			'id_vhplab_gis' => 'BIGINT(21) NOT NULL AUTO_INCREMENT',
			'latitude' => 'DOUBLE NULL',
			'longitude' => 'DOUBLE NULL',
			'zoom' => 'TINYINT(4) NULL',
			"address" => "TEXT DEFAULT '' NOT NULL"
		),
		'key' => array(
			"PRIMARY KEY" => "id_vhplab_gis",
		),
		'principale' => 'oui'
	);

	$spip_vhplab_gis_liens = array(
		"id_vhplab_gis" => "BIGINT(21) NOT NULL",
		"objet" => "VARCHAR(25) DEFAULT '' NOT NULL",
		"id_objet" => "BIGINT(21) NOT NULL"
	);

	$spip_vhplab_gis_liens_key = array(
		"PRIMARY KEY" => "id_vhplab_gis,id_objet,objet",
		"KEY id_objet" => "id_vhplab_gis"
	);

	$tables_auxiliaires['spip_vhplab_gis_liens'] = array(
		'field' => &$spip_vhplab_gis_liens,
		'key' => &$spip_vhplab_gis_liens_key
	);
	
	/* Declaraci—n de la tabla vhplab_related: related articles */
	$tables['spip_vhplab_related'] = array(
	
		/* Declaraci—n principal */
		'table_objet' => 'vhplab_related',
		'table_objet_surnoms' => array('vhplab_related'),
		'type' => 'vhplab_related',
		'type_surnoms' => array('vhplab_related'),

		/* Declaraci—n de la tabla */
		'field' => array(
			"id_vhplab_related" => "BIGINT(21) NOT NULL AUTO_INCREMENT",
			"objet_related" => "VARCHAR(25) DEFAULT '' NOT NULL",
			"id_objet_related" => "BIGINT(21) NOT NULL"
		),
		'key' => array(
			"PRIMARY KEY" => "id_vhplab_related",
		),
		'principale' => 'oui'
	);

	$spip_vhplab_related_liens = array(
		"id_vhplab_related" => "BIGINT(21) NOT NULL",
		"objet" => "VARCHAR(25) DEFAULT '' NOT NULL",
		"id_objet" => "BIGINT(21) NOT NULL"
	);

	$spip_vhplab_related_liens_key = array(
		"PRIMARY KEY" => "id_vhplab_related,id_objet,objet",
		"KEY id_objet" => "id_vhplab_related"
	);

	$tables_auxiliaires['spip_vhplab_related_liens'] = array(
		'field' => &$spip_vhplab_related_liens,
		'key' => &$spip_vhplab_related_liens_key
	);
	
	/* Declaraci—n de la tabla vhpgis_json: related JSON data */
	$tables['spip_vhplab_json'] = array(
	
		/* Declaraci—n principal */
		'table_objet' => 'vhplab_json',
		'table_objet_surnoms' => array('vhplab_json'),
		'type' => 'vhplab_json',
		'type_surnoms' => array('vhplab_json'),

		/* Declaraci—n de la tabla */
		'field' => array(
			"id_vhplab_json" => "BIGINT(21) NOT NULL AUTO_INCREMENT",
			"id_json" => "BIGINT(21) NOT NULL"
		),
		'key' => array(
			"PRIMARY KEY" => "id_vhplab_json",
		),
		'principale' => 'oui'
	);

	$spip_vhplab_json_liens = array(
		"id_vhplab_json" => "BIGINT(21) NOT NULL",
		"objet" => "VARCHAR(25) DEFAULT '' NOT NULL",
		"id_objet" => "BIGINT(21) NOT NULL"
	);

	$spip_vhplab_json_liens_key = array(
		"PRIMARY KEY" => "id_vhplab_json,id_objet,objet",
		"KEY id_objet" => "id_vhplab_json"
	);

	$tables_auxiliaires['spip_vhplab_json_liens'] = array(
		'field' => &$spip_vhplab_json_liens,
		'key' => &$spip_vhplab_json_liens_key
	);
	
	return $tables;
}

function vhplab_declarer_tables_auxiliaires($tables_auxiliaires) {
	
	/* Declaraci—n de la tabla vhplab_liens: lat, lng, address */
	
	$spip_vhplab_gis_liens = array(
		"id_vhplab_gis" => "BIGINT(21) NOT NULL",
		"objet" => "VARCHAR(25) DEFAULT '' NOT NULL",
		"id_objet" => "BIGINT(21) NOT NULL");

	$spip_vhplab_gis_liens_key = array(
		"PRIMARY KEY" => "id_vhplab_gis,id_objet,objet",
		"KEY id_objet" => "id_vhplab_gis");

	$tables_auxiliaires['spip_vhplab_gis_liens'] = array(
		'field' => &$spip_vhplab_gis_liens,
		'key' => &$spip_vhplab_gis_liens_key);

	/* Declaraci—n de la tabla vhplab_related_liens: related articles */
	
	$spip_vhplab_related_liens = array(
		"id_vhplab_related" => "BIGINT(21) NOT NULL",
		"objet" => "VARCHAR(25) DEFAULT '' NOT NULL",
		"id_objet" => "BIGINT(21) NOT NULL");

	$spip_vhplab_related_liens_key = array(
		"PRIMARY KEY" => "id_vhplab_related,id_objet,objet",
		"KEY id_objet" => "id_vhplab_related");

	$tables_auxiliaires['spip_vhplab_related_liens'] = array(
		'field' => &$spip_vhplab_related_liens,
		'key' => &$spip_vhplab_related_liens_key);
	
	/* Declaraci—n de la tabla vhpgis_json_liens: related JSON data */
	
	$spip_vhplab_json_liens = array(
		"id_vhplab_json" => "BIGINT(21) NOT NULL",
		"objet" => "VARCHAR(25) DEFAULT '' NOT NULL",
		"id_objet" => "BIGINT(21) NOT NULL");

	$spip_vhplab_json_liens_key = array(
		"PRIMARY KEY" => "id_vhplab_json,id_objet,objet",
		"KEY id_objet" => "id_vhplab_json");

	$tables_auxiliaires['spip_vhplab_json_liens'] = array(
		'field' => &$spip_vhplab_json_liens,
		'key' => &$spip_vhplab_json_liens_key);
			
	return $tables_auxiliaires;
}



?>