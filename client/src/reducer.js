import { FETCH_USERS_LIST } from './actionTypes';
const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_USERS_LIST:
      let { users } = action;
      return {
        ...state,
        users,
      };
    default:
      return state;
  }
};

export default reducer;
