import apiClient from "./apiClient";

export const userLogin = async (payload) => {
    const response = await apiClient.post('/login', payload);
    return response.data;
};

export const userLogout = async () => {
    const response = await apiClient.post('/logout');
    return response.data;
};

export const sendOtp = async (email) => {
    const response = await apiClient.post('/send-otp', {
        email: email,
    });
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

export const saveFcmToken = async (token) => {
    console.log("Saving FCM token to backend:", token);

    const response = await apiClient.post('/drivers/fcm-token', {
        fcm_token: token,
    });

    return response.data;
};