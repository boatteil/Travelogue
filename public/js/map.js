
    
      maptilersdk.config.apiKey = mapToken;

      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.STREETS,  // stylesheet location
        zoom: 9,
        center: [77.1025, 28.7041],
        
      });

      const gc = new maptilersdkMaptilerGeocoder.GeocodingControl({});

      map.addControl(gc, 'top-left');

  const popup = new maptilersdk.Popup({ offset: 25 })
  .setLngLat([77.1025, 28.7041])
  .setHTML("<h3>Welcome to Travelogue</h3>");

const marker = new maptilersdk.Marker({
  color: "red",
  draggable: true
})
.setLngLat([77.1025, 28.7041])
.setPopup(popup)  // attach popup
.addTo(map);
