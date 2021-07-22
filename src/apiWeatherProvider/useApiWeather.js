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
  const endpoint = 'https://atlas.microsoft.com/weather/currentConditions/json';
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  const { data, errorMessage } = state;
  const [isLoading, setIsLoading] = useState(false);
  const { lang, key, lon, lat } = options;
  const params = {
    'subscription-key': key,
    'api-version': '1.0'
  };

  const fetchData = async () => {
    if (!lat || !lon) {
      const location = await getLocation();
      params.query = `${location.latitude},${location.longitude}`;
    } else {
      params.query = `${lat},${lon}`;
    }
  
    setIsLoading(true);
    try {
      const forecastResponse = await axios.get(endpoint, { params });
      const forecastResponseData = forecastResponse.data;
      // const forecastResponseData = {
      //   "results": [
      //     {
      //       "dateTime": "2021-07-22T11:08:00-07:00",
      //       "phrase": "Mostly sunny",
      //       "iconCode": 2,
      //       "hasPrecipitation": false,
      //       "isDayTime": true,
      //       "temperature": {
      //         "value": 21.1,
      //         "unit": "C",
      //         "unitType": 17
      //       },
      //       "realFeelTemperature": {
      //         "value": 26.6,
      //         "unit": "C",
      //         "unitType": 17
      //       },
      //       "realFeelTemperatureShade": {
      //         "value": 20.3,
      //         "unit": "C",
      //         "unitType": 17
      //       },
      //       "relativeHumidity": 60,
      //       "dewPoint": {
      //         "value": 13.1,
      //         "unit": "C",
      //         "unitType": 17
      //       },
      //       "wind": {
      //         "direction": {
      //           "degrees": 338.0,
      //           "localizedDescription": "NNW"
      //         },
      //         "speed": {
      //           "value": 3.5,
      //           "unit": "km/h",
      //           "unitType": 7
      //         }
      //       },
      //       "windGust": {
      //         "speed": {
      //           "value": 7.7,
      //           "unit": "km/h",
      //           "unitType": 7
      //         }
      //       },
      //       "uvIndex": 7,
      //       "uvIndexPhrase": "High",
      //       "visibility": {
      //         "value": 4.8,
      //         "unit": "km",
      //         "unitType": 6
      //       },
      //       "obstructionsToVisibility": "",
      //       "cloudCover": 15,
      //       "ceiling": {
      //         "value": 10058.0,
      //         "unit": "m",
      //         "unitType": 5
      //       },
      //       "pressure": {
      //         "value": 1022.0,
      //         "unit": "mb",
      //         "unitType": 14
      //       },
      //       "pressureTendency": {
      //         "localizedDescription": "Steady",
      //         "code": "S"
      //       },
      //       "past24HourTemperatureDeparture": {
      //         "value": 4.2,
      //         "unit": "C",
      //         "unitType": 17
      //       },
      //       "apparentTemperature": {
      //         "value": 21.1,
      //         "unit": "C",
      //         "unitType": 17
      //       },
      //       "windChillTemperature": {
      //         "value": 21.1,
      //         "unit": "C",
      //         "unitType": 17
      //       },
      //       "wetBulbTemperature": {
      //         "value": 16.1,
      //         "unit": "C",
      //         "unitType": 17
      //       },
      //       "precipitationSummary": {
      //         "pastHour": {
      //           "value": 0.0,
      //           "unit": "mm",
      //           "unitType": 3
      //         },
      //         "past3Hours": {
      //           "value": 0.0,
      //           "unit": "mm",
      //           "unitType": 3
      //         },
      //         "past6Hours": {
      //           "value": 0.0,
      //           "unit": "mm",
      //           "unitType": 3
      //         },
      //         "past9Hours": {
      //           "value": 0.0,
      //           "unit": "mm",
      //           "unitType": 3
      //         },
      //         "past12Hours": {
      //           "value": 0.0,
      //           "unit": "mm",
      //           "unitType": 3
      //         },
      //         "past18Hours": {
      //           "value": 0.0,
      //           "unit": "mm",
      //           "unitType": 3
      //         },
      //         "past24Hours": {
      //           "value": 0.0,
      //           "unit": "mm",
      //           "unitType": 3
      //         }
      //       },
      //       "temperatureSummary": {
      //         "past6Hours": {
      //           "minimum": {
      //             "value": 12.5,
      //             "unit": "C",
      //             "unitType": 17
      //           },
      //           "maximum": {
      //             "value": 21.1,
      //             "unit": "C",
      //             "unitType": 17
      //           }
      //         },
      //         "past12Hours": {
      //           "minimum": {
      //             "value": 12.5,
      //             "unit": "C",
      //             "unitType": 17
      //           },
      //           "maximum": {
      //             "value": 21.1,
      //             "unit": "C",
      //             "unitType": 17
      //           }
      //         },
      //         "past24Hours": {
      //           "minimum": {
      //             "value": 12.5,
      //             "unit": "C",
      //             "unitType": 17
      //           },
      //           "maximum": {
      //             "value": 21.3,
      //             "unit": "C",
      //             "unitType": 17
      //           }
      //         }
      //       }
      //     }
      //   ]
      // };

      const payload = mapData(
        forecastResponseData.results[0],
        lang,
      );

      dispatch({
        type: SUCCESS,
        payload,
      });
    } catch (error) {
      console.error(error.message);
      dispatch({ type: FAILURE, payload: error.message || error });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [lon, lat]);
  return { data, isLoading, errorMessage, fetchData };
};

export default useApiWeather;
