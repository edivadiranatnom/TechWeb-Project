<?php

	$review = $_POST['review'];
	$url = $_POST['url'];
	$mail = $_POST['mail'];

	$html = file_get_contents("../../../dataset/".$url);
	$doc = new DomDocument('1.0', 'utf-8');
	$doc->formatOutput = TRUE;
	$doc->preserveWhiteSpace = FALSE;
	libxml_use_internal_errors(true);
	$doc->loadHTML($html);
	libxml_clear_errors();

	$script = $doc->getElementById($mail);

	if($script==NULL){

		$head = $doc->documentElement->getElementsByTagName('head')->item(0);
		$toAppendRev = $doc->createElement('script', $review);
		$toAppendRev->setAttribute('type', 'application/ld+json');
		$toAppendRev->setAttribute('id', $mail);
		$toAppendRev = $doc->importNode($toAppendRev, true);
		$head->appendChild($toAppendRev);

	} else {

		$head = $doc->documentElement->getElementsByTagName('head')->item(0);
		$toAppendRev = $doc->createElement('script', $review);
		$toAppendRev->setAttribute('type', 'application/ld+json');
		$toAppendRev->setAttribute('id', $mail);
		$toAppendRev = $doc->importNode($toAppendRev, true);
		$head->replaceChild($toAppendRev, $script);

	}

	$doc->saveHTMLFile("../../../dataset/".$url);

?>
