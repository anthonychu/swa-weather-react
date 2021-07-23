import { useEffect, useReducer, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { getIcon } from './iconsMap';
import { getLocation } from '../utils';

export const formatDate = (dte, lang) => {
  if (lang && lang !== 'en') {
    dayjs.locale(lang.replace('_', '-'));
  }
  if (dte && dayjs().isValid(dte)) {
    return dayjs.unix(dte).format('ddd D MMMM');
  }
  return '';
};

export const mapCurrent = (day, lang) => {
  return {
    provider: 'api',
    date: day.dateTime,
    description: day.phrase,
    icon: getIcon(day.iconCode),
    temperature: {
      current: day.temperature.value.toFixed(0),
      min: undefined, // openweather doesnt provide min/max on current weather
      max: undefined,
    },
    wind: day.wind.speed.value.toFixed(0),
    humidity: day.relativeHumidity,
  };
};

export const mapForecast = () => null;

export const mapData = (todayData, lang) => {
  const mapped = {};
  if (todayData) {
    mapped.current = mapCurrent(todayData, lang);
    mapped.forecast = [];
  }
  return mapped;
};

export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

const initialState = {
  data: null,
  errorMessage: null,
};

export const fetchReducer = (state, { type, payload }) => {
  switch (type) {
    case SUCCESS:
      return {
        data: payload,
        errorMessage: null,
      };
    case FAILURE:
      return { data: null, errorMessage: "Failed to load weather" };
    default:
      return state;
  }
};

const useApiWeather = (options) => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  const { data, errorMessage } = state;
  const [isLoading, setIsLoading] = useState(false);
  const { lang, lon, lat } = options;

  const fetchData = async () => {
    const params = {};
    if (!lat || !lon) {
      const location = await getLocation();
      params.coordinates = `${location.latitude},${location.longitude}`;
    } else {
      params.coordinates = `${lat},${lon}`;
    }
  
    setIsLoading(true);
    try {
      const forecastResponse = await axios.get('/api/weather', { params });
      const forecastResponseData = forecastResponse.data;

      const payload = mapData(
        forecastResponseData.results[0],
        lang,
      );

      dispatch({
        type: SUCCESS,
        payload,
      });
    } catch (error) {
      console.log(error);
      if (error && error.response && error.response.status === 401) {
        window.location.href = '/.auth/login/github';
        return;
      }
      dispatch({ type: FAILURE, payload: error.message || error });
    }
    setIsLoading(false);
  };
  // eslint-disable-next-line
  useEffect(() => {
    fetchData();
  },
  // eslint-disable-next-line
  [lon, lat]);
  return { data, isLoading, errorMessage, fetchData };
};

export default useApiWeather;
