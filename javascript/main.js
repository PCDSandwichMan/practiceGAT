// ! Helpers

// ! CSS Buttons Functions

// ? Backgronud Change
function backgronudImageChange() {
  const newImage = 'url(../images/getRolled.png) no-repeat center center fixed';
  const imageDefaults = document.body.style;

  setTimeout(() => {
    document.body.style = imageDefaults;
  }, 4000);

  imageDefaults.background = newImage;
}

// ? Color Change
function changeTextColor() {
  const neonShadow =
    '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073';
  let textTags = document.getElementsByClassName('card');

  for (i = 0; i < textTags.length; ++i) {
    if (textTags[i].style.textShadow == 'none') {
      textTags[i].style.textShadow = neonShadow;
    } else {
      textTags[i].style.textShadow = 'none';
    }
  }
}

// ? Remove All CSS
function removeCSS() {  
    setTimeout(() => {
        document.styleSheets[0].disabled = false;
    }, 4000);
  
    document.styleSheets[0].disabled = true;
  }

// ? Better Hover Effects
// TODO finish this my dude
function betterHover() {
    let textTags = document.getElementsByClassName('card');
    
    console.log(textTags[1].classList);
    for (i = 0; i < textTags.length; ++i) {
        textTags[i].classList.toggle('betterHover');
    }
}

// ! API Buttons

// ? Weather in Antarica
// function getWeather() {
// }
