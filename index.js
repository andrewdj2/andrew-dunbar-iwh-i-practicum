const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;
const OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage: GET the custom object records and render them in a table
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,species,bio&limit=100`;

    try {
        const response = await axios.get(url, { headers });
        const pets = response.data.results;

        res.render('homepage', {
            title: 'Homepage | Integrating With HubSpot I Practicum',
            pets: pets
        });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('There was an error retrieving your records.');
    }
});

// ROUTE 2 - Render the form used to create a new custom object record
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3 - POST the form data to create a new custom object record
app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;

    const newRecord = {
        properties: {
            name: req.body.name,
            species: req.body.species,
            bio: req.body.bio
        }
    };

    try {
        await axios.post(url, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('There was an error creating your record.');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
