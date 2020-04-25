// This is the server
// It hosts static files
const express = require('express');
const Datastore = require('nedb');

const app = express();

app.listen(3000, () => console.log('Hi Danny. Listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

// And...
// Saves information from database? Etc
// Saves information *to* database?
// Handles authentication?

// But not stuff that only the client can do. E.g...
// Geolocate

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (error, data) => {
        if (error) {
            console.log("error!");
            response.end();
            return;
        }
        response.json(data);
    })
})

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});