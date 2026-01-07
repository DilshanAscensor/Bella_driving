import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OrderProvider } from '../context/OrderContext';

import DriverDashboard from '../../src/screens/driver/Dashboard';
import DriverDeliveries from '../../src/screens/driver/DriverDeliveriesScreen';
import DriverProfile from '../../src/screens/driver/UserProfileScreen';
import EditDriverProfile from '../../src/screens/driver/EditProfile';
import AcceptDeliveryScreen from '../../src/screens/driver/delivery/order/AcceptDeliveryScreen';
import OrderDetailsScreen from '../../src/screens/driver/delivery/order/OrderDetailsScreen';
import PickupConfirmScreen from '../../src/screens/driver/delivery/order/PickupConfirmScreen';
import PickupPhotoUpload from '../../src/screens/driver/delivery/order/PickupPhotoUpload';
import DeliveryCompletedScreen from '../../src/screens/driver/delivery/order/DeliveryCompletedScreen';
import DeliveryPhotoUploadScreen from '../../src/screens/driver/delivery/order/DeliveryPhotoUploadScreen';
import DocumentsAndLicensesScreen from '../../src/screens/driver/profile/DocumentsAndLicenses';
import EarningsScreen from '../../src/screens/driver/EarningsScreen';
import PickupMapScreen from '../../src/screens/driver/delivery/order/PickupMapScreen';
import DeliveryMapScreen from '../../src/screens/driver/delivery/order/DeliveryMap';

import DriverRegistration from '../../src/screens/driver/DriverRegistrationScreen';
import MyVehicleScreen from '../../src/screens/driver/MyVehicleScreen';
import EditVehicleScreen from '../../src/screens/driver/EditVehicleScreen';
import VehicleRegistration from '../../src/screens/vehicle/VehicleRegistrationScreen';
import RegistrationScreen from '../../src/screens/customer/RegistrationScreen';


const Stack = createStackNavigator();

const DriverNavigator = () => {
    return (
        <OrderProvider>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName="DriverDashboard"
            >
                <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
                {/* <Stack.Screen name="DriverRegistration" component={DriverRegistration} /> */}
                <Stack.Screen name="DriverDeliveries" component={DriverDeliveries} />
                {/* <Stack.Screen name="VehicleRegistration" component={VehicleRegistration} /> */}
                <Stack.Screen name="MyVehicle" component={MyVehicleScreen} />
                <Stack.Screen name="EditVehicle" component={EditVehicleScreen} />
                <Stack.Screen name="DriverProfile" component={DriverProfile} />
                <Stack.Screen name="EditDriverProfile" component={EditDriverProfile} />
                <Stack.Screen name="AcceptDeliveryScreen" component={AcceptDeliveryScreen} />
                <Stack.Screen name="DeliveryMap" component={DeliveryMapScreen} />
                <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
                <Stack.Screen name="PickupPhotoUpload" component={PickupPhotoUpload} />
                <Stack.Screen name="DeliveryCompletedScreen" component={DeliveryCompletedScreen} />
                <Stack.Screen name="DeliveryPhotoUploadScreen" component={DeliveryPhotoUploadScreen} />
                {/* <Stack.Screen name="DocumentsAndLicenses" component={DocumentsAndLicensesScreen} /> */}
                <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
                <Stack.Screen name="PickupConfirm" component={PickupConfirmScreen} />
                <Stack.Screen name="PickupMap" component={PickupMapScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
            </Stack.Navigator>
        </OrderProvider>
    );
};


export default DriverNavigator;
