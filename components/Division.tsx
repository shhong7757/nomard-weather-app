import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { tintColorGray } from "../constants/Colors";

interface Props {
  list: Array<{ label: string; value: string }>;
}

export default function Division({ list }: Props) {
  return (
    <View style={styles.division}>
      {list.map((v) => (
        <View key={v.label} style={styles.itemContainer}>
          <Text style={{ color: tintColorGray }}>{v.label}</Text>
          <Text style={{ color: "white", fontSize: 24 }}>{v.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  division: { paddingVertical: 10, flexDirection: "row" },
  itemContainer: { flex: 1 },
  label: { color: tintColorGray },
  value: { color: "white", fontSize: 24 },
});
