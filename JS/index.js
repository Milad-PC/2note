// Add slideDown animation to Bootstrap dropdown when expanding.
$('.dropdown').on('show.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
  });

  // Add slideUp animation to Bootstrap dropdown when collapsing.
  $('.dropdown').on('hide.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
  });



  //toggle jobs section

  function showjobs(hi){
var p =document.querySelectorAll('.category');
p[hi].classList.toggle("active");
  }


  //progressbar

  function checkMe(input) {
    const checkBoxes = document.querySelectorAll(".myCheckBox"+input);
    const progress = document.querySelectorAll(".catheading-inner");
    const checklistProgressInterval = 100 / checkBoxes.length;
    let width = 0;
    for(let i = 0; i < checkBoxes.length; i++){
      if(checkBoxes[i].checked){
        width += checklistProgressInterval;
      }
    }
      progress[input].style.width = `${width}%`;
  }


  // PWA
  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker
    .register('/sw.js')
    .then(function(){
      console.log('SW Registered');
    })
    .catch(function(err){
      console.log('SW Error',err);
    });
    });
  }

  //Install promp when not installed
  if(document.location.pathname != '/install.html'){
    if(!document.cookie.startsWith('ShowedInstall=true')){
      window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        var d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "ShowedInstall=true;" + expires + ";path=/";
        window.location = 'install.html';
      });
    }
  }