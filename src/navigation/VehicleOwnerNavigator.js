import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import VehicleOwnerDashboard from '../../src/screens/vehicleOwner/VehicleOwnerDashboard';
import MultiVehicleRegistrationScreen from '../../src/screens/vehicleOwner/MultiVehicleRegistrationScreen';
import VehicleListScreen from '../../src/screens/vehicleOwner/VehicleListScreen';
import EditVehicleScreen from '../../src/screens/vehicleOwner/EditVehicleScreen';
import VehicleOwnerSettingsScreen from '../../src/screens/vehicleOwner/VehicleOwnerSettingsScreen';


const Stack = createStackNavigator();

const VehicleOwnerNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="VehicleOwnerDashboard" component={VehicleOwnerDashboard} />
            <Stack.Screen name="MultiVehicleRegistrationScreen" component={MultiVehicleRegistrationScreen} />
            <Stack.Screen name="VehicleListScreen" component={VehicleListScreen} />
            <Stack.Screen name="EditVehicleScreen" component={EditVehicleScreen} />
            <Stack.Screen name="VehicleOwnerSettingsScreen" component={VehicleOwnerSettingsScreen} />
        </Stack.Navigator>
    );
};

export default VehicleOwnerNavigator;
