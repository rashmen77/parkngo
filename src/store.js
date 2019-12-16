import { createStore } from "redux";

let getTime = () => {
  return new Date();
};

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, user: action.value };
  }

  if (action.type === "login-fail") {
    return { ...state, loggedIn: false, user: undefined };
  }
  if (action.type === "start-dateTime") {
    return { ...state, startDateTime: action.value };
  }

  if (action.type === "end-dateTime") {
    return { ...state, endDateTime: action.value };
  }

  if (action.type === "Search-address-data") {
    return { ...state, searchAddData: action.value };
  }

  if (action.type === "target-coordinates") {
    return {
      ...state,
      searchLat: action.value[1],
      searchLng: action.value[0],
      monthlySearch: action.monthly
    };
  }

  if (action.type === "default-search") {
    return {
      ...state,
      monthlySearch: action.monthly
    };
  }

  if (action.type === "set-parkingLot-details") {
    return {
      ...state,
      parkingLotDetail: action.parkingLotDetail
    };
  }

  if (action.type === "availability") {
    return { ...state, searchLat: action.value };
  }

  if (action.type === "set-editpost") {
    return { ...state, editPost: action.value };
  }

  if (action.type === "set-all-userPosts") {
    return {
      ...state,
      userpostLoading: action.loading,
      allPosts: action.allPosts
    };
  }

  return state;
};
const store = createStore(
  reducer,
  {
    enablePdfDownload: false,
    allPosts: undefined,
    parkingLotDetail: undefined,
    editPost: undefined,
    userpostLoading: true,
    loggedIn: false,
    user: undefined,
    startDateTime: getTime(),
    endDateTime: getTime(),
    searchLat: 45.508888,
    searchLng: -73.561668,
    searchAddData: undefined,
    availability: [],
    monthlySearch: false
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
