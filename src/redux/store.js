import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slides/productSlide';
import userReducer from './slides/userSlide';

export const store = configureStore({
    reducer: {
        product: productReducer,
        user: userReducer,
    },
});

// middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//         serializableCheck: false, // Tắt kiểm tra tính serializable
//     }),

