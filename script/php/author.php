<?php

	$users=json_decode(file_get_contents('../../users.json'), true);
	$chiaveVal="";
	foreach ($users as $k => $v) {
			if($_GET['email']==$v['email']) $chiaveVal=$k;
	}

	$json=json_decode(file_get_contents('../../events.json'), true);

	$i3=0;

	$isAuthor[] = Array();

	foreach($json as $key => $val) {

		foreach ($val['submissions'] as $key => $value) {

			foreach($value['authors'] as $chiave => $valore){

				if ($valore==$chiaveVal){
					$isAuthor[$i3]=$val['conference'];
					$i3++;
					$isAuthor[$i3]=$value['title'];
					$i3++;
					$isAuthor[$i3]=$value['url'];
					$i3++;
				}

			}

		}

	}

	$output=json_encode($isAuthor);
	echo $output;

?>
