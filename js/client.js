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


    // Display random image
    var img = document.createElement("IMG");
    img.setAttribute("id", "brand-logo");
    img.setAttribute("src", "../public/img/" + randomimage());
    document.getElementById('ad').appendChild(img);
}



