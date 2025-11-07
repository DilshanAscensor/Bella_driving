import apiClient from "./apiClient";

export const registerVehicle = async (formData) => {
    const response = await apiClient.post('/vehicle/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getVehicleByDriver = async (driverId) => {
    const response = await apiClient.get(`/vehicle/${driverId}`);
    return response.data;
};

export const updateVehicle = async (vehicleId, formData) => {
    const response = await apiClient.put(
        `/vehicle/update/${vehicleId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }
    );
    return response.data;
};