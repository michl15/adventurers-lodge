import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Spell, SpellCastingInfo, SpellsKnown } from '../constants/types';
import { RowSelectionState } from '@tanstack/react-table';

export interface SpellInitialState {
    spellList: Spell[];
    spellsLoading: boolean;
    selectedSpellsState: RowSelectionState;
    charSpells: Spell[];
    spellSlots: SpellsKnown | null;
    spellcasting: SpellCastingInfo;
}

const initialSpells: SpellInitialState = {
    spellList: [],
    spellsLoading: true,
    selectedSpellsState: {},
    charSpells: [],
    spellSlots: null,
    spellcasting: {},
};

export const spellSlice = createSlice({
    name: 'spells',
    initialState: initialSpells,
    reducers: {
        setSpells: (state, action: PayloadAction<Spell[]>) => {
            state.spellList = [...action.payload];
        },
        resetSpells: (state) => {
            state.spellList = [];
        },
        setSpellsLoading: (state, action: PayloadAction<boolean>) => {
            state.spellsLoading = action.payload;
        },
        setSelectedSpellsState: (
            state,
            action: PayloadAction<RowSelectionState>
        ) => {
            state.selectedSpellsState = action.payload;
        },
        addCharSpell: (state, action: PayloadAction<Spell>) => {
            if (
                state.charSpells.filter(
                    (spell) => spell.index === action.payload.index
                ).length === 0
            ) {
                state.charSpells.push(action.payload);
            }
        },
        removeCharSpell: (state, action: PayloadAction<Spell>) => {
            state.charSpells = state.charSpells.filter(
                (spell) => spell.index !== action.payload.index
            );
        },
        selectCharSpell: (state, action: PayloadAction<Spell>) => {
            const filteredSpells = state.charSpells.filter(
                (spell) => spell.index !== action.payload.index
            );
            if (filteredSpells.length === state.charSpells.length) {
                filteredSpells.push(action.payload);
            }
            state.charSpells = filteredSpells;
        },
        resetCharSpells: (state) => {
            state.charSpells = [];
        },
        resetSelectedSpellState: (state) => {
            state.selectedSpellsState = {};
        },
        setCharSpells: (state, action: PayloadAction<Spell[]>) => {
            state.charSpells = action.payload;
        },
        setSpellSlots: (state, action: PayloadAction<SpellsKnown>) => {
            state.spellSlots = action.payload;
        },
        resetSpellSlots: (state) => {
            state.spellSlots = null;
        },
        setSpellcastingInfo: (
            state,
            action: PayloadAction<SpellCastingInfo>
        ) => {
            state.spellcasting = action.payload;
        },
        resetSpellcasting: (state) => {
            state.spellcasting = {};
        },
    },
});

export const {
    setSpells,
    resetSpells,
    setSpellsLoading,
    addCharSpell,
    removeCharSpell,
    setSelectedSpellsState,
    selectCharSpell,
    resetCharSpells,
    resetSelectedSpellState,
    setCharSpells,
    setSpellSlots,
    resetSpellSlots,
    setSpellcastingInfo,
    resetSpellcasting,
} = spellSlice.actions;
export default spellSlice.reducer;
