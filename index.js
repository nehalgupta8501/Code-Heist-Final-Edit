// toggle button code
window.onload = function() {
    document.getElementById('track').play();
    var track = document.getElementById('track');
    track.paused = false;
    var controlBtn = document.getElementById('play-pause');

    function playPause() {
      if (track.paused) {
          track.play();
          //controlBtn.textContent = "Pause";
          controlBtn.className = "pause";
      } else { 
          track.pause();
          //controlBtn.textContent = "Play";
          controlBtn.className = "play";
      }
    }

    controlBtn.addEventListener("click", playPause);
    track.addEventListener("ended", function() {
    controlBtn.className = "play";
  });
}

// Other pages
function openAbout(){
	window.location= "about.html";	
}

function openInstructions(){
	window.location="instruction.html";
}

function openRewards(){
	window.location="rewards.html";
}

function openLogin(){
	window.location="login.html";
}

// IMAGE SLIDES & CIRCLES ARRAYS, & COUNTER
var imageSlides = document.getElementsByClassName('imageSlides');
var circles = document.getElementsByClassName('circle');
var leftArrow = document.getElementById('leftArrow');
var rightArrow = document.getElementById('rightArrow');
var counter = 0;

// HIDE ALL IMAGES FUNCTION
function hideImages() {
  for (var i = 0; i < imageSlides.length; i++) {
    imageSlides[i].classList.remove('visible');
  }
}

// REMOVE ALL DOTS FUNCTION
function removeDots() {
  for (var i = 0; i < imageSlides.length; i++) {
    circles[i].classList.remove('dot');
  }
}

// SINGLE IMAGE LOOP/CIRCLES FUNCTION
function imageLoop() {
  var currentImage = imageSlides[counter];
  var currentDot = circles[counter];
  currentImage.classList.add('visible');
  removeDots();
  currentDot.classList.add('dot');
  counter++;
}

// LEFT & RIGHT ARROW FUNCTION & CLICK EVENT LISTENERS
function arrowClick(e) {
  var target = e.target;
  if (target == leftArrow) {
    clearInterval(imageSlideshowInterval);
    hideImages();
    removeDots();
    if (counter == 1) {
      counter = (imageSlides.length - 1);
      imageLoop();
      imageSlideshowInterval = setInterval(slideshow, 5000);
    } else {
      counter--;
      counter--;
      imageLoop();
      imageSlideshowInterval = setInterval(slideshow, 5000);
    }
  } 
  else if (target == rightArrow) {
    clearInterval(imageSlideshowInterval);
    hideImages();
    removeDots();
    if (counter == imageSlides.length) {
      counter = 0;
      imageLoop();
      imageSlideshowInterval = setInterval(slideshow, 5000);
    } else {
      imageLoop();
      imageSlideshowInterval = setInterval(slideshow, 5000);
    }
  }
}

leftArrow.addEventListener('click', arrowClick);
rightArrow.addEventListener('click', arrowClick);


// IMAGE SLIDE FUNCTION
function slideshow() {
  if (counter < imageSlides.length) {
    imageLoop();
  } else {
    counter = 0;
    hideImages();
    imageLoop();
  }
}

// SHOW FIRST IMAGE, & THEN SET & CALL SLIDE INTERVAL
setTimeout(slideshow, 500);
var imageSlideshowInterval = setInterval(slideshow, 5000);