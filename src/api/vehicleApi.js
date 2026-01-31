import apiClient from "./apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerVehicle = async (formData) => {
    const token = await AsyncStorage.getItem('auth_token');

    const response = await apiClient.post('/vehicle/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data;
};


export const getVehicleByDriver = async (driverId) => {
    const response = await apiClient.get(`/vehicle/${driverId}`);
    return response.data;
};

export const updateVehicle = async (vehicleId, formData) => {
    const response = await apiClient.post(
        `/vehicle/update/${vehicleId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getMyVehicles = async () => {
    const token = await AsyncStorage.getItem('auth_token');

    const response = await apiClient.get('/vehicles', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data;
};

export const deleteVehicle = async (id) => {
    const token = await AsyncStorage.getItem('auth_token');

    const response = await apiClient.delete(`/vehicles/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data;
};