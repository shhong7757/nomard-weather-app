import * as React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { HoulryWeather } from "../hooks/useOneCallWeather";

interface Props {
  list: Array<HoulryWeather>;
}

export default function HoulryWeatherList({ list }: Props) {
  const getHour = (dt: number) => {
    const date = new Date(dt * 1000);
    const hour = "0" + date.getHours();
    return hour.substr(-2);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {list.map((v, i) => {
        const first = i === 0;
        const last = list.length - 1 === i;

        return (
          <View
            style={{
              alignItems: "center",
              marginRight: last ? 0 : 16,
            }}
            key={`houlry::${v.dt}`}
          >
            <Text style={{ color: "white" }}>
              {i == 0 ? "지금" : `${getHour(v.dt)} 시`}
            </Text>
            <Image
              style={styles.weatherIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${v.weather[0].icon}@2x.png`,
              }}
            />
            <Text style={{ color: "white" }}>{`${Math.round(v.temp)}°`}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
});
