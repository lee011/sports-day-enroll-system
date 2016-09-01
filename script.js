/*string*/ var usertype;
/*bool*/   var loggedin = false,
               reset = false;
/*int*/    var idleTime = 0,
               timeout = 600;
jQuery.holdReady(true);
$(function () {
    var idleInterval = setInterval(timerIncrement, 1000);

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
        if (dialog6.opened) {
            dialog6.close();
        }
    });
    $(this).keypress(function (e) {
        idleTime = 0;
        if (dialog6.opened) {
            dialog6.close();
        }
    });
    $(document).on("click", "#loginButton", function () {
        if (c.value == "" || n.value == "" || p.value == "") {
            dialog1.open();
        } else if (n.invalid) {
            dialog3.open();
        } else {
            $(progressBar).fadeIn(200);
            $("#bg").fadeOut(200);
            $.ajax({
                url: "handleLogin.html",
                data: {
                    u: c.value,
                    p: p.value,
                    n: n.value,
                    c: captchaValue
                },
                dataType: "json",
                method: "post",
                cache: false
            }).done(function (d) {
                if (typeof d == 'string') {
                    $("#bg").fadeIn(200);
                    console.log(d);
                } else {
                    if (d.success != 1)
                        $("#bg").fadeIn(200);
                    if (d.success == 1) {
                        toast.text = lang.login_success;
                        toast.open();
                        refreshCurrent();
                    } else if (d.success == 0) {
                        $(progressBar).fadeOut(200);
                        toast.text = lang.login_error_pwd;
                        toast.open();
                    } else if (d.success == -1) {
                        $(progressBar).fadeOut(200);
                        toast.text = lang.login_error_unknown;
                        toast.open();
                    } else if (d.success == -2) {
                        $(progressBar).fadeOut(200);
                        toast.text = lang.login_error_missing_info;
                        toast.open();
                    } else if (d.success == -3) {
                        $(progressBar).fadeOut(200);
                        toast.text = lang.login_error_not_ready;
                        toast.open();
                    } else if (d.success == -4) {
                        $(progressBar).fadeOut(200);
                        toast.text = lang.login_error_verification;
                        toast.open();
                        console.log(d.error);
                        console.log(d.jsontext);
                    } else if (d.success == -5) {
                        $(progressBar).fadeOut(200);
                        toast.text = lang.login_error_blocked;
                        toast.open();
                    }
                }
            }).fail(function (e, f, g) {
                $("#bg").fadeIn(200);
                $(progressBar).fadeOut(200);
                toast.fitInto = document.querySelector('#loginPanel');
                toast.text = e.status == 404 ? lang.network_error : lang.error + g;
                toast.open();
                console.log(e.responseText);
            });
        }
    });
    $(document).on("click", "#logoutLink", function () {
        $(progressBar).fadeIn(200);
        $.ajax({
            url: "logout.html",
            cache: false
        }).done(function (d) {
            usertype = "";
            captchaValue = "";
            loadMainPage();
            toast.text = lang.logout;
            toast.open();
        }).fail(function (e, f, g) {
            $(progressBar).fadeOut(200);
            toast.text = e.status == 404 ? lang.network_error : lang.error + g;
            toast.open();
        })
    });
    if (history.state === null) {
        jQuery(backButton).hide();
        document.title = lang.title;
        loadMainPage();
    } else {
        switch (history.state.l) {
            case "main":
                jQuery(backButton).hide();
                document.title = lang.title;
                loadMainPage();
                break;
            case "enroll":
                jQuery(backButton).show();
                document.title = lang.enroll_title + " - " + lang.title;
                loadEnrollPage();
                break;
            case "stat":
                jQuery(backButton).show();
                document.title = lang.stat_title + " - " + lang.title;
                loadStatPage();
                break;
        }
    }
    window.onpopstate = function (e) {
        if (e.state === null) {
            jQuery(backButton).hide();
            document.title = lang.title;
            loadMainPage();
        } else {
            switch (e.state.l) {
                case "main":
                    jQuery(backButton).hide();
                    document.title = lang.title;
                    loadMainPage();
                    break;
                case "enroll":
                    jQuery(backButton).show();
                    document.title = lang.enroll_title + " - " + lang.title;
                    loadEnrollPage();
                    break;
                case "stat":
                    jQuery(backButton).show();
                    document.title = lang.stat_title + " - " + lang.title;
                    loadStatPage();
                    break;
            }
        }
    }
    $(document.body).on("iron-select", "#firstiev", function () {
        if (firstiev.contentElement.selected == 0 && !reset) {
            firstiev.contentElement.selected = secondiev.contentElement.selected;
            secondiev.contentElement.selected = thirdiev.contentElement.selected;
            thirdiev.contentElement.selected = 0;
        }
        secondiev.disabled = (firstiev.contentElement.selected == 0);
        thirdiev.disabled = (secondiev.contentElement.selected == 0);
        validateEntries();
    });
    $(document.body).on("iron-select", "#secondiev", function () {
        if (secondiev.contentElement.selected == 0 && !reset) {
            secondiev.contentElement.selected = thirdiev.contentElement.selected;
            thirdiev.contentElement.selected = 0;
        }
        thirdiev.disabled = (secondiev.contentElement.selected == 0);
        validateEntries();
    });
    $(document.body).on("iron-select", "#thirdiev", function () {
        validateEntries();
    });
    $(document.body).on("iron-select", "#relayItemSelect, .memberSelect", function () {
        validateRelayTeam();
    });
});

function refreshCurrent() {
    if (history.state === null) {
        jQuery(backButton).hide();
        document.title = lang.title;
        loadMainPage();
    } else {
        switch (history.state.l) {
            case "main":
                jQuery(backButton).hide();
                document.title = lang.title;
                loadMainPage();
                break;
            case "enroll":
                jQuery(backButton).show();
                document.title = lang.enroll_title + " - " + lang.title;
                loadEnrollPage();
                break;
            case "stat":
                jQuery(backButton).show();
                document.title = lang.stat_title + " - " + lang.title;
                loadStatPage();
                break;
        }
    }
}

function loadMainPage() {
    document.title = lang.title;
    $(progressBar).fadeIn(200);
    $("#mainContent").fadeOut(200, function () {
        $.ajax({
            url: "main.html",
            cache: false
        }).done(function (d) {
            $(progressBar).fadeOut(200);
            $(mainContent).html(d).fadeIn(200);
        }).fail(function (e, f, g) {
            $(progressBar).fadeOut(200);
            toast.text = e.status == 404 ? lang.network_error : lang.error + g;
            toast.open();
        });
    });
}

function loadEnrollPage() {
    document.title = lang.enroll_title + " - " + lang.title;
    $(progressBar).fadeIn(200);
    $("#mainContent").fadeOut(200, function () {
        $.ajax({
            url: "enroll.html",
            cache: false
        }).done(function (d) {
            $(progressBar).fadeOut(200);
            $(mainContent).html(d).fadeIn(200);
        }).fail(function (e, f, g) {
            $(progressBar).fadeOut(200);
            switch (e.status) {
                case 403:
                    toast.text = loggedin ? lang.timeout : lang.login_required;
                    toast.open();
                    loadMainPage();
                    break;
                case 404:
                    toast.text = lang.network_error;
                    toast.open();
                    break;
                case 500:
                    toast.text = lang.system_error;
                    toast.open();
                    break;
            }
        });
    });
}

function loadStatPage() {
    document.title = lang.stat_title + " - " + lang.title;
    $(progressBar).fadeIn(200);
    $("#mainContent").fadeOut(200, function () {
        $.ajax({
            url: "stat.html",
            cache: false
        }).done(function (d) {
            $(progressBar).fadeOut(200);
            $(mainContent).html(d).fadeIn(200);
        }).fail(function (e, f, g) {
            $(progressBar).fadeOut(200);
            switch (e.status) {
                case 403:
                    toast.text = loggedin ? lang.timeout : lang.login_required;
                    toast.open();
                    loadMainPage();
                    break;
                case 404:
                    toast.text = lang.network_error;
                    toast.open();
                    break;
                case 500:
                    toast.text = lang.system_error;
                    toast.open();
                    break;
            }
        });
    });
}

