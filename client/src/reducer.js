import {
  FETCH_USERS_LIST,
  AUTHENTICATED_USER,
  SIGNOUT_USER,
  USER_UPDATED,
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
    case USER_UPDATED:
      return { ...state, user: { ...state.user, user: { ...action.data } } };
    default:
      return state;
  }
};

export default reducer;
