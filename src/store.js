import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, user: action.value };
  }

  if (action.type === "login-fail") {
    return { ...state, loggedIn: false };
  }

  return state;
};
const store = createStore(
  reducer,
  { loggedIn: false, user: undefined },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
