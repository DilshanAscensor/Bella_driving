import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const persistedUser = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        user: persistedUser,
    },
});

export const persistor = persistStore(store);