function validateEntries() {
    var first$ = jQuery(firstiev.selectedItem);
    var second$ = jQuery(secondiev.selectedItem);
    var third$ = jQuery(thirdiev.selectedItem);
    firstiev.invalid = false;
    secondiev.invalid = false;
    thirdiev.invalid = false;
    if (first$.data("id") == "" && second$.data("id") == "" && third$.data("id") == "") {
        return;
    } else {
        if (first$.data("id") != "") {
            if ((second$.data("id") != "" && first$.data("id") == second$.data("id"))) {
                secondiev.invalid = true;
                secondiev.errorMessage = lang.duplicate_selection;
                return;
            }
            if ((third$.data("id") != "" && first$.data("id") == third$.data("id"))) {
                thirdiev.invalid = true;
                thirdiev.errorMessage = lang.duplicate_selection;
                return;
            }
        }
        if (second$.data("id") != "") {
            if ((third$.data("id") != "" && second$.data("id") == third$.data("id"))) {
                thirdiev.invalid = true;
                thirdiev.errorMessage = lang.duplicate_selection;
                return;
            }
        }
        if ((first$.data("type") == "TI" && second$.data("type") == "TI" && third$.data("type") == "TI") ||
            (first$.data("type") == "F" && second$.data("type") == "F" && third$.data("type") == "F")) {
            thirdiev.invalid = true;
            thirdiev.errorMessage = lang.too_many;
            return;
        }
    }
}

function validateRelayTeam() {
    var selectedEv = "";
    relayItemSelect.invalid = false;
    if (relayItemSelect.selectedItem == null) {
        relayItemSelect.invalid = true;
        relayItemSelect.errorMessage = lang.field_required;
    } else {
        var item$ = jQuery(relayItemSelect.selectedItem);
        selectedEv = item$.data("id");
    }
    var domMembers = jQuery(".memberSelect").toArray();
    domMembers.forEach(function (v) {
        v.invalid = false;
        if (v.selectedItem == null) {
            v.invalid = true;
            v.errorMessage = lang.field_required;
        }
    });
    if (domMembers[0].selectedItem != null) {
        if (domMembers[0].contentElement.selected == domMembers[1].contentElement.selected) {
            domMembers[1].invalid = true;
            domMembers[1].errorMessage = lang.duplicate_selection;
        }
        if (domMembers[0].contentElement.selected == domMembers[2].contentElement.selected) {
            domMembers[2].invalid = true;
            domMembers[2].errorMessage = lang.duplicate_selection;
        }
        if (domMembers[0].contentElement.selected == domMembers[3].contentElement.selected) {
            domMembers[3].invalid = true;
            domMembers[3].errorMessage = lang.duplicate_selection;
        }
    }
    if (domMembers[1].selectedItem != null) {
        if (domMembers[1].contentElement.selected == domMembers[2].contentElement.selected) {
            domMembers[2].invalid = true;
            domMembers[2].errorMessage = lang.duplicate_selection;
        }
        if (domMembers[1].contentElement.selected == domMembers[3].contentElement.selected) {
            domMembers[3].invalid = true;
            domMembers[3].errorMessage = lang.duplicate_selection;
        }
    }
    if (domMembers[2].selectedItem != null) {
        if (domMembers[2].contentElement.selected == domMembers[3].contentElement.selected) {
            domMembers[3].invalid = true;
            domMembers[3].errorMessage = lang.duplicate_selection;
        }
    }
}

