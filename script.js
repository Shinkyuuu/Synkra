window.addEventListener('scroll', doParallax);

function doParallax(){
   var positionY = window.pageYOffset/2;
   document.body.style.backgroundPosition = "70% -" + (positionY /2) + "px";
}

