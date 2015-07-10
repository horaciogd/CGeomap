<?php
define('_INTERDIRE_COMPACTE_HEAD_ECRIRE', true);
function url_encode($baliza) {
	return rawurlencode($baliza);
}
function extension($fichier){
    if (preg_match(',\.([^\.]+)$,', $fichier, $regs)) return $regs[1];
    return '';
}
function extraire_br($baliza) {
	$return = str_replace("\n", "", $baliza);
	$return = str_replace("\t", "", $return);
	$return = str_replace("\"", "'", $return);
	return $return;
}
function ajouter($baliza, $b=1){
   return $baliza + $b;
}
function deduire($baliza, $b=1){
   return $baliza - $b;
}
function multiplier($baliza, $b=1){
   return $baliza * $b;
}
function fracture($baliza, $b=1){
   return $baliza / $b;
}
?>