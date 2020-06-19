<?php
  session_start();
  if (!isset($_SESSION['id'])) header("Location:index.html");
?>
<!DOCTYPE html>
<html>
<head>

  <title>User</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="dataset/img/rash.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.css">
  <link rel="stylesheet" href="style/css/user.css">
  <link rel="stylesheet" href="dataset/css/bootstrap.min.css">
  <script src="dataset/js/jquery.min.js"></script>
  <script src="dataset/js/bootstrap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.js"></script>
  <link href="dataset/css/bootstrap-toggle.min.css" rel="stylesheet">
  <script src="dataset/js/bootstrap-toggle.min.js"></script>
  <script src="dataset/js/bootstrap-notify.js"></script>
  <link rel="stylesheet" href="dataset/css/animate.css">
  <script src="script/js/user.js"></script>

  <style type="text/css">
    .navbar-brand:hover{
      cursor: pointer;
    }
    .navbar-right p:hover{
      cursor: pointer;
    }
    .item:hover{
      cursor: pointer;
    }

  </style>

</head>
  <body>

      <div class="modal" id="chairModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="opacity: 100; margin-top: 1000px !important">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title" id="myModalLabel">Accept/Reject Papers For Publication</h4>
            </div>
            <div class="modal-body">
              <table class="table table-hover">
                <tbody>
                </tbody>
              </table>
              <div id='collapseRev' class='collapse'><i class="remove icon"></i></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" onclick='dismiss()'><i class="remove icon"></i>Close</button>
            </div>
          </div>
        </div>
      </div>

      <div id="reviewerJudge" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
        <div class="modal-dialog modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <p>Do you want to judge the paper?</p>
            </div>
            <div class="modal-body">
              <label class="radio-inline">
                <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="accepted"> Accept
              </label>
              <label class="radio-inline">
                <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="rejected"> Reject
              </label>
              <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" data-target=".bs-example-modal-sm" onclick="postReviewJudgement()">Judge</button>
              <button type="button" class="btn btn-sm btn-default" data-dismiss="modal" data-target=".bs-example-modal-sm" onclick="postReview()" style="margin-left: 5px; float: right">Later</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="reviewModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content modal-lg">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel" style="text-align: center;">Your Annotations</h4>
            </div>
            <div class="modal-body" style="overflow: scroll">
            <table id="myAnnotations" class="table">
              <thead style="font-size: 15px; font-weight: bold"><tr><td>Text</td><td>Annotation</td><td>Modify</td><td>Delete</td></tr></thead>
              <tbody></tbody>
            </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal"><i class="remove icon"></i>Close</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#reviewerJudge"><i class="save icon"></i>Save All</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="annotationModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel">
        <div class="modal-dialog" role="document" style="z-index: 10000">
          <div class="modal-content">
            <div class="modal-body">
                <div class="form-group">
                  <label for="recipient-name" class="control-label">Target:</label>
                    <p id="Target"></p>
                </div>
                <div class="form-group">
                  <label for="message-text" class="control-label">Author:</label>
                  <p id="Author"></p>
                </div>
                <div class="form-group">
                  <label for="message-text" class="control-label">Date:</label>
                  <p id="Date"></p>
                </div>
                <div class="form-group">
                  <label for="message-text" class="control-label">Comment:</label>
                  <textarea class="form-control" id="Comment"></textarea>
                </div>
                  <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" data-target=".bs-example-modal-sm" onclick="saveAnn('lightgreen')"><i class="thumbs outline up icon"></i>Good</button>
                  <button type="button" class="btn btn-sm btn-primary" data-dismiss="modal" data-target=".bs-example-modal-sm" onclick="saveAnn('dodgerblue')"><i class="pointing right icon"></i>Normal</button>
                  <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" data-target=".bs-example-modal-sm" onclick="saveAnn('crimson')"><i class="thumbs outline down icon"></i>Bad</button>
                  <button type="submit" class="btn btn-default" data-dismiss="modal" onclick="closeAnn()"><i class="remove icon"></i>Close</button>
            </div>
          </div>
        </div>
      </div>

    <div class="ui sidebar right inverted vertical menu" id="sidebar-right">
      <div class="item">
        <input id="switch" type="checkbox" data-toggle="toggle" data-on="<i class='write square icon'></i>Annotator" data-off="<i class='unhide icon'></i>Reader" data-offstyle="success" data-onstyle="danger" disabled>
      </div>
      <div id="annotationContainer" class="ui container left aligned">
        <ul>

        </ul>
      </div>
      <div id="filterButtons">
		  <h3 style="color: white">Annotation filters</h3>
        <button type="button" class="btn btn-success btn-sm" onclick="filterAnnotations('lightgreen')"><i class="thumbs outline up icon"></i>Good</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="filterAnnotations('dodgerblue')"><i class="pointing right icon"></i>Normal</button>
        <button type="button" class="btn btn-danger btn-sm" onclick="filterAnnotations('crimson')"><i class="thumbs outline down icon"></i>Bad</button>
      </div>
      <div style="margin-top: 10px">
        <p onclick="resetColors()" style="color: white; font-size: 12.5px"><i class="refresh icon"></i>Reset</p>
      </div>
    </div>

    <div class="ui sidebar inverted vertical menu" id="sidebar-left">
      <div id="div1">
      <div><i id="userIcon" class="blue massive user icon"></i></div>
      <div><br></div>
      <div><a><span id="user">&nbsp;</span></span></a></div>
      <div><br><br></div>
      <div><a href="script/php/logout.php"><button class="btn btn-danger" id="logout"><i class="sign out icon"></i>Logout</button></a></div>
    </div>

    <div class="ui inverted accordion">
        <div id="C" class="title">Chair</div>
    </div>
      <div class="ui inverted accordion">
        <div id="R" class="title">Reviewer</div>
        <div class="content" id="rev"></div>
      </div>
      <div class="ui inverted accordion">
        <div id="A" class="title">Author</div>
        <div class="content" id="auth"></div>
      </div>
    </div>

    </div>

    <div class="pusher">
      <nav class="navbar navbar-inverse navbar-fixed-top">
          <div class="navbar-header">
            <a class="navbar-brand menu"><i class="content icon"></i>&nbsp;<span id="menu">MENU</span></a>
            <a href="info.php" class="navbar-brand">Tutorial</a>
            <a class="navbar-brand" href="" data-toggle="modal" data-target="#passChange" data-whatever="@fat">Change Pass</a>
            <a class="navbar-brand" id="right">ANNOTATIONS&nbsp;<i class="comments icon"></i></a>
          </div>
      </nav>
      
      <div class="container-fluid col-sm-12">
    		<div id="article" class="jumbotron"></div>
    		<div class="modal fade" id="passChange" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Manage Password</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label for="recipient-name" class="form-control-label">New Password</label>
                    <input type="password" class="form-control" id="new">
                    <label for="recipient-name" class="form-control-label">Confirm Password</label>
                    <input type="password" class="form-control" id="conf">
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button id="saveNew" type="button" class="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div> 
        </div>
        <div id="footerButtons"></div>
    </div>
  </body>
</html>
