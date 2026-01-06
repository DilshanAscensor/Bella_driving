import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Redux
import { Provider, useSelector } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

// UI
import { PaperProvider } from 'react-native-paper';

// Firebase / Notifications
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// Navigation helpers
import { navigationRef, navigate } from './src/navigation/NavigationService';

// Utils
import { playOrderSound } from './src/utils/notificationSound';
import apiClient from './src/api/apiClient';
import { isDriverOnline } from './src/utils/driverStatus';

// Navigators
import DriverNavigator from './src/navigation/DriverNavigator';
import CustomerNavigator from './src/navigation/CustomerNavigator';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/WelcomScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpScreen from './src/screens/login/OtpVerificationScreen';

const Stack = createNativeStackNavigator();

/* ======================================================
   ROOT NAVIGATOR
====================================================== */
const RootNavigator = () => {
  const user = useSelector(state => state.user.user);
  const hasNavigatedRef = useRef(false);

  /* ================= ACTIVE ORDER RESUME ================= */
  const checkActiveOrder = async () => {
    if (!user || user.role !== 'driver') return;

    const online = await isDriverOnline();
    if (!online) return;

    if (hasNavigatedRef.current) return;

    try {
      const res = await apiClient.get('/drivers/active-order');
      const order = res?.data?.data;
      if (!order) return;

      hasNavigatedRef.current = true;

      switch (order.status) {
        case 'accepted':
          navigate('PickupConfirm', { order_id: order.id });
          break;
        case 'picked_up':
          navigate('PickupPhotoUpload', { order_id: order.id });
          break;
        case 'on_the_way':
          navigate('DeliveryMap', { order_id: order.id });
          break;
        default:
          hasNavigatedRef.current = false;
      }
    } catch {
      hasNavigatedRef.current = false;
    }
  };

  /* ================= SIDE EFFECTS ================= */
  useEffect(() => {
    notifee.requestPermission();

    notifee.createChannel({
      id: 'orders',
      name: 'Orders',
      importance: AndroidImportance.HIGH,
      sound: 'order_sound',
    });

    /* ---------- AppState ---------- */
    const appStateSub = AppState.addEventListener('change', async state => {
      if (state === 'active') {
        await checkActiveOrder();
      }
    });

    /* ---------- Cold Start ---------- */
    messaging().getInitialNotification().then(async remoteMessage => {
      const online = await isDriverOnline();
      if (!online) return;

      if (remoteMessage?.data?.type === 'new_order') {
        navigate('AcceptDeliveryScreen', {
          order_id: remoteMessage.data.order_id,
        });
      }
    });

    /* ---------- Background ---------- */
    const unsubscribeBackground =
      messaging().onNotificationOpenedApp(async remoteMessage => {
        const online = await isDriverOnline();
        if (!online) return;

        if (remoteMessage?.data?.type === 'new_order') {
          navigate('AcceptDeliveryScreen', {
            order_id: remoteMessage.data.order_id,
          });
        }
      });

    /* ---------- Foreground ---------- */
    const unsubscribeForeground =
      messaging().onMessage(async remoteMessage => {
        const online = await isDriverOnline();
        if (!online) return;

        if (remoteMessage?.data?.type === 'new_order') {
          await notifee.displayNotification({
            title: 'New Order Available',
            body: 'Tap to accept the order',
            android: {
              channelId: 'orders',
              sound: 'order_sound',
              importance: AndroidImportance.HIGH,
              pressAction: { id: 'default' },
            },
            data: remoteMessage.data,
          });

          playOrderSound();
        }
      });

    /* ---------- Notifee Press ---------- */
    const unsubscribeNotifee =
      notifee.onForegroundEvent(async ({ type, detail }) => {
        if (type !== EventType.PRESS) return;

        const online = await isDriverOnline();
        if (!online) return;

        const data = detail.notification?.data;
        if (data?.type === 'new_order') {
          navigate('AcceptDeliveryScreen', {
            order_id: data.order_id,
          });
        }
      });

    return () => {
      appStateSub.remove();
      unsubscribeForeground();
      unsubscribeBackground();
      unsubscribeNotifee();
    };
  }, [user?.id]);

  /* ================= ROUTING ================= */
  if (user === undefined) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
      </Stack.Navigator>
    );
  }

  return user.role === 'driver'
    ? <DriverNavigator />
    : <CustomerNavigator />;
};

/* ======================================================
   APP ROOT
====================================================== */
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
