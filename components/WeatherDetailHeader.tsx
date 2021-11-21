import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
interface Props {
  appendable?: boolean;
  onPressAppend?: () => void;
  onPressCacnel?: () => void;
}

export const HEADER_HEIGHT = 60;

export default function Header({
  appendable = false,
  onPressAppend,
  onPressCacnel,
}: Props) {
  const handlePressAppend = React.useCallback(() => {
    if (onPressAppend) onPressAppend();
  }, [onPressAppend]);

  const handlePressCancel = React.useCallback(() => {
    if (onPressCacnel) onPressCacnel();
  }, [onPressCacnel]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerWrapper}>
        <Pressable
          style={styles.headerSideButtonWrapper}
          onPress={handlePressCancel}
        >
          <Text style={styles.text}>닫기</Text>
        </Pressable>
        <View style={styles.empty} />
        <Pressable
          disabled={!appendable}
          style={styles.headerSideButtonWrapper}
          onPress={handlePressAppend}
        >
          {appendable && <Text style={styles.text}>추가</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1 },
  headerContainer: { height: HEADER_HEIGHT },
  headerSideButtonWrapper: { flexBasis: 40 },
  headerWrapper: { flexDirection: "row", padding: 16 },
  text: { color: "white", fontSize: 18, fontWeight: "400" },
});
