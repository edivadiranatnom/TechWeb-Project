var at = c.indexOf("@");
var substr = c.substring(0, at).replace('.', ' ');
var jsonComments = []; //array dei commenti json
var revIndex;
var spanIndex; //variabile che prende l'indice del documento dopo getReview.php
var selection;
var span;

/* Grazie StackOverflow */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function createComment(revIndex, comIndex, ref, comment) {

    var d = new Date();
    date = d.toISOString().slice(0, 19);
    return {
        "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
        "@type": "comment",
        "@id": "#review" + revIndex + "-c" + comIndex,
        "text": comment,
        "ref": ref,
        "author": "mailto:" + c,
        "date": date
    };

}

function createPerson(mail, fullName, revIndex, role) {

    return ({
        "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
        "@type": "person",
        "@id": "mailto:" + mail,
        "name": fullName,
        "as": {
            "@id": "#role" + revIndex,
            "@type": "role",
            "role_type": "pro:" + role,
            "in": ""
        }
    });

}

function createReview(mail, fullName, revIndex) {

    var d = new Date();
    date = d.toISOString().slice(0, 19);
    var review = [{
        "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
        "@type": "review",
        "@id": "#review" + revIndex,
        "article": {
            "@id": "",
            "eval": {
                "@id": "#review" + revIndex + "-eval",
                "@type": "score",
                "status": "",
                "author": "mailto:" + mail,
                "date": date
            }
        },
        "comments": []
    }];
    return review;

}

var XP;

function createSpan(spanIndex) {

    var span = document.createElement("span");
    span.setAttribute('id', substr.replace(' ', '_') + '_' + spanIndex);
    span.setAttribute('data-toggle', 'tooltip');
    span.setAttribute('data-html', "true");
    span.setAttribute('data-placement', 'top');
    $(span).addClass(substr.replace(' ', '') + '_' + 'note');
    $(span).addClass("note");
    return span;

}

$(document).on("click", "#createNote", function(event) {
    event.preventDefault();

    if (/Android|webOS|iPhone|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        if (window.getSelection) {
            selction = window.getSelection().getRangeAt(0);
        } else {
            selection = document.getSelection().getRangeAt(0);
        }

    } else {

        if (window.getSelection) {
            selection = window.getSelection();
        } else if (document.getSelection) {
            selection = document.getSelection();
        } else if (document.selection) {
            selection = document.selection.createRange().text;
        }
    }

    if (selection.toString() == "") {

        $.notify({
            message: "Empty selection!<br>Please select a paper fragment."
        }, {
            delay: 2000,
            newest_on_top: true
        });

    } else if (selection.anchorNode.parentNode === selection.focusNode.parentNode) {


        $('#annotationModal').modal('show');
        $('#annotationModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#Target').text(selection);
        $('#Comment').prop('disabled', false);
        var d = new Date().toISOString().slice(0, 19);
        $('#Author').text(substr);
        $('#Date').text(d);

        span = createSpan(spanIndex);

        if (selection) {
            if (selection.rangeCount) {
                var range = selection.getRangeAt(0).cloneRange();
                range.surroundContents(span);
                //selection.removeAllRanges();
                //selection.addRange(range);
            }
        }

        var x = substr.replace(' ', '') + '_' + 'note';

    } else {

        $.notify({
            message: "Selection rejected!<br>You can only select inside one paragraph at a time and you can't comment mixed text."
        }, {
            element: 'body',
            type: 'danger',
            delay: 10000,
            newest_on_top: true,
        });

    }

});



