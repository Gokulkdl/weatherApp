import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherDashboard = () => {
    const [currentWeather, setCurrentWeather] = useState({
        temperature: 0,
        location: '',
        time: new Date().toLocaleTimeString(),
        condition: '',
        feelsLike: 0,
        sunset: '',
        sunrise: '',
        icon: ''
    });

    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [historicalData, setHistoricalData] = useState([]);
    const [location, setLocation] = useState('New York');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('current');

    const locations = ['Delhi', 'Moscow', 'Paris', 'New York', 'Sydney', 'Riyadh'];

    const fetchCurrentWeather = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:5000/api/weather/current/${location}`);
            setCurrentWeather({
                ...response.data,
                time: new Date().toLocaleTimeString()
            });
            generateHourlyForecast(response.data.temperature);
        } catch (err) {
            setError('Failed to fetch current weather data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generateHourlyForecast = (currentTemp) => {
        const hours = ['Now', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '8 AM', '9 AM', '10 AM'];
        const forecast = hours.map((hour, index) => ({
            time: hour,
            temp: Math.max(currentTemp - index + Math.floor(Math.random() * 3), currentTemp - 5)
        }));
        setHourlyForecast(forecast);
    };

    const fetchHistoricalData = async () => {
        if (!fromDate || !toDate) {
            setError('Please select both date ranges');
            return;
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);
        const diffTime = Math.abs(to - from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
            setError('Date range cannot exceed 30 days');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:5000/api/weather/historical`, {
                params: { location, fromDate, toDate }
            });
            setHistoricalData(response.data);
        } catch (err) {
            setError('Failed to fetch historical data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCurrentWeather();
    }, [location]);

    const getWeatherIcon = (condition) => {
        if (!condition) return '🌤️'; // default if empty

        const lowerCaseCondition = condition.toLowerCase();

        if (lowerCaseCondition.includes('clear')) return '☀️';
        if (lowerCaseCondition.includes('cloud')) return '☁️';
        if (lowerCaseCondition.includes('rain')) return '🌧️';
        if (lowerCaseCondition.includes('snow')) return '❄️';
        if (lowerCaseCondition.includes('thunder')) return '⛈️';
        if (lowerCaseCondition.includes('drizzle')) return '🌦️';
        if (lowerCaseCondition.includes('mist') || lowerCaseCondition.includes('fog')) return '🌫️';

        return '🌤️'; // fallback default
    };

    return (
        <div className="max-w-4xl mx-auto p-4 text-gray-300 bg-gray-900 min-h-screen">
    {/* Location Selector */}
    <div className="mb-6">
        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
            Select Location
        </label>
        <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300"
        >
            {locations.map((loc) => (
                <option key={loc} value={loc} className="text-white">
                    {loc}
                </option>
            ))}
        </select>
    </div>

    {/* Tabs */}
    <div className="flex border-b border-gray-700 mb-6">
        <button
            className={`py-2 px-4 font-medium transition-colors ${
                activeTab === 'current'
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('current')}
        >
            Current Weather
        </button>
        <button
            className={`py-2 px-4 font-medium transition-colors ${
                activeTab === 'historical'
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('historical')}
        >
            Historical Data
        </button>
    </div>

    {/* Loading/Error */}
    {loading && (
        <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
            <p className="mt-2 text-gray-300">Loading weather data...</p>
        </div>
    )}
    {error && (
        <div className="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
            {error}
        </div>
    )}

    {/* Current Weather */}
    {activeTab === 'current' && !loading && (
    <div className="flex flex-col gap-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
            <div
                className="bg-gray-800 rounded-xl shadow-md p-6 flex-1 bg-blend-overlay relative overflow-hidden"
                style={{
                    backgroundImage: `url('https://png.pngtree.com/thumb_back/fh260/back_pic/04/39/71/36584e58be12c25.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-800/50 z-0"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-6xl font-bold text-white drop-shadow-lg">
                                {currentWeather.temperature}°
                            </div>
                            <div className="text-xl font-medium text-white mt-2 drop-shadow">
                                {currentWeather.condition}
                            </div>
                        </div>
                        <div className="text-6xl text-white drop-shadow-lg">
                            {getWeatherIcon(currentWeather.condition)}
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="text-xl font-medium text-white">{currentWeather.location}</div>
                        <div className="text-gray-300 text-base mt-1">{currentWeather.time}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-200 mt-8 pt-4 border-t border-gray-700 gap-2">
                        <span>🌡️ Feels like {currentWeather.feelsLike}°</span>
                        <span>🌅 Sunrise {currentWeather.sunrise}</span>
                        <span>🌇 Sunset {currentWeather.sunset}</span>
                    </div>
                </div>
            </div>
            <div
                className="bg-gray-800 rounded-xl shadow-md p-6 flex-1 bg-blend-overlay relative overflow-hidden"
                style={{
                    backgroundImage: `url('https://i.pinimg.com/736x/7f/63/1e/7f631e577ed5e5ffbbce726f8ec03489.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-800/50 z-0"></div>
                <div className="relative z-10">
                    <h3 className="text-lg font-semibold mb-4 text-white">Hourly Forecast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hourlyForecast.map((hour, index) => (
                            <div key={index} className="text-center bg-gray-900/30 rounded-lg p-2 backdrop-blur-sm">
                                <div className="text-gray-300 text-sm">{hour.time}</div>
                                <div className="text-lg font-semibold text-white">
                                    {hour.temp}°
                                </div>
                                <div className="text-gray-400 text-xs mt-1">
                                    {hour.condition}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center md:text-left">
                Stay Updated with Real-Time Weather Reports
            </h2>
            <p className="text-base text-gray-400 leading-relaxed text-center md:text-left">
                Get the latest weather updates for your location, including current temperature,
                forecast details, and important highlights like sunrise and sunset times. Our app is
                designed to keep you informed and prepared, whether you're planning your day or staying
                safe during weather changes. Stay connected for hourly and daily insights wherever you are!
            </p>
        </div>
    </div>
)}
    {/* Historical Data */}
    {activeTab === 'historical' && !loading && (
        <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Fetch Historical Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={fetchHistoricalData}
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                        Fetch
                    </button>
                </div>
            </div>

            {historicalData.length > 0 ? (
                <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2 text-white">Historical Results</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border border-gray-700 text-gray-300">
                            <thead>
                                <tr className="bg-gray-700 text-gray-200">
                                    <th className="px-4 py-2 border border-gray-600">Date</th>
                                    <th className="px-4 py-2 border border-gray-600">Temperature (°C)</th>
                                    <th className="px-4 py-2 border border-gray-600">Condition</th>
                                    <th className="px-4 py-2 border border-gray-600">Humidity</th>
                                    <th className="px-4 py-2 border border-gray-600">Wind Speed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicalData.map((item, index) => (
                                    <tr key={index} className="text-center hover:bg-gray-700">
                                        <td className="px-4 py-2 border border-gray-600">{new Date(item.timestamp).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 border border-gray-600">{item.temperature}</td>
                                        <td className="px-4 py-2 border border-gray-600">{item.condition}</td>
                                        <td className="px-4 py-2 border border-gray-600">{item.humidity}%</td>
                                        <td className="px-4 py-2 border border-gray-600">{item.windSpeed} km/h</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400 mt-4">No historical data found in this time duration.</p>
            )}
        </div>
    )}
</div>

    );
};

export default WeatherDashboard;
