import { useFocusEffect } from "@react-navigation/core";
import * as React from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import Svg from "../components/Svg";
import { Text } from "../components/Themed";

interface Props {
  showCancelButton?: boolean;
  text: string;
  onChangeText?: (query: string) => void;
  onPressCancel?: () => void;
}

export default function SearchBar({
  showCancelButton = true,
  text,
  onChangeText,
  onPressCancel,
}: Props) {
  const textInputRef = React.useRef<TextInput>(null);

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 300);
    }, [])
  );

  const handlePressCancel = React.useCallback(() => {
    if (onPressCancel) onPressCancel();
  }, [onPressCancel]);

  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchBarWrapper}>
        {Platform.OS === "ios" && (
          <Svg xml="search" size={20} color={"rgb(42,43,45)"} />
        )}
        <TextInput
          keyboardAppearance="dark"
          ref={textInputRef}
          autoFocus={true}
          onChangeText={onChangeText}
          placeholder="읍/면/동 검색"
          placeholderTextColor="#575757"
          style={styles.textInput}
          value={text}
        />
      </View>
      {showCancelButton && (
        <Pressable onPress={handlePressCancel}>
          <Text style={{ fontSize: 20, color: "white" }}>취소</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
  },
  searchBarWrapper: {
    backgroundColor: "rgb(42,43,45)",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textInput: {
    color: "white",
    fontSize: 20,
    paddingHorizontal: 4,
  },
});
