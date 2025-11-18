
import axios from 'axios';
import { BASE_URL } from '../config/api';

const apiClient = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 30000,
    headers: {
        Accept: 'application/json',
    },
});


export const getDriverDetails = async (driverId) => {
    const response = await apiClient.get(`/driver/${driverId}`);
    return response.data;
};

export const updateDriverDetails = async (driverId, data, files) => {
    try {
        const formData = new FormData();

        // Append text fields
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        // Append image files
        Object.entries(files).forEach(([key, file]) => {
            if (file) {
                const uri =
                    Platform.OS === 'ios'
                        ? file.uri.replace('file://', '')
                        : file.uri;

                formData.append(key, {
                    uri,
                    name: file.name || `${key}_${Date.now()}.jpg`,
                    type: file.type || 'image/jpeg',
                });
            }
        });

        console.log('Uploading to:', `${BASE_URL}/api/driver/${driverId}`);
        console.log('Sent fields:', data);
        console.log('Sent files:', files);

        const response = await apiClient.post(
            `/driver/${driverId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Upload error:', error.response?.data || error.message);
        throw error;
    }
};
