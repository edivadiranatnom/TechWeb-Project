<?php

	session_start();
	$_SESSION['email'] = $_REQUEST['email'];
	$_SESSION['pass'] = $_REQUEST['pass'];
	$_SESSION['id'] = session_id();
	$json=file_get_contents("../../users.json");
	$obj=json_decode($json, true);
	$email=" ";
	$pass=" ";
	foreach ($obj as $key => $value) {
		if($value['email']==$_SESSION['email']){
			$email=$value['email'];
			if($value['pass']==$_SESSION['pass']){
				$pass=$value['pass'];
			}
		}
	}
	if($email!=" " && $pass!=" "){
		die("OK");
	}
	if($email==" "){
		echo "wrong email";
		exit(1);
	}
	if($pass==" "){
		echo "wrong password";
		exit(1);
	}

?>
