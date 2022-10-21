import { configureStore,  } from "@reduxjs/toolkit";
import loandIdReducer from "./features/loanIdSlice"
import loanDetailReducer from "./features/loanDetailSlice";
import generateScheduleReducer from "./features/generateScheduleSlice";
import storage  from "redux-persist/lib/storage";

import { combineReducers } from 'redux';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';


const persistConfig ={
    key: 'data',
    storage,
}

const reducers = combineReducers({
    loanId: loandIdReducer,
    loanDetail: loanDetailReducer,
    generateSchedule : generateScheduleReducer,

   
})

const persistedReducer = persistReducer(persistConfig,reducers);

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

//https://dev.to/dawnind/persist-redux-state-with-redux-persist-3k0d
//HOW TO PERSIST WITH REDUX GOOD TUTORIAL