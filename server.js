const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ error: 'Invalid input. Please provide an array of city names.' });
    }

    const weatherDataPromises = cities.map(async (city) => {
      const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`);
      return {
        city,
        weather: weatherResponse.data.weather[0].description,
        temperature: weatherResponse.data.main.temp,
      };
    });

    const weatherData = await Promise.all(weatherDataPromises);

    res.json({ weatherData });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
