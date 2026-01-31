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

export const registerVehicleOwner = async (fd) => {
    console.log("Registering Vehicle Owner with data:", fd);
    const response = await apiClient.post('/vehicle-owner/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const registerOwnerVehicle = (fd) =>
    apiClient.post('/vehicle-owner/vehicles', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });