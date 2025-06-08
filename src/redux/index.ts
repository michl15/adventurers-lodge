import { combineReducers, configureStore } from '@reduxjs/toolkit';
import InventoryReducer from './InventoryReducer';
import UserReducer from './UserReducer';
import EquipmentReducer from './EquipmentReducer';
import SpellsReducer from './SpellsReducer';
import CharDataReducer from './CharDataReducer';

const rootReducer = combineReducers({
    inventory: InventoryReducer,
    user: UserReducer,
    equipment: EquipmentReducer,
    spells: SpellsReducer,
    charData: CharDataReducer,
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
