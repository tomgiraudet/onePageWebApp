/*var imlocation = "../public/img/";
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
    currentdate = new Date();
    image_number = currentdate.getSeconds();
    image_number = Math.floor(image_number/rand);
    return(image[image_number])
}

document.onload(function(){
    document.getElementById('ad').write("<img src='../public/img/' + randomimage()>");
});*/


