import React, { useState, useEffect } from "react";
import axios from "axios";
import clouds from "../../Images/clouds.png";
import semiClouds from "../../Images/cloudy-day.png";
import rain from "../../Images/heavy-rain.png";
import snow from "../../Images/snow.png";
import sun from "../../Images/sun.png";
import thunder from "../../Images/thunder.png";

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weatherImage, setWeatherImage] = useState("");

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            setError("Unable to retrieve your location: " + error.message);
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      const fetchWeatherData = async () => {
        try {
          console.log("Location: ", location);
          const response = await axios.get(
            `https://api.allorigins.win/get?url=${encodeURIComponent(
              `${process.env.REACT_APP_WEATHER_API}?lon=${location.lon}&lat=${location.lat}&units=metric`
            )}`
          );

          console.log("API Response: ", response);
          const data = JSON.parse(response.data.contents);
          setWeatherData(data);
          console.log("Weather Data: ", data);
          console.log("City: ", data.city);
          getWeatherImage(data.weather);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchWeatherData();
    }
  }, [location]);

  const getWeatherImage = (weather) => {
    switch (weather.toLowerCase()) {
      case "clouds":
      case "broken clouds":
      case "overcast clouds":
      case "scattered clouds":
        setWeatherImage(clouds);
        break;
      case "clear":
      case "clear sky":
        setWeatherImage(sun);
        break;
      case "rain":
      case "drizzle":
      case "moderate rain":
      case "light rain":
      case "heavy intensity rain":
        setWeatherImage(rain);
        break;
      case "snow":
      case "light snow":
        setWeatherImage(snow);
        break;
      case "thunderstorm":
        setWeatherImage(thunder);
        break;
      default:
        setWeatherImage(semiClouds);
        break;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {weatherData ? (
        <div>
          <div className="w-full justify-center mt-20">
            <img
              src={weatherImage}
              alt="Weather"
              className="w-40 h-40 m-auto"
            />
          </div>
          <div className="grid grid-cols-2 p-10 gap-4">
            <div className="bg-blue-500 rounded h-20 py-6">
              <p>{weatherData.city}</p>
            </div>
            <div className="bg-blue-500 rounded h-20 py-6">
              <p>{weatherData.temperature} °C</p>
            </div>
            <div className="bg-blue-500 rounded h-20 py-6">
              <p>{weatherData.weather}</p>
            </div>
            <div className="bg-blue-500 rounded h-20 py-4">
              <p>
                Humidity: <br />
                {weatherData.humidity}%
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default WeatherComponent;
