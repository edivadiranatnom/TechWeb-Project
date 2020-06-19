$(document).ready(function() {
    $("#login").click(function(event) {
        event.preventDefault();
        $.post("script/php/login.php", { email: $("#usr").val(), pass: $("#psw").val() }, function(data) {

            if (data == "OK") {
                window.location.replace("user.php");
            } else if (data == "wrong password") {

                if ($("#psw").val() == "") {
                    $.notify({
                        message: "Empty password, please fill it in"
                    }, {
                        element: 'body',
                        type: 'danger',
                        delay: 2000,
                        newest_on_top: true,
                    });
                } else {
                    $.notify({
                        message: "Wrong password"
                    }, {
                        element: 'body',
                        type: 'danger',
                        delay: 2000,
                        newest_on_top: true,
                    });
                }

            } else if (data == "wrong email") {

                $.notify({
                    message: "User not found"
                }, {
                    element: 'body',
                    type: 'danger',
                    delay: 2000,
                    newest_on_top: true,
                });
                $("#psw").val("");

            }

            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("user", $("#usr").val());
                localStorage.setItem("pass", $("#psw").val());
            } else {
                alert("your browser doesn't support web Storage");
            }

        }, "text");
    });

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $('#pic').transition('horizontal flip in').transition('vertical flip in');

    $('#pic').transition('fade up').transition('fade up');


    $("#newUser").click(function() {
        var chk = validateEmail($("#email").val());

        if ($("#name").val() != "" && isFirstLetterCapital($("#name").val()) && $("#surname").val() != "" && isFirstLetterCapital($("#surname").val()) && $("#password").val() != "" && $("#email").val() != "") {
            if (chk) {
                $.post("script/php/newUser.php", {
                        given_name: $("#name").val(),
                        family_name: $("#surname").val(),
                        email: $("#email").val(),
                        pass: $("#password").val(),
                        sex: $("#sex option:selected").val()
                    },
                    function(data) {
                        if (data == "OK") {
                            console.log(data);
                            $('#registrationModal').modal('hide');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $.notify({
                                message: "Registered successfully!"
                            }, {
                                element: 'body',
                                type: 'success',
                                delay: 1000,
                                newest_on_top: true,
                            });


                        } else {
                            console.log(data);
                            $.notify({
                                message: "Existing email "
                            }, {
                                element: '.modal-content',
                                type: 'danger',
                                delay: 1000,
                                newest_on_top: true,
                            });
                        }
                    }, "text");


            } else {
                $.notify({
                    message: "Not valid email"
                }, {
                    element: '.modal-content',
                    type: 'danger',
                    delay: 1000,
                    newest_on_top: true,
                });
            }



        } else {

            $.notify({
                message: "Please fill all required fields, Name and Surname with First Capital Letter!"
            }, {
                element: '.modal-content',
                type: 'danger',
                delay: 3000,
                newest_on_top: true,
            });
        }
    });

    function isFirstLetterCapital(string) {
        return string.charAt(0) === string.charAt(0).toUpperCase();
    }

});