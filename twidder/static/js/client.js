function ImageArray (n) {
    this.length = n;
    for (var i =1; i <= n; i++) {
        this[i] = ' '
    }
}

image = new ImageArray(3);
image[0] = 'logo1.jpg';
image[1] = 'logo2.jpg';
image[2] = 'logo3.jpg';

function randomimage() {
    var rand = Math.floor((Math.random()*3) +1);
    return(image[rand-1]);
}

var SCRIPT_ROOT = 'http://127.0.0.1:5000/';

var socket;

window.onload = function() {

    if (localStorage.getItem("token") == "{}" || localStorage.getItem("token") === null) {
        displayWelcomeView();
    }else{
        token = localStorage.getItem("token");
        displayProfileView(token);
    }
};


function socket_connection(email, token){
    socket = new WebSocket("ws://" + document.domain + ":5000/connect_socket");

    socket.onopen = function()
    {
        console.log("onopen : connection ok");
        // Web Socket is connected, send data using send()
        logged_id = JSON.stringify({email: email});

        socket.send(logged_id);
        console.log("Message sent");
    };

    socket.onmessage = function(event){
        msg = JSON.parse(event.data);
        if (msg.success == false) {
            // Connection on another device, you're logged out
            log_out(token);
        }
    };

    socket.onbeforeunload = function() {
        ws.close();
    };
}


function displayWelcomeView(){
    var request = new XMLHttpRequest();
    var res_request;


    var welcomeDiv = document.getElementById("welcome-display");
    welcomeDiv.innerHTML = document.getElementById('welcome-view').innerHTML ;

    //LOGIN
    btnLogin = document.getElementById("btn-login");
    btnLogin.setAttribute("onclick", "return false;");  // make the page not refresh
    btnLogin.addEventListener("click", function() {
        var username = document.getElementById("user-username").value;
        var password = document.getElementById("user-password").value;

        if((/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test(username)) && (password.length > 5)) {

            // Sending post request to log in
            request.open('POST', SCRIPT_ROOT + 'sign_in', true);
            request.setRequestHeader("Content-type", "application/json");

            parameters = JSON.stringify({"username":username,"password":password});
            request.send(parameters);

            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    // Ok, sign in
                    res_request = JSON.parse(request.responseText);

                    if (res_request.success) {
                        document.getElementById("in-username-form").setAttribute("class", "input-group has-success");
                        document.getElementById("in-password-form").setAttribute("class", "input-group has-success");
                        if (document.getElementById("login-error") != null) {
                            document.getElementById("error-area-signin").removeChild(document.getElementById("login-error"));
                        }
                        token = res_request.data;
                        localStorage.setItem('token', token);

                        changeWelcomeToProfile(token);
                        socket_connection(username, token);

                    } else {
                        // error
                        displayErrorSignIn('Wrong username or password.');
                    }
                    return false;
                }
            };

        } else {
            displayErrorSignIn('Not valid email address');
        }

    });


    //SIGN UP
    btnsignup = document.getElementById("btn-signup");
    btnsignup.setAttribute("onclick", "return false;");
    btnsignup.addEventListener("click", function() {
        var username = document.getElementById("new-username").value;
        var password = document.getElementById("new-password").value;
        var passwordb = document.getElementById("new-passwordb").value;
        var firstname = document.getElementById("new-firstname").value;
        var familyname = document.getElementById("new-familyname").value;
        var city = document.getElementById("city").value;
        var country = document.getElementById("country").value;
        var sex = document.getElementById("female-radio-btn").checked ? "female" : "male";

        testUsername = username.length>0 && ((/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test(username)));
        testPassword = (password.localeCompare(passwordb) == 0) && password.length>5;
        testFirstName = firstname.length>0;
        testFamilyName = familyname.length>0;
        testCity = city.length>0;
        testCountry = country.length>0;

        valide = testUsername && testPassword && testFirstName && testFamilyName && testCity && testCountry;

        if(valide){
            if(document.getElementById("signup-error") != null) {
                document.getElementById("error-area-signup").removeChild(document.getElementById("signup-error"));
                document.getElementById("up-username-form").setAttribute("class", "input-form");
                document.getElementById("up-password-form").setAttribute("class", "input-form");
                document.getElementById("up-password-form").setAttribute("class", "input-form");
                document.getElementById("up-name-form").setAttribute("class", "input-form");
                document.getElementById("up-address-form").setAttribute("class", "input-form");
            }

            // Sending post request to sign up
            request.open('POST', SCRIPT_ROOT + 'sign_up', true);
            request.setRequestHeader("Content-type", "application/json");

            signup_parameters = JSON.stringify({ "email" : username, "password" : password, "firstname" : firstname, "familyname" : familyname,
                "gender" : sex, "city" : city, "country" : country});

            request.send(signup_parameters);

            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    connection = JSON.parse(request.responseText);

                    if(connection.success){
                        token = connection.data;
                        document.getElementById("signup-form").reset();
                        localStorage.setItem('token', token);
                        changeWelcomeToProfile(token);
                        socket_connection(username, token);

                    }else{
                        displayErrorSignUp(connection.message);
                    }
                }
            };

        }else{
            // Display error
            displayErrorSignUp("Please check your information.");
        }

        return false;
    });

    // Display random image
    $('#ad').css('background-image', 'url(static/public/img/' + randomimage() +')');
}


function displayProfileView(token){

    // Logged
    var profileDiv = document.getElementById("profile-display");
    profileDiv.innerHTML = document.getElementById('profile-view').innerHTML ;

    var homebtn = document.getElementById("home-btn");
    homebtn.addEventListener("click", function(){
        document.getElementById('home').style.display = "block";
        document.getElementById('account').style.display = "none";
        document.getElementById('browse').style.display = "none";
    });

    var bowserbtn = document.getElementById("browse-btn");
    bowserbtn.addEventListener("click", function(){
        document.getElementById('home').style.display = "none";
        document.getElementById('account').style.display = "none";
        document.getElementById('browse').style.display = "block";
    });

    var accountbtn = document.getElementById("account-btn");
    accountbtn.addEventListener("click", function(){
        document.getElementById('home').style.display = "none";
        document.getElementById('account').style.display = "block";
        document.getElementById('browse').style.display = "none";
    });


    // ACCOUNT VIEW : CHANGE PASSWORD
    var changepasswordbtn = document.getElementById("valid-change-password");

    changepasswordbtn.setAttribute("onclick", "return false;");  // make the page not refresh
    changepasswordbtn.addEventListener("click", function(){
        oldpassword = document.getElementById("logged-old-password").value;
        newpassword = document.getElementById("logged-new-password").value;

        if ((oldpassword != "") && (newpassword != "")) {
            // Sending post request to change password
            password_request = new XMLHttpRequest();
            password_request.open('POST', SCRIPT_ROOT + 'change_password', true);
            password_request.setRequestHeader("Content-type", "application/json");

            password_parameters = JSON.stringify({ "token" : token, "old" : oldpassword, "new" : newpassword});

            password_request.send(password_parameters);

            password_request.onreadystatechange = function () {
                if (password_request.readyState == 4 && password_request.status == 200) {
                    res_request = JSON.parse(password_request.responseText);

                    if (res_request.success) {
                        // Display valid message
                        document.getElementById("form-change-password").setAttribute("class", "form-group");
                        if(document.getElementById("change-password-error") != null) document.getElementById("response-area-account").removeChild(document.getElementById("change-password-error"));

                        accountvalidlabel = document.createElement("label");
                        accountvalidlabel.setAttribute("class", "label label-success");
                        accountvalidlabel.setAttribute("id", "change-password-valid");
                        accountvalidlabel.style.marginLeft = "15px";
                        accountvalidlabel.innerText = "Your password is changed";
                        if(document.getElementById("change-password-valid") == null) document.getElementById("response-area-account").appendChild(accountvalidlabel);

                    }else{
                        displayErrorChangePassword(res_request.message);
                    }
                }
            };
        }else{
            displayErrorChangePassword("Complete the fields");
        }
    });

    // LOGGOUT
    var loggoutbtn = document.getElementById("loggout-btn");
    loggoutbtn.setAttribute("onclick", "return false;");  // make the page not refresh
    loggoutbtn.addEventListener("click", function(){
        log_out(token);
    });


    // BROWSER
    var searchuserbtn = document.getElementById("search-user-btn");
    searchuserbtn.setAttribute("onclick", "return false;");

    var founduser;
    var founduserwall = document.getElementById("user-wall-area");
    searchuserbtn.addEventListener("click", function(){
        if (document.getElementById("search-user-id") != null) {
            founduserwall.innerHTML = "";
        }
        searchmail = document.getElementById("search-user-input").value;

        browser_request = new XMLHttpRequest();
        browser_request.open('GET', SCRIPT_ROOT + 'get_user_data_by_email?token=' + token + '&email=' + searchmail, true);
        browser_request.send();

        browser_request.onreadystatechange = function () {
            if (browser_request.readyState == 4 && browser_request.status == 200) {

                res_request = JSON.parse(browser_request.responseText);

                if(res_request.success == false){
                    // TODO : Display error
                }else{
                    founduser = res_request.data;

                    profilearea = document.createElement("div");
                    profilearea.setAttribute("class", "col-md-4 side-panel");
                    profilearea.setAttribute("id", "search-user-id");

                    profilearea.innerHTML =
                        "<div class='title-sign'> Profile </div>" +
                        "<div class='container'> " +
                        "<dl>" +
                        "<dt>Username : </dt>" +
                        "<div id='profil_username'>"+ founduser.email +"</div>" +
                        "<br>" +
                        "<dt>First name : </dt>" +
                        "<div id='profil_first_name'>"+ founduser.firstname +"</div>" +
                        "<br>" +
                        "<dt>Name : </dt>" +
                        "<div id='profil_family_name'>"+ founduser.familyname + "</div>" +
                        "<br>" +
                        "<dt>Sex : </dt>" +
                        "<div id='profil_sex'>"+ founduser.gender + "</div>" +
                        "<br>" +
                        "<dt>City :</dt>" +
                        "<div id='profil_city'>"+ founduser.city + "</div>" +
                        "<br>" +
                        "<dt>Country :</dt>" +
                        "<div id='profil_country'>"+ founduser.country + "</div>" +
                        "</dl>" +
                        "</div>";

                    wallarea = document.createElement("div");
                    wallarea.setAttribute("class", "panel panel-default col-xs-8");
                    wallarea.setAttribute("id", "search-user-wall");
                    wallarea.innerHTML = "<div class='panel-heading'>" +
                        "<h3 class='panel-title'>News feed : <button id='btn-refresh-wall'><span class='glyphicon glyphicon-refresh' aria-hidden='true'></span></button></h3>" +
                        "</div>" +
                        "<div id='wall-user'>" +
                        "<div class='wall panel panel-default hidden'></div>" +
                        "</div>";


                    // Sending get request to get user information
                    browser_message_request = new XMLHttpRequest();
                    browser_message_request.open('GET', SCRIPT_ROOT + 'get_user_messages_by_email?token=' + token + '&email=' + searchmail, true);
                    browser_message_request.send();

                    browser_message_request.onreadystatechange = function () {
                        if (browser_message_request.readyState == 4 && browser_message_request.status == 200) {
                            res_request = JSON.parse(browser_message_request.responseText);

                            founduserwall.appendChild(profilearea);
                            founduserwall.appendChild(wallarea);

                            displayMessageBrowserPage(res_request);

                        }
                    };


                }
            }
        };


    });


    // PROFILE INFORMATION

    // Sending get request to get user information
    profile_request = new XMLHttpRequest();
    profile_request.open('GET', SCRIPT_ROOT + 'get_user_data_by_token?token=' + token, true);
    profile_request.send();

    profile_request.onreadystatechange = function () {
        if (profile_request.readyState == 4 && profile_request.status == 200) {

            res_request = JSON.parse(profile_request.responseText);
            userinformation = res_request.data;


            mailAddressUser = userinformation.email;
            firstNameUser = userinformation.firstname;
            familyNameUser = userinformation.familyname;
            sexUser = userinformation.gender;
            cityUser = userinformation.city;
            countryUser = userinformation.country;

            document.getElementById("profil_username").innerHTML = mailAddressUser;
            document.getElementById("profil_first_name").innerHTML = firstNameUser;
            document.getElementById("profil_family_name").innerHTML = familyNameUser;
            document.getElementById("profil_sex").innerHTML = sexUser;
            document.getElementById("profil_city").innerHTML = cityUser;
            document.getElementById("profil_country").innerHTML = countryUser;

        }
    };



    // SHARE BUTTON
    btnShare = document.getElementById("btn-share");

    btnShare.setAttribute("onclick", "return false;");  // make the page not refresh
    btnShare.addEventListener("click", function() {
        var content = document.getElementById("comment").value;
        var destination = document.getElementById("destination").value;

        // Sending post request to post message to someone else's wall
        post_request = new XMLHttpRequest();
        post_request.open('POST', SCRIPT_ROOT + 'post_message', true);
        post_request.setRequestHeader("Content-type", "application/json");

        parameters = JSON.stringify({"token":token , "message":content, "email":destination});
        post_request.send(parameters);

        post_request.onreadystatechange = function () {
            if (post_request.readyState == 4 && post_request.status == 200) {

                res_request = JSON.parse(post_request.responseText);
                if(res_request.success == false){
                    displayErrorShare(res_request.message);
                } else {
                    eraseErrorShare();
                    displaySuccessShare(res_request.message);
                    document.getElementById("comment").value = "";
                }
            }
        };
        return false;

    });

    // MESSAGE ON PROFILE WALL
    // Sending get request to get user information
    profile_message_request = new XMLHttpRequest();
    profile_message_request.open('GET', SCRIPT_ROOT + 'get_user_messages_by_token?token=' + token, true);
    profile_message_request.send();

    profile_message_request.onreadystatechange = function () {
        if (profile_message_request.readyState == 4 && profile_message_request.status == 200) {
            res_request = JSON.parse(profile_message_request.responseText);
            displayMessageHomePage(res_request);
        }
    };

    // Refresh button of newsfeed :
    document.getElementById("btn-refresh").addEventListener("click", function(){
        //Clear
        content = document.getElementById("newsfeed");
        content.innerHTML = "<div class=\"message panel panel-default hidden\"> <\/div>";

        // Reload
        reload_message_request = new XMLHttpRequest();
        reload_message_request.open('GET', SCRIPT_ROOT + 'get_user_messages_by_token?token=' + token, true);
        reload_message_request.send();

        reload_message_request.onreadystatechange = function () {
            if (reload_message_request.readyState == 4 && reload_message_request.status == 200) {
                res_request = JSON.parse(reload_message_request.responseText);
                displayMessageHomePage(res_request);
            }
        };
    });

}

function changeProfileToWelcome(){
    var profileDiv = document.getElementById("profile-page");
    profileDiv.remove();
    displayWelcomeView();
}

function changeWelcomeToProfile(token){
    var welcomeDiv = document.getElementById("welcome-page");
    welcomeDiv.remove();
    displayProfileView(token);
}

function displayErrorChangePassword(msg){
    document.getElementById("form-change-password").setAttribute("class", "form-group has-error");
    if(document.getElementById("change-password-valid") != null) document.getElementById("response-area-account").removeChild(document.getElementById("change-password-valid"));
    if(document.getElementById("change-password-error") != null) document.getElementById("response-area-account").removeChild(document.getElementById("change-password-error"));
    if(document.getElementById("change-password-error") == null){
        accounterrorlabel = document.createElement("label");
        accounterrorlabel.setAttribute("class", "label label-danger");
        accounterrorlabel.style.marginLeft = "15px";
        accounterrorlabel.setAttribute("id", "change-password-error");
        accounterrorlabel.innerText = msg;
    }
    document.getElementById("response-area-account").appendChild(accounterrorlabel);
}


function displayErrorSignUp(msg){
    if(document.getElementById("signup-error") == null){
        var errorlabel = document.createElement("label");
        errorlabel.setAttribute("class", "label label-danger");
        errorlabel.setAttribute("id", "signup-error");
        errorlabel.innerText = msg;
    }else{
        document.getElementById("signup-error").innerHTML= msg ;
    }

    document.getElementById("error-area-signup").appendChild(errorlabel);

    document.getElementById("up-username-form").setAttribute("class", "input-form has-error");
    document.getElementById("up-password-form").setAttribute("class", "input-form has-error");
    document.getElementById("up-name-form").setAttribute("class", "input-form has-error");
    document.getElementById("up-address-form").setAttribute("class", "input-form has-error");

}

function displayErrorSignIn(res) {
    document.getElementById("in-username-form").setAttribute("class", "input-group has-error");
    document.getElementById("in-password-form").setAttribute("class", "input-group has-error");
    if (document.getElementById("login-error") == null) {
        var errorlabel = document.createElement("label");
        errorlabel.setAttribute("class", "label label-danger");
        errorlabel.setAttribute("id", "login-error");
        errorlabel.innerText = res;
        document.getElementById("error-area-signin").appendChild(errorlabel);
    }
    if (document.getElementById("signup-error") != null) {
        // Sign-up has errors and need to be cleaned
        document.getElementById("error-area-signup").removeChild(document.getElementById("signup-error"));
        document.getElementById("up-username-form").setAttribute("class", "input-form");
        document.getElementById("up-password-form").setAttribute("class", "input-form");
        document.getElementById("up-password-form").setAttribute("class", "input-form");
        document.getElementById("up-name-form").setAttribute("class", "input-form");
        document.getElementById("up-address-form").setAttribute("class", "input-form");
    }
}


function displayMessageHomePage(msg){
    var template = $(".message.hidden");

    if(msg.success){
        msg.data.forEach(function (message){
            message = JSON.parse(message);
            var msg = template.clone().removeClass("hidden");
            div = document.createElement("div");
            div.setAttribute("class", "panel-body content-message");
            div.setAttribute("draggable", "true");
            div.setAttribute("ondragstart", "drag(event)");
            div.innerHTML = message.content;
            msg.append(div);
            $("#newsfeed").append(msg);
        });
    }
}

function displayMessageBrowserPage(msg){
    var template = $(".wall.hidden");
    if(msg.success){
        msg.data.forEach(function (message){
            message = JSON.parse(message);
            var msg = template.clone().removeClass("hidden");
            div = document.createElement("div");
            div.setAttribute("class", "panel-body content-message");
            div.innerHTML = message.content;
            msg.append(div);
            $("#wall-user").append(msg);
        });
    }
}


function displayErrorShare(msg){
    if(document.getElementById("share-error") == null){
        var errorlabel = document.createElement("label");
        errorlabel.setAttribute("class", "label label-danger");
        errorlabel.setAttribute("id", "share-error");
        errorlabel.innerText = msg;
        document.getElementById("error-area-share").appendChild(errorlabel);
    }

}

function displaySuccessShare(msg){
    if(document.getElementById("share-error") != null){
        document.getElementById("share-error").remove();
    }
    var successlabel = document.createElement("label");
    successlabel.setAttribute("class", "label label-success");
    successlabel.setAttribute("id", "share-error");
    successlabel.innerText = msg;
    document.getElementById("error-area-share").appendChild(successlabel);
}

function eraseErrorShare(){
    if(document.getElementById("share-error") != null){
        document.getElementById("share-error").innerHTML = "";
    }
}


function log_out(token){
    // Sending get request to get user information
    loggout_request = new XMLHttpRequest();
    loggout_request.open('GET', SCRIPT_ROOT + 'sign_out?token=' + token, true);
    loggout_request.send();

    loggout_request.onreadystatechange = function () {
        if (loggout_request.readyState == 4 && loggout_request.status == 200) {
            res_request = JSON.parse(loggout_request.responseText);
            if (res_request.success){
                localStorage.removeItem('token');
                changeProfileToWelcome();
            }
        }
    };
}

/* Drag and drop */

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.innerHTML);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.value = data;
}