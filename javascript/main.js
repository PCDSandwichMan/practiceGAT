// ! CSS Buttons Functions

// ? Background Change
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

  for (i = 0; i < textTags.length; ++i) {
    textTags[i].classList.toggle('betterHover');
  }
}

// ! API Buttons

// ! Get the weather
// ? Get the weather
let weatherURL = 'http://api.openweathermap.org/data/2.5/weather?';
let long = 0;
let lat = 0;
let otherQueries = 'units=imperial';
let weatherApikey = '&APPID='; //TODO - add api key

// ? Helpers for get weather
// TODO - IT WORKS!!!!!!!!
function checkGeo() {
  // ! CHECKS FOR AND STORES GEOLOCATION AVAILABLE
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      tempLat = JSON.parse(position.coords.latitude);
      tempLong = JSON.parse(position.coords.longitude);
      lat = tempLat;
      long = tempLong;
      console.log(lat, long);
    });
    return true;
  } else {
    return false;
  }
}

// ? Click event
function getWeather() {
  if (checkGeo()) {
    checkGeo();
    console.log('Get geolocation weather has activated');
    // ! fetches API
    setTimeout(() => {
      fetch(
        `${weatherURL}lat=${lat}&lon=${long}&${weatherApikey}&${otherQueries}`
      )
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          console.log(JSON.stringify(myJson));
        });
    }, 10000);
  } else {
    console.log('Geolocation is not available');
  }
}
