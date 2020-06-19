<?php


    $decision = $_POST["decision"];
    $url = $_POST["url"];
//inserisco la stringa del documento relativo in DomDocument e lo pulisco dagli errori e lo formatto    
    $html = file_get_contents("../../../dataset/".$url);
	$doc = new DomDocument('1.0', 'utf-8');
	$doc->formatOutput = TRUE;
	$doc->preserveWhiteSpace = FALSE;
	libxml_use_internal_errors(true);
	$doc->loadHTML($html);
	libxml_clear_errors();
//cerco l'head, mi creo la tag script, appendo la decisione del chair e appendo il nodo all'head
    $head = $doc->documentElement->getElementsByTagName('head')->item(0);
	$toAppendDec = $doc->createElement('script', $decision);
	$toAppendDec->setAttribute('type', 'application/ld+json');
	$toAppendDec = $doc->importNode($toAppendDec, true);
    $head->appendChild($toAppendDec);
    
    $doc->saveHTMLFile("../../../dataset/".$url);

    $json = $_POST["content"];
    file_put_contents('../../../decisions.json', $json);
?>
