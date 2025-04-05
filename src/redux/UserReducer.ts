import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export interface UserInitialState {
    user: User | null;
}

const initialUser: UserInitialState = {
    user: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState: initialUser,
    reducers: {
        updateUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
        },
    },
});

export const { updateUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
