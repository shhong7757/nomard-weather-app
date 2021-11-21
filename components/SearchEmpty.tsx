import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Svg from "./Svg";

interface Props {
  query: string;
}

export default function SearchEmpty({ query }: Props) {
  return (
    <View style={styles.container}>
      <Svg xml="search" size={64} color={"rgb(42,43,45)"} />
      <View style={{ marginTop: 16 }}>
        <Text style={{ color: "white", fontSize: 24 }}>결과 없음</Text>
      </View>
      <View style={{ marginTop: 8 }}>
        <Text
          style={{ color: "rgb(117,117,117)" }}
        >{`'${query}'에 대한 결과가 없습니다.`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
