import * as React from "react";
import WeatherDetail from "../template/WeatherDetail";

import { RootStackScreenProps } from "../types";

export default function WeatherScreen({
  navigation,
  route,
}: RootStackScreenProps<"WeatherScreen">) {
  const item = route.params.item;
  const oneCall = route.params.oneCall;

  const handlePressCancel = React.useCallback(
    () => navigation.goBack(),
    [navigation]
  );

  return (
    <WeatherDetail
      address={item.address}
      oneCall={oneCall}
      onPressCacnel={handlePressCancel}
    />
  );
}
