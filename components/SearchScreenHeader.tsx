import { StyleSheet, View } from "react-native";
import * as React from "react";
import SearchBar from "./SearchBar";

interface Props {
  text: string;
  transprent: boolean;
  onChangeText?: (query: string) => void;
  onPressCancel?: () => void;
}

export default function SearchScreenHeader({
  text,
  transprent,
  onChangeText,
  onPressCancel,
}: Props) {
  return (
    <View style={[styles.container, { backgroundColor: "black" }]}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          text={text}
          onChangeText={onChangeText}
          onPressCancel={onPressCancel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.1,
    borderBottomColor: "white",
  },
  noticeWrapper: { alignItems: "center", paddingVertical: 16 },
  searchBarContainer: { paddingHorizontal: 16 },
});
