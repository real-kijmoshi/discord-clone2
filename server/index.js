const express = require('express');

const app = express();

require('dotenv').config();


const apiVersions = {
    v1: require('./api/v1')
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/:version', (req, res, next) => {
    const version = req.params.version;
    if (apiVersions[version]) {
        return apiVersions[version](req, res, next);
    }
    res.status(404).send('API version not found');
})

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})
