import * as React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { MapSearchResponseResultItem } from "../hooks/useMapSearch";
import { RootStackScreenProps } from "../types";
import LocationList from "../components/LocationList";
import SearchScreenHeader from "../components/SearchScreenHeader";
import useDebounce from "../hooks/useDebounce";
import useMapSearcher from "../hooks/useMapSearch";

export default function SearchScreen({
  navigation,
}: RootStackScreenProps<"SearchScreen">) {
  const [query, setQuery] = React.useState("");
  const [transprent, setTransparent] = React.useState(false);
  const debounceValue = useDebounce(query);
  const { data, isLoading } = useMapSearcher(debounceValue);

  const handlePressCancel = React.useCallback(
    () => navigation.goBack(),
    [navigation]
  );

  const handlePressLocation = React.useCallback(
    (item: MapSearchResponseResultItem) => {
      Keyboard.dismiss();
      navigation.navigate("SearchDetailScreen", { item });
    },
    [navigation]
  );

  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setTransparent(e.nativeEvent.contentOffset.y > 0);
    },
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SearchScreenHeader
          text={query}
          transprent={transprent}
          onPressCancel={handlePressCancel}
          onChangeText={setQuery}
        />
        <View style={styles.listContainer}>
          <LocationList
            isLoading={isLoading}
            list={
              data && data.response.result ? data.response.result.items : []
            }
            query={query}
            onPressLocation={handlePressLocation}
            onScroll={handleScroll}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
