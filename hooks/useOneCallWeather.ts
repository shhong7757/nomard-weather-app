import { WEATHER_API_KEY, OPEN_WEATHER_API_URL } from "../constants/Env";
import * as Location from "expo-location";
import axios from "axios";
import useSWR from "swr";
import useLocation from "./useLocation";

export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type CurrentWeather = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: Array<Weather>;
  rain: {
    "1h": number;
  };
};

export type HoulryWeather = {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Array<Weather>;
  pop: number;
};

export type DailyWeather = {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  weather: Array<Weather>;
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;
};

export type OneCallResponse = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: Array<HoulryWeather>;
  daily: Array<DailyWeather>;
};

const fetcher = (url: string, lat: number, lon: number) =>
  axios
    .get<OneCallResponse>(url, {
      params: {
        lat,
        lon,
        units: "metric",
        lang: "kr",
        appId: WEATHER_API_KEY,
        exclude: "alerts,minutely",
      },
    })
    .then((res) => res.data);

export default function useOneCallWeather(lat: number, lon: number) {
  const { data, error } = useSWR(
    [`${OPEN_WEATHER_API_URL}onecall`, lat, lon],
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
