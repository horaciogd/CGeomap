 <?php
header('Access-Control-Allow-Origin: *');
if (isset($_POST["reset"])) {
	$myfile = fopen("log.html", "w") or die("Unable to open file!");
} else {
	$myfile = fopen("log.html", "a") or die("Unable to open file!");
	$txt = $_POST["write"]."<br>\n";
	fwrite($myfile, $txt);
}
fclose($myfile);
?> 