import {
  FETCH_USERS_LIST,
  AUTHENTICATED_USER,
  SIGNOUT_USER,
} from './actionTypes';
const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_USERS_LIST:
      let { users } = action;
      return {
        ...state,
        users,
        usersFetched: true,
      };
    case AUTHENTICATED_USER:
      let { user } = action;
      return { ...state, authenticated: true, user };
    case SIGNOUT_USER:
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;
