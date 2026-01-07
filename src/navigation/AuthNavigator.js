import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../WelcomScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/login/OtpVerificationScreen';
import RegistrationScreen from '../screens/customer/RegistrationScreen';
import DriverRegistration from '../screens/driver/DriverRegistrationScreen';
import VehicleRegistration from '../screens/vehicle/VehicleRegistrationScreen';
import DocumentsAndLicensesScreen from '../screens/driver/profile/DocumentsAndLicenses';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="DriverRegistration" component={DriverRegistration} />
        <Stack.Screen name="VehicleRegistration" component={VehicleRegistration} />
        <Stack.Screen name="DocumentsAndLicenses" component={DocumentsAndLicensesScreen} />
    </Stack.Navigator>
);

export default AuthNavigator;
