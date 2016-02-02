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


window.onload = function() {

    if (localStorage.getItem("loggedinusers") == "{}" || localStorage.getItem("loggedinusers") === null) {
        displayWelcomeView();
    }else{
        displayProfileView();
    }

};

function displayWelcomeView(){
    var welcomeDiv = document.getElementById("welcome-display");
    welcomeDiv.innerHTML = document.getElementById('welcome-view').innerHTML ;
    btnLogin = document.getElementById("btn-login");

    btnLogin.setAttribute("onclick", "return false;");  // make the page not refresh
    btnLogin.addEventListener("click", function() {
        var username = document.getElementById("user-username").value;
        var password = document.getElementById("user-password").value;
        var res = serverstub.signIn(username,password);
        if((/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test(username)) && (password.length > 5)){
            // Ok, sign in
            if(res.success){
                document.getElementById("in-username-form").setAttribute("class", "input-group has-success");
                document.getElementById("in-password-form").setAttribute("class", "input-group has-success");
                if (document.getElementById("login-error") != null ){
                    document.getElementById("error-area-signin").removeChild(document.getElementById("login-error"));
                }
                changeWelcomeToProfile();

            }else {
                // error
                displayErrorSignIn(res);
            }
        }else {
            displayErrorSignIn(res);
        }

        return false;

    });


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

            var jsonFile = { email : username, password : password, firstname : firstname, familyname : familyname,
                gender : sex, city : city, country : country};
            var connection = serverstub.signUp(jsonFile);

            if(connection.success){
                document.getElementById("signup-form").reset();
                serverstub.signIn(username, password);
                changeWelcomeToProfile();
            }else{
                displayErrorSignUp(connection.message);
            }
        }else{
            // Display error
            displayErrorSignUp("Please check your information.");
        }

        return false;
    });

    // Display random image
    var img = document.createElement("IMG");
    img.setAttribute("id", "brand-logo");
    img.setAttribute("src", "../public/img/" + randomimage());
    document.getElementById('ad').appendChild(img);
}

function displayProfileView(){
    var token = Object.keys(JSON.parse(localStorage.getItem("loggedinusers")));

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
            msg = serverstub.changePassword(token, oldpassword, newpassword);
            console.log(msg);

            if (msg.success) {
                // Display valid message
                document.getElementById("form-change-password").setAttribute("class", "form-group");
                if(document.getElementById("change-password-error") != null) document.getElementById("response-area-account").removeChild(document.getElementById("change-password-error"));

                accountvalidlabel = document.createElement("label");
                accountvalidlabel.setAttribute("class", "label label-success");
                accountvalidlabel.setAttribute("id", "change-password-valid");
                accountvalidlabel.style.marginLeft = "15px";
                accountvalidlabel.innerText = "Your password is changed";
                document.getElementById("response-area-account").appendChild(accountvalidlabel);

            }else{
                displayErrorChangePassword(msg.message);
            }
        }else{
            displayErrorChangePassword("Complete the fields");
        }
    });

    // LOGGOUT
    var loggoutbtn = document.getElementById("loggout-btn");
    loggoutbtn.setAttribute("onclick", "return false;");  // make the page not refresh
    loggoutbtn.addEventListener("click", function(){
        loggedInUsers = Object.keys(JSON.parse(localStorage.getItem("loggedinusers")));
        serverstub.signOut(loggedInUsers);
        changeProfileToWelcome();
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
        founduser = serverstub.getUserDataByEmail(token,  document.getElementById("search-user-input").value);
        if(founduser.success == false){
            // TODO : Display error
        }else{
            founduser = founduser.data;
        profilearea = document.createElement("div");
        profilearea.setAttribute("class", "col-md-2 side-panel");
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
        messageUser = (serverstub.getUserMessagesByEmail(token,  document.getElementById("search-user-input").value)).data;
        wallarea.innerHTML = "<div class='title-sign'> Wall </div>"+
                "<div>"+ messageUser + "</div>";
        founduserwall.appendChild(profilearea);
        founduserwall.appendChild(wallarea);
        }

    });


    // Display profil information:
    var user = serverstub.getUserDataByToken(token);
    userinformation = user.data;

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

    // Share button
    btnShare = document.getElementById("btn-share");

    btnShare.setAttribute("onclick", "return false;");  // make the page not refresh
    btnShare.addEventListener("click", function() {
        console.log("shared button hit");
        var content = document.getElementById("comment").value;
        var destination = document.getElementById("destination").value;

        console.log(destination);
        if(destination == ""){
            // Post on my own wall
            res = serverstub.postMessage(token, content);
            eraseErrorShare();
            displaySuccessShare(res.message);
            console.log("posted on my own wall");
            document.getElementById("comment").value = "";
        }else {
            // Post to someone else's wall
            res = serverstub.postMessage(token, content, destination);
            if (res.message = "No such user.") {
                // Unknown user
                displayErrorShare(res.message);
            } else {
                if (res.message = "You are not signed in.") {
                    displayErrorShare(res.message);
                } else {
                    eraseErrorShare();
                    displaySuccessShare(res.message);
                    console.log("posted on an other wall");
                    document.getElementById("comment").value = "";
                }
            }
        }

        return false;

    });


    // Refresh button of newsfeed :
    document.getElementById("btn-refresh").addEventListener("click", function(){
        content = document.getElementById("newsfeed");
        $("#newsfeed").load(content);
    });


    // Display message on Home page
    var msg = serverstub.getUserMessagesByToken(token);
    var template = $(".message.hidden");


    if(msg.success){
        console.log(msg.data);
        msg.data.forEach(function (message){
            var msg = template.clone().removeClass("hidden");
            console.log(message.content);
            console.log(msg);
            div = document.createElement("div");
            div.setAttribute("class", "panel-body content-message");
            div.innerHTML = message.content;
            msg.append(div);
            $("#newsfeed").append(msg);
        });
    }
}

function changeProfileToWelcome(){
    var profileDiv = document.getElementById("profile-page");
    profileDiv.remove();
    displayWelcomeView();
}

function changeWelcomeToProfile(){
    var welcomeDiv = document.getElementById("welcome-page");
    welcomeDiv.remove();
    displayProfileView();
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

    if(document.getElementById("login-error") != null){
        // Sign-in has errors and need to be cleaned
        document.getElementById("in-username-form").setAttribute("class", "input-group");
        document.getElementById("in-password-form").setAttribute("class", "input-group");
        document.getElementById("error-area-signin").removeChild(document.getElementById("login-error"));
    }

    if(document.getElementById("signup-error") == null){
        var errorlabel = document.createElement("label");
        errorlabel.setAttribute("class", "label label-danger");
        errorlabel.setAttribute("id", "signup-error");
        errorlabel.innerText = msg;
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
        errorlabel.innerText = res.message;
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
    var successlabel = document.createElement("label");
    successlabel.setAttribute("class", "label label-success");
    successlabel.setAttribute("id", "share-error");
    successlabel.innerText = msg;
    document.getElementById("error-area-share").appendChild(successlabel);
}

function eraseErrorShare(){
    if(document.getElementById("share-error") != null){
        document.getElementById("share-error").removeChild(document.getElementById("share-error"));
    }
}
