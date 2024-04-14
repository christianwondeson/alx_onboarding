document.getElementById('osm-map').style.height = '600px';
  let loggedUser = '{{@user.username}}';

  axios.get(`http://localhost:5000/api/devices/get_devices_location/${loggedUser}`)
    .then(response => {
      let data = response.data;

      // Create an array to store locations
      var locations = [];

      for (let i = 0; i < data.length; i++) {
        var location = {
          lat: data[i].LATITUDE,
          lng: data[i].LONGITUDE,
          label: data[i].NAME
        };

        locations.push(location);
      }

      // Initialize the map
      var map = L.map('osm-map').setView([locations[0].lat, locations[0].lng], 18);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Create a marker cluster group
      var markers = L.markerClusterGroup();

      // Add markers for each location with a popup label to the marker cluster group
      locations.forEach(function (location) {
        var marker = L.marker([location.lat, location.lng]);
        marker.bindPopup(location.label);
        markers.addLayer(marker);
      });

      // Add the marker cluster group to the map
      map.addLayer(markers);

      // Open the popups after the markers have been added to the map
      markers.eachLayer(function (layer) {
        layer.openPopup();
      });

    })
    .catch(error => {
      console.log("ERROR", error);
    });