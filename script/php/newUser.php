<?php
//funzione che manda una mail di conferma della registrazione
function sendmail($email, $name, $sur, $pass){
	$nome_mittente = "easyRASH";
	$mail_mittente = "info@easyrash.com";
	$headers = "From: " .  $nome_mittente . " <" .  $mail_mittente . ">\r\n".
		'Reply-To: '. $mail_mittente . "\r\n" .
		'X-Mailer: PHP/' . phpversion();

	$subject = "easyRASH registration";
	$message ="Welcome ".$name." ".$sur.",\r\n". 
			"your credentials are email: ".$email.", password: ".$pass.".\r\n".
			"Best regards,\r\n".
			"easyRASH";
		$bool=mail($email, $subject, $message, $headers);

			
		if ($bool==true) exit("OK");
}

//script che controlla se un utente esiste un utente, se non esiste lo aggiunge e riscrive il file users.json
$json = json_decode(file_get_contents("../../users.json"), true);
$name = $_POST['given_name'];
$sur = $_POST['family_name'];
$email = $_POST['email'];
$pass = $_POST['pass'];
$sex = $_POST['sex'];

foreach ($json as $key => $value) {
	if($value['email']==$email){
		exit("Email esistente");
	}
}
$index=($name." ".$sur." "."<".$email.">");
$var=array('given_name' => $name, 'family_name'=>$sur, 'email'=>$email, 'pass'=>$pass, 'sex'=>$sex);

$json[$index]=$var;

file_put_contents("../../users.json", json_encode($json));
sendmail($email, $name, $sur, $pass);

?>
