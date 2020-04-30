// Leaflet
// const mymap = L.map("geoMap").setView([0, 0], 15);
// const marker = L.marker([0, 0]).addTo(mymap);
// const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// const attribution = "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>";
// const tiles = L.tileLayer(tileUrl, { attribution });
// tiles.addTo(mymap);

// Geo locate
let lat, lon, weather, airQuality;

if ("geolocation" in navigator) {
  console.log("geolocation is available!");

  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      document.getElementById("latitude").textContent = lat.toFixed(2);
      document.getElementById("longitude").textContent = lon.toFixed(2);

      const apiUrl = `/weather/${lat},${lon}`;
      const response = await fetch(apiUrl);
      const json = await response.json();
      console.log("JSON response from server:");
      console.log(json);

      // Handle weather
      weather = json.weather;
      document.getElementById("summary").textContent = weather.weather_code.value;
      document.getElementById("temperature").textContent = weather.temp.value;
      
      // Handle air quality
      airQuality = json.airQuality.results[0].measurements[0];
      airQuality = airQuality.value;
      document.getElementById("aqValue").textContent = airQuality.value;
      document.getElementById("aqUnit").textContent = airQuality.unit;
    } catch (error) {
      console.log("Something went wrong when fetching the air quality data:");
      console.error(error);
      console.log("Trying an alternate source...");
      const apiUrl = `/weather/${lat},${lon}`;
      const response = await fetch(apiUrl);
      const json = await response.json();
      document.getElementById("aqValue").textContent = `(backup reading) ${json.weather.pm25.value}`;
      document.getElementById("aqUnit").textContent = json.weather.pm25.units;

      airQuality = { value: -1 };
    }

    const data = { lat, lon, weather, airQuality };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const dbResponse = await fetch("/api", options);
    const dbJson = await dbResponse.json();
    console.log(dbJson);
  });
} else {
  console.log("geolocation is *not* available");
}

// Handle button presses, submit data to database
