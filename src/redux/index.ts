import { configureStore } from "@reduxjs/toolkit";
import InventoryReducer from "./InventoryReducer";

export const store = configureStore({
    reducer: {
        inventory: InventoryReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;