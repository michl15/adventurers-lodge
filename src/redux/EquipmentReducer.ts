import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EquipmentData } from '../constants/types';

export interface EquipmentInitialState {
    equipmentList: EquipmentData[];
    equipmentIsLoading: boolean;
    extraEquipmentFetched: boolean;
}

const initialEquipment: EquipmentInitialState = {
    equipmentList: [],
    equipmentIsLoading: false,
    extraEquipmentFetched: false,
};

export const equipmentSlice = createSlice({
    name: 'equipment',
    initialState: initialEquipment,
    reducers: {
        setEquipment: (
            state,
            action: PayloadAction<EquipmentData[] | null>
        ) => {
            if (action.payload) {
                state.equipmentList = [...action.payload];
            }
        },
        resetEquipment: (state) => {
            state.equipmentList = [];
        },
        setEquipmentIsLoading: (state, action: PayloadAction<boolean>) => {
            state.equipmentIsLoading = action.payload;
        },
        addEquipment: (
            state,
            action: PayloadAction<EquipmentData[] | null>
        ) => {
            if (action.payload) {
                state.equipmentList.push(...action.payload);
            }
        },
        setExtraEquipmentFetched: (state, action: PayloadAction<boolean>) => {
            state.extraEquipmentFetched = action.payload;
        },
    },
});

export const {
    setEquipment,
    resetEquipment,
    setEquipmentIsLoading,
    addEquipment,
    setExtraEquipmentFetched,
} = equipmentSlice.actions;
export default equipmentSlice.reducer;
