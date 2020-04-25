// This is the server
// It hosts static files
const express = require('express');
const app = express();

app.listen(3000, () => console.log('Hi Danny. Listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

// And...
// Saves information from database? Etc
// Saves information *to* database?
// Handles authentication?

// But not stuff that only the client can do. E.g...
// Geolocate

app.post('/api', (request, response) => {
    console.log(request.body);
    const data = request.body;
    response.json({
        status: "success",
        latitude: data.latitude,
        longitude: data.longitude
    });
});