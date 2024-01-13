var jobs=document.querySelector(".jobs");
var headingheight=(document.querySelector(".heading").offsetHeight/window.innerHeight)*100;
var mainheight=(document.querySelector(".jobs-carousel").offsetHeight/window.innerHeight)*100;
var pluss=100 -(mainheight + headingheight) - 10;
jobs.style.height=pluss+"vh";

function heightchange(){
    jobs.classList.toggle("active");
  

}