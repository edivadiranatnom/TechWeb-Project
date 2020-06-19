<?php

include('../simple_html_dom.php');
	
$body = $_POST['body'];
$url = $_POST['url'];
	
$out = file_get_html("../../../dataset/".$url);
	
foreach($out->find("body") as $b) {
	$b->innertext = $body;
}

echo $out->save('../../../dataset/'.$url);

?>