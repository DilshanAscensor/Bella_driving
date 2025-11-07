import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../assets/theme/colors';
import { BASE_URL } from '../../config/api';
import { getVehicleByDriver } from '../../api/vehicleApi';
import { userLogout } from '../../api/authApi';

const DriverDashboardScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [loading, setLoading] = useState(true);
    const [hasVehicle, setHasVehicle] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);

    const { driver } = route.params || {};

    useEffect(() => {
        if (!driver) return;

        const loadVehicle = async () => {
            try {
                const res = await getVehicleByDriver(driver.id);

                if (res.status === true && res.data) {
                    setHasVehicle(true);
                } else {
                    setHasVehicle(false);
                }
            } catch (err) {
                setHasVehicle(false);
            }
            setLoading(false);
        };

        loadVehicle();
    }, [driver]);

    // ================= Logout Function =================
    const handleLogout = () => {
        if (loggingOut) return;

        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => performLogout() // call async function outside
                },
            ]
        );
    };

    // Actual async logout logic
    const performLogout = async () => {
        setLoggingOut(true);
        try {
            const response = await userLogout();

            await AsyncStorage.removeItem('auth_token');

            Alert.alert('Success', response.message || 'Logged out successfully.');

            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });

        } catch (error) {
            Alert.alert('Logout Error', error.message);
        } finally {
            setLoggingOut(false);
        }
    };

    // ===================================================

    if (!driver) return null;

    const driverName = driver?.first_name || 'Driver';
    const profilePic = driver?.driver_details?.profile_pic
        ? `${BASE_URL}/storage/${driver.driver_details.profile_pic}`
        : null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    {profilePic ? (
                        <Image
                            source={{ uri: profilePic }}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={require('../../assets/images/taxi-app-logo.webp')}
                            style={styles.profileImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
                <Text style={styles.welcomeText}>Welcome, {driverName} 👋</Text>
                <Text style={styles.subText}>Let’s get you on the road today!</Text>
            </View>

            {/* Dashboard Actions */}
            <View style={styles.cardContainer}>
                {/* <TouchableOpacity style={styles.card}>
                    <MaterialIcons name="directions-car" size={28} color={ACCENT_COLOR} />
                    <Text style={styles.cardText}>My Rides</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                    <MaterialIcons name="account-balance-wallet" size={28} color={ACCENT_COLOR} />
                    <Text style={styles.cardText}>Earnings</Text>
                </TouchableOpacity> */}
                {hasVehicle === false && (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('VehicleRegistration', { driver })}
                    >
                        <MaterialIcons name="directions-car" size={28} color={ACCENT_COLOR} />
                        <Text style={styles.cardText}>Register Vehicle</Text>
                    </TouchableOpacity>
                )}


                {/* <TouchableOpacity style={styles.card}>
                    <MaterialIcons name="settings" size={28} color={ACCENT_COLOR} />
                    <Text style={styles.cardText}>Settings</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('MyVehicle')}
                >
                    <MaterialIcons name="directions-car" size={28} color={ACCENT_COLOR} />
                    <Text style={styles.cardText}>My Vehicle</Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={handleLogout}
                    disabled={loggingOut}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="logout" size={28} color={loggingOut ? '#ccc' : ACCENT_COLOR} />
                    <Text style={[styles.cardText, loggingOut && { color: '#ccc' }]}>
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2025 Belle Driving Belle</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { alignItems: 'center', padding: 16 },
    profileContainer: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', marginBottom: 12 },
    profileImage: { width: '100%', height: '100%' },
    welcomeText: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    subText: { fontSize: 14, color: '#666' },
    cardContainer: { paddingHorizontal: 16, marginTop: 20 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 8,
        elevation: 2,
    },
    cardText: { marginLeft: 12, fontSize: 16, color: '#333' },
    footer: { alignItems: 'center', padding: 16 },
    footerText: { fontSize: 12, color: '#999' },
});

export default DriverDashboardScreen;