function deleteAnn(button) {

    var ref = button.parentNode.parentNode.childNodes[1].childNodes[0].getAttribute("ref"); //prendo la ref dal campo contenente annotazione nella review modal
    var classe = substr.replace(' ', '') + '_' + 'note'; //prendo la classe di tutte le annotazioni dello user
    var el = document.getElementById(ref); //prendo la span tramite la ref
    var parent = el.parentNode; //prendo il padre della span
    var index = ref.substr(ref.length - 1); //prendo l'indice del commento

    var rowXpath = getElementXPath(button.parentNode.parentNode); //mi calcolo l'xpath della riga
    var badRowEval = document.evaluate(rowXpath, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null); //inserisco nella variabile l'elemento valutando l'xpath

    if (badRowEval && badRowEval.singleNodeValue) {
        var badRow = badRowEval.singleNodeValue;
        badRow.parentNode.removeChild(badRow);
    }

    for (var i = 0; i < jsonComments.length; i++) {
        if (jsonComments[i]["ref"] == ref) {
            for (var j = i + 1; j < jsonComments.length; j++) {
                if (parseInt(jsonComments[j]["@id"].substr(10)) > 1) {
                    jsonComments[j]["@id"] = jsonComments[j]["@id"].substring(0, 10) + (jsonComments[j]["@id"].substr(10) - 1);
                    jsonComments[j]["ref"] = jsonComments[j]["ref"].substring(0, jsonComments[j]["ref"].length - 2) + "_" + (jsonComments[j]["@id"].substr(10));
                }
            }
            jsonComments.splice(i, 1);
            while (el.firstChild) { //tiro fuori tutti i figli dalla span
                parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el); //rimuovo la span ora che è vuota
            parent.normalize(); //normalizzo il frammento di testo in cui è stata rimossa la span
            break;
        }
    }

    var value, i, j;

    /* Aggiorno le reference nella tabella */

    var tableRows = document.getElementsByClassName("tableRef");
    var sortedTableRows = [].slice.call(tableRows).sort(function(a, b) {
        return a.getAttribute("ref").substr(a.getAttribute("ref").length - 1, a.getAttribute("ref").length) > b.getAttribute("ref").substr(b.getAttribute("ref").length - 1, b.getAttribute("ref").length);
    });

    if (parseInt(sortedTableRows[0].getAttribute("ref").substr(sortedTableRows[0].getAttribute("ref").length - 1, sortedTableRows[0].getAttribute("ref").length)) > 1) {
        for (i = 0; i < tableRows.length; i++) {
            var ref = tableRows[i].getAttribute("ref");
            document.getElementById("myAnnotations").querySelector("div[ref=" + ref + "]").setAttribute("ref", ref.substring(0, ref.length - 1) + (ref.substr(ref.length - 1, ref.length) - 1));
        }
    } else {
        for (i = 0; i < sortedTableRows.length - 1; i++) {
            if (parseInt(sortedTableRows[i].getAttribute("ref").substr(sortedTableRows[i].getAttribute("ref").length - 1, sortedTableRows[i].getAttribute("ref").length)) === (parseInt(sortedTableRows[i + 1].getAttribute("ref").substr(sortedTableRows[i + 1].getAttribute("ref").length - 1, sortedTableRows[i + 1].getAttribute("ref").length)) - 2)) {
                for (j = i + 1; j < sortedTableRows.length; j++) {
                    var ref = sortedTableRows[j].getAttribute("ref");
                    document.getElementById("myAnnotations").querySelector("div[ref=" + ref + "]").setAttribute("ref", ref.substring(0, ref.length - 1) + (ref.substr(ref.length - 1, ref.length) - 1));
                }
                break;
            }
        }

    }


    var mieSpan = document.getElementsByClassName(classe); //prendo tutte le span relative allo user
    var len = mieSpan.length;
    //riordino le span in modo da trovare le due che hanno indice che differisce di 2
    var sortedMieSpan = [].slice.call(mieSpan).sort(function(a, b) {
        return a.getAttribute("id").substr(a.getAttribute("id").length - 1, a.getAttribute("id").length) > b.getAttribute("id").substr(b.getAttribute("id").length - 1, b.getAttribute("id").length);
    });

    /* se elimino il primo commento reindicizzo tutte le span di -1 */
    if (parseInt(sortedMieSpan[0].getAttribute("id").substr(sortedMieSpan[0].getAttribute("id").length - 1, sortedMieSpan[0].getAttribute("id").length)) > 1) {
        for (i = 0; i < sortedMieSpan.length; i++) {
            var id = sortedMieSpan[i].getAttribute("id");
            var originalTitle = sortedMieSpan[i].getAttribute("data-original-title");
            var title = sortedMieSpan[i].getAttribute("title");
            document.getElementById(id).setAttribute("id", id.substring(0, id.length - 1) + (id.substr(id.length - 1, id.length) - 1));
            //reindicizzo argomento dell'onclick per la chiusura dei tooltip
            if (originalTitle != null) {
                sortedMieSpan[i].setAttribute("data-original-title", reIndexTooltip(originalTitle));
            } else {
                sortedMieSpan[i].setAttribute("title", reIndexTooltip(title));
            }

        }

    } else {
        /* se elimino un commento che non sia il primo */
        for (i = 0; i < sortedMieSpan.length - 1; i++) {
            /* se trovo lo span nell'array ordinato che ha indice del precedente+2 allora parto da quell'indice nel sorted e decremento di 1 gli indici di tutti gli span successivi */
            if (parseInt(sortedMieSpan[i].getAttribute("id").substr(sortedMieSpan[i].getAttribute("id").length - 1, sortedMieSpan[i].getAttribute("id").length)) === (parseInt(sortedMieSpan[i + 1].getAttribute("id").substr(sortedMieSpan[i + 1].getAttribute("id").length - 1, sortedMieSpan[i + 1].getAttribute("id").length)) - 2)) {
                for (j = i + 1; j < sortedMieSpan.length; j++) {
                    var id = sortedMieSpan[j].getAttribute("id");
                    var originalTitle = sortedMieSpan[j].getAttribute("data-original-title");
                    var title = sortedMieSpan[j].getAttribute("title");
                    document.getElementById(id).setAttribute("id", id.substring(0, id.length - 1) + (id.substr(id.length - 1, id.length) - 1));
                    //reindicizzo argomento dell'onclick per la chiusura dei tooltip
                    if (originalTitle != null) {
                        sortedMieSpan[j].setAttribute("data-original-title", reIndexTooltip(originalTitle));
                    } else {
                        sortedMieSpan[j].setAttribute("title", reIndexTooltip(title));
                    }

                }
                break;
            }
        }
    }

    var x = button.parentNode.parentNode.childNodes[1].childNodes[0].getAttribute("ref");
    refContainer = document.getElementById("annotationContainer").querySelector("p[ref=" + x + "]");
    refContainer.parentNode.parentNode.removeChild(refContainer.parentNode);

    console.log(document.getElementById("annotationContainer"));
    console.log(document.getElementsByClassName("tableRef"));
    console.log(jsonComments);

    spanIndex = jsonComments.length + 1; //risetto lo spanIndex per il prossimo commento

};

