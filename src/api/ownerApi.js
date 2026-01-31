import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getOwnerProfile = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    const res = await apiClient.get('/owner/profile', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const updateOwnerProfile = async (formData) => {
    const token = await AsyncStorage.getItem('auth_token');
    const res = await apiClient.post('/owner/profile/update', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};