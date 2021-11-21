import * as React from "react";
import { ActivityIndicator, Text } from "react-native";
import { View } from "../components/Themed";
import {
  useLocationListDispatch,
  useLocationListState,
} from "../context/LocationList";
import useLocationStoarge from "../hooks/useLocationStorage";
import useOneCallWeather from "../hooks/useOneCallWeather";
import WeatherDetail from "../template/WeatherDetail";

import { RootStackScreenProps } from "../types";

export default function SearchDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"SearchDetailScreen">) {
  const item = route.params.item;

  const list = useLocationListState();
  const dispatch = useLocationListDispatch();
  const { saveList } = useLocationStoarge();
  const { data, isLoading, isError } = useOneCallWeather(
    parseInt(item.point.y, 10),
    parseInt(item.point.x, 10)
  );

  const handlePressAppend = React.useCallback(async () => {
    try {
      const listItem = {
        address: item.title,
        current: false,
        lat: parseInt(item.point.y, 10),
        lon: parseInt(item.point.x, 10),
      };
      dispatch({
        type: "APPEND",
        location: listItem,
      });

      await saveList([...list, listItem]);

      navigation.popToTop();
    } catch (e) {
      //
    }
  }, [list, item]);

  const handlePressCancel = React.useCallback(
    () => navigation.goBack(),
    [navigation]
  );

  const isExist = React.useMemo(
    () => list.some((v) => v.address === item.title),
    [list, item]
  );

  if (isError)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 16,
          backgroundColor: "black",
        }}
      >
        <Text style={{ color: "white" }}>요청 건수를 다 채웠어요</Text>
      </View>
    );
  if (isLoading)
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ paddingVertical: 16, backgroundColor: "black" }}>
          <ActivityIndicator color="white" size="small" />
        </View>
      </View>
    );
  else if (data) {
    return (
      <WeatherDetail
        address={item.title}
        appendable={!isExist}
        oneCall={data}
        onPressAppend={handlePressAppend}
        onPressCacnel={handlePressCancel}
      />
    );
  }

  return null;
}