function reIndexTooltip(title) {
    var xx, xy, xz, xa, xi, xw;
    xx = title.substr(45);
    xy = title.substring(0, 45);
    var cPar = xx.indexOf(")");
    xz = xx.substring(0, cPar);
    xa = xz.substring(0, xz.length - 1);
    xi = parseInt(xz.substr(xz.length - 1)) - 1;
    xw = xx.substr(cPar);
    return xy + xa + xi + xw;
}

function postReview() {

    var Review = [];

    Review.push(createReview(c, substr, revIndex));
    jsonComments.forEach(function(comment) {
        Review[0][0]["comments"].push(comment["@id"]);
        Review.push(comment);
    });
    Review.push(createPerson(c, toTitleCase(substr), revIndex, "reviewer"));
    var toSendReview = JSON.stringify(Review);
    var body = document.getElementById('article').innerHTML;

    $.post("script/php/annot/postReview.php", { review: toSendReview, mail: c, url: $("#article").attr("url") });
    $.post("script/php/annot/updateBody.php", { body: body, url: $("#article").attr("url") }, function(data) {
        console.log(data);
    });

}

function postReviewJudgement() {

    var Review = [];
    var judgement = $("input[name='inlineRadioOptions']:checked").val();
    Review.push(createReview(c, substr, revIndex));
    jsonComments.forEach(function(comment) {
        Review[0][0]["comments"].push(comment["@id"]);
        Review.push(comment);
    });
    Review.push(createPerson(c, toTitleCase(substr), revIndex, "reviewer"));
    Review[0][0]["article"]["eval"]["status"] = judgement + "-for-publication";
    var toSendReview = JSON.stringify(Review);
    var body = document.getElementById('article').innerHTML;

    $.post("script/php/annot/postReview.php", { review: toSendReview, mail: c, url: $("#article").attr("url") });
    $.post("script/php/annot/updateBody.php", { body: body, url: $("#article").attr("url") }, function(data) {
        console.log(data);
    });

    $.post("script/php/annot/ifJudged.php", { mail: c, url: $("#article").attr("url"), action: 'write', judgement: judgement }, function(data) {
        console.log(data);
    });
    $('#switch').bootstrapToggle('off');
    $('#switch').bootstrapToggle('disable');
    $('#sidebar-right').sidebar('hide');
    rst();
    $.notify({
        message: "Review completed! From this moment you can't create annotations on this paper anymore."
    }, {
        element: 'body',
        type: 'success',
        delay: 5000,
        newest_on_top: true
    });

    console.log(toSendReview);

}

/* Modifica annotazione nel json, nel tooltip e nella review modal */
function modifyAnn(button) {

    var ann = button.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0]; //prendo elemento annotazione nella table in review modal
    var ref = button.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].getAttribute("ref"); //prendo la reference alla span nella table in review modal
    var newCom = button.parentNode.nextSibling.value; //prendo valore del campo contenente il commento (fratello del bottone)
    ann.innerHTML = newCom; //sostituisco il nuovo testo dall'input di modifica al campo dell'annotazione nella modale
    //document.getElementById(ref).setAttribute('data-original-title', "<i class='remove icon' ref='" + ref + "' onclick='closeTooltip(" + ref + ")'></i>" + toTitleCase(substr) + ": <br>" + newCom); //setto il nuovo commento nel tooltip
    document.getElementById(ref).setAttribute('data-original-title', "<i class='remove icon' onclick='closeTooltip(" + ref + ")'></i>" + toTitleCase(substr) + ": <br>" + newCom);
    button.parentNode.nextSibling.value = ""; //pulisco l'input di modifica
    jsonComments.forEach(function(comment) { //modifico il commento anche nell'array contenente i commenti json
        if (comment["ref"] == ref) {
            comment["text"] = newCom;
        }
    })
};

/*  */
function setSpan(color) {
    span.style.fontWeight = "bold";
    span.setAttribute('title', "<i class='remove icon' onclick='closeTooltip(" + span.getAttribute('id') + ")'></i>" + toTitleCase(substr) + ": <br>" + $('#Comment').val());
    $(span).addClass(color);
    span.style.backgroundColor = color;

    jsonComments.push(createComment(revIndex, spanIndex, span.getAttribute("id"), $("#Comment").val()));
    var id = span.getAttribute("id");
    $("#reviewModal tbody").append("<tr><td class='col-md-3'><div><p>" + document.getElementById(id).innerText + "</p></div></td><td class='col-md-3'><div class='tableRef' ref='" + span.getAttribute("id") + "'>" + $("#Comment").val() + "</p></td><td class='col-md-4'><div><div class='input-group' style='margin-top: 20px'><span class='input-group-btn'><button class='btn btn-warning modifyAnn' type='button' onclick='modifyAnn(this)'><i class='edit icon'></i>Modify</button></span><input type='text' class='form-control'></div></div></td><td class='col-md-2'><button class='btn btn-danger deleteAnn' type='button' style='margin-top: 20px' onclick='deleteAnn(this)'><i class='trash outline icon'></i>Delete</button></td></tr>");
    var Index = substr.replace(' ', '_') + "_" + spanIndex;
    $("#annotationContainer ul").append("<li><p ref='" + span.getAttribute("id") + "' style='color: " + color + "' data-toggle='collapse' data-target='#collapse_" + Index + "' aria-expanded='false' aria-controls='collapse_" + Index + "'><span style='color: black'><br>" + toTitleCase(substr) + ":</span><br> " + document.getElementById(span.getAttribute("id")).innerText + "<div class='collapse' id='collapse_" + Index + "'>" + $('#Comment').val().toUpperCase() + "</div></li>");
    $('#Comment').val("");
    spanIndex++;
}

function saveAnn(color) {

    if ($("#Comment").val() == "") {

        $.notify({
            message: "Please fill in a comment."
        }, {
            element: '#annotationModal .modal-body',
            type: 'danger',
            delay: 3000,
            newest_on_top: true,
        });

    } else {

        setSpan(color);
        $('#annotationModal').modal('hide');
    }

}

/* Al click su close in review modal unwrappa il range della selezione e risetta lo spanIndex */
function closeAnn() {

    var el = span;
    var parent = el.parentNode;

    // move all children out of the element
    while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
    }

    // remove the empty element
    parent.removeChild(el);
    parent.normalize();
    $('#annotationModal').modal('hide');
    spanIndex = jsonComments.length + 1;

};

//Ritorna ogni review dell'utente per ogni articolo caricato e setta indice della review e della span
$('#article').bind('contentchanged', function() {
    var uri;
    var table = document.getElementById("myAnnotations").children[1];
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    var container = document.getElementById("annotationContainer").children[0];
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    jsonComments = [];
    uri = $('#article').attr("url");


    $.get("script/php/annot/getReview.php", { url: "../../../dataset/" + uri, mail: c }, function(data) {

        var rev;

        if (data.revIndex) { //se mi viene ritornato il json senza review, con solo indice della review

            revIndex = data.revIndex;
            spanIndex = 1;
            console.log(data);

        } else { //se mi ritorna la review, setto gli indici dei prossimi commenti

            rev = JSON.parse(data);
            spanIndex = rev[0][0]['comments'].length + 1;
            revIndex = rev[0][0]["@id"].slice(7);
            rev.splice(0, 1);
            rev.splice(rev.length - 1, 1);
            rev.forEach(function(item) {
                if (item["@type"] == "comment") {
                    var Index = item["@id"].slice(10);
                    var collapseIndex = substr.replace(' ', '') + "_" + Index;
                    jsonComments.push(item);
                    $("#reviewModal tbody").append("<tr><td class='col-md-3'><div><p>" + document.getElementById(item["ref"]).innerHTML + "</p></div></td><td class='col-md-3'><div class='tableRef' ref='" + item["ref"] + "'>" + item["text"] + "</p></td><td class='col-md-4'><div><div class='input-group' style='margin-top: 20px'><span class='input-group-btn'><button class='btn btn-warning modifyAnn' type='button' onclick='modifyAnn(this)'><i class='edit icon'></i>Modify</button></span><input type='text' class='form-control'></div></div></td><td class='col-md-2'><button class='btn btn-danger deleteAnn' type='button' style='margin-top: 20px' onclick='deleteAnn(this)'><i class='trash outline icon'></i>Delete</button></td></tr>");
                }
            });

        }

    }, "json");

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

$(document).on("click", "#manageRev button", function() {

    console.log(jsonComments);

});

$(document).on("click", ".note", function(e) {
    $(this).tooltip({ trigger: "click focus" });
});

function closeTooltip(ref) {
    $(ref).tooltip('hide');
}

/* Ritorna XPath dell'elemeto che sottolineo per annotarlo l'indice del n-esimo carattere
da cui inizia la selezione e l'indice del carattere in cui finisce la selezione */

document.getElementById("article").onselectionchange = function() {


    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.getSelection) {
        selection = document.getSelection();
    } else if (document.selection) {
        selection = document.selection.createRange().text;
    }
    // multi-selections too.
    start = selection.anchorOffset, // Start position
        end = selection.focusOffset; //End position

    if (end < start && selection.anchorNode === selection.focusNode) {
        var tmp = end;
        end = start;
        start = tmp;
    }
}



/* Grazie FIREBUG:

Ritorna l'xpath con l'id se l'elemento ha già un id,
altrimenti richiama getElementTreeXPath che ricostruisce l'albero

*/

function getElementXPath(element) {
    if (element && element.id)
        return '//*[@id="' + element.id + '"]';
    else
        return getElementTreeXPath(element);
};

function getElementTreeXPath(element) {
    var paths = [];

    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
        var index = 0;
        var hasFollowingSiblings = false;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
                ++index;
        }

        for (var sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
            if (sibling.nodeName == element.nodeName)
                hasFollowingSiblings = true;
        }

        var tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
        var pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
};

function hideAnnotation(annotation) {
    annotation.style.backgroundColor = 'transparent';
    annotation.style.fontWeight = '300';
    annotation.style.border = 'none';
}

function loadAnnotation(annotation, color) {
    annotation.style.backgroundColor = color;
    annotation.style.fontWeight = 'bold';
    annotation.style.border = 'solid';
    annotation.style.borderColor = 'lightgrey';
    annotation.style.borderStyle = 'dashed';
    annotation.style.borderWidth = '1px';
}

function filterAnnotations(color) {
    var dodger = document.getElementsByClassName('dodgerblue');
    var crimson = document.getElementsByClassName('crimson');
    var green = document.getElementsByClassName('lightgreen');
    if (color == 'lightgreen') {
        for (var i = 0; i < green.length; i++) {
            if (green[i].style.backgroundColor == 'transparent') {
                loadAnnotation(green[i], 'lightgreen');
            }
        }
        for (var i = 0; i < dodger.length; i++) {
            hideAnnotation(dodger[i]);
        }
        for (var i = 0; i < crimson.length; i++) {
            hideAnnotation(crimson[i]);
        }
    } else if (color == 'dodgerblue') {
        for (var i = 0; i < dodger.length; i++) {
            if (dodger[i].style.backgroundColor == 'transparent') {
                loadAnnotation(dodger[i], 'dodgerblue');
            }
        }
        for (var i = 0; i < green.length; i++) {
            hideAnnotation(green[i]);
        }
        for (var i = 0; i < crimson.length; i++) {
            hideAnnotation(crimson[i]);
        }
    } else if (color == 'crimson') {
        for (var i = 0; i < crimson.length; i++) {
            if (crimson[i].style.backgroundColor == 'transparent') {
                loadAnnotation(crimson[i], 'crimson');
            }
        }
        for (var i = 0; i < green.length; i++) {
            hideAnnotation(green[i]);
        }
        for (var i = 0; i < dodger.length; i++) {
            hideAnnotation(dodger[i]);
        }
    }
}

function resetColors() {
    var dodger = document.getElementsByClassName('dodgerblue');
    var crimson = document.getElementsByClassName('crimson');
    var green = document.getElementsByClassName('lightgreen');
    for (var i = 0; i < green.length; i++) {
        if (green[i].style.backgroundColor == 'transparent') {
            loadAnnotation(green[i], 'lightgreen');
        }
    }
    for (var i = 0; i < dodger.length; i++) {
        if (dodger[i].style.backgroundColor == 'transparent') {
            loadAnnotation(dodger[i], 'dodgerblue');
        }
    }
    for (var i = 0; i < crimson.length; i++) {
        if (crimson[i].style.backgroundColor == 'transparent') {
            loadAnnotation(crimson[i], 'crimson');
        }
    }
}