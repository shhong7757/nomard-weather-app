import useOneCallWeather, { OneCallResponse } from "../hooks/useOneCallWeather";
import {
  Pressable,
  StyleSheet,
  Text,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Animated,
  LayoutChangeEvent,
  Dimensions,
  View,
  Easing,
  ActivityIndicator,
} from "react-native";
import { LocationListItem } from "../context/LocationList";
import * as React from "react";
import Svg from "./Svg";
import { getWeatherConditionalColor } from "../libs";

interface Props {
  list: Array<LocationListItem>;
  onPressItem?: (item: LocationListItem, oneCall: OneCallResponse) => void;
  onPressRemove?: (item: LocationListItem) => void;
}

const AUTO_ANIMATION_DURATION = 300;
const BUTTON_MIN_WIDTH = 80;
const SCREEN_WIDTH = Dimensions.get("screen").width;
const REMOVE_THRESHOLD = 0.7;

function SimpleLocationWeatherListItem({
  item,
  onPressItem,
  onPressRemove,
}: {
  item: LocationListItem;
  onPressItem?: (item: LocationListItem, oneCall: OneCallResponse) => void;
  onPressRemove?: (item: LocationListItem) => void;
}) {
  const d = new Date();
  const hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
  const minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();

  const { data, isLoading, isError } = useOneCallWeather(item.lat, item.lon);

  const animatedDx = React.useRef(new Animated.Value(0)).current;
  const animatedAbsDx = animatedDx.interpolate({
    inputRange: [-SCREEN_WIDTH, 0],
    outputRange: [SCREEN_WIDTH, 0],
  });

  const oneWay = React.useRef(true);
  const temp = React.useRef(0);
  const enableGesture = React.useRef(true);
  const itemWidthRef = React.useRef(0);
  const lastDxRef = React.useRef(0);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        !item.current && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (gestureState.dx + lastDxRef.current < 0) {
          const overThreshold =
            gestureState.dx + lastDxRef.current + temp.current <
            itemWidthRef.current * REMOVE_THRESHOLD * -1;

          if (enableGesture.current) {
            if (overThreshold && oneWay.current) {
              oneWay.current = false;
              enableGesture.current = false;
              temp.current =
                itemWidthRef.current + gestureState.dx + lastDxRef.current;

              Animated.timing(animatedDx, {
                toValue: itemWidthRef.current * -1,
                duration: 250,
                useNativeDriver: false,
                easing: Easing.ease,
              }).start(() => {
                enableGesture.current = true;
              });
            } else {
              Animated.timing(animatedDx, {
                toValue: Math.max(
                  itemWidthRef.current * -1,
                  gestureState.dx + lastDxRef.current - temp.current
                ),
                duration: 0,
                useNativeDriver: false,
                easing: Easing.ease,
              }).start();
            }
          }
        }
      },
      onPanResponderRelease: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const absDx = Math.abs(gestureState.dx + lastDxRef.current);

        let value = 0;

        if (gestureState.dx > 0 || absDx < BUTTON_MIN_WIDTH / 2) value = 0;
        else if (absDx < itemWidthRef.current * REMOVE_THRESHOLD)
          value = BUTTON_MIN_WIDTH * -1;
        else value = itemWidthRef.current * -1;

        lastDxRef.current = value;
        temp.current = 0;

        Animated.timing(animatedDx, {
          toValue: value,
          duration: AUTO_ANIMATION_DURATION,
          useNativeDriver: false,
          easing: Easing.ease,
        }).start(({ finished }) => {
          if (
            finished &&
            absDx > itemWidthRef.current * REMOVE_THRESHOLD &&
            onPressRemove
          ) {
            onPressRemove(item);
          }
        });
      },
      onPanResponderTerminate: (evt, gestureState) => {
        Animated.timing(animatedDx, {
          toValue: 0,
          duration: AUTO_ANIMATION_DURATION,
          useNativeDriver: false,
          easing: Easing.ease,
        }).start();
      },
    })
  ).current;

  const [itemHeight, setItemHeight] = React.useState(0);

  const handleLayout = React.useCallback((e: LayoutChangeEvent) => {
    itemWidthRef.current = e.nativeEvent.layout.width;
    setItemHeight(e.nativeEvent.layout.height);
  }, []);

  const handlePressRemove = React.useCallback(() => {
    if (onPressRemove) {
      onPressRemove(item);
    }
  }, [item, onPressRemove]);

  const handlePressItem = React.useCallback(() => {
    if (onPressItem && data) {
      onPressItem(item, data);
    }
  }, [data, item, onPressItem]);

  return (
    <View style={{ flexDirection: "row" }}>
      <Animated.View
        style={{
          backgroundColor: getWeatherConditionalColor(
            data ? data.current.weather[0].main : ""
          ),
          borderRadius: 8,
          width: "100%",
          transform: [{ translateX: animatedDx }],
        }}
        {...panResponder.panHandlers}
        onLayout={handleLayout}
      >
        <Pressable onPress={handlePressItem}>
          <View style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View>
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  {item.current ? "나의 위치" : item.address}
                </Text>
                <Text
                  style={{ color: "white", fontSize: 16 }}
                >{`${hour}:${minutes}`}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View>
                <Text
                  style={{ color: "white", fontSize: 32, fontWeight: "bold" }}
                >{`${data ? Math.round(data.current.temp) + "°" : ""}`}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "white" }}>
                  {data?.current.weather[0].description}
                </Text>
              </View>
              <View>
                <Text style={{ color: "white" }}>
                  {data
                    ? `최고:${Math.round(
                        data.daily[0].temp.max
                      )}° 최저:${Math.round(data.daily[0].temp.min)}°`
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
      <Animated.View
        style={{
          width: animatedAbsDx,
          flexWrap: "nowrap",
          transform: [{ translateX: animatedDx }],
        }}
      >
        <Pressable
          disabled={data === undefined}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden",
            backgroundColor: "rgb(232,85,69)",
            height: itemHeight,
            borderRadius: 8,
            marginLeft: 16,
          }}
          onPress={handlePressRemove}
        >
          <View style={{ marginLeft: 20 }}>
            <Svg xml="remove" />
          </View>
        </Pressable>
      </Animated.View>
      {isLoading && (
        <View style={{ position: "absolute", top: 8, right: 8 }}>
          <ActivityIndicator size="small" color="white" />
        </View>
      )}
    </View>
  );
}

export default function SimpleLocationWeatherList({
  list,
  onPressItem,
  onPressRemove,
}: Props) {
  return (
    <View style={{ marginBottom: 8 }}>
      {list.map((v) => (
        <View key={v.address} style={{ marginVertical: 8 }}>
          <SimpleLocationWeatherListItem
            item={v}
            onPressItem={onPressItem}
            onPressRemove={onPressRemove}
          />
        </View>
      ))}
    </View>
  );
}
