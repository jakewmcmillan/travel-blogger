//cloudinary handlers
const myWidget = cloudinary.createUploadWidget(
    {
      cloudName: "daheygjio",
      uploadPreset: "travelblogger",
      sources: ["local", "url", "google_drive", "facebook", "instagram"],
      showAdvancedOptions: false,
      clientAllowedFormats: "image",
      cropping: false,
      multiple: false,
      //thumbnails: '.thumbnail',
      defaultSource: "local",
      maxImageFileSize: 2000000, //restrict file size to less than 2MB
      maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
      styles: {
        palette: {
          window: "#CAD2C5",
          sourceBg: "#EDEDE4",
          windowBorder: "#84A98C",
          tabIcon: "#354F52",
          inactiveTabIcon: "#52796F",
          menuIcons: "#354F52",
          link: "#84A98C",
          action: "#2F3E46",
          inProgress: "#354F52",
          complete: "#84A98C",
          error: "#c43737",
          textDark: "#2F3E46",
          textLight: "#FFFFFF"
        },
        fonts: {
          default: null,
          "'Fauna One', sans-serif": {
            url:
              "https://fonts.googleapis.com/css2?family=Fauna+One&display=swap",
            active: true
          }
        }
      }
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        document
          .getElementById("uploaded-img")
          .setAttribute("src", result.info.secure_url);
      }
    }
  );
  
  document.getElementById("upload_widget").addEventListener(
    "click",
    function () {
      myWidget.open();
    },
    false
  );

//modal handlers

// Declare variables of Modal
const openModalBtn = document.getElementById("open-modal");
const modalOverlay = document.getElementById("modal-overlay");

// Show modal 
const showModalWindow = () => {
  modalOverlay.style.display = 'flex';
}
openModalBtn.addEventListener("click", showModalWindow);

// Hide Modal
const closeModalButton = document.getElementById("close-modal");

const hideModalWindow = () => {
    modalOverlay.style.display = 'none';
    const destinationEl = document.getElementById('dname');
    const addressEl = document.getElementById('address');
    const descriptionEl = document.getElementById('description');
    //clear form values
    destinationEl.value='';
    addressEl.value ='';
    descriptionEl.value='';
    document.getElementById('uploaded-img').setAttribute('src','data:,')
}

closeModalButton.addEventListener("click", hideModalWindow);


// Hide modal when anything outside the modal is clicked

const hideModal = (e) => {

    if(e.target === e.currentTarget) {
      console.log(e.target === e.currentTarget)
        hideModalWindow();
    }
}

//submit form
const form = document.getElementById('post');
const submitModal = (e) => {
  e.preventDefault();
  console.log('a bunch of stuff');
  const destination = document.getElementById('dname').value;
  const address = document.getElementById('address').value;
  const description = document.getElementById('description').value;
  const imgurl = document.getElementById('uploaded-img').getAttribute('src');
  
  //send request

  hideModalWindow();
}
form.addEventListener("submit", (e) => submitModal(e))

modalOverlay.addEventListener("click", hideModal);