import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { requestLocationAccess } from "../utils/location";
import { GetWeatherForecast, GetWeatherForecastByCoords } from "../api";
import { toast } from "react-toastify";


function formatTime(unix, offset) {
  const date = new Date((unix + offset) * 1000);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dt_txt) {
  return new Date(dt_txt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export const Forecast = () => {
  const [data, setData] = useState(null);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const location = useSelector((state) => state.location.currentCity);
  const unit = useSelector((state) =>  state.weatherUnit.unit);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchForecast() {
        setLoading(true);
        let json;
              try {
                if(location==='Current Location')
                {
                    try {
                      const position = await requestLocationAccess();
                      const { latitude, longitude } = position.coords;
                      json = await GetWeatherForecastByCoords(latitude,longitude, unit);
                    } catch (e) {
                      toast.error("Location access denied or not available.");
                      setLoading(false);
                        setError("Location access denied or not available.");
                      return;
                    }
                }
                else{
                    json = await GetWeatherForecast(location, unit);
                }

              } catch (err) {
                console.error("Error fetching weather data:", err);
                setLoading(false);
                console.error("Failed to load weather data.");
                setError("Failed to load weather data. Please try again later.");
              }

      const daily = json.list.filter((_, i) => i % 8 === 0);
        if (!json || !json.city || !daily.length) {
            setError("Failed to load weather data.");
            setLoading(false);
            return;
        }
        setLoading(false);
      setData({ city: json.city, forecasts: daily });
      setSelectedForecast(daily[0]);
    }

    fetchForecast();
  }, [location]);

  if (loading)
    return <p className="text-center text-3xl mt-40 animate-bounce">Loading weather...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-40">{error}</p>;
  const { city, forecasts } = data;

  return (
    <div className="min-h-screen flex items-center justify-center text-white font-sans bg-gradient-to-br from-blue-800 to-green-700">
      <div className="w-full max-w-5xl px-6 py-10 backdrop-blur-sm bg-white/10 rounded-xl shadow-lg h-full mt-28">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-light mb-2">{city.name}, {city.country}</h1>
            <p className="text-sm text-gray-300">Population: {city.population.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-md font-light">Local Time</p>
            <p className="text-sm">
              {new Date(Date.now() + city.timezone * 1000).toLocaleTimeString()}
            </p>
            <p className="text-xs mt-1 text-gray-300">
              Sunrise: {formatTime(city.sunrise, city.timezone)} | <br className="sm:hidden" /> Sunset: {formatTime(city.sunset, city.timezone)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            <p className="uppercase text-sm tracking-widest text-gray-200">{formatDate(selectedForecast.dt_txt)}</p>
            <h2 className="text-5xl font-semibold">{Math.round(selectedForecast.main.temp)}°C</h2>
            <p className="text-gray-200 mt-2">Feels like: {Math.round(selectedForecast.main.feels_like)}°</p>
          </div>

          <div className="text-center text-6xl">
            <img
              src={`https://openweathermap.org/img/wn/${selectedForecast.weather[0].icon}@2x.png`}
              alt="icon"
              className="w-20 h-20 mx-auto"
            />
            <p className="text-sm text-gray-300 mt-1">{selectedForecast.weather[0].description}</p>
          </div>

          <div className="text-right text-gray-200 text-sm">
            <p>Humidity: <br className="sm:hidden" /> {selectedForecast.main.humidity}%</p>
            <p>Wind:<br className="sm:hidden" /> {selectedForecast.wind.speed} m/s</p>
            <p>Direction:<br className="sm:hidden" /> {selectedForecast.wind.deg}°</p>
          </div>
        </div>

        <div className="border-t border-white/30 mt-10 pt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
          {forecasts.map((d, i) => {
            const isSelected = selectedForecast.dt === d.dt;
            return (
              <div
                key={i}
                onClick={() => setSelectedForecast(d)}
                className={`cursor-pointer rounded-xl p-2 transition-all duration-200 ${
                  isSelected ? "bg-white/20 scale-105" : "hover:bg-white/10"
                }`}
              >
                <p className="font-light">{formatDate(d.dt_txt)}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`}
                  alt="icon"
                  className="w-10 h-10 mx-auto"
                />
                <p className="text-lg">{Math.round(d.main.temp)}°</p>
                <p className="text-xs text-gray-300">{d.weather[0].main}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
