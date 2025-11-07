import apiClient from "./apiClient";

export const registerCustomer = async (formData) => {
    const response = await apiClient.post('/customer/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const registerDriver = async (formData) => {
    const response = await apiClient.post('/driver/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
