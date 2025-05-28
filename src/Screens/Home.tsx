import { useEffect, useState } from "react";
import { GetWeatherReport, GetWeatherReportByCoords } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { toggleUnit } from "../Redux/slices/weatherUnitSlice";
import { requestLocationAccess } from "../utils/location";
import { toast } from "react-toastify";
import { FaLocationPin } from "react-icons/fa6";

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.weatherUnit.unit);
  const location = useSelector((state) => state.location.currentCity);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let intervalId;

    const fetchWeather = async () => {
      try {
        if(location==='Current Location')
        {
            try {
              const position = await requestLocationAccess();
              const { latitude, longitude } = position.coords;
              const data = await GetWeatherReportByCoords(latitude,longitude, unit);
              setWeather(data);
            } catch (e) {
            toast.error("Please allow location access to get weather for your current location.");
              setError("Location access denied.");
              setLoading(false);
              return;
            }
        }
        else{
            const data = await GetWeatherReport(location, unit);
            setWeather(data);
            setError("");
        }

      } catch (err) {
        setError("Failed to load weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    intervalId = setInterval(fetchWeather, 30000);

    return () => clearInterval(intervalId);
  }, [unit,location]);

  if (loading)
    return <p className="text-center text-3xl mt-40 animate-bounce">Loading weather...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-40">{error}</p>;
  if (!weather) return null;

  const {
    name,
    main: { temp, feels_like, humidity },
    weather: weatherInfo,
    wind,
    sys,
  } = weather;

  const { description, icon } = weatherInfo[0];
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className="pt-24 px-5 bg-gradient-to-br from-blue-800 to-green-700">
      <div className="mt-14"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:h-[50vh] mb-6">
        <div className="bg-gradient-to-tr from-orange-200 to-yellow-100 rounded-3xl shadow-2xl p-6 flex flex-col justify-center items-center animate-fade-in hover:scale-95 transition-all duration-300 cursor-pointer relative">
            <div className="lg:absolute top-10 right-10 text-slate-600 text-xl flex items-center gap-2">
                <FaLocationPin/>
                <span >{name} , {sys.country}</span>
            </div>
          <div className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            🌡 Temperature
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              className="w-10 h-10"
            />
            <button
              onClick={() => dispatch(toggleUnit())}
              className="lg:px-4 py-2 px-2 rounded-full bg-slate-800 hover:bg-slate-900/80 text-white font-semibold transition cursor-pointer"
            >
                <span className="hidden lg:inline">
              {unit === "metric" ? "Fahrenheit (°F)" : "Celsius (°C)"}
                </span>
                <span>
                  {unit === "metric" ? "°F" : "°C"}
                </span>
            </button>
          </div>
          <p className="text-7xl font-bold text-orange-500">
            {Math.round(temp)}{tempUnit}
          </p>
          <p className="text-md text-gray-600 mt-1 capitalize">{description}</p>
          <p className="text-sm text-gray-500">
            Feels like {Math.round(feels_like)}{tempUnit}
          </p>
        </div>

        <div className="bg-gradient-to-tr from-cyan-100 to-blue-100 rounded-3xl shadow-2xl p-6 flex flex-col justify-center items-center animate-fade-in hover:scale-95 transition-all duration-300 cursor-pointer">
          <div className="text-2xl font-bold text-gray-800 mb-2">💧 Humidity</div>
          <p className="text-6xl font-bold text-blue-400">{humidity}%</p>
          <p className="text-sm text-gray-500 mt-2">Humidity in the atmosphere</p>
        </div>
      </div>

      <div className="w-full h-[32vh] bg-gradient-to-tr from-sky-100 to-indigo-100 rounded-3xl shadow-2xl p-6 flex flex-col justify-center items-center animate-slide-up hover:scale-95 transition-all duration-300 cursor-pointer">
        <div className="text-2xl font-bold text-gray-800 mb-2">💨 Wind Speed</div>
        <p className="text-6xl font-bold text-indigo-500 text-center">
          {wind.speed} {windUnit}
        </p>
        <p className="text-sm text-gray-500 mt-1">Direction: {wind.deg}°</p>
      </div>
    </div>
  );
};
