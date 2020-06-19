<?php

$json=json_decode(file_get_contents("../../mutex.json"), true);

//funzione che controlla se il documento ricevuto e' utilizzato da qualcuno
function check($json){
		$p=current($json);
		foreach ($p as $key => $value){
			if($key==$_REQUEST['document']){
				if($value['mutex']=="0"){
					exit("OK");
				}else exit("busy resource");
			}
		}
}

//funzione che scrive sul file mutex.json ls mail dell'utente che sta utilizzando il documento e rende indisponibile il documento agli altri
function mut($json){
	$p=current($json);
		foreach ($p as $key => $value){
			if($key==$_REQUEST['document']){
				if($value['mutex']=="0"){
					$p[$key]['mutex']="1";
					$p[$key]['user']=$_REQUEST['email'];
					$p[$key]['time']=time();

				}else exit("busy resource");
			}
		}
	$j=array("mutex"=>$p);
	$out=array_values($j);
	file_put_contents("../../mutex.json", json_encode($out, true));
}


//funziona che rilascia il documento, rendendolo disponibile per tutti
function rst($json){
	$a=current($json);
	foreach ($a as $key => $value) {
		$a[$key]['mutex']="0";
		$a[$key]['user']="";
		$a[$key]['time']="";
	}
	$x=array('mutex' => $a);
	$out=array_values($x);
	file_put_contents("../../mutex.json", json_encode($out, true));
}


if($_REQUEST['mutex']=="reset") rst($json);
if($_REQUEST['mutex']=="set") mut($json);
if($_REQUEST['mutex']=="check") check($json);


?>
