

function onChangeTypeHandler() {
    // deal with option input first
    var geg = document.forms["messageForm"]["selection"].value;
    document.getElementById("otheroutPut").innerHTML = geg;
    geg === '2' ? onTest() : null;

    const message = document.forms["messageForm"]["mInput"].value;
    document.getElementById("outPut").innerHTML = message;
} 

function onTest() {
    const message = "x";
    document.getElementById("outPut").innerHTML = message;
}