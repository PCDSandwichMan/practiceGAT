// ! CSS Buttons Functions

// ? Background Change
function backgronudImageChange() {
  const newImage = 'url(../images/getRolled.png) no-repeat center center fixed';
  const imageDefaults = document.body.style;

  setTimeout(() => {
    document.body.classList.remove('getRolled');
  }, 4000);

  document.body.classList.add('getRolled');
}

// ? Color Change
function changeTextColor() {
  const neonShadow =
    '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073';
  let textTags = document.getElementsByClassName('card');

  for (i = 0; i < textTags.length; ++i) {
    if (
      textTags[i].style.textShadow == 'none' ||
      textTags[i].style.textShadow == ''
    ) {
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
let modalLoad = document.getElementsByClassName('LoaderBalls')[0];
let modalBody = document.getElementsByClassName('modalBody')[0];
let modalBodyImage = document.getElementsByClassName('modalBodyImage')[0];
let modalBodyText = document.getElementsByClassName('modalBodyText')[0];
let numbersInput = document.getElementById('numbersInput');
let modalFooter = document.getElementsByClassName('modalFooter')[0];
let modalFooterText = document.getElementsByClassName('modalFooterText')[0];
let modalFooterImage = document.getElementsByClassName('modalFooterImage')[0];
let modalButton = document.getElementsByClassName('modalButton')[0];

let closeBtn = document.getElementsByClassName('closeBtn')[0];

// ! Multi-use Modal Full Reset
function resetModal() {
  modalTitle.innerHTML = '';
  modalBodyImage.src = '';
  modalBodyText.innerHTML = '';
  modalFooterImage.style.display = 'none';
  modalFooterText.innerHTML = '';
  numbersInput.style.display = 'none';
  modalButton.style.display = 'none';
}

//! ALL API DATA MODAL CARDS
let weatherModal = document.getElementById('getWeather');
let chuckFact = document.getElementById('getChuckFact');
let numberFact = document.getElementById('getNumberFact');
let nasaInfo = document.getElementById('getNasaInfo');

// ! API listeners
weatherModal.addEventListener('click', getWeather);
chuckFact.addEventListener('click', getChuckFact);
numberFact.addEventListener('click', getUserNumber);
nasaInfo.addEventListener('click', getNasaInfo);

// * Modal Listeners
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// * Modal Functions
function openModal() {
  modalMainContainer.style.display = 'block';
  modalBodyImage.style.display = 'none';
  modalLoad.style.display = 'flex';
  modalTitle.innerHTML = 'Be Right Back';
  modalBodyText.innerHTML = 'Grabbing Your Button Information';
}
function closeModal() {
  modalMainContainer.style.display = 'none';
  resetModal();
}
function outsideClick(e) {
  if (e.target == modalMainContainer) {
    modalMainContainer.style.display = 'none';
    resetModal();
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
  //   console.log(`Geolocation access has been ${status.state}`);
  isGeolocationEnabled = status.state;
});

// ? Click Event
let geoLocationCity = '';
let currentTemp = '';
let weatherDescription = '';
let iconCode = '';
let iconUrl = '';
function getWeather() {
  openModal();
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
          //   console.log(geoLocationCity);
          currentTemp = myJson.main.temp;
          //   console.log(currentTemp);
          weatherDescription = myJson.weather[0].description;
          //   console.log(weatherDescription);
          iconCode = myJson.weather[0].icon;
          iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png';
          //   console.log(iconCode);
          // ? Display in DOM
          modalTitle.innerHTML = geoLocationCity
            .replace('"', '')
            .replace('"', '');
          modalBodyText.innerHTML = `The current weather is: ${weatherDescription
            .charAt(0)
            .toUpperCase() +
            weatherDescription.slice(1)} at ${currentTemp} degrees.`;
          modalBodyText.style.display = 'block';
          modalFooterImage.src = iconUrl;
          modalFooterImage.style.display = 'block';
          modalLoad.style.display = 'none';
        });
    });
  } else {
    alert(
      'Geolocation is enabled or is not available in your current browser.'
    );
  }
}

//! Chuck Norris Facts API
const chuckFactUrl = 'https://api.chucknorris.io/jokes/random';

// * Fetches for random chuck fact
function getChuckFact() {
  openModal();
  fetch(chuckFactUrl)
    .then(
      response => {
        if (response.ok) {
          return response.json();
        }
      },
      error => {
        alert('Bad stuff happened and something broke');
        console.log(error);
      }
    )
    .then(jsonResponse => {
      const chuckIcon = jsonResponse.icon_url;
      const chuckFact = jsonResponse.value;

      modalTitle.innerHTML = 'Chuck Fact';
      modalBodyText.innerHTML = chuckFact;
      modalBodyText.style.display = 'block';
      modalFooterImage.src = chuckIcon;
      modalFooterImage.style.display = 'block';
      modalLoad.style.display = 'none';
    });
}

// ! Number Facts API
const inputFeild = document.getElementById('numbersInput');
let userNumber;
function showNumber(str) {
  //*callback for the fact fetch
  modalBodyText.innerText = str;
  modalBodyText.style.display = 'block';
}

// ? get the value from the SEARCH TAG YOU NEED TO MAKE
function getUserNumber() {
  openModal();
  modalLoad.style.display = 'none';
  modalTitle.innerHTML = "What number's fact would you like?";

  // * Displays and resets input and hide old body
  inputFeild.value = '';
  inputFeild.style.display = 'block';
  modalBodyText.style.display = 'none';
  // * Styling for the input field
  modalFooterImage.style.display = 'block';
  modalFooterImage.src = 'images/questionMarkFire.ico';
  modalFooterImage.style = 'height: 10%; width: 10%';

  inputFeild.addEventListener('keypress', function(e) {
    const inputVal = inputFeild.value;
    const key = e.which || e.keyCode;
    if (key === 13) {
      //*check for enter key
      if (isNaN(inputVal)) {
        //* Number input check
        alert("INPUT MUST BE ALL NUMBERS! DON'T BREAK THE MATRIX NEO!");
        return false;
      }
      inputFeild.style.display = 'none'; // *hides input field

      //* fetches number fact and displays to modal

      (function() {
        var scriptTag = document.createElement('script');
        scriptTag.async = true;
        modalLoad.style.display = 'flex';
        scriptTag.src = `http://numbersapi.com/${inputVal}/math?callback=showNumber`;
        document.body.appendChild(scriptTag);
        modalLoad.style.display = 'none';
      })();
    }
  });
}

//! Nasa APOD (daily picture) API
apodUrl =
  'https://api.nasa.gov/planetary/apod?api_key=XRjUqrBTRbTO4FnyFmn2gFUMF2EGTdX3Jc51c3L4&hd=True';

//* fetches the APOD from the NASA API
function getNasaInfo() {
  openModal();
  fetch(apodUrl)
    .then(
      response => {
        if (response.ok) {
          return response.json();
        }
      },
      networkError => {
        alert('Bad stuff happened and something broke');
        console.log(networkError);
      }
    )
    .then(jsonResponse => {
      modalTitle.innerHTML = jsonResponse.title;
      modalBodyText.innerHTML = jsonResponse.explanation;
      modalBodyText.style.display = 'block';
      modalBodyImage.src = jsonResponse.url;
      modalBodyImage.style.display = 'block';
      let copyrightFooter = () => {
        if (jsonResponse.copyright) {
          modalFooterText.innerHTML = `&copy ${jsonResponse.copyright}`;
        } else {
          modalFooterText.innerHTML = `&copy NASA`;
        }
      };
      copyrightFooter();
      modalLoad.style.display = 'none';
      modalBodyImage.style.display = 'block'; //*counters reset
    });
}

// ! Transform/Transition/Keyframe Buttons

// ? Main Variables
const speechReader = document.getElementById('speechReader');
const barrelRoll = document.getElementById('barrelRoll');
const lightsOff = document.getElementById('lightsOff');
const killButtons = document.getElementById('killButtons');
const fullPage = document.getElementsByClassName('fullPage')[0];
const headerTag = document.getElementsByTagName('header')[0];

// ? Button Event Listeners
speechReader.addEventListener('click', speechReaderActivate);
barrelRoll.addEventListener('click', doBarrelRoll);
lightsOff.addEventListener('click', turnLightsOff);
killButtons.addEventListener('click', killButtonsAnimation);

// ? SpeechRecognition Button
function speechReaderActivate() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.start();
  openModal();
  modalLoad.style.display = 'none';
  modalTitle.innerHTML = 'Tell Me A Story';
  modalBodyText.innerHTML = '(Start Speaking)';
  

  recognition.onresult = function(event) {
    const current = event.resultIndex;
    const voiceTranscript = event.results[current][0].transcript;
    console.log(voiceTranscript);
    // * Puts speech to text on modal and displays
    modalBodyText.innerHTML = voiceTranscript;
    modalButton.style.display = 'block';
  };
}

//*reads the script
const readText = () => {
  const speech = new SpeechSynthesisUtterance();
  speech.volume = 0.3;
  speech.rate = .8;
  speech.pitch = 1;
  speech.text = modalBodyText.innerHTML;
  window.speechSynthesis.speak(speech);
};

//? Do a Barrel Roll button
function doBarrelRoll() {
  const allCards = document.getElementsByClassName('card');

  for (i = 0; i < allCards.length; ++i) {
    allCards[i].classList.toggle('rotated');
  }
}

//? Controls lights of buttons
function turnLightsOff() {
  document.querySelector('*').classList.toggle('dimScreen');
}

// ? Controls grid layout rearrange
function killButtonsAnimation() {
  const allCards = document.getElementsByClassName('card');
  // * Causes all cards to fall off screen
  for (i = 0; i < allCards.length; ++i) {
    window.setTimeout(() => console.log('waiting'), 2000);
    allCards[i].classList.add('killButtons');
  }
  // * Restores buttons for user after delay
  window.setTimeout(() => {
    alert(
      'Thanks for playing! (the buttons will come back shortly if your wish to continue playing)'
    );
  }, 2000);
  console.log('before');
  window.setTimeout(() => {
    console.log('during');

    for (i = 0; i < allCards.length; ++i) {
      allCards[i].classList.remove('killButtons');
    }
  }, 15000);
}

//! Nav Bar Functionality
// * Variables for nav items
const apiNav = document.getElementById('apiNav');
const ttNav = document.getElementById('ttNav');
const jSNav = document.getElementById('jSNav');
const cssNav = document.getElementById('cssNav');
const dontNav = document.getElementById('dontNav');

//* Card Class Identifiers
const cssEffect = document.getElementsByClassName('cssEffect');
const ttEffect = document.getElementsByClassName('ttEffect');
const jSEffect = document.getElementsByClassName('jSEffect');
const apiEffect = document.getElementsByClassName('apiEffect');

// * Event listeners for nav highlight
apiNav.addEventListener('click', buttonGlowSelector);
ttNav.addEventListener('click', buttonGlowSelector);
jSNav.addEventListener('click', buttonGlowSelector);
cssNav.addEventListener('click', buttonGlowSelector);
dontNav.addEventListener('click', buttonGlowSelector);

// ? Button Glowing effect when nav click
function buttonGlowAdd(btn) {
  const allCards = document.getElementsByClassName('card');
  console.log(btn[0].classList.value);
  if (!btn[0].classList.value.includes('buttonGlow')) {
    for (i = 0; i < allCards.length; ++i) {
      allCards[i].classList.remove('buttonGlow');
    }
  }
  for (i = 0; i < btn.length; ++i) {
    btn[i].classList.toggle('buttonGlow');
  }
}

function buttonGlowSelector(e) {
  console.log(e.target.id);
  //TODO add remove class edge case before function call
  switch (e.target.id) {
    case 'apiNav':
      buttonGlowAdd(apiEffect);
      break;
    case 'ttNav':
      buttonGlowAdd(ttEffect);
      break;
    case 'jSNav':
      buttonGlowAdd(jSEffect);
      break;
    case 'cssNav':
      buttonGlowAdd(cssEffect);
      break;
    case 'dontNav':
      //TODO Finish this button
      let alertSound = new Audio('../images/spookButton.mp3');
      alertSound.volume = 1;
      alertSound.play();
      setTimeout(() => {
        alert(
          'Boo! ( See now you will be scared for the whole day.... I told you not to press it.....)'
        );
      }, 200);
      break;
  }
}
