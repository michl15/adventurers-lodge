import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatsTypes } from '../constants/types';
import { BASE_STATS } from '../constants/constants';

export interface CharDataInitialState {
    charStats: StatsTypes;
    charLvl: number;
    charSpellsPrepared: number;
    spellcastingAbility: string | undefined;
}

const initialCharData: CharDataInitialState = {
    charStats: BASE_STATS,
    charLvl: 1,
    charSpellsPrepared: 0,
    spellcastingAbility: '',
};

export const charDataSlice = createSlice({
    name: 'charData',
    initialState: initialCharData,
    reducers: {
        setStat: (
            state,
            action: PayloadAction<{ stat: string; val: number }>
        ) => {
            state.charStats = {
                ...state.charStats,
                [action.payload.stat]: action.payload.val,
            };
        },
        setAllStats: (state, action: PayloadAction<StatsTypes>) => {
            state.charStats = action.payload;
        },
        setLvl: (state, action: PayloadAction<number>) => {
            state.charLvl = action.payload;
        },
        setCharSpellsPrepared: (state, action: PayloadAction<number>) => {
            state.charSpellsPrepared = action.payload;
        },
        setCharSpellcastingAbility: (state, action: PayloadAction<string>) => {
            state.spellcastingAbility = action.payload;
        },
        resetAllCharData: () => initialCharData,
    },
});

export const {
    setStat,
    setAllStats,
    setLvl,
    setCharSpellsPrepared,
    setCharSpellcastingAbility,
    resetAllCharData,
} = charDataSlice.actions;
export default charDataSlice.reducer;
