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
    }else{
        var profileDiv = document.getElementById("profile-display");
        profileDiv.innerHTML = document.getElementById('profile-view').innerHTML ;
    }


    btnLogin = document.getElementById("btn-login");

    btnLogin.setAttribute("onclick", "return false;");  // make the page not refresh
    btnLogin.addEventListener("click", function() {
        var username = document.getElementById("user-username").value;
        var password = document.getElementById("user-password").value;
        if((/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test(username)) && (password.length > 6)){
            // Ok, sign in

            document.getElementById("in-username-form").setAttribute("class", "input-group has-success");
            document.getElementById("in-password-form").setAttribute("class", "input-group has-success");
            document.getElementById("error-area").removeChild(document.getElementById("login-error"));
        }
        else
        {
            document.getElementById("in-username-form").setAttribute("class", "input-group has-error");
            document.getElementById("in-password-form").setAttribute("class", "input-group has-error");

            var errorlabel = document.createElement("label");
            errorlabel.setAttribute("class", "label label-danger");
            errorlabel.setAttribute("id", "login-error");
            errorlabel.innerText = "Wrong email or password";
            document.getElementById("error-area").appendChild(errorlabel);
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

        testUsername = username.length>0;
        // J'ai rajouté length > 6 parce qu'il faut une longueur minimum du mot de passe
        testPassword = (password.localeCompare(passwordb) == 0) && password.length>6;
        testFirstName = firstname.length>0;
        testFamilyName = familyname.length>0;
        testSex = true; // To do : test sexe
        testCity = city.length>0;
        testCountry = country.length>0;

        valide = testUsername && testPassword && testFirstName && testSex && testFamilyName && testCity && testCountry
        console.log(valide);

        if(valide){
            alert("Sign up succesful ! Good job dickhead !")
        }else{
            if(!testUsername){
                //document.getElementById()
            }
            if(!testFirstName){
                document.getElementById("new-firstname").setAttribute("class", "has-error");
            }
            if(!testFamilyName){


            }
            if(!testSex){

            }
            if(!testCity){

            }
            if(!testCountry){

            }
        }

        return false;
    });


    // Display random image
    var img = document.createElement("IMG");
    img.setAttribute("id", "brand-logo");
    img.setAttribute("src", "../public/img/" + randomimage());
    document.getElementById('ad').appendChild(img);
};



