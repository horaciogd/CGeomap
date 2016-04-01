<?php
include ("squelettes/lang/cgeomap_es.php");
echo '
function Lang_ES() {
	this.id = "es";';
$fields = array_keys($GLOBALS[$GLOBALS['idx_lang']]);
$values = array_values($GLOBALS[$GLOBALS['idx_lang']]);
for ($i=0; $i<count($fields); $i++) {
	echo '
	this.'.$fields[$i].' = '.json_encode($values[$i]).';';
}
echo '
};';
?>