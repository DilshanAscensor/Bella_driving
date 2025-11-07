import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AuthLoadingScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('auth_token');
            const user_data = await AsyncStorage.getItem('user_data');

            if (!token || !user_data) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SplashScreen' }],
                });
                return;
            }

            // ✅ Convert saved string back into object
            const user = JSON.parse(user_data);
            const role = user.role?.toLowerCase();

            if (role === 'driver') {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'DriverDashboard',
                            params: { driver: user }
                        }
                    ],
                });
            }
            else if (role === 'customer') {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'CustomerDashboard',
                            params: { customer: user }
                        }
                    ],
                });
            }
            else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SplashScreen' }],
                });
            }
        };

        checkAuth();
    }, []);


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
};

export default AuthLoadingScreen;
