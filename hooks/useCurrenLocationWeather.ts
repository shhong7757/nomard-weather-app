import { VWORKD_API_URL, VWORLD_API_KEY } from "../constants/Env";
import axios from "axios";
import useLocation from "./useLocation";
import { useEffect, useState } from "react";
import { LocationListItem } from "../context/LocationList";

export default function useCurrenLocationWeather() {
  const currentLocation = useLocation();

  const [currentLocationWeather, setCurrentLocationWeather] =
    useState<LocationListItem>();

  useEffect(() => {
    const init = async () => {
      if (currentLocation) {
        const res = await getCurrentAddress(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );

        if (res.status !== "NOT_FOUND") {
          setCurrentLocationWeather({
            current: true,
            address: res.result[0].text,
            lat: currentLocation.coords.latitude,
            lon: currentLocation.coords.longitude,
          });
        }
      }
    };
    init();
  }, [currentLocation]);

  const getCurrentAddress = async (lat: number, lon: number) => {
    return await axios
      .get(`${VWORKD_API_URL}/address`, {
        params: {
          crs: "EPSG:4326",
          format: "json",
          key: VWORLD_API_KEY,
          simple: false,
          request: "getAddress",
          service: "address",
          point: `${lon},${lat}`,
          type: "parcel",
          version: 2,
        },
      })
      .then((res) => {
        if (res.status === 200) return res.data.response;
        else throw new Error("현재 주소를 읽어오는데 에러가 발생했습니다");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return currentLocationWeather;
}
