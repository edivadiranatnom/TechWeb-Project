<?php
session_start();
if (!isset($_SESSION['id'])) header("Location:index.html");
?>

<!DOCTYPE html>
<html>
<head>

  <title>Info</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="dataset/img/rash.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.css">
  <link rel="stylesheet" href="dataset/css/bootstrap.min.css">
  <script src="https://code.jquery.com/jquery-3.1.1.js" integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA=" crossorigin="anonymous"></script>
  <script src="dataset/js/bootstrap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.js"></script>
  <link href="dataset/css/bootstrap-toggle.min.css" rel="stylesheet">
  <script src="dataset/js/bootstrap-toggle.min.js"></script>
  <script src="dataset/js/bootstrap-notify.js"></script>
  <link rel="stylesheet" href="dataset/css/animate.css">
  <link rel="stylesheet" href="style/css/info.css">
  <script type="text/javascript">
    $(document).ready(function(){
      $(".navbar-brand.menu").click(function(event) {
        $('#sidebar-left').sidebar('toggle');
      });
      $("#chair").click(function(){
        $("#content").load("infochair.html");
        $('#sidebar-left').sidebar('hide');
        $("#content").scrollTop(0);
      });
      $("#reviewer").click(function(){
        $("#content").load("inforeviewer.html");
        $('#sidebar-left').sidebar('hide');
        $("#content").scrollTop(0);
      });
    })
  </script>
</head>

<body>
    <div class="ui sidebar inverted vertical menu" id="sidebar-left">
      <div id="div1">
      </div>
    </div>

    <div class="pusher">
      <nav class="navbar navbar-inverse navbar-fixed-top">
          <div class="navbar-header">
            <a class="navbar-brand" href="user.php"><i id="home" class="home large icon"></i></a>
            <!--<a class="navbar-brand menu"><i class="content icon"></i>&nbsp;<span id="menu">MENU</span></a>-->
            <a class="navbar-brand"><span id="chair">Chair</span></a>
            <a class="navbar-brand"><span id="reviewer">Reviewer</span></a>
          </div>
      </nav>

      <div class="container-fluid col-sm-12">
        <div id="content" class="jumbotron"></div>
      </div>
      <div style="text-align: center; margin-bottom: 2%; font-size: 20px">
        <p>A project by:<p>
        <p>Alexei Amato and Davide Montanari<p>
      </div>
    </div>

</body>

