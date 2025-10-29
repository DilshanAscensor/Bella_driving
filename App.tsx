import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegistrationScreen from './src/screens/customer/RegistrationScreen';
import DriverRegistration from './src/screens/driver/DriverRegistrationScreen';
import WelcomeScreen from './src/WelcomScreen';
import driverWelcomeScreen from './src/driverWelcomeScreen';
import VehicleRegistration from './src/screens/vehicle/VehicleRegistrationScreen';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DriverDashboard from './src/screens/driver/Dashboard';
import CustomerDashboard from './src/screens/customer/CustomerDashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
        <Stack.Screen name="DriverRegistration" component={DriverRegistration} />
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="driverWelcomeScreen" component={driverWelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="VehicleRegistration" component={VehicleRegistration} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
