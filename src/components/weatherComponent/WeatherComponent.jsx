import React, { useState, useEffect } from "react";
import axios from "axios";
import clouds from "../../Images/clouds.png";
import semiClouds from "../../Images/cloudy-day.png";
import rain from "../../Images/heavy-rain.png";
import snow from "../../Images/snow.png";
import sun from "../../Images/sun.png";
import thunder from "../../Images/thunder.png";
import Droplet from "../../Images/droplet.svg";
import Wind from "../../Images/wind.svg";
import { ReactComponent as WindIcon } from "../../Images/wind.svg";
import { ReactComponent as DropletIcon } from "../../Images/droplet.svg";

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weatherImage, setWeatherImage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

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
          const response = await axios.get(
            `https://api.allorigins.win/get?url=${encodeURIComponent(
              `${process.env.REACT_APP_WEATHER_API}?lon=${location.lon}&lat=${location.lat}&units=metric`
            )}`
          );
          const data = JSON.parse(response.data.contents);
          setWeatherData(data);
          console.log("Weather Data: ", data);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-UK");

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
          <div className="w-full text-white justify-center mt-20">
            <p className="text-3xl mb-4">{weatherData.city}</p>
            <img
              src={weatherImage}
              alt="Weather"
              className="w-40 h-40 m-auto"
            />
            <p className="text-3xl">{weatherData.temperature} °C</p>
            <p className="text-xl">{weatherData.weather}</p>
            <p className="mt-4">
              {formattedDate} <br /> {formattedTime}
            </p>
          </div>
          <div className="grid grid-cols-2 text-white p-10 gap-4">
            <div className="bg-blue-400 rounded h-fit p-4">
              <p>
                <DropletIcon className="h-8 mx-auto mb-2 fill-white" />
              </p>
              <p>{weatherData.humidity}%</p>
            </div>
            <div className="bg-blue-400 rounded h-fit p-4">
              <p>
                <WindIcon className="h-8 mx-auto mb-2 fill-white" />
              </p>
              <p>
                {weatherData.wind_speed} {weatherData.speed_unit}
              </p>
            </div>
          </div>
          <p className="text-white text-xs">{weatherData.credits}</p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default WeatherComponent;
