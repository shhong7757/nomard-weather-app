import React from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import * as Svgs from "../assets/svgs";

interface Props {
  color?: string;
  size?: number;
  xml: keyof typeof Svgs;
}

export default function Svg({ xml, size = 24, color = "black" }: Props) {
  if (Svgs[xml])
    return <SvgXml color={color} width={size} height={size} xml={Svgs[xml]} />;
  return <View />;
}
