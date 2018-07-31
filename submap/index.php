<?php
// Include and instantiate the class.
require_once 'Mobile-Detect/Mobile_Detect.php';
$detect = new Mobile_Detect;
 
// Any mobile device (phones or tablets).
if ( $detect->isMobile() ) {
	// header('Location: http://www.vhplab.net/cgeomap-externo/phone.html');
	include("phone.html");
} else {
 	// header('Location: http://www.vhplab.net/cgeomap-externo/desktop.html');
	include("desktop.html");
}
?>