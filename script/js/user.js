var c = localStorage.getItem("user");

var doc;
var isChair;
var isReviewer;
var isAuthor;
var resetted = false;
var mutexBool;

window.onbeforeunload = rst;

//chiama la reset del file mutex.php
function rst() {
    console.log(mutexBool);
    $.post("script/php/mutex.php", { mutex: "reset" },
        function(data) {
            clearTimeout(mutexBool);
            console.log(data);
        }, "text");

}


/*chiama la mutex di mutex.php e setta il tempo che avra' a disposizione l'utente per annotare
 quando scade il timeout resetta il mutex.json e disabilita i pulsanti per le annotazioni
 
 */ 
function mutex() {
    $.post("script/php/mutex.php", { email: c, document: doc, mutex: "set" },
        function(data) {

            if (data != "busy resource") {
                mutexBool = setTimeout(function() {
                    rst();
                    $.notify({
                        message: "Time is over!"
                    }, {
                        element: 'body',
                        type: 'danger',
                        delay: 4000,
                        newest_on_top: true,
                    });
                    $("#switch").bootstrapToggle('off');
                    $(".item:last-child").remove();
                }, 180000);
            } else {
                $("#switch").bootstrapToggle('off');
                $("#switch").bootstrapToggle('disable');
                $(".item:last-child").remove();
                $.notify({
                    message: "Busy resource, please try later!"
                }, {
                    element: 'body',
                    type: 'danger',
                    delay: 4000,
                    newest_on_top: true,
                });
            }
        }, "text");
}

$(document).ready(function() {

    $('.ui.accordion').accordion();

    $.ajax({
        method: "POST",
        url: "./script/php/infoUser.php",
        data: { email: c },
        success: function(data) {
            $("#user").append(data);
        }
    })

    $.getScript("script/js/annotations.js"); //carico le funzioni di annotation.js

    $.getScript("script/js/chair.js");

    //-------- Ajax che appende conferenze per cui User è Chair -----------//

    $.get("script/php/chair.php", { "email": c },
        function(data) {
            isChair = data;
            for (i = 0; i < isChair.length - 1; i = i + 3) {
                $("#C").append("<div class='chair content ui inverted accordion' acr='" + isChair[i + 1] + "'>" + isChair[i] + "</div><br>");
            }

            //-------- Ajax che appende conferenze per cui User è Reviewer -----------//

            $.get("script/php/reviewer.php", { "email": c },
                function(data) {
                    isReviewer = data;
                    for (i = 1; i < isReviewer.length - 1; i = i + 3) {
                        $("#rev").append("<p class='title reviewer content article' url='" + isReviewer[i + 1] + "' conf='" + isReviewer[i - 1] + "'>" + isReviewer[i] + "</p><br>");
                    }
                    $('.article').on("click", function(event) {
                        doc = $(this).attr("url");
                        $.get("script/php/loadBody.php", { url: $(this).attr("url") })
                            .done(function(data) {
                                $('#article').html(data);
                                $('#article').scrollTop(0);
                                $('#article').attr('url', $(this).attr("url").slice(38));
                                $.post("script/php/mutex.php", { document: doc, mutex: "check" },
                                    function(data) {
                                        console.log(data);
                                        if (data == "busy resource") {
                                            $("#switch").bootstrapToggle('disable');
                                            $.notify({
                                                message: "Busy resource, please try later!"
                                            }, {
                                                element: 'body',
                                                type: 'danger',
                                                delay: 2000,
                                                newest_on_top: true,
                                            });
                                        }
                                    }, "text");
                            }).fail(function() {
                                $.notify({
                                    message: "Paper loading failed, please retry"
                                }, {
                                    element: 'body',
                                    type: 'danger',
                                    delay: 2000,
                                    newest_on_top: true,
                                });
                            })
                    })

                    //-------- Ajax che appende conferenze per cui User è Author -----------//

                    $.get("script/php/author.php", { "email": c },
                        function(data) {
                            isAuthor = data;
                            for (i = 1; i < isAuthor.length - 1; i = i + 3) {
                                $("#auth").append("<p class='title author content article' url='" + isAuthor[i + 1] + "' conf='" + isAuthor[i - 1] + "'>" + isAuthor[i] + "</p><br>");
                            }

                            $('.article').on("click", function(event) {
                                $.get("script/php/loadBody.php", { url: "dataset/" + $(this).attr("url") })
                                    .done(function(data) {
                                        $('#article').html(data);
                                        $('#article').scrollTop(0);
                                        $('#article').attr('url', $(this).attr("url").slice(38));
                                        $('#article').trigger('contentchanged');

                                    }).fail(function() {
                                        $.notify({
                                            message: "Loading article failed"
                                        }, {
                                            element: 'body',
                                            type: 'danger',
                                            delay: 2000,
                                            newest_on_top: true,
                                        });
                                    });
                            })

                        }, "json");

                }, "json");

        }, "json");


    //-------- Appende bottone per creazione annotazioni quando lo switch è Annotator
    $("#switch").change(function() {

        if ($(this).is(':checked')) {

            $(".container-fluid.col-sm-12")
                .append('<div id="createAnn" class="item"><button id="createNote" type="button" class="btn-lg btn-danger" data-toggle="modal"><i class="write icon"></i>Create Annotation</button>');
            $("#sidebar-right")
                .append('<div id="manageRev" class="item"><button type="button" class="btn btn-default btn-lg" data-toggle="modal" data-target="#reviewModal"><i class="edit icon"></i>Manage Review</button></div>');
            $("#reviewModal").removeClass("hide");
            mutex();
        } else {
            $(".item:last-child").remove();
            rst();
        }
    });

    $(window).on("load", function() {
        if (innerWidth <= 1922) {
            $("#right").css("margin-left", innerWidth - 526);
        }
    });

    $(window).resize(function() {
        if (innerWidth <= 1922) {
            $("#right").css("margin-left", innerWidth - 526);
        }

    });


    $(document).on("click", ".reviewer", function() {
        var isJudged;
        
		//ajax che controlla se un documento e' stato giudicato o meno
        $.get("script/php/annot/ifJudged.php", { mail: localStorage.getItem("user"), url: $(this).attr("url"), action: 'read' }, function(data) {
            isJudged = data;
            if (isJudged == "judged") {
                $("#switch").bootstrapToggle('off');
                $("#switch").bootstrapToggle('disable');
                $('#sidebar-left').sidebar('hide');
                $.notify({
                    message: "You have already evaluated this paper! From this moment you can only read it."
                }, {
                    element: 'body',
                    type: 'success',
                    delay: 5000,
                    newest_on_top: true
                });
            } else if (isJudged == "not judged") {
                $("#switch").bootstrapToggle('off');
                $("#switch").bootstrapToggle('enable');
            }
        });

        if (document.getElementById('footerButtons').hasChildNodes()) document.getElementById('footerButtons').removeChild(document.getElementById("infoBtn"));
        if (!$('#footerButtons').find("#infoBtn").length) { //appende il bottone che attiva il popover con le info relative all'articolo
            $("#footerButtons").append("<p id='infoBtn' data-toggle='popover' data-placement='left' title='" + this.getAttribute("conf") + "' data-content='Title: " + this.innerHTML + "'><b><i class='info icon'></i>Paper Info</b></p>");
            $("#infoBtn").popover();
        }

    });

    $("#saveNew").click(function() {
        if ($("#new").val() == $("#conf").val()) {
			
			//ajax che consente di cambiare la password
            $.post("./script/php/newPass.php", { email: c, new: $("#conf").val() },
                function(data) {
                    console.log(data);
                    $("#passChange").modal('hide');
                    $.notify({
                        message: "Password successfully saved!"
                    }, {
                        element: 'body',
                        type: 'success',
                        delay: 5000,
                        newest_on_top: true
                    });
                }
            );
        } else {
            $.notify({
                message: "Password is not the same"
            }, {
                element: '.modal-content',
                type: 'danger',
                delay: 5000,
                newest_on_top: true
            });
        }
    });

    $(document).on("click", ".author", function() {
        $('#switch').bootstrapToggle('off');
        $("#switch").bootstrapToggle('disable');
        if (document.getElementById('footerButtons').hasChildNodes()) document.getElementById('footerButtons').removeChild(document.getElementById("infoBtn"));
        if (!$('#footerButtons').find("#infoBtn").length) { //appende il bottone che attiva il popover con le info relative all'articolo
            $("#footerButtons").append("<p id='infoBtn' data-toggle='popover' data-placement='left' title='" + this.getAttribute("conf") + "' data-content='Title: " + this.innerHTML + "'><b><i class='info icon'></i>Paper Info</b></p>");
            $("#infoBtn").popover();
        }
    });

    $(".navbar-brand.menu").click(function(event) {
        $('#sidebar-left').sidebar('toggle');
    });

    $("#right").click(function(event) {
        $('#sidebar-right').sidebar('toggle');
    });

});
