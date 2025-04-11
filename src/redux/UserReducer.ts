import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentUser } from '../constants/types';

export interface UserInitialState {
    user: CurrentUser | null;
}

const initialUser: UserInitialState = {
    user: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState: initialUser,
    reducers: {
        updateUser: (state, action: PayloadAction<CurrentUser | null>) => {
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
        },
        updateDisplayName: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.displayName = action.payload;
            }
        },
    },
});

export const { updateUser, removeUser, updateDisplayName } = userSlice.actions;
export default userSlice.reducer;
