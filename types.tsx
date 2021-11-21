/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LocationListItem } from "./context/LocationList";
import { MapSearchResponseResultItem } from "./hooks/useMapSearch";
import { OneCallResponse } from "./hooks/useOneCallWeather";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  WeatherScreen: {
    item: LocationListItem;
    oneCall: OneCallResponse;
  };
  NotFound: undefined;
  Root: undefined;
  SearchScreen: undefined;
  SearchDetailScreen: {
    item: MapSearchResponseResultItem;
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
