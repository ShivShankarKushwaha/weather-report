export const GetWeatherReport = async (location: string,unit:string) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch weather report:", error);
        throw error;
    }
}

export const GetWeatherReportByCoords = async (lat: number, lon: number, unit: string) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch weather report by coordinates:", error);
        throw error;
    }
}

export const GetWeatherForecast = async (location: string, unit: string) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching weather forecast: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch weather forecast:", error);
        throw error;
    }
}
export const GetWeatherForecastByCoords = async (lat: number, lon: number, unit: string) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching weather forecast: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch weather forecast by coordinates:", error);
        throw error;
    }
}
