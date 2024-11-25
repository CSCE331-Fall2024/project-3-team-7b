import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box } from '@mui/material';

const Weather = (props) => {
    const city = "College Station";
    const [weatherData, setWeatherData] = useState(null);
    const isBanner = props.isBanner;
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=288fb59188b407967c9459d6080c9f1d`
            );
            setWeatherData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        !isBanner ? (
            <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                {weatherData ? (
                    <Box display="flex" alignItems="center" flexDirection="row" gap={8}>
                        <Box display="flex" alignItems="center" flexDirection="column">
                            {/* Weather Icon */}
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt="Weather Icon"
                                style={{ width: '100px', height: '100px' }}
                            />
                            <Typography variant="h5" component="div">
                                {weatherData.name}
                            </Typography>
                            <Typography variant="h6" color="text.primary">
                                {weatherData.weather[0].description}
                            </Typography>
                        </Box>
                        {/* Weather Details */}
                        <Box display="flex" alignItems="center" flexDirection="column">
                            <Typography variant="body1">
                                Temperature: {weatherData.main.temp}°F
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Feels Like: {weatherData.main.feels_like}°F
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Humidity: {weatherData.main.humidity}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Wind Speed: {weatherData.wind.speed} m/s
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography>Loading weather data...</Typography>
                )}
            </Box>
        ) : (
            <Box display="flex" justifyContent="center" alignItems="center">
                {weatherData ? (
                    <Box display="flex" alignItems="center" flexDirection="row" gap={5}>
                        {/* Weather Icon */}
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt="Weather Icon"
                            style={{ width: '100px', height: '100px' }}
                        />
                        {/* Weather Details */}
                        <Box display="flex" alignItems="center" flexDirection="column">
                            <Typography variant="h6" component="div">
                                {weatherData.name}
                            </Typography>
                            <Typography variant="h7" color="text.primary">
                                {weatherData.weather[0].description}
                            </Typography>
                            <Typography variant="body2">
                                Temperature: {weatherData.main.temp}°F
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Feels Like: {weatherData.main.feels_like}°F
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography>Loading weather data...</Typography>
                )}
            </Box>
        )
    );
};

export default Weather;
