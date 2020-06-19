<?php
    $url = $_GET['url'];
    
//inserisco la stringa del documento relativo in DomDocument e lo pulisco dagli errori e lo formatto
    $html = file_get_contents("../../../dataset/".$url);
    $doc = new DomDocument();
	libxml_use_internal_errors(true);
	$doc->loadHTML($html);
	libxml_clear_errors();
	//tramite xpath prendo le review del paper
	$xpath = new DOMXpath($doc);
	$scripts = $doc->getElementsByTagName('script');
	$scripts = $xpath->query('//script[@type="application/ld+json" and @id]');
    $jsonRevs = array(); //creo array review e lo ritorno
    foreach($scripts as $value){
        array_push($jsonRevs, $value->textContent);
    }
    echo json_encode($jsonRevs);
?>
