import apiClient from "./apiClient";

export const userLogin = async (formData) => {
    const response = await apiClient.post('/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const userLogout = async () => {
    const response = await apiClient.post('/logout');
    return response.data;
};

export const sendOtp = async (email) => {
    const response = await apiClient.post('/send-otp', email);
    return response.data;
};

export const verifyOtp = async (payload) => {
    const isFormData = payload instanceof FormData;

    const response = await apiClient.post('/verify-otp', payload, {
        headers: {
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        }
    });

    return response.data;
};

