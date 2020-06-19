<?php
$json=json_decode(file_get_contents("../../users.json"), true);

foreach($json as $key => $value){
	foreach ($value as $k => $val) {
		if($_REQUEST['email']==$value['email']){
			$name=$value['given_name'];
		}
	}
}

echo($name);

?>
