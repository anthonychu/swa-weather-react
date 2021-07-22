const axios = require('axios');

module.exports = async function (context, req) {
    const coordinates = req.query.coordinates || "49.2833329,-123.1200278";

    const endpoint = 'https://atlas.microsoft.com/weather/currentConditions/json';

    const params = {
        'subscription-key': process.env.AZURE_MAPS_KEY,
        'api-version': '1.0',
        'query': coordinates,
    };

    const response = await axios.get(endpoint, { params });
    context.res.json(response.data);
}