function checkRelayTeam() {
    var selectedEv = "";
    if (relayItemSelect.selectedItem == null) {
        return statusEnum.required;
    } else {
        var item$ = jQuery(relayItemSelect.selectedItem);
        selectedEv = item$.data("id");
    }
    var domMembers = jQuery(".memberSelect").toArray();
    for (var i = 0; i < domMembers.length; i++) {
        if (domMembers[i].selectedItem == null) {
            return statusEnum.required;
        }
    }
    if (domMembers[0].selectedItem != null) {
        if (domMembers[0].contentElement.selected == domMembers[1].contentElement.selected) {
            return statusEnum.duplicated;
        }
        if (domMembers[0].contentElement.selected == domMembers[2].contentElement.selected) {
            return statusEnum.duplicated;
        }
        if (domMembers[0].contentElement.selected == domMembers[3].contentElement.selected) {
            return statusEnum.duplicated;
        }
    }
    if (domMembers[1].selectedItem != null) {
        if (domMembers[1].contentElement.selected == domMembers[2].contentElement.selected) {
            return statusEnum.duplicated;
        }
        if (domMembers[1].contentElement.selected == domMembers[3].contentElement.selected) {
            return statusEnum.duplicated;
        }
    }
    if (domMembers[2].selectedItem != null) {
        if (domMembers[2].contentElement.selected == domMembers[3].contentElement.selected) {
            return statusEnum.duplicated;
        }
    }
    return statusEnum.ok;
}

function checkEntries() {
    var first$ = jQuery(firstiev.selectedItem);
    var second$ = jQuery(secondiev.selectedItem);
    var third$ = jQuery(thirdiev.selectedItem);
    if (first$.data("id") == "" && second$.data("id") == "" && third$.data("id") == "") {
        return statusEnum.ok;
    } else {
        if (first$.data("id") != "") {
            if ((second$.data("id") != "" && first$.data("id") == second$.data("id"))) {
                return statusEnum.duplicated;
            }
            if ((third$.data("id") != "" && first$.data("id") == third$.data("id"))) {
                return statusEnum.duplicated;
            }
        }
        if (second$.data("id") != "") {
            if ((third$.data("id") != "" && second$.data("id") == third$.data("id"))) {
                return statusEnum.duplicated;
            }
        }
        if ((first$.data("type") == "TI" && second$.data("type") == "TI" && third$.data("type") == "TI") ||
            (first$.data("type") == "F" && second$.data("type") == "F" && third$.data("type") == "F")) {
            return statusEnum.tooMany;
        } else {
            return statusEnum.ok;
        }
    }
}

function showEntryErrorDialog(status) {
    switch (status) {
        case statusEnum.duplicated:
            $("#dialog5 .dialog-text").text(lang.duplicate_selection);
            break;
        case statusEnum.notInOrder:
            $("#dialog5 .dialog-text").text(lang.not_in_order);
            break;
        case statusEnum.tooMany:
            $("#dialog5 .dialog-text").text(lang.too_many);
            break;
    }
    dialog5.open();
}

function showRelayTeamErrorDialog(status) {
    switch (status) {
        case statusEnum.duplicated:
            $("#dialog9 .dialog-text").text(lang.duplicate_selection);
            break;
        case statusEnum.required:
            $("#dialog9 .dialog-text").text(lang.all_fields_required);
            break;
        case statusEnum.registered:
            $("#dialog9 .dialog-text").text(lang.relay_team_registered);
            break;
    }
    dialog9.open();
}

var statusEnum = {
    ok: 0,
    notInOrder: -1,
    duplicated: -2,
    tooMany: -3,
    required: -4,
    registered: -5
};

function showRelayTeamDialog() {
    $.ajax({
        url: "relayTeamDialog.html"
    }).done(function (d) {
        $(relayTeamContent).html(d);
        dialog8.open();
    });
}

function sendEntries() {
    var result;
    if ((result = checkEntries()) == statusEnum.ok) {
        var first$ = jQuery(firstiev.selectedItem);
        var second$ = jQuery(secondiev.selectedItem);
        var third$ = jQuery(thirdiev.selectedItem);
        $(progressBar).fadeIn(200);
        $.ajax({
            url: "handleEnroll.html",
            method: "POST",
            data: {
                firstiev: first$.data("id"),
                secondiev: second$.data("id"),
                thirdiev: third$.data("id"),
                rev: "",
                locked: "0",
                lockpwd: ""
            },
            dataType: "json"
        }).done(function (d) {
            if (d.success == 1) {
                toast.text = lang.item_updated;
                toast.open();
                refreshCurrent();
            } else {
                $(progressBar).fadeOut(200);
                toast.text = lang.error + '(' + d.error.code + ')' + d.error.message;
                toast.open();
            }
        });
    } else {
        showEntryErrorDialog(result);
    }
}

