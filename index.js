// This is the server
// It hosts static files
const express = require("express");
const Datastore = require("nedb");
const fetch = require("node-fetch");
require('dotenv').config();

const app = express();

app.listen(3000, () => console.log("Listening at 3000"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("database.db");
database.loadDatabase();

app.get("/api", (request, response) => {
  database.find({}, (error, data) => {
    if (error) {
      console.log("error!");
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post("/api", (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

app.get("/weather/:latlon", async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    const apiKey = process.env.API_KEY;

    const weatherUrl = `https://api.climacell.co/v3/weather/realtime?lat=${lat}&lon=${lon}&unit_system=si&fields=temp%2Cweather_code&apikey=${apiKey}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const airQualityUrl = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const airQualityResponse = await fetch(airQualityUrl);
    const airQualityData = await airQualityResponse.json();

    const data = {
        weather: weatherData,
        airQuality: airQualityData
    }
    response.json(data);
  });