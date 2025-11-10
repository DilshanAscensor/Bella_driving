import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegistrationScreen from './src/screens/customer/RegistrationScreen';
import DriverRegistration from './src/screens/driver/DriverRegistrationScreen';
import MyVehicleScreen from './src/screens/driver/MyVehicleScreen';
import EditVehicleScreen from './src/screens/driver/EditVehicleScreen';
import WelcomeScreen from './src/WelcomScreen';
import driverWelcomeScreen from './src/driverWelcomeScreen';
import VehicleRegistration from './src/screens/vehicle/VehicleRegistrationScreen';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import OtpScreen from './src/screens/login/OtpVerificationScreen';
import DriverDashboard from './src/screens/driver/Dashboard';
import DriverDeliveries from './src/screens/driver/DriverDeliveriesScreen';
import CustomerDashboard from './src/screens/customer/CustomerDashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoadingScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
        <Stack.Screen name="DriverRegistration" component={DriverRegistration} />
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
        <Stack.Screen name="DriverDeliveries" component={DriverDeliveries} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="driverWelcomeScreen" component={driverWelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="VehicleRegistration" component={VehicleRegistration} />
        <Stack.Screen name="MyVehicle" component={MyVehicleScreen} />
        <Stack.Screen name="EditVehicle" component={EditVehicleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
