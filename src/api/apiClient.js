import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/api';

const apiClient = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 20000,
});

// ✅ Auto attach token to every request
apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = 'application/json';
    return config;
});

// ✅ Clean error formatting
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const apiErr = error?.response?.data;
        const status = error?.response?.status;

        // Laravel Validation Errors
        if (apiErr?.errors) {
            const messages = Object.values(apiErr.errors).flat().join('\n');
            return Promise.reject(new Error(messages));
        }

        // Laravel message
        if (apiErr?.message) {
            return Promise.reject(new Error(apiErr.message));
        }

        // Custom backend errors
        if (apiErr?.error) {
            return Promise.reject(new Error(apiErr.error));
        }

        if (error.request) {
            return Promise.reject(new Error("No response from server. Check your internet."));
        }

        return Promise.reject(new Error(`Unexpected error (${status})`));
    }
);

export default apiClient;
