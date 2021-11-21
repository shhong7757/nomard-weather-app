import { OneCallResponse } from "../hooks/useOneCallWeather";
import { OPEN_WEATHER_API_URL, WEATHER_API_KEY } from "../constants/Env";
import * as React from "react";
import axios from "axios";
import {
  LocationListItem,
  useLocationListState,
} from "../context/LocationList";
import useCurrenLocationWeather from "./useCurrenLocationWeather";

export default function useRootWeatherList() {
  const currentItem = useCurrenLocationWeather();
  const storagedList = useLocationListState();

  const [error, setError] = React.useState<string>();
  const [data, setData] =
    React.useState<
      Array<{ location: LocationListItem; oneCall: OneCallResponse }>
    >();

  const list = React.useMemo(
    () => (currentItem ? [currentItem, ...storagedList] : storagedList),
    [currentItem, storagedList]
  );

  React.useEffect(() => {
    try {
      Promise.all(
        list.map((item) =>
          axios
            .get<OneCallResponse>(`${OPEN_WEATHER_API_URL}onecall`, {
              params: {
                lat: item.lat,
                lon: item.lon,
                units: "metric",
                lang: "kr",
                appId: WEATHER_API_KEY,
                exclude: "alerts,minutely",
              },
            })
            .then((res) => res.data)
        )
      )
        .then((res) => {
          setData(
            res.map((v, index) => ({
              location: list[index],
              oneCall: v,
            }))
          );
          setError(undefined);
        })
        .catch((e) => {
          setError("oneCall Api 호출 중 에러가 발생하였습니다.");
        });
    } catch (e) {
      setError("oneCall Api 호출 중 에러가 발생하였습니다.");
    }
  }, [list]);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
