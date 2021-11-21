import * as React from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  SafeAreaView,
} from "react-native";
import { OneCallResponse } from "../hooks/useOneCallWeather";
import DailyWeatherList from "../components/DailyWeatherList";
import Division from "../components/Division";
import HoulryWeatherList from "../components/HoulryWeatherList";
import WeatherDetailHeader, {
  HEADER_HEIGHT,
} from "../components/WeatherDetailHeader";

import { showLocation } from "react-native-map-link";
import { getDate, getDirection, getWeatherConditionalColor } from "../libs";

interface Props {
  address: string;
  appendable?: boolean;
  oneCall: OneCallResponse;
  onPressAppend?: () => void;
  onPressCacnel?: () => void;
}

const MAX_PADDING_TOP = 32;
const SHORT_HEIGHT = Dimensions.get("screen").height / 10;
const TEMP_HEIGHT = SHORT_HEIGHT * 2;
const FULL_HEIGHT = SHORT_HEIGHT + TEMP_HEIGHT + MAX_PADDING_TOP * 2;

export default function WeatherDetail({
  address,
  appendable = false,
  oneCall,
  onPressAppend,
  onPressCacnel,
}: Props) {
  const animScrollOffsetY = React.useRef(new Animated.Value(0.01)).current;
  const animTranslateY = animScrollOffsetY.interpolate({
    inputRange: [
      0,
      FULL_HEIGHT - MAX_PADDING_TOP * 2,
      Dimensions.get("screen").height,
    ],
    outputRange: [MAX_PADDING_TOP, 0, 0],
  });
  const animOpacity = animScrollOffsetY.interpolate({
    inputRange: [0, TEMP_HEIGHT - MAX_PADDING_TOP],
    outputRange: [1, 0],
  });

  const handlePressOpenMap = React.useCallback(() => {
    showLocation({
      latitude: oneCall.lat,
      longitude: oneCall.lon,
    });
  }, [address, oneCall]);

  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      Animated.timing(animScrollOffsetY, {
        toValue: e.nativeEvent.contentOffset.y,
        duration: 0,
        useNativeDriver: true,
      }).start();
    },
    []
  );

  const backgroundColor = getWeatherConditionalColor(
    oneCall.current.weather[0].main
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <WeatherDetailHeader
          appendable={appendable}
          onPressAppend={onPressAppend}
          onPressCacnel={onPressCacnel}
        />

        <ScrollView
          removeClippedSubviews={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          onScroll={handleScroll}
        >
          <View
            style={{
              height: FULL_HEIGHT - SHORT_HEIGHT,
            }}
          />
          <View
            style={{
              paddingTop:
                Platform.OS === "ios" ? SHORT_HEIGHT + 20 : SHORT_HEIGHT + 20,
              backgroundColor,
            }}
          >
            <View
              style={{
                paddingVertical: 16,
                paddingLeft: 16,
                backgroundColor,
                borderBottomWidth: 1,
                borderBottomColor: "white",
              }}
            >
              <HoulryWeatherList list={oneCall.hourly} />
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.row}>
              <View style={{ padding: 16 }}>
                <DailyWeatherList list={oneCall.daily} />
              </View>
            </View>
            <View style={{ paddingHorizontal: 16 }}>
              <View style={styles.row}>
                <Division
                  list={[
                    {
                      label: "일출",
                      value: getDate(oneCall.current.sunrise),
                    },
                    { label: "일몰", value: getDate(oneCall.current.sunset) },
                  ]}
                />
              </View>
              <View style={styles.row}>
                <Division
                  list={[
                    { label: "기압", value: `${oneCall.current.pressure}` },
                    { label: "습도", value: `${oneCall.current.humidity}%` },
                  ]}
                />
              </View>
              <View style={styles.row}>
                <Division
                  list={[
                    {
                      label: "바람",
                      value: `${getDirection(oneCall.current.wind_deg)} ${
                        oneCall.current.wind_deg
                      }m/s`,
                    },
                    {
                      label: "체감",
                      value: `${Math.round(oneCall.current.feels_like)}°`,
                    },
                  ]}
                />
              </View>
              <View style={styles.rowLast}>
                <Division
                  list={[
                    {
                      label: "가시거리",
                      value: `${(oneCall.current.visibility / 1000).toFixed(
                        2
                      )}Km`,
                    },
                    {
                      label: "자외선 지수",
                      value: `${Math.round(oneCall.current.uvi)}`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", padding: 16 }}>
            <View style={{ marginRight: 8 }}>
              <Text style={{ color: "white", fontSize: 16 }}>{address}</Text>
            </View>
            <Pressable onPress={handlePressOpenMap}>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  textDecorationLine: "underline",
                }}
              >
                지도에서 열기
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <View
          style={{
            alignItems: "center",
            height: FULL_HEIGHT,
            position: "absolute",
            top: HEADER_HEIGHT,
            left: 0,
            right: 0,
          }}
        >
          <View
            style={{
              paddingVertical: 16,
              alignItems: "center",
              width: "100%",
              backgroundColor,
            }}
          >
            <Animated.View
              style={{
                height: SHORT_HEIGHT,
                alignItems: "center",
                transform: [{ translateY: animTranslateY }],
              }}
            >
              <Text
                ellipsizeMode={"tail"}
                style={{ color: "white", fontSize: 24 }}
              >
                {address}
              </Text>
              <View style={{ marginTop: 8 }}>
                <Text style={{ color: "white", fontSize: 18 }}>
                  {oneCall.current.weather[0].description}
                </Text>
              </View>
              <Animated.View
                style={{
                  opacity: animOpacity,
                  height: FULL_HEIGHT - SHORT_HEIGHT,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 56,
                    fontWeight: "100",
                  }}
                >
                  {`${Math.round(oneCall.current.temp)}°C`}
                </Text>
                <View>
                  <Text style={{ color: "white" }}>
                    {`최고:${Math.round(
                      oneCall.daily[0].temp.max
                    )}°C 최저:${Math.round(oneCall.daily[0].temp.min)}°C`}
                  </Text>
                </View>
              </Animated.View>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
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
  table: {
    borderBottomWidth: 1,
    borderColor: "white",
  },
  row: {
    borderBottomWidth: 1,
    borderColor: "white",
  },
  rowLast: {},
  weatherIcon: {
    width: 40,
    height: 40,
  },
});
