function createDecision(idDec, author, decision) {
    var d = new Date();
    var date = d.toISOString().slice(0, 19);

    return {
        "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
        "@type": "decision",
        "@id": idDec,
        "article": {
            "@id": "",
            "eval": {
                "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
                "@id": idDec + "-eval",
                "@type": "score",
                "status": "pso:" + decision + "-for-publication",
                "author": "mailto:" + author,
                "date": date
            }
        }
    };
}

$(document).on("click", ".chair", function() {

    $("#chairModal").modal("show");
    $("#chairModal").modal({ backdrop: false });
    var tbody = document.getElementById('chairModal').childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1];
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    $.get("script/php/chair/getConfArt.php", { conf: $(this).text() }, function(data) {
        var conf = JSON.parse(data);
        var judge, judgeable, x, decision;
        $.getJSON("judge.json", function(json) { judge = json });
        $.getJSON("decisions.json", function(data) {
            x = data;
        });
        var url;
        conf.forEach(function(item) {
            url = item.url;
            $.getJSON("events.json", function(data) {
                data.forEach(function(paper) {
                    var counter = 0;
                    var reviewers;
                    for (var i = 0; i < paper.submissions.length; i++) {
                        if (paper.submissions[i].url == item.url) {
                            reviewers = paper.submissions[i].reviewers;
                            for (var j = 0; j < reviewers.length; j++) {
                                var ang = reviewers[j].indexOf('<');
                                reviewers[j] = reviewers[j].substr(ang + 1);
                                reviewers[j] = reviewers[j].substring(0, reviewers[j].length - 1);
                                for (var z = 0; z < judge.length; z++) {
                                    if (judge[z][reviewers[j]]) {
                                        if (judge[z][reviewers[j]][item.url] != "") {
                                            counter++;
                                        }
                                    }
                                }
                            }
                            for (var i = 0; i < x.length; i++) {
                                if (x[i][item.url]) {
                                    for (var j = 0; j < x[i][item.url].length; j++) {
                                        console.log(x[i][item.url][j]);
                                        if (x[i][item.url][j]['user'] == c) {
                                            if (x[i][item.url][j]['decision'] == "") decision = false;
                                            else if (x[i][item.url][j]['decision'] == "accepted" || x[i][item.url][j]['decision'] == "rejected") {
                                                decision = x[i][item.url][j]['decision'];
                                            }
                                        }
                                    }
                                }
                            }
                            if (counter == reviewers.length) {
                                judgeable = "Waiting for decision";
                            } else judgeable = "Under review";
                            if (decision == false || !decision) {
                                if (judgeable == "Waiting for decision") {
                                    $("#chairModal .modal-body tbody").append("<tr><td><div class='url' style='font-weight: bold' url='" + item.url + "'>" + item.title + "</div></td><td><div><i class='hourglass end icon'></i>" + judgeable + "</div></td><td><p data-toggle='collapse' data-target='#collapseRev' onclick='checkRevs(this)'>Check reviews</p></td><td><label class='radio-inline'><input type='radio' name='chairRadio' value='accepted'><i class='checkmark icon'></i> Accept</label><label class='radio-inline'><input type='radio' value='rejected' name='chairRadio'><i class='remove icon'></i> Reject</label><br><br><button class='btn btn-default btn-sm' onclick='setDecision(this)'>Decision</button></td></tr>");
                                } else {
                                    $("#chairModal .modal-body tbody").append("<tr><td><div class='url' style='font-weight: bold' url='" + item.url + "'>" + item.title + "</div></td><td><div><i class='comment outline icon'></i>" + judgeable + "</div></td><td><p data-toggle='collapse' data-target='#collapseRev' onclick='checkRevs(this)'>Check reviews</p></td><td><label class='radio-inline'><input type='radio' name='chairRadio' value='accepted'><i class='checkmark icon'></i> Accept</label><label class='radio-inline'><input type='radio' value='rejected' name='chairRadio'><i class='remove icon'></i> Reject</label><br><br><button class='btn btn-default btn-sm disabled' onclick='setDecision(this)'>Decision</button></td></tr>");
                                }
                            } else {
                                $("#chairModal .modal-body tbody").append("<tr><td><div class='url' style='font-weight: bold' url='" + item.url + "'>" + item.title + "</div></td><td><td colspan='3'><h3>Paper: " + decision + "<h3></td></tr>");
                            }

                        }
                    }
                })
            });
        })
    });
});

function dismiss() {
    $("#chairModal").modal("hide");
}

