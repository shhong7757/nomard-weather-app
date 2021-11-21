import { LocationListItem } from "../context/LocationList";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LIST = "LIST";

export default function useLocationStoarge() {
  const getList = async () => {
    // await AsyncStorage.clear();
    const item = await AsyncStorage.getItem(LIST);

    if (item !== null) {
      const list: Array<LocationListItem> = JSON.parse(item);
      return list;
    }

    return [];
  };

  const saveList = async (l: Array<LocationListItem>) => {
    await AsyncStorage.setItem(LIST, JSON.stringify(l));
  };

  return { getList, saveList };
}
