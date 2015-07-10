<?php
/*
 * VHPlab base plugin
 * lat lng, tags, related, extra fields, etc
 *
 * Author:
 * Horacio González
 * (c) 2013 - Distribuído baixo licencia GNU/GPL
 *
 */
 
// Sécurité
if (!defined('_ECRIRE_INC_VERSION')) return;

/**
 * Installation/maj des tables VHPlab
 *
 * @param string $nom_meta_base_version
 * @param string $version_cible
 */
function vhplab_upgrade($nom_meta_base_version, $version_cible){
	$maj = array();
	// primera instalaciónn
	$maj['create'] = array(
		array('maj_tables', array('spip_vhplab_gis')),
		array('maj_tables', array('spip_vhplab_gis_liens')),
		array('maj_tables', array('spip_vhplab_related')),
		array('maj_tables', array('spip_vhplab_related_liens')),
		array('maj_tables', array('spip_vhplab_json')),
		array('maj_tables', array('spip_vhplab_json_liens')),
	);
	include_spip('base/upgrade');
	maj_plugin($nom_meta_base_version, $version_cible, $maj);
}

/**
 * Desinstallation/suppression des tables vhplab
 *
 * @param string $nom_meta_base_version
 */
function vhplab_vider_tables($nom_meta_base_version) {
	sql_drop_table("spip_vhplab_gis");
	sql_drop_table("spip_vhplab_gis_liens");
	sql_drop_table("spip_vhplab_related");
	sql_drop_table("spip_vhplab_related_liens");
	sql_drop_table("spip_vhplab_json");
	sql_drop_table("spip_vhplab_json_liens");
	effacer_meta($nom_meta_base_version);
}

?>
