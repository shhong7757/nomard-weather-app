import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { tintColorGray } from "../constants/Colors";
import { DailyWeather } from "../hooks/useOneCallWeather";
import { getDay } from "../libs";

interface Props {
  list: Array<DailyWeather>;
}

export default function DailyWeatherList({ list }: Props) {
  return (
    <>
      {list.map((v) => (
        <View key={`daily::${v.dt}`} style={styles.itemContainer}>
          <Text style={styles.text}>{getDay(v.dt)}</Text>
          <View style={styles.itemIconWrapper}>
            <Image
              style={styles.weatherIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${v.weather[0].icon}@2x.png`,
              }}
            />
          </View>
          <View style={styles.itemMaxTempWrapper}>
            <Text style={styles.text}>{Math.round(v.temp.max)}</Text>
          </View>
          <View style={styles.itemMinTempWrapper}>
            <Text style={styles.textGray}>{Math.round(v.temp.min)}</Text>
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: { flexDirection: "row", alignItems: "center" },
  text: { color: "white", fontSize: 18 },
  textGray: { color: tintColorGray, fontSize: 18 },
  itemMaxTempWrapper: {
    marginRight: 16,
    flexBasis: 30,
    alignItems: "flex-end",
  },
  itemMinTempWrapper: { flexBasis: 30, alignItems: "flex-end" },
  itemIconWrapper: { flex: 1, alignItems: "center" },
  weatherIcon: {
    width: 40,
    height: 40,
  },
});
