import { VWORKD_API_URL, VWORLD_API_KEY } from "../constants/Env";
import axios from "axios";
import useSWR from "swr";

type MapSearchResponseStatus = "OK" | "NOT_FOUND" | "ERROR";

export type MapSearchResponseResultItem = {
  geometry: string;
  id: string;
  point: { x: string; y: string }; // { x => lon, y => lat}
  title: string;
};

type MapSearchResponse = {
  response: {
    page: {
      current: string;
      size: string;
      total: string;
    };
    record: {
      current: string;
      totale: string;
    };
    result: {
      crs: "EPSG:4326";
      items: Array<MapSearchResponseResultItem>;
      type: "district";
    };
    service: {
      name: "search";
      operation: "search";
      time: string;
      version: "2.0";
    };
    status: MapSearchResponseStatus;
  };
};

const fetcher = (url: string, query: string) => {
  if (query !== "") {
    return axios
      .get<MapSearchResponse>(url, {
        params: {
          category: "L4",
          crs: "EPSG:4326",
          errorformat: "json",
          format: "json",
          key: VWORLD_API_KEY,
          page: 1,
          query,
          request: "search",
          service: "search",
          size: 10,
          type: "district",
          version: 2,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        let message = "알 수 없는 에러가 발생하였습니다.";
        if (err.code === "OVER_REQUEST_LIMIT")
          message =
            "서비스 사용량이 일일 제한량을 초과하여 더 이상 서비스를 사용할 수 없습니다.";
        else if (err.code === "SYSTEM_ERROR")
          message = "시스템 에러가 발생하였습니다.";

        throw new Error(message);
      });
  }
};

export default function useMapSearcher(query: string) {
  const { data, error } = useSWR([`${VWORKD_API_URL}/search`, query], fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