function sendRelayTeam() {
    var result;
    if ((result = checkRelayTeam()) == statusEnum.ok) {
        var item$ = jQuery(relayItemSelect.selectedItem);
        var domMembers = jQuery(".memberSelect").toArray();
        $(progressBar).fadeIn(200);
        $.ajax({
            url: "handleRelayTeam.html",
            method: "POST",
            data: {
                ev: item$.data("id"),
                member1: $(domMembers[0].selectedItem).data("id"),
                member2: $(domMembers[1].selectedItem).data("id"),
                member3: $(domMembers[2].selectedItem).data("id"),
                member4: $(domMembers[3].selectedItem).data("id")
            },
            dataType: "json"
        }).done(function (d) {
            if (d.success == 1) {
                toast.text = lang.item_added;
                toast.open();
                refreshCurrent();
                dialog8.close();
            } else if (d.success == -1) {
                $(progressBar).fadeOut(200);
                showRelayTeamErrorDialog(statusEnum.registered);
            } else {
                $(progressBar).fadeOut(200);
                toast.text = lang.error + '(' + d.error.code + ')' + d.error.message;
                toast.open();
            }
        });
    } else {
        showRelayTeamErrorDialog(result);
    }
}

function deleteRelayTeam() {
    var item$ = jQuery(relayTeamsList.selectedItem);
    $(progressBar).fadeIn(200);
    $.ajax({
        url: "deleteRelayTeams.html",
        method: "POST",
        data: {
            id: item$.data("id"),
        },
        dataType: "json"
    }).done(function (d) {
        if (d.success == 1) {
            toast.text = lang.item_deleted;
            toast.open();
            refreshCurrent();
        } else {
            $(progressBar).fadeOut(200);
            toast.text = lang.error + '(' + d.error.code + ')' + d.error.message;
            toast.open();
        }
    });
}

function confirmRelayTeam() {
    var item$ = jQuery(relayTeamsList.selectedItem);
    $(progressBar).fadeIn(200);
    $.ajax({
        url: "confirmRelayTeam.html",
        method: "POST",
        data: {
            id: item$.data("id"),
            pos: item$.data("pos")
        },
        dataType: "json"
    }).done(function (d) {
        if (d.success == 1) {
            toast.text = lang.item_updated;
            toast.open();
            refreshCurrent();
        } else {
            $(progressBar).fadeOut(200);
            toast.text = lang.error + '(' + d.error.code + ')' + d.error.message;
            toast.open();
        }
    });
}

var captchaValue = "";
var recaptchaAvailable = false;

var onloadCallback = function () {
    recaptchaAvailable = true;
    if (recaptchacontainer) {
        grecaptcha.render(recaptchacontainer, {
            "sitekey": "6LcbNxMTAAAAAJqw8rngqBFCofxVjUNdfzay7Rxj",
            "callback": function (v) {
                captchaValue = v;
                loginButton.disabled = false;
            },
            "expired-callback": function () {
                captchaValue = "";
                loginButton.disabled = true;
            }
        });
    }
};

window.addEventListener('WebComponentsReady', function (e) {
    jQuery.holdReady(false);
    $(document.body).show();
});

function timerIncrement() {
    if (loggedin) {
        idleTime++;
        if (idleTime > timeout - 1) {
            loggedin = false;
            dialog6.close();
            $(progressBar).fadeIn(200);
            $.ajax({
                url: "logout.html",
                cache: false
            }).done(function (d) {
                usertype = "";
                captchaValue = "";
                loadMainPage();
                toast.text = lang.logout;
                toast.open();
            }).fail(function (e, f, g) {
                $(progressBar).fadeOut(200);
                toast.text = e.status == 404 ? lang.network_error : lang.error + g;
                toast.open();
            });
            dialog7.open();
        } else if (idleTime > timeout - 121) {
            if (!dialog6.opened) {
                dialog6.open();
            }
            $("#idlecount").text(timeout - idleTime);
        }
    }
}

function resetEntry() {
    reset = true;
    firstiev.contentElement.selected = 0;
    secondiev.contentElement.selected = 0;
    thirdiev.contentElement.selected = 0;
    reset = false;
}