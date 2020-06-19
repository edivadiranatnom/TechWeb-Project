<?php
	include 'simple_html_dom.php';
	$url = $_GET['url'];
	$url = "../../".$url;
	$output = new simple_html_dom();
	$output = file_get_html($url);

	foreach($output->find("img") as $e){
		if (strpos($e->src, "dataset/") !==0){
			$e->src = "dataset/" . $e->src;
		}
	}

	foreach($output->find("link") as $e){
		if (strpos($e->href, "dataset/") !==0){
			$e->href = "dataset/" . $e->href;
		}
	}

	foreach($output->find("a") as $e){
		$e->target = "_blank";
	}

	foreach($output->find("body") as $e){
		echo $e;
	}

 ?>