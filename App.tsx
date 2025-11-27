import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Redux
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';

// Screens
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
import DriverProfile from './src/screens/driver/UserProfileScreen';
import EditDriverProfile from './src/screens/driver/EditProfile';
import AcceptDeliveryScreen from './src/screens/driver/delivery/order/AcceptDeliveryScreen';
import DeliveryMapScreen from './src/screens/driver/delivery/DeliveryMapScreen';
import OrderDetailsScreen from './src/screens/driver/delivery/order/OrderDetailsScreen';
import PickupConfirmScreen from './src/screens/driver/delivery/order/PickupConfirmScreen';
import PickupPhotoUpload from './src/screens/driver/delivery/order/PickupPhotoUpload';
import DeliveryConfirmationScreen from './src/screens/driver/delivery/order/DeliveryConfirmationScreen';
import DeliveryCompletedScreen from './src/screens/driver/delivery/order/DeliveryCompletedScreen';
import DeliveryPhotoUploadScreen from './src/screens/driver/delivery/order/DeliveryPhotoUploadScreen';
import DocumentsAndLicensesScreen from './src/screens/driver/profile/DocumentsAndLicenses';
import EarningsScreen from './src/screens/driver/EarningsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="AuthLoadingScreen"
              screenOptions={{ headerShown: false }}
            >
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
              <Stack.Screen name="DriverProfile" component={DriverProfile} />
              <Stack.Screen name="EditDriverProfile" component={EditDriverProfile} />
              <Stack.Screen name="AcceptDeliveryScreen" component={AcceptDeliveryScreen} />
              <Stack.Screen name="DeliveryMap" component={DeliveryMapScreen} />
              <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
              <Stack.Screen name="PickupPhotoUpload" component={PickupPhotoUpload} />
              <Stack.Screen name="DeliveryConfirmationScreen" component={DeliveryConfirmationScreen} />
              <Stack.Screen name="DeliveryCompletedScreen" component={DeliveryCompletedScreen} />
              <Stack.Screen name="DeliveryPhotoUploadScreen" component={DeliveryPhotoUploadScreen} />
              <Stack.Screen name="DocumentsAndLicenses" component={DocumentsAndLicensesScreen} />
              <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
              <Stack.Screen name="PickupConfirm" component={PickupConfirmScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>

      </PersistGate>
    </Provider>
  );
}
