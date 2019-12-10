import { createStore } from "redux";

let getTime = () => {
  return new Date();
};

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, user: action.value };
  }

  if (action.type === "login-fail") {
    return { ...state, loggedIn: false };
  }
  if (action.type === "arrivalDate-change") {
    return { ...state, arrivalDate: action.value };
  }
  if (action.type === "arrivalTime-change") {
    return { ...state, arrivalTime: action.value };
  }
  if (action.type === "leavingDate-change") {
    return { ...state, leavingDate: action.value };
  }
  if (action.type === "leavingTime-change") {
    return { ...state, leavingTime: action.value };
  }

  if (action.type === "Search-address-data") {
    return { ...state, searchAddData: action.value };
  }

  if (action.type === "target-coordinates") {
    return { ...state, searchLat: action.value[1], searchLng: action.value[0] };
  }

  if (action.type === "availability") {
    return { ...state, searchLat: action.value };
  }

  return state;
};
const store = createStore(
  reducer,
  {
    loggedIn: false,
    user: undefined,
    arrivalDate: getTime(),
    arrivalTime: "12:00",
    leavingDate: getTime(),
    leavingTime: "13:00",
    searchLat: 45.508888,
    searchLng: -73.561668,
    searchAddData: undefined,
    availability: []
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
