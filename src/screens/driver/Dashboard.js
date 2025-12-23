import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
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
    Divider,
} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { BASE_URL } from '../../config/api';
import { getVehicleByDriver } from '../../api/vehicleApi';
import { userLogout, saveFcmToken } from '../../api/authApi';

import styles from '../../assets/styles/driverDashboard';
import Footer from '../../components/Footer';

const DriverDashboardScreen = () => {
    const navigation = useNavigation();
    const driver = useSelector(state => state.user.user);

    const [loading, setLoading] = useState(true);
    const [hasVehicle, setHasVehicle] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [active, setActive] = useState('home');

    // ---------------- INIT ----------------
    useEffect(() => {
        init();
    }, [driver]);

    const init = async () => {
        await loadOnlineStatus();

        if (driver?.id) {
            await initFCM();
            await loadVehicle();
        }

        setLoading(false); // ✅ ALWAYS stop loading
    };

    // ---------------- FCM ----------------
    const initFCM = async () => {
        try {
            await messaging().requestPermission();
            const token = await messaging().getToken();
            await saveFcmToken(token);
        } catch (e) {
            console.log('FCM ERROR:', e);
        }
    };

    // ---------------- LOADERS ----------------
    const loadOnlineStatus = async () => {
        const saved = await AsyncStorage.getItem('driver_online_status');
        if (saved !== null) {
            setIsOnline(JSON.parse(saved));
        }
    };

    const loadVehicle = async () => {
        try {
            const res = await getVehicleByDriver(driver.id);
            setHasVehicle(!!res?.data);
        } catch {
            setHasVehicle(false);
        }
    };

    // ---------------- LOGOUT ----------------
    const handleLogout = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: performLogout },
            ]
        );
    };

    const performLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);

        try {
            await userLogout();
            await AsyncStorage.multiRemove([
                'auth_token',
                'driver_online_status',
            ]);

            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } catch (e) {
            Alert.alert('Logout Error', e.message);
        } finally {
            setLoggingOut(false);
        }
    };

    // ---------------- ONLINE / OFFLINE ----------------
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

    // ---------------- LOADING UI ----------------
    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    // ---------------- SAFETY CHECK ----------------
    if (!driver) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Driver not loaded</Text>
            </SafeAreaView>
        );
    }

    // ---------------- UI DATA ----------------
    const driverName = driver.first_name || 'Driver';

    const profilePic = driver?.driver_details?.profile_pic
        ? `${BASE_URL}/storage/${driver.driver_details.profile_pic}`
        : null;

    // ---------------- RENDER ----------------
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* HEADER */}
                <Surface style={styles.headerCard}>
                    <View style={styles.headerRow}>
                        {profilePic ? (
                            <Avatar.Image size={scale(85)} source={{ uri: profilePic }} />
                        ) : (
                            <Avatar.Icon size={scale(85)} icon="account" />
                        )}

                        <View style={styles.headerInfo}>
                            <Text variant="headlineMedium" style={styles.welcomeText}>
                                Hello, {driverName}
                            </Text>
                            <Text style={styles.headerSubText}>
                                Waiting for new delivery requests 🚀
                            </Text>
                        </View>
                    </View>
                </Surface>

                {/* STATUS CARD */}
                <Surface style={styles.onlineCard}>
                    <View style={styles.onlineHeader}>
                        <Text style={styles.statusLabel}>Driver Status</Text>
                        <View
                            style={[
                                styles.statusDot,
                                { backgroundColor: isOnline ? '#28C76F' : '#EA5455' },
                            ]}
                        />
                        <Text style={styles.statusText}>
                            {isOnline ? 'Online' : 'Offline'}
                        </Text>
                    </View>

                    <Divider style={{ marginVertical: 10 }} />

                    <Text style={styles.statusSubText}>
                        {isOnline
                            ? 'You will receive delivery requests.'
                            : 'Go online to receive orders.'}
                    </Text>

                    <Button
                        mode="contained"
                        style={styles.statusButton}
                        onPress={toggleOnlineStatus}
                        buttonColor={isOnline ? '#EA5455' : '#28C76F'}
                    >
                        {isOnline ? 'Go Offline' : 'Go Online'}
                    </Button>
                </Surface>

                {/* MENU */}
                {isOnline && (
                    <View style={styles.menuList}>
                        <Card
                            style={styles.menuCard}
                            onPress={() =>
                                hasVehicle
                                    ? navigation.navigate('MyVehicle')
                                    : navigation.navigate('VehicleRegistration', { driver })
                            }
                        >
                            <Card.Title title={hasVehicle ? 'My Vehicle' : 'Register Vehicle'} />
                        </Card>

                        <Card
                            style={styles.menuCard}
                            onPress={() => navigation.navigate('DriverDeliveries')}
                        >
                            <Card.Title title="My Deliveries" />
                        </Card>

                        <Card style={styles.menuCard} onPress={handleLogout}>
                            <Card.Title title="Logout" />
                        </Card>
                    </View>
                )}

            </ScrollView>

            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default DriverDashboardScreen;
