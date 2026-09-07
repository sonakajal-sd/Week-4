const weatherAPI = require("./weatherAPI");

async function getWeatherData(city) {
    const url =
        `https://api.weather.com/current?city=${city}`;

    return weatherAPI.getWeather(url);
}

module.exports = {
    getWeatherData
};