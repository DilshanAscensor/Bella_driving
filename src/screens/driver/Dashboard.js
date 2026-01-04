import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {
    PRIMARY_COLOR,
    TEXT_DARK,
} from '../../assets/theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import {
    Avatar,
    Text,
    Button,
    Card,
    Surface,
} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { BASE_URL } from '../../config/api';
import { getVehicleByDriver } from '../../api/vehicleApi';
import { userLogout, saveFcmToken } from '../../api/authApi';
import apiClient from '../../api/apiClient';

import styles from '../../assets/styles/driverDashboard';
import Footer from '../../components/Footer';

const DriverDashboardScreen = () => {
    const navigation = useNavigation();
    const driver = useSelector(state => state.user.user);

    const [loading, setLoading] = useState(true);
    const [hasVehicle, setHasVehicle] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [active, setActive] = useState('home');

    useEffect(() => {
        if (driver?.id) {
            init();
        }
    }, [driver]);

    /* ================= ACTIVE ORDER CHECK ================= */
    const checkActiveOrder = async () => {
        try {
            const res = await apiClient.get('/driver/active-order');
            const order = res?.data?.data;

            if (!order) return;

            if (order.status === 'accepted') {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AcceptDeliveryScreen', params: { order_id: order.id } }],
                });
            }

            if (order.status === 'picked_up') {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'PickupConfirm', params: { order_id: order.id } }],
                });
            }

            if (order.status === 'on_the_way') {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'DeliveryMap', params: { order_id: order.id } }],
                });
            }
        } catch (e) {
            // ignore
        }
    };

    /* ================= INIT ================= */
    const init = async () => {
        await loadOnlineStatus();

        await initFCM();
        await loadVehicle();

        setLoading(false);
    };

    /* ================= FCM ================= */
    const initFCM = async () => {
        try {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (!enabled) return;

            const token = await messaging().getToken();
            await saveFcmToken(token);
        } catch (e) {
            console.log('FCM error', e);
        }
    };

    /* ================= DATA ================= */
    const loadOnlineStatus = async () => {
        const saved = await AsyncStorage.getItem('driver_online_status');
        if (saved !== null) setIsOnline(JSON.parse(saved));
    };

    const loadVehicle = async () => {
        try {
            const res = await getVehicleByDriver(driver.id);
            setHasVehicle(!!res?.data);
        } catch {
            setHasVehicle(false);
        }
    };

    /* ================= LOGOUT ================= */
    const handleLogout = async () => {
        try {
            const res = await apiClient.get('/driver/active-order');

            if (res.data?.data) {
                Alert.alert(
                    'Active Order',
                    'You must complete the active order before logging out'
                );
                return;
            }

            Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', style: 'destructive', onPress: performLogout },
                ]
            );
        } catch {
            performLogout();
        }
    };

    const performLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);

        try {
            await userLogout();
            await AsyncStorage.multiRemove(['auth_token', 'driver_online_status']);

            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } finally {
            setLoggingOut(false);
        }
    };

    /* ================= ONLINE / OFFLINE ================= */
    const toggleOnlineStatus = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);

        await AsyncStorage.setItem(
            'driver_online_status',
            JSON.stringify(newStatus)
        );

        if (newStatus) {
            const token = await messaging().getToken();
            await saveFcmToken(token);
        }
    };

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!driver) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>Driver not loaded</Text>
            </SafeAreaView>
        );
    }

    const driverName = driver.first_name || 'Driver';
    const profilePic = driver?.driver_details?.profile_pic
        ? `${BASE_URL}/storage/${driver.driver_details.profile_pic}`
        : null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ================= HEADER ================= */}
                <Surface style={styles.headerCard}>
                    <View style={styles.headerRow}>
                        {profilePic ? (
                            <Avatar.Image size={scale(72)} source={{ uri: profilePic }} />
                        ) : (
                            <Avatar.Icon size={scale(72)} icon="account" />
                        )}

                        <View style={styles.headerInfo}>
                            <Text style={styles.greeting}>Welcome back</Text>
                            <Text style={styles.driverName}>{driverName}</Text>
                        </View>
                    </View>
                </Surface>

                {/* ================= STATUS ================= */}
                <Surface style={styles.statusCard}>
                    <View style={styles.statusTop}>
                        <View>
                            <Text style={styles.statusTitle}>Driver Status</Text>
                            <Text style={styles.statusDesc}>
                                {isOnline
                                    ? 'You are available for deliveries'
                                    : 'Go online to receive orders'}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: isOnline ? '#2ECC71' : '#E74C3C' },
                            ]}
                        >
                            <Text style={styles.statusBadgeText}>
                                {isOnline ? 'ONLINE' : 'OFFLINE'}
                            </Text>
                        </View>
                    </View>
                    <Button
                        mode="contained"
                        onPress={toggleOnlineStatus}
                        style={[
                            styles.statusButton,
                            { backgroundColor: isOnline ? '#E74C3C' : PRIMARY_COLOR },
                        ]}
                        labelStyle={{
                            color: '#FFFFFF',
                            fontSize: scale(15),
                            fontWeight: '700',
                        }}
                    >
                        {isOnline ? 'Go Offline' : 'Go Online'}
                    </Button>
                </Surface>

                {/* ================= MENU ================= */}
                <View style={styles.menuList}>
                    <Card
                        style={styles.menuCard}
                        onPress={() =>
                            hasVehicle
                                ? navigation.navigate('MyVehicle')
                                : navigation.navigate('VehicleRegistration', { driver })
                        }
                    >
                        <Card.Title
                            title="Register Vehicle"
                            titleStyle={{
                                color: TEXT_DARK,
                                fontWeight: '600',
                                fontSize: scale(15),
                            }}
                            left={(props) => (
                                <Avatar.Icon
                                    {...props}
                                    icon="truck"
                                    color={PRIMARY_COLOR}
                                    style={styles.iconStyle}
                                />
                            )}
                        />

                    </Card>

                    <Card
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('DriverDeliveries')}
                    >
                        <Card.Title
                            title="My Deliveries"
                            titleStyle={{
                                color: TEXT_DARK,
                                fontWeight: '600',
                                fontSize: scale(15),
                            }}
                            left={(props) => (
                                <Avatar.Icon
                                    {...props}
                                    icon="package-variant"
                                    color={PRIMARY_COLOR}
                                    style={styles.iconStyle}
                                />
                            )}
                        />
                    </Card>

                    <Card
                        style={[styles.menuCard, styles.logoutCard]}
                        onPress={handleLogout}
                    >
                        <Card.Title
                            title="Logout"
                            titleStyle={{
                                color: '#D32F2F',
                                fontWeight: '600',
                                fontSize: scale(15),
                            }}
                            left={(props) => (
                                <Avatar.Icon
                                    {...props}
                                    icon="logout"
                                    color="#D32F2F"
                                    style={styles.iconLogoutStyle}
                                />
                            )}
                        />
                    </Card>

                </View>

            </ScrollView>

            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};


export default DriverDashboardScreen;
