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
    if (localStorage.getItem("token") === null) {
        var welcomeDiv = document.getElementById("welcome-display");
        welcomeDiv.innerHTML = document.getElementById('welcome-view').innerHTML ;
        btnLogin = document.getElementById("btn-login");

        btnLogin.setAttribute("onclick", "return false;");  // make the page not refresh
        btnLogin.addEventListener("click", function() {
            var username = document.getElementById("user-username").value;
            var password = document.getElementById("user-password").value;
            if((/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test(username)) && (password.length > 5)){
                // Ok, sign in

                document.getElementById("in-username-form").setAttribute("class", "input-group has-success");
                document.getElementById("in-password-form").setAttribute("class", "input-group has-success");
                document.getElementById("error-area-signin").removeChild(document.getElementById("login-error"));
            }
            else
            {


                document.getElementById("in-username-form").setAttribute("class", "input-group has-error");
                document.getElementById("in-password-form").setAttribute("class", "input-group has-error");
                if(document.getElementById("login-error") == null) {
                    var errorlabel = document.createElement("label");
                    errorlabel.setAttribute("class", "label label-danger");
                    errorlabel.setAttribute("id", "login-error");
                    errorlabel.innerText = "Wrong email or password";
                    document.getElementById("error-area-signin").appendChild(errorlabel);
                }
                if(document.getElementById("signup-error") != null){
                    // Sign-up has errors and need to be cleaned
                    document.getElementById("error-area-signup").removeChild(document.getElementById("signup-error"));
                    document.getElementById("up-username-form").setAttribute("class", "input-form");
                    document.getElementById("up-password-form").setAttribute("class", "input-form");
                    document.getElementById("up-password-form").setAttribute("class", "input-form");
                    document.getElementById("up-name-form").setAttribute("class", "input-form");
                    document.getElementById("up-address-form").setAttribute("class", "input-form");
                }
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

            testUsername = username.length>0 && ((/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test(username)));
            testPassword = (password.localeCompare(passwordb) == 0) && password.length>5;
            testFirstName = firstname.length>0;
            testFamilyName = familyname.length>0;
            testCity = city.length>0;
            testCountry = country.length>0;

            valide = testUsername && testPassword && testFirstName && testFamilyName && testCity && testCountry
            console.log(valide);

            if(valide){
                alert("Sign up succesful ! Good job dickhead !")
                document.getElementById("error-area-signup").removeChild(document.getElementById("signup-error"));
                document.getElementById("up-username-form").setAttribute("class", "input-form");
                document.getElementById("up-password-form").setAttribute("class", "input-form");
                document.getElementById("up-password-form").setAttribute("class", "input-form");
                document.getElementById("up-name-form").setAttribute("class", "input-form");
                document.getElementById("up-address-form").setAttribute("class", "input-form");
            }else{
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
                    errorlabel.innerText = "Please check your information";
                }
                document.getElementById("error-area-signup").appendChild(errorlabel);

                if(!testUsername){
                    document.getElementById("up-username-form").setAttribute("class", "input-form has-error");
                }else{
                    document.getElementById("up-username-form").setAttribute("class", "input-form");
                }
                if(!testFirstName){
                    document.getElementById("up-password-form").setAttribute("class", "input-form has-error");
                }else{
                    document.getElementById("up-password-form").setAttribute("class", "input-form");
                }
                if(!testPassword){
                    document.getElementById("up-password-form").setAttribute("class", "input-form has-error");
                }else{
                    document.getElementById("up-password-form").setAttribute("class", "input-form");
                }
                if(!testFamilyName || !testFirstName){
                    document.getElementById("up-name-form").setAttribute("class", "input-form has-error");
                }else{
                    document.getElementById("up-name-form").setAttribute("class", "input-form");
                }
                if(!testCity || !testCountry){
                    document.getElementById("up-address-form").setAttribute("class", "input-form has-error");
                }else{
                    document.getElementById("up-address-form").setAttribute("class", "input-form");
                }
            }
            return false;
        });

        
    }else{
        var profileDiv = document.getElementById("profile-display");
        profileDiv.innerHTML = document.getElementById('profile-view').innerHTML ;
    }





    // Display random image
    var img = document.createElement("IMG");
    img.setAttribute("id", "brand-logo");
    img.setAttribute("src", "../public/img/" + randomimage());
    document.getElementById('ad').appendChild(img);
};



