import axios from 'axios';
import { BASE_URL } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = `${BASE_URL}/api`;

export const registerCustomer = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/customer/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 20000,
        });
        return response.data;
    } catch (error) {
        // ✅ Debug log
        console.log('❌ API Error:', error.response?.data || error.message);

        if (error.response) {
            // Laravel-style validation errors
            const data = error.response.data;

            if (data.errors) {
                // Collect all validation error messages into a single string
                const allErrors = Object.values(data.errors).flat().join('\n');
                throw new Error(allErrors);
            }

            // Custom backend message
            if (data.message) {
                throw new Error(data.message);
            }

            // Fallback
            throw new Error(data);
        } else if (error.request) {
            throw new Error('No response from server. Please check your internet connection.');
        } else {
            throw new Error('Unexpected error: ' + error.message);
        }
    }
};

export const registerDriver = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/driver/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
            },
            timeout: 20000,
        });
        return response.data;
    } catch (error) {
        console.log('❌ API Error:', error.response?.data || error.message);

        if (error.response) {
            const data = error.response.data;

            if (data.errors) {
                const allErrors = Object.values(data.errors).flat().join('\n');
                throw new Error(allErrors);
            }
            if (data.message) {
                throw new Error(data.message);
            }
            if (data.error) {
                throw new Error(data.error);
            }
            // Improved: Include status and stringify if object
            const errorDetail = typeof data === 'object' && data !== null ? JSON.stringify(data) : data || 'No additional details';
            throw new Error(`Server error (${error.response.status}): ${errorDetail}`);
        } else if (error.request) {
            throw new Error(error);
        } else {
            throw new Error('Unexpected error: ' + error.message);
        }
    }
};


export const registerVehicle = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/vehicle/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
            },
            timeout: 20000,
        });
        return response.data;
    } catch (error) {
        console.log('❌ API Error:', error.response?.data || error.message);

        if (error.response) {
            const data = error.response.data;

            if (data.errors) {
                const allErrors = Object.values(data.errors).flat().join('\n');
                throw new Error(allErrors);
            }
            if (data.message) {
                throw new Error(data.message);
            }
            if (data.error) {
                throw new Error(data.error);
            }
            const errorDetail = typeof data === 'object' && data !== null ? JSON.stringify(data) : data || 'No additional details';
            throw new Error(`Server error (${error.response.status}): ${errorDetail}`);
        } else if (error.request) {
            throw new Error(error + 'aaaa');
        } else {
            throw new Error('Unexpected error: ' + error.message);
        }
    }
};

export const userLogin = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            },
            timeout: 20000,
        });

        return response.data;
    } catch (error) {
        console.log('❌ API Error:', error?.response?.data ?? error.message);

        if (error.response && error.response.data) {
            const data = error.response.data;

            if (data.errors && typeof data.errors === 'object') {
                const allErrors = Object.values(data.errors).flat().join('\n');
                throw new Error(allErrors || 'Validation failed');
            }

            if (data.message) {
                throw new Error(String(data.message));
            }

            if (data.error) {
                throw new Error(String(data.error));
            }

            const detail = typeof data === 'object' ? JSON.stringify(data) : String(data);
            throw new Error(`Server error (${error.response.status}): ${detail}`);
        }
        if (error.request) {
            throw new Error('Network error: no response from server. Please check your connection and try again.');
        }
        throw new Error('Unexpected error: ' + (error.message ?? 'Unknown error'));
    }
};

export const userLogout = async () => {
    try {
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) throw new Error('No auth token found');

        // Call logout API with Authorization header
        const response = await axios.post(
            `${API_BASE_URL}/logout`,
            {}, // empty body
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                timeout: 20000,
            }
        );

        return response.data;
    } catch (error) {
        console.log('❌ Logout API Error:', error?.response?.data ?? error.message);

        if (error.response && error.response.data) {
            const data = error.response.data;
            if (data.message) throw new Error(String(data.message));
            if (data.error) throw new Error(String(data.error));
            throw new Error(`Server error (${error.response.status}): ${JSON.stringify(data)}`);
        }
        if (error.request) throw new Error('Network error: no response from server.');
        throw new Error(error.message ?? 'Unexpected error');
    }
};


export const sendOtp = async (email) => {
    try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) throw new Error('No auth token found');

        const response = await axios.post(
            `${API_BASE_URL}/send-otp`,
            email,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                timeout: 20000,
            }
        );

        return response.data;
    } catch (error) {
        console.log('❌ Send OTP API Error:', error?.response?.data ?? error.message);

        if (error.response && error.response.data) {
            const data = error.response.data;
            if (data.message) throw new Error(String(data.message));
            if (data.error) throw new Error(String(data.error));
            throw new Error(`Server error (${error.response.status}): ${JSON.stringify(data)}`);
        }

        if (error.request) throw new Error('Network error: no response from server.');
        throw new Error(error.message ?? 'Unexpected error');
    }
};

export const verifyOtp = async (data) => {
    try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) throw new Error('No auth token found');

        let headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        };

        let body = data;

        // If data is a plain object, send JSON; if FormData, send as multipart
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await axios.post(
            `${API_BASE_URL}/verify-otp`,
            body,
            {
                headers,
                timeout: 20000,
            }
        );

        return response.data;
    } catch (error) {
        console.log('❌ Verify OTP API Error:', error?.response?.data ?? error.message);

        if (error.response && error.response.data) {
            const data = error.response.data;
            if (data.message) throw new Error(String(data.message));
            if (data.error) throw new Error(String(data.error));
            throw new Error(`Server error (${error.response.status}): ${JSON.stringify(data)}`);
        }

        if (error.request) throw new Error('Network error: no response from server.');
        throw new Error(error.message ?? 'Unexpected error');
    }
};