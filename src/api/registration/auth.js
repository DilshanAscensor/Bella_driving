import axios from 'axios';

const BASE_URL = 'https://ifswapap2025.colomboexpo.com/api';

export const registerCustomer = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/customer/register`, formData, {
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
        const response = await axios.post(`${BASE_URL}/driver/register`, formData, {
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
        const response = await axios.post(`${BASE_URL}/vehicle/register`, formData, {
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
            throw new Error(error);
        } else {
            throw new Error('Unexpected error: ' + error.message);
        }
    }
};