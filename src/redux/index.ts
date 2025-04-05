import { combineReducers, configureStore } from '@reduxjs/toolkit';
import InventoryReducer from './InventoryReducer';
import UserReducer from './UserReducer';

const rootReducer = combineReducers({
    inventory: InventoryReducer,
    user: UserReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
};

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
