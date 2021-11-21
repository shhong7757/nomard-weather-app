/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { ColorSchemeName, Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import * as React from "react";
import LinkingConfiguration from "./LinkingConfiguration";
import RootScreen from "../screens/RootScreen";
import SearchDetailScreen from "../screens/SearchDetailScreen";
import SearchScreen from "../screens/SearchScreen";
import WeatherScreen from "../screens/WeatherScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={RootScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SearchDetailScreen"
        component={SearchDetailScreen}
        options={{
          headerShown: false,
          animation:
            Platform.OS === "android"
              ? "slide_from_right"
              : "slide_from_bottom",
          presentation:
            Platform.OS !== "android" ? "modal" : "transparentModal",
        }}
      />
      <Stack.Screen
        name="WeatherScreen"
        component={WeatherScreen}
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation:
            Platform.OS !== "android" ? "modal" : "transparentModal",
        }}
      />
    </Stack.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
