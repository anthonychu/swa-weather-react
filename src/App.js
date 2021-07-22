import './App.css';
import { getLocation } from './utils';
import { useEffect } from 'react';
import ReactWeather from 'react-open-weather';
import { useApiWeather } from './apiWeatherProvider';

function App() {
  useEffect(() => {
    (async function () {
      try {
        const location = await getLocation();
        console.log(location);
        
      } catch (err) {
        console.error(err);
      }
    })();
  });

  const { data, isLoading, errorMessage } = useApiWeather({
    key: '',
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial),
  });

  return (
    <div className="App">
      <ReactWeather
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        lang="en"
        locationLabel="Current Location"
        unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
        showForecast
      />
      <h1>{errorMessage}</h1>
    </div>
  );
}

export default App;
