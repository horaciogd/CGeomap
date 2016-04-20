<?php

    //set it to writable location, a place for temp generated PNG files
	$PNG_TEMP_DIR = dirname(__FILE__).DIRECTORY_SEPARATOR.'temp'.DIRECTORY_SEPARATOR;

	//html PNG location prefix
	$PNG_WEB_DIR = 'temp/';

	include "qrlib.php";    

    //ofcourse we need rights to create temp dir
	if (!file_exists($PNG_TEMP_DIR)) mkdir($PNG_TEMP_DIR);
    
	$filename = $PNG_TEMP_DIR.'test.png';

    //processing form input

    //remember to sanitize user input in real-life solution !!!
	$errorCorrectionLevel = 'H';
	$matrixPointSize = 10;
	
    if (isset($_GET['data'])) { 
		//it's very important!
		if (trim($_GET['data']) == '') die('data cannot be empty! <a href="?">back</a>');
		// user data
		$filename = $PNG_TEMP_DIR.'test'.md5($_GET['data'].'|'.$errorCorrectionLevel.'|'.$matrixPointSize).'.png';
        QRcode::png($_GET['data'], $filename, $errorCorrectionLevel, $matrixPointSize, 2);
    }
    //display generated file
    
    $im = imagecreatefrompng($PNG_WEB_DIR.basename($filename));
    header('Content-Type: image/png');
	imagepng($im);
	imagedestroy($im);
	
?>