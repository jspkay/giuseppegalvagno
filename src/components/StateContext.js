import {initialState} from '../helpers/reducerOld';

import React, {createContext, useContext, useReducer} from 'react';

export const StateContext = createContext(initialState);

export const StateProvider = ({reducer, initialState, children}) =>
    (
        <StateContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </StateContext.Provider>
    );

export const useStateValue = () => useContext(StateContext);