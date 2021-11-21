import { OneCallResponse } from "../hooks/useOneCallWeather";
import {
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  UIManager,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import {
  LocationListItem,
  useLocationListDispatch,
  useLocationListState,
} from "../context/LocationList";
import * as React from "react";
import SimpleLocationWeatherList from "../components/SimpleLocationWeatherList";
import Svg from "../components/Svg";
import useCurrenLocationWeather from "../hooks/useCurrenLocationWeather";
import useLocationStoarge from "../hooks/useLocationStorage";
import { RootStackScreenProps } from "../types";

const layoutAnimConfig = {
  duration: 300,
  update: {
    type: LayoutAnimation.Types.easeIn,
    property: LayoutAnimation.Properties.opacity,
  },
  delete: {
    duration: 100,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TITLE_HEIGHT = 35;

export default function RootScreen({
  navigation,
}: RootStackScreenProps<"Root">) {
  const listDispatch = useLocationListDispatch();
  const listState = useLocationListState();
  const currentItem = useCurrenLocationWeather();

  const { getList, saveList } = useLocationStoarge();

  const scrollViewRef = React.useRef<ScrollView>(null);
  const searchRef = React.useRef<View>(null);

  const [showHeaderTitle, setShowHeaderTitle] = React.useState(false);

  const list = React.useMemo(
    () => (currentItem ? [currentItem, ...listState] : listState),
    [currentItem, listState]
  );

  React.useEffect(() => {
    const init = async () => {
      const list = await getList();
      listDispatch({ type: "SET", locationList: list });
      LayoutAnimation.configureNext(layoutAnimConfig);
    };
    init();
  }, []);

  const handlePressItem = React.useCallback(
    (item: LocationListItem, oneCall: OneCallResponse) => {
      navigation.navigate("WeatherScreen", {
        item,
        oneCall,
      });
    },
    [navigation]
  );

  React.useEffect(() => {
    const save = async () => {
      await saveList(listState);
    };
    save();
  }, [listState]);

  const handlePressRemove = React.useCallback(
    async (item: LocationListItem) => {
      listDispatch({ type: "REMOVE", location: item });
      LayoutAnimation.configureNext(layoutAnimConfig);
    },
    [listDispatch, listState]
  );

  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setShowHeaderTitle(e.nativeEvent.contentOffset.y > TITLE_HEIGHT);
    },
    []
  );

  const handlePressSearch = React.useCallback(() => {
    navigation.navigate("SearchScreen");
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View
        style={{
          height: TITLE_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flexBasis: 40 }} />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{ color: showHeaderTitle ? "white" : "black", fontSize: 20 }}
          >
            날씨
          </Text>
        </View>
        <View style={{ flexBasis: 40 }} />
      </View>
      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        scrollToOverflowEnabled
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
      >
        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          <Text style={styles.weather}>날씨</Text>
        </View>
        <View style={{ backgroundColor: "black" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              marginVertical: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Pressable onPress={handlePressSearch}>
                <View
                  ref={searchRef}
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "rgb(42,43,45)",
                      borderRadius: 8,
                      flex: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    {Platform.OS === "ios" && (
                      <Svg xml="search" size={20} color={"rgb(42,43,45)"} />
                    )}
                    <Text
                      style={{
                        color: "#575757",
                        paddingHorizontal: 4,
                        fontSize: 20,
                      }}
                    >
                      검색
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <SimpleLocationWeatherList
            list={list}
            onPressItem={handlePressItem}
            onPressRemove={handlePressRemove}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  date: { color: "rgb(117,117,117)", fontSize: 24, fontWeight: "bold" },
  weather: { color: "white", fontSize: 32, fontWeight: "bold" },
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
