<?php
$new=$_REQUEST['new'];
	$obj=json_decode(file_get_contents("../../users.json"), true);
    	foreach ($obj as $key => $value) {
			if($value['email']==$_REQUEST['email']){
				$obj[$key]['pass']=$new;
			}
		}
	file_put_contents("../../users.json", json_encode($obj));
?>