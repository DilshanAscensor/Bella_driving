import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
/* ================= REDUX ================= */
import { Provider, useSelector } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

/* ================= UI ================= */
import { PaperProvider } from 'react-native-paper';

/* ================= FIREBASE ================= */
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

/* ================= NAVIGATION ================= */
import { navigationRef, navigate, onNavigationReady } from './src/navigation/NavigationService';

/* ================= UTILS ================= */
import { playOrderSound, stopOrderSound } from './src/utils/notificationSound';
import apiClient from './src/api/apiClient';
import { isDriverOnline } from './src/utils/driverStatus';
import { isCameraActive } from './src/utils/appLock';

/* ================= NAVIGATORS ================= */
import DriverNavigator from './src/navigation/DriverNavigator';
import CustomerNavigator from './src/navigation/CustomerNavigator';
import VehicleOwnerNavigator from './src/navigation/VehicleOwnerNavigator';

/* ================= SCREENS ================= */
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/WelcomScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpScreen from './src/screens/login/OtpVerificationScreen';
import DriverRegistration from './src/screens/driver/DriverRegistrationScreen';
import RegistrationScreen from './src/screens/customer/RegistrationScreen';
import VehicleOwnerRegistration from './src/screens/vehicleOwner/VehicleOwnerRegisterScreen';

const Stack = createNativeStackNavigator();

/* ======================================================
   ROOT NAVIGATOR
====================================================== */
const RootNavigator = () => {
  const user = useSelector(state => state.user.user);

  // 🔒 Prevent duplicate navigation PER ORDER
  const lastNavigatedOrderRef = useRef(null);

  /* ================= SAFE ACCEPT NAV ================= */
  const safeNavigateToAccept = (orderId) => {
    if (!orderId) return;

    if (lastNavigatedOrderRef.current === orderId) return;

    lastNavigatedOrderRef.current = orderId;
    console.log('Navigating to Accept Delivery for order:', orderId);
    navigate('AcceptDeliveryScreen', { order_id: orderId });
  };

  /* ================= ACTIVE ORDER RESUME ================= */
  const checkActiveOrder = async () => {
    if (!user || user.role !== 'driver') return;

    const online = await isDriverOnline();
    if (!online) return;

    try {
      const res = await apiClient.get('/drivers/active-order');
      const order = res?.data?.data;

      if (!order) {
        lastNavigatedOrderRef.current = null;
        return;
      }

      lastNavigatedOrderRef.current = order.id;

      switch (order.status) {
        case 'accepted':
          navigate('PickupMap', { order_id: order.id });
          break;
        case 'way_to_pickup':
          navigate('PickupConfirm', { order_id: order.id });
          break;
        case 'picked_up':
          navigate('PickupPhotoUpload', { order_id: order.id });
          break;
        case 'on_the_way':
          navigate('DeliveryMap', { order_id: order.id });
          break;
      }
    } catch {
      lastNavigatedOrderRef.current = null;
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

    /* ---------- APP STATE ---------- */
    const appStateSub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        if (isCameraActive()) return;
        checkActiveOrder();
      } else {
        stopOrderSound(); // 🔇 STOP SOUND WHEN APP BACKGROUNDS
      }
    });
    /* ---------- COLD START ---------- */
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage?.data?.type === 'new_order') {
        safeNavigateToAccept(remoteMessage.data.order_id);
      }
    });

    /* ---------- BACKGROUND ---------- */
    const unsubscribeBackground =
      messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage?.data?.type === 'new_order') {
          safeNavigateToAccept(remoteMessage.data.order_id);
        }
      });

    /* ---------- FOREGROUND ---------- */
    const unsubscribeForeground =
      messaging().onMessage(async remoteMessage => {

        // 🔔 NEW ORDER
        if (remoteMessage?.data?.type === 'new_order') {
          const online = await isDriverOnline();
          if (!online) return;

          const hasActiveOrder = await checkDriverActiveOrder(); // NEW

          if (hasActiveOrder) {
            stopOrderSound(); // 🔇 stop immediately
            return; // 🚫 do not open accept screen
          }

          playOrderSound();
          safeNavigateToAccept(remoteMessage.data.order_id);
        }


        if (remoteMessage?.data?.type === 'order_cancelled') {
          stopOrderSound();

          notifee.displayNotification({
            id: `order_${remoteMessage.data.order_id}`,
            title: 'Order Cancelled',
            body: 'Order was accepted by another driver',
            android: {
              channelId: 'orders',
              importance: AndroidImportance.HIGH,
            },
          });

          navigationRef.resetRoot({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          });
        }
      });

    const checkDriverActiveOrder = async () => {
      try {
        const res = await apiClient.get('/drivers/active-order');
        return !!res?.data?.data;
      } catch {
        return false;
      }
    };


    /* ---------- NOTIFEE PRESS ---------- */
    const unsubscribeNotifee =
      notifee.onForegroundEvent(({ type, detail }) => {
        if (type !== EventType.PRESS) return;

        const data = detail.notification?.data;
        if (data?.type === 'new_order') {
          safeNavigateToAccept(data.order_id);
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
        <Stack.Screen name="DriverRegistration" component={DriverRegistration} />
        <Stack.Screen name="CustomerRegistration" component={RegistrationScreen} />
        <Stack.Screen name="VehicleOwnerRegistration" component={VehicleOwnerRegistration} />
      </Stack.Navigator>
    );
  }
  if (user.role === 'customer') {
    return <CustomerNavigator />;
  }

  if (user.role === 'driver') {
    return <DriverNavigator />;
  }
  return <VehicleOwnerNavigator />;


};

/* ======================================================
   APP ROOT
====================================================== */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                onNavigationReady();
              }}
            >
              <RootNavigator />
            </NavigationContainer>
          </PaperProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
