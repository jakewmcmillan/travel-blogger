//geocoding
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbHllcm9zZSIsImEiOiJjbDdqM2ZmNWwwZDd6NDJvOXNqNjFoaWJpIn0.zkgmR75M9mTqE27ouxHxVA';
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: 'Search Address...'
});

const geojson = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-77.0375935, 38.910095]
        },
        'properties': {
          'description': '<strong>Dog Park</strong> <br>This is a lovely spot to walk your dogs!'
        }
      },
    ]
  };

geocoder.addTo('#geocoder');
// Add geocoder result to container.
geocoder.on('result', (e) => {
    const locationDiv = document.getElementById('geocoder');
    locationDiv.setAttribute('data-coords',JSON.stringify(e.result.center));
    locationDiv.setAttribute('data-location',JSON.stringify(e.result.place_name));
});

//cloudinary handlers
const locationWidget = cloudinary.createUploadWidget(
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
      locationWidget.open();
    },
    false
  );

  const profileWidget = cloudinary.createUploadWidget(
    {
      cloudName: "daheygjio",
      uploadPreset: "profilepics",
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
        const avatar = document.getElementById('profpic');
        avatar.setAttribute("src", result.info.secure_url);
      }
    }
  );

  document.getElementById("profilewidget").addEventListener(
    "click",
    function () {
      profileWidget.open();
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
    geocoder.clear();
    const descriptionEl = document.getElementById('description');
    //clear form values
    destinationEl.value='';
    
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
const submitModal = async (e) => {
  e.preventDefault();
  const geocoderEl = document.getElementById('geocoder')
  const title = document.getElementById('dname').value.trim();
  const address = geocoderEl.getAttribute('data-location');
  const coords = geocoderEl.getAttribute('data-coords');
  const description = document.getElementById('description').value.trim();
  const imgurl = document.getElementById('uploaded-img').getAttribute('src');
  
  //send request
  if (title && address && description && imgurl) {
    const payload = {
        title:title,
        address:address,
        coords:coords,
        image_url:imgurl,
        content: description}
    
    const response = await fetch('/api/destinations/post', { //is this the right route? someone check yes emily its the right route :D
      method: 'POST',
      body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      document.location.reload();
        alert('Post Added!')
        geojson['features'].push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': JSON.parse(coords)
            },
            'properties': {
              'description': `<strong>${title}</strong> <br>${description}`
            }
          })
      } else {
        alert('Failed to add to add post!');
      }
}

  hideModalWindow();
}
form.addEventListener("submit", (e) => {
    if (e.submitter === document.getElementById('submit')) {
        submitModal(e)
    }
})

modalOverlay.addEventListener("click", hideModal);

      const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-96, 37.8],
        zoom: 3
      });

      map.on('load', () => {
        map.addSource('places', {
          'type': 'geojson',
          'data': geojson
        });

        map.loadImage(
            'https://res.cloudinary.com/daheygjio/image/upload/v1662094931/profilepics/zy0jtqhpeolszswbuvvm.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style.
                map.addImage('dog', image);

        
       map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
          'icon-allow-overlap': true,
          'icon-image': 'dog',
          'icon-size': 0.04
          }
        });
        
        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'places', (e) => {
            // Copy coordinates array.
            map.flyTo({
                center: e.features[0].geometry.coordinates,
                zoom: 6
                });
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', () => {
            map.getCanvas().style.cursor = '';
        });
    });
      });