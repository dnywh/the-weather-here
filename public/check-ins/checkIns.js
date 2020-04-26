// Mapping
const mymap = L.map("checkInMap").setView([0, 0], 1);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

// Data
getData();

async function getData() {
  const response = await fetch("/api");
  const data = await response.json();
  // console.log(data);
  for (item of data) {
    let popupContent = `Weather: ${item.weather.temp.value}°C.`;
    if (item.airQuality.value < 0) {
      popupContent += ` No air quality reading.`;
    } else {
      popupContent += ` Air quality: ${item.airQuality.value}${item.airQuality.unit}.`;
    }
    //   console.log(item.lat, item.lon);
    const options = {
      opacity: 0.5,
    };

    const marker = L.marker([item.lat, item.lon], options).addTo(mymap);
    marker.bindPopup(popupContent);
  }
}
