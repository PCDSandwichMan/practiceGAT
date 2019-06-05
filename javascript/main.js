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

// ? Reusable Modal
// * Modal Vars
let modalMainContainer = document.getElementsByClassName(
  'modalMainContainer'
)[0];
let modalTitle = document.getElementsByClassName('modalTitle')[0];
let modalBody = document.getElementsByClassName('modalBody')[0];
let modalBodyText = document.getElementsByClassName('modalBodyText')[0];
let modalFooterText = document.getElementsByClassName('modalFooterText')[0];

let weatherModal = document.getElementById('getWeather');
let closeBtn = document.getElementsByClassName('closeBtn')[0];

// * Modal Listeners
weatherModal.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// * Modal Functions
function openModal() {
  modalMainContainer.style.display = 'block';
}
function closeModal() {
  modalMainContainer.style.display = 'none';
}
function outsideClick(e) {
  if (e.target == modalMainContainer) {
    modalMainContainer.style.display = 'none';
  }
}

// ! Get the weather
// ? Get the weather
let isGeolocationEnabled = '';
let weatherURL = 'http://api.openweathermap.org/data/2.5/weather?';
let long = 0;
let lat = 0;
let otherQueries = 'units=imperial';
let weatherApikey = '&APPID=f815bde335c200f01cd0732879135a21'; //TODO - add api key

// ? Helpers for get weather
// * gets the lat and long
function updateCoordinate(callback) {
  navigator.geolocation.getCurrentPosition(position => {
    var returnValue = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    var jsonCookie = returnValue;
    callback(jsonCookie);
  });
}
// * check if geolocation is disabled
navigator.permissions.query({ name: 'geolocation' }).then(function(status) {
  console.log(`Geolocation access has been ${status.state}`);
  isGeolocationEnabled = status.state;
});

// ? Click Event
let geoLocationCity = '';
let currentTemp = '';
let weatherDescription = '';
let iconCode = '';
let iconUrl = '';
function getWeather() {
  if (isGeolocationEnabled == 'granted' || isGeolocationEnabled == 'prompt') {
    updateCoordinate(function(cookie) {
      lat = cookie.latitude;
      long = cookie.longitude;
      // * Fetches API Data
      fetch(
        `${weatherURL}lat=${lat}&lon=${long}${weatherApikey}&${otherQueries}`
      )
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          geoLocationCity = JSON.stringify(myJson.name);
          console.log(geoLocationCity);
          currentTemp = myJson.main.temp;
          console.log(currentTemp);
          weatherDescription = myJson.weather[0].description;
          console.log(weatherDescription);
          iconCode = myJson.weather[0].icon;
          iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png';
          console.log(iconCode);
          // ? Display in DOM
          modalTitle.innerHTML = geoLocationCity
            .replace('"', '')
            .replace('"', '');
          modalBodyText.innerHTML = `The current weather is: ${weatherDescription
            .charAt(0)
            .toUpperCase() +
            weatherDescription.slice(1)} at ${currentTemp} degrees.`;
          modalFooterText.src = iconUrl;
        });
    });
  } else {
    console.log(
      'Geolocation is enabled or is not available in your current browser.'
    );
  }
}
