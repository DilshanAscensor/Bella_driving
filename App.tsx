import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { AppState } from 'react-native';

// Redux
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';

// Navigation
import { navigationRef, navigate } from './src/navigation/NavigationService';

// Utils
import { playOrderSound } from './src/utils/notificationSound';
import apiClient from './src/api/apiClient';

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
import DriverProfile from './src/screens/driver/UserProfileScreen';
import EditDriverProfile from './src/screens/driver/EditProfile';
import AcceptDeliveryScreen from './src/screens/driver/delivery/order/AcceptDeliveryScreen';
import OrderDetailsScreen from './src/screens/driver/delivery/order/OrderDetailsScreen';
import PickupConfirmScreen from './src/screens/driver/delivery/order/PickupConfirmScreen';
import PickupPhotoUpload from './src/screens/driver/delivery/order/PickupPhotoUpload';
import DeliveryCompletedScreen from './src/screens/driver/delivery/order/DeliveryCompletedScreen';
import DeliveryPhotoUploadScreen from './src/screens/driver/delivery/order/DeliveryPhotoUploadScreen';
import DocumentsAndLicensesScreen from './src/screens/driver/profile/DocumentsAndLicenses';
import EarningsScreen from './src/screens/driver/EarningsScreen';
import PickupMapScreen from './src/screens/driver/delivery/order/PickupMapScreen';
import DeliveryMapScreen from './src/screens/driver/delivery/order/DeliveryMap';

import CustomerDashboard from './src/screens/customer/CustomerDashboardScreen';
import OngoingOrdersScreen from './src/screens/customer/OngoingOrdersScreen';
import OrderHistoryScreen from './src/screens/customer/OrderHistoryScreen';
import CustomerOrderDetailsScreen from './src/screens/customer/OrderDetailsScreen';
import CustomerProfileScreen from './src/screens/customer/profile/CustomerProfileScreen';
import EditCustomerProfileScreen from './src/screens/customer/profile/EditCustomerProfileScreen';



const Stack = createNativeStackNavigator();


export default function App() {

  const hasNavigatedRef = useRef(false);
  /* ================= ACTIVE ORDER CHECK ================= */
  const checkActiveOrder = async () => {
    if (hasNavigatedRef.current) return;

    try {
      const res = await apiClient.get('/drivers/active-order');
      const order = res?.data?.data;

      if (!order) return;

      hasNavigatedRef.current = true;

      if (order.status === 'accepted') {
        navigate('AcceptDeliveryScreen', { order_id: order.id });
      }

      if (order.status === 'picked_up') {
        navigate('PickupConfirm', { order_id: order.id });
      }

      if (order.status === 'on_the_way') {
        navigate('DeliveryMap', { order_id: order.id });
      }
    } catch { }
  };


  useEffect(() => {

    /* ========== ANDROID NOTIFICATION PERMISSION ========= */
    notifee.requestPermission();

    /* ========== CHANNEL ========= */
    notifee.createChannel({
      id: 'orders',
      name: 'Orders',
      importance: AndroidImportance.HIGH,
      sound: 'order_sound',
    });

    /* ========== APP STATE (REOPEN APP) ========= */
    const appStateSub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkActiveOrder();
      }
    });

    /* ========== KILLED STATE ========= */
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage?.data?.type === 'new_order') {
        playOrderSound();
        navigate('AcceptDeliveryScreen', {
          order_id: remoteMessage.data.order_id,
        });
      }
    });

    /* ========== BACKGROUND ========= */
    const unsubscribeBackground =
      messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage?.data?.type === 'new_order') {
          playOrderSound();
          navigate('AcceptDeliveryScreen', {
            order_id: remoteMessage.data.order_id,
          });
        }
      });

    /* ========== FOREGROUND ========= */
    const unsubscribeForeground =
      messaging().onMessage(async remoteMessage => {
        if (remoteMessage?.data?.type === 'new_order') {

          await notifee.displayNotification({
            title: 'New Order Available',
            body: 'Tap to accept the order',
            data: remoteMessage.data,
            android: {
              channelId: 'orders',
              importance: AndroidImportance.HIGH,
              sound: 'order_sound',
              pressAction: { id: 'default' },
            },
          });

          playOrderSound();
        }
      });

    /* ========== NOTIFEE PRESS ========= */
    const unsubscribeNotifee =
      notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
          const data = detail.notification?.data;

          if (data?.type === 'new_order') {
            navigate('AcceptDeliveryScreen', {
              order_id: data.order_id,
            });
          }
        }
      });

    /* ========== CLEANUP ========= */
    return () => {
      appStateSub.remove();
      unsubscribeForeground();
      unsubscribeBackground();
      unsubscribeNotifee();
    };

  }, []);



  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
              initialRouteName="AuthLoadingScreen"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen name="Registration" component={RegistrationScreen} />
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
              <Stack.Screen name="DeliveryCompletedScreen" component={DeliveryCompletedScreen} />
              <Stack.Screen name="DeliveryPhotoUploadScreen" component={DeliveryPhotoUploadScreen} />
              <Stack.Screen name="DocumentsAndLicenses" component={DocumentsAndLicensesScreen} />
              <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
              <Stack.Screen name="PickupConfirm" component={PickupConfirmScreen} />
              <Stack.Screen name="PickupMap" component={PickupMapScreen} />

              <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
              <Stack.Screen name="OngoingOrders" component={OngoingOrdersScreen} />
              <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
              <Stack.Screen name="CustomerOrderDetails" component={CustomerOrderDetailsScreen} />
              <Stack.Screen name="CustomerProfileScreen" component={CustomerProfileScreen} />
              <Stack.Screen name="EditCustomerProfile" component={EditCustomerProfileScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
