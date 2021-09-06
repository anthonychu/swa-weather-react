import './App.css';
import ReactWeather from 'react-open-weather';
import { useApiWeather } from './apiWeatherProvider';

function App() {
  const weatherParams = {
    key: '',
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial),
  };

  const useMyLocation = window.location.href.endsWith('mylocation');
  
  if (!useMyLocation || window.location.hostname === 'localhost') {
    weatherParams.lat = '49.2833329';
    weatherParams.lon = '-123.1200278';
  }

  let { data, isLoading, errorMessage } = useApiWeather(weatherParams);

  const myLocationLink = useMyLocation ? <div></div> : 
  <div class="my-location-link">
    <a onClick={handleClick} style={{cursor: 'pointer'}}>Use my location</a>
  </div>;

  const location = useMyLocation ? 'Current location' : 'Vancouver, BC';

  function handleClick() {
    window.location.href = '/mylocation';
  }

  return (
    <div className="App">
      <ReactWeather
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        lang="en"
        locationLabel={location}
        unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
        showForecast
      />
      {isLoading ? <div></div> : myLocationLink}
      <h1>{errorMessage}</h1>
    </div>
  );
}

export default App;
