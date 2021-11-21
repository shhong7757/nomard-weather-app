import * as React from "react";
import {
  Pressable,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Text, View } from "../components/Themed";

import { MapSearchResponseResultItem } from "../hooks/useMapSearch";
import SearchEmpty from "./SearchEmpty";

interface Props {
  isLoading: boolean;
  list: Array<MapSearchResponseResultItem>;
  query: string;
  onPressLocation?: (item: MapSearchResponseResultItem) => void;
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function LocationListItem({
  item,
  query,
  onPressLocation,
}: {
  item: MapSearchResponseResultItem;
  query: string;
  onPressLocation?: (item: MapSearchResponseResultItem) => void;
}) {
  const getColor = (hit: boolean) => {
    return hit ? "white" : "rgb(117,117,117)";
  };

  const arr = React.useMemo(() => {
    const idx = item.title.indexOf(query);

    if (idx > -1) {
      return [
        { value: item.title.substring(0, idx), hit: false },
        { value: item.title.substring(idx, idx + query.length), hit: true },
        {
          value: item.title.substring(idx + query.length, item.title.length),
          hit: false,
        },
      ];
    }

    return [{ value: item.title, hit: false }];
  }, [item, query]);

  const handlePressLocation = React.useCallback(() => {
    if (onPressLocation) {
      onPressLocation(item);
    }
  }, [item, onPressLocation]);

  return (
    <Pressable style={styles.listItemWrapper} onPress={handlePressLocation}>
      <View style={{ flexDirection: "row", backgroundColor: "black" }}>
        {arr.map((v, index) => (
          <View
            key={`${item.title}::${index}`}
            style={{ backgroundColor: "black" }}
          >
            <Text style={{ color: getColor(v.hit), fontSize: 20 }}>
              {v.value}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

export default function LocationList({
  isLoading,
  list,
  query,
  onPressLocation,
  onScroll,
}: Props) {
  if (query !== "" && !isLoading && list.length === 0) {
    return <SearchEmpty query={query} />;
  }

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={list}
      keyExtractor={(item, index) => `[${index}]: ${item.title}`}
      scrollEnabled={list.length > 0}
      renderItem={({ item }) => (
        <LocationListItem
          item={item}
          query={query}
          onPressLocation={onPressLocation}
        />
      )}
      onScroll={onScroll}
    />
  );
}

const styles = StyleSheet.create({
  listItemWrapper: {
    backgroundColor: "black",
    paddingVertical: 10,
  },
});