$(document).on("click", ".url", function() {
    $.get("script/php/loadBody.php", { url: "dataset/" + $(this).attr("url") },
        function(data) {
            $('#article').html(data);
            $('#article').scrollTop(0);
            $('#article').attr('url', $(this).attr("url").slice(38));
        }
    );
    dismiss();
    $('#switch').bootstrapToggle('off');
    $('#switch').bootstrapToggle('disable');
    $('#sidebar-left').sidebar('hide');
    $.notify({
        message: "Double click on the document to load all the annotations into the right sidebar"
    }, {
        delay: 5000,
        newest_on_top: true
    });
});

$('#article').on("dblclick", function() {
    var container = document.getElementById("annotationContainer").children[0];
    container.innerHTML = "";
    var notes = document.getElementsByClassName('note');
    var s;
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].getAttribute('title') != "") s = notes[i].getAttribute('title').substr(52 + notes[i].getAttribute('id').length);
        else s = notes[i].getAttribute('data-original-title').substr(52 + notes[i].getAttribute('id').length);
        var leftPar = s.indexOf("<");
        var rightPar = s.indexOf(">");
        var owner = s.substring(0, leftPar);
        var comm = s.substr(rightPar + 1);
        var id = notes[i].getAttribute("id");
        var Index = id.substr(id.length - 1);
        console.log(comm.toUpperCase());
        $("#annotationContainer ul").append("<li><p ref='" + notes[i].getAttribute("id") + "' class='" + substr.replace(" ", "") + "' style='color: " + notes[i].style.backgroundColor + "' data-toggle='collapse' data-target='#collapse_" + Index + "' aria-expanded='false' aria-controls='collapse_" + Index + "'><span style='color: black'><br>" + owner + "</span><br> " + notes[i].innerText + "<div class='collapse' id='collapse_" + Index + "'>" + comm.toUpperCase() + "</div></li>");
    };
});

function checkRevs(paper) {
    var url = paper.parentNode.previousSibling.previousSibling.firstChild.getAttribute('url');
    $.get("script/php/chair/chairGetRevs.php", { url: url }, function(data) {
        data = JSON.parse(data);
        var reviews = [];
        data.forEach(function(item) {
            reviews.push(JSON.parse(item));
        });
        for (var i = 0; i < reviews.length; i++) {
            for (var j = 0; j < reviews[i].length; j++) {
                for (var k = 0; k < reviews[i][j].length; k++) {
                    var author = JSON.stringify(reviews[i][j][k].article.eval.author);
                    author = author.substring(1, author.length - 1);
                    author = author.substr(7);
                    var at = author.indexOf("@");
                    author = author.substring(0, at);
                    author = author.replace(".", " ");
                    author = toTitleCase(author);
                    var status = JSON.stringify(reviews[i][j][k].article.eval.status);
                    status = status.substring(1, status.length - 1);
                    var date = JSON.stringify(reviews[i][j][k].article.eval.date);
                    if (status == "accepted-for-publication") status = "Accepted";
                    else if (status == "rejected-for-publication") status = "Rejected";
                    else status = "Still reviewing";
                    $("#collapseRev").append("<div><span><b>Author:</b> " + author + " </span><br><span><b>Evaluation:</b> " + status + " </span><br><span><b>Date:</b> " + date + " </span><div><br><br><br>");
                }
            }
        }
    });
}

$("#collapseRev").on("hidden.bs.collapse", function() {
    this.innerHTML = "<i class='remove icon'></i>";
});

$(document).on("click", "#collapseRev>.remove.icon", function() {
    $("#collapseRev").collapse("hide");
    document.getElementById("collapseRev").innerHTML = "<i class='remove icon'></i>";
});

function setDecision(paper) {
    var url = paper.parentNode.previousSibling.previousSibling.previousSibling.firstChild.getAttribute('url');
    var check = $("input[name='chairRadio']:checked").val();
    var decision = [];
    decision.push(createDecision("#decision1", toTitleCase(substr), check));
    decision.push(createPerson(c, toTitleCase(substr), 3, "chair"));
    decision = JSON.stringify(decision);
    var json;
    $.getJSON("decisions.json", function(data) {
        data.forEach(function(item) {
            if (item[url]) {
                item[url].forEach(function(u) {
                    if (u['user'] == c) u['decision'] = check;
                });
            }
        });
        data = JSON.stringify(data);
        postDec(url, decision, data);
    });
    dismiss();
    $('#sidebar-left').sidebar('hide');
    $.notify({
        message: "Paper " + check + "!"
    }, {
        element: 'body',
        type: 'success',
        delay: 5000,
        newest_on_top: true
    });
}

function postDec(url, decision, json) {
    $.post("script/php/chair/appendDecision.php", { url: url, decision: decision, content: json }, function(data) {
        console.log(data);
    });
}