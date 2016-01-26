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
        if((/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test(username)) && (password !== null)){
            // Ok, sign in
        }
        else
        {
            username.setAttribute("class", "error");
        }

        return false;

    });


    // Display random image
    var img = document.createElement("IMG");
    img.setAttribute("id", "brand-logo");
    img.setAttribute("src", "../public/img/" + randomimage());
    document.getElementById('ad').appendChild(img);
}



