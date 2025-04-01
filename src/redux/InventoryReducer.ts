import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Equipment } from '../constants/types';

export interface InventoryInitialState {
    inventoryList: Equipment[];
}

const initialInventory: InventoryInitialState = {
    inventoryList: [],
};

export const inventorySlice = createSlice({
    name: 'inventory',
    initialState: initialInventory,
    reducers: {
        addItem: (state, action: PayloadAction<Equipment>) => {
            state.inventoryList = [...state.inventoryList, action.payload];
        },
        updateItemQuantity: (
            state,
            action: PayloadAction<{ value: number; index: number }>
        ) => {
            if (action.payload.value === 0) {
                state.inventoryList.splice(action.payload.index, 1);
                state.inventoryList = [...state.inventoryList];
            } else {
                state.inventoryList[action.payload.index].quantity =
                    action.payload.value;
            }
        },
        resetInventory: (state) => {
            state.inventoryList = [];
        },
        setInventory: (state, action: PayloadAction<Equipment[]>) => {
            state.inventoryList = [...action.payload];
        },
    },
});

export const { addItem, updateItemQuantity, resetInventory, setInventory } =
    inventorySlice.actions;
export default inventorySlice.reducer;
