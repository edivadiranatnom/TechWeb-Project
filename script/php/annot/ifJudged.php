<?php
	
	$mail = $_REQUEST['mail'];
	$url = $_REQUEST['url'];
	$action = $_REQUEST['action'];
	if (isset($_REQUEST['judgement'])) {
		$judgement = $_REQUEST['judgement'];
	}
	$json = json_decode(file_get_contents('../../../judge.json'));
	
	if($action=='write'){

		foreach ($json as $key => $value) {
			foreach ($value as $k => $v) {
				if($k==$mail){
					foreach ($v as $paper => $isJudged) {
						if($paper==$url){
							if($_REQUEST['judgement']=="accepted") $v->$paper='accepted';
							else if($_REQUEST['judgement']=="rejected") $v->$paper="rejected";
							$updated = json_encode($json, JSON_UNESCAPED_SLASHES);
							file_put_contents('../../../judge.json', $updated);
							die('succesfully judged');
						}
					}
				}
			}
		}

	}else if($action=='read'){
		
		foreach ($json as $key => $value) {
			foreach ($value as $k => $v) {
				if($k==$mail){
					foreach ($v as $paper => $isJudged) {
						if($paper==$url){
							if($v->$paper==""){
								die('not judged');
							} else die('judged');
						}
					}
				}
			}
		}

	}
?>