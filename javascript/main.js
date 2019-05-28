// ! Helpers

// ! CSS Buttons Functions

// ? Backgronud Change
function backgronudImageChange() {
  const newImage = 'url(../images/getRolled.png) no-repeat center center fixed';
  const imageDefaults = document.body.style;

  console.log('Backgroud-Image Change Applied');

  setTimeout(() => {
    document.body.style = imageDefaults;
  }, 4000);

  imageDefaults.background = newImage;
}
