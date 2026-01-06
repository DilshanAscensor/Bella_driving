import AsyncStorage from '@react-native-async-storage/async-storage';

export const isDriverOnline = async () => {
    try {
        const value = await AsyncStorage.getItem('driver_online_status');
        return JSON.parse(value) === true;
    } catch {
        return false;
    }
};
