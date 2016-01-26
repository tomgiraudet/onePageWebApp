var imlocation = "../public/img/";
var currentdate = 0;
var image_number = 0;

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
var rand = 60/image.length;

function randomimage() {
    var rand = Math.floor((Math.random()*3) +1);
    console.log(rand);
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

    console.log(document.getElementById("user-username"));
    btnLogin.addEventListener("click", function() {

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
        testPassword = (password.localeCompare(passwordb) == 0) && password.length>0;
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
            alert("Fail somewhere, over the rainbow ...")
        }

        return false;
    });


    // Display random image
    var img = document.createElement("IMG");
    img.setAttribute("id", "brand-logo");
    img.setAttribute("src", "../public/img/" + randomimage());
    document.getElementById('ad').appendChild(img);
}



