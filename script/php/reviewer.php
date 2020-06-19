<?php

	$users=json_decode(file_get_contents('../../users.json'), true);
	$chiaveVal="";
		foreach($users as $key => $val) {
			if($_GET['email']==$val['email']) $chiaveVal=$key;
		}

	$json=json_decode(file_get_contents('../../events.json'), true);

	$i2=0;
	$art1=1;

	$isReviewer[] = Array();

	foreach($json as $key => $val) {

			foreach ($val['submissions'] as $key => $value) {

				foreach($value['reviewers'] as $chiave => $valore){
					if ($valore==$chiaveVal){
						$isReviewer[$i2]=$val['conference'];
						$i2++;
					  	$isReviewer[$i2]=$value['title'];
					  	$i2++;
					  	$isReviewer[$i2]=$value['url'];
					  	$i2++;
					}
				}
			}

	}

	$output=json_encode($isReviewer);
	echo $output;

?>
