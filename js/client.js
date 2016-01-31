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
    localStorage.setItem("token", "test");

    // Not logged :
    if (localStorage.getItem("token") === null) {
        //if (localStorage.getItem("loggedinusers") === null) {
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
                    document.getElementById("error-area-signin").removeChild(document.getElementById("login-error"));
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
                    // Ok, redirection vers profile page
                    document.getElementById("signup-form").reset();
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

    }else{

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

        // Display profil information:
        mailAddressUser = localStorage.getItem("loggedinusers").email;
        firstNameUser = localStorage.getItem("loggedinusers").firstname;
        familyNameUser = localStorage.getItem("loggedinusers").familyname;
        sexUser = localStorage.getItem("loggedinusers").gender;
        cityUser = localStorage.getItem("loggedinusers").city;
        countryUser = localStorage.getItem("loggedinusers").country;

        document.getElementById("profil_username").innerHTML = mailAddressUser;
        document.getElementById("profil_first_name").innerHTML = firstNameUser;
        document.getElementById("profil_family_name").innerHTML = familyNameUser;
        document.getElementById("profil_sex").innerHTML = sexUser;
        document.getElementById("profil_city").innerHTML = cityUser;
        document.getElementById("profil_country").innerHTML = countryUser;
    }

};

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
