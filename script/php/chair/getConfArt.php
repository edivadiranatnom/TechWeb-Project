<?php
	$conf = $_GET["conf"];
	$events = json_decode(file_get_contents("../../../events.json"));
	$array = array();
	$obj = array();
	foreach ($events as $event) {
		if($event->conference==$conf){
			foreach ($event->submissions as $submission) {
				$obj=array("title"=>$submission->title, "url"=>$submission->url);
				array_push($array, $obj);
			}
		}
	}
	echo json_encode($array);
?>