import { useContext, useReducer } from 'react';

import StateContext from './context';

export const StateProvider = ({ reducer, initialState, children }) => {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;

export const useStateValue = () => useContext(StateContext);
