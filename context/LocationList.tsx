import * as React from "react";

export type LocationListItem = {
  current: boolean;
  address: string;
  lat: number;
  lon: number;
};

type LocationListState = Array<LocationListItem>;

type LocationListAction =
  | { type: "APPEND"; location: LocationListItem }
  | { type: "REMOVE"; location: LocationListItem }
  | { type: "SET"; locationList: Array<LocationListItem> };

const initialLocationList: LocationListState = [];

function reducer(state: Array<LocationListItem>, action: LocationListAction) {
  switch (action.type) {
    case "SET":
      return action.locationList;
    case "APPEND":
      return [...state, action.location];
    case "REMOVE":
      return state.filter((v) => v.address !== action.location.address);
    default:
      throw new Error(`Unhandled action type`);
  }
}

const LocationListStateContext = React.createContext<LocationListState>([]);

const LocationListPropsContext =
  React.createContext<React.Dispatch<LocationListAction> | null>(null);

export function LocationListProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer(reducer, initialLocationList);

  return (
    <LocationListStateContext.Provider value={state}>
      <LocationListPropsContext.Provider value={dispatch}>
        {children}
      </LocationListPropsContext.Provider>
    </LocationListStateContext.Provider>
  );
}

// state 와 dispatch 를 쉽게 사용하기 위한 커스텀 Hooks
export function useLocationListState() {
  const state = React.useContext(LocationListStateContext);
  if (!state) throw new Error("Cannot find SampleProvider"); // 유효하지 않을땐 에러를 발생
  return state;
}

export function useLocationListDispatch() {
  const dispatch = React.useContext(LocationListPropsContext);
  if (!dispatch) throw new Error("Cannot find SampleProvider"); // 유효하지 않을땐 에러를 발생
  return dispatch;
}

export default LocationListProvider;
