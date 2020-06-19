<?php
	$articles[]= array();
	$json=json_decode(file_get_contents("../../events.json", true));
	foreach($json as $k => $val){
		foreach ($val['conference'] as $key => $value) {
			$articles=array('articolo' => $value);
		}
	}
	var_dump($articles);
?>