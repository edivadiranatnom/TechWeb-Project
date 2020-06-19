<?php

	$isChair[]=Array();
	$i=0;
	$users=json_decode(file_get_contents('../../users.json'), true);
	$chiaveVal="";
		foreach($users as $key => $val) {
			if($_REQUEST['email']==$val['email']) $chiaveVal=$key;
		}

	$json=json_decode(file_get_contents('../../events.json'), true);

	foreach($json as $key => $val) {

			foreach ($val['chairs'] as $chiave => $valore) {
				if($valore==$chiaveVal){
					$isChair[$i]=$val['conference'];
			 		$i++;
			 		$isChair[$i]=$val['acronym'];
			 		$i++;
			 	}
			}

	}

	$output=json_encode($isChair);
	echo $output;

?>
