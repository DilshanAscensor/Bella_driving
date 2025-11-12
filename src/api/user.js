
import apiClient from "./apiClient";

export const getDriverDetails = async (driverId) => {
    const response = await apiClient.get(`/driver/${driverId}`);
    return response.data;
};

export const updateDriverDetails = async (driverId, data, files = {}) => {
    try {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        Object.keys(files).forEach((key) => {
            const file = files[key];
            if (file) {
                formData.append(key, {
                    uri: file.uri,
                    type: file.type || "image/jpeg",
                    name: file.name || `${key}.jpg`,
                });
            }
        });

        const response = await apiClient.put(`/driver/${driverId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;

    } catch (error) {
        console.error("Update driver API error:", error.response || error.message);
        throw error;
    }
};