import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LocationListProvider from "./context/LocationList";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <LocationListProvider>
          <Navigation colorScheme={colorScheme} />
        </LocationListProvider>
        <StatusBar style="light" translucent={false} />
      </SafeAreaProvider>
    );
  }
}
