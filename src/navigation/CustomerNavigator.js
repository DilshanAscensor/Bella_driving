import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CustomerDashboard from '../../src/screens/customer/CustomerDashboardScreen';
import OngoingOrdersScreen from '../../src/screens/customer/OngoingOrdersScreen';
import OrderHistoryScreen from '../../src/screens/customer/OrderHistoryScreen';
import CustomerOrderDetailsScreen from '../../src/screens/customer/OrderDetailsScreen';
import CustomerProfileScreen from '../../src/screens/customer/profile/CustomerProfileScreen';
import EditCustomerProfileScreen from '../../src/screens/customer/profile/EditCustomerProfileScreen';


const Stack = createStackNavigator();

const CustomerNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
            <Stack.Screen name="OngoingOrders" component={OngoingOrdersScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="CustomerOrderDetails" component={CustomerOrderDetailsScreen} />
            <Stack.Screen name="CustomerProfileScreen" component={CustomerProfileScreen} />
            <Stack.Screen name="EditCustomerProfile" component={EditCustomerProfileScreen} />

        </Stack.Navigator>
    );
};

export default CustomerNavigator;
