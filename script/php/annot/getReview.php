<?php

	$mail = $_GET["mail"];
	$url = $_GET["url"];
	$html = file_get_contents($url);
	$doc = new DomDocument();
	libxml_use_internal_errors(true);
	$doc->loadHTML($html);
	libxml_clear_errors();
	$xpath = new DOMXpath($doc);
	$scripts = $doc->getElementsByTagName('script');
	$scripts = $xpath->query('//script[@type="application/ld+json" and @id]');
	$reviewIndex=1;
	$review = $doc->getElementById($mail);

	if($scripts->length === 0){
		$data = array("isRev"=>"No review", "revIndex"=>$reviewIndex);
		die(json_encode($data));

	}else if($scripts->length > 0){

		if($review){
			$review = preg_replace('/^\s*\/\/<!\[CDATA\[([\s\S]*)\/\/\]\]>\s*\z/', '$1', $review->textContent);
			die(json_encode($review, JSON_UNESCAPED_SLASHES));

		}else{
			$reviewIndex = ($scripts->length)+1;
			$data = array("isRev"=>"No review", "revIndex"=>$reviewIndex);
			die(json_encode($data));
		}

	}

?>
