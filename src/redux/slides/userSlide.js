import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    phone: '',
    image: '',
    id: '',
    accessToken: '',
    address: '',
    role: 'customer'
};

const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name, email, accessToken, phone, image, id, role, address } = action.payload
            state.name = name
            state.email = email
            state.phone = phone || ''
            state.id = id
            state.image = image
            state.role = role
            state.address = address || ''
            state.accessToken = accessToken
        },
        resetUser: (state) => {
            state.name = ''
            state.email = ''
            state.phone = ''
            state.id = ''
            state.image = ''
            state.address = ''
            state.accessToken = ''
            state.role = "customer"
        },
    },
});

export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;
