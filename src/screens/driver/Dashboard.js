import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/api';
import { getVehicleByDriver } from '../../api/vehicleApi';
import { userLogout } from '../../api/authApi';
import Footer from '../../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../../assets/styles/driverDashboard';

const DriverDashboardScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [loading, setLoading] = useState(true);
    const [hasVehicle, setHasVehicle] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const [active, setActive] = useState("home");
    const [isOnline, setIsOnline] = useState(false);

    const driver = useSelector(state => state.user.user) || {};
    const styles = Styles;
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
                    onPress: () => performLogout()
                },
            ]
        );
    };

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
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
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

                <View style={styles.onlineCard}>
                    <View style={styles.onlineStatusRow}>
                        <Text style={styles.onlineLabel}>Status:</Text>

                        <View style={[
                            styles.onlineDot,
                            { backgroundColor: isOnline ? "#28a745" : "#d9534f" }
                        ]} />

                        <Text style={styles.onlineStateText}>
                            {isOnline ? "Online" : "Offline"}
                        </Text>
                    </View>

                    <Text style={styles.onlineDescription}>
                        {isOnline
                            ? "You are now receiving delivery requests."
                            : "You are currently offline. Go online to activate your dashboard."
                        }
                    </Text>

                    <TouchableOpacity
                        onPress={() => setIsOnline(!isOnline)}
                        activeOpacity={0.9}
                        style={[
                            styles.onlineButton,
                            { backgroundColor: isOnline ? "#d9534f" : "#8DB600" }
                        ]}
                    >
                        <Text style={styles.onlineButtonText}>
                            {isOnline ? "Go Offline" : "Go Online"}
                        </Text>
                    </TouchableOpacity>
                </View>


                {/* SHOW THESE ONLY IF ONLINE */}
                {isOnline && (
                    <View style={styles.cardContainer}>

                        {hasVehicle === false && (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => navigation.navigate('VehicleRegistration', { driver })}
                            >
                                <MaterialIcons name="directions-car" size={28} color={styles.ACCENT_COLOR} />
                                <Text style={styles.cardText}>Register Vehicle</Text>
                            </TouchableOpacity>
                        )}

                        {hasVehicle === true && (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => navigation.navigate('MyVehicle')}
                            >
                                <MaterialIcons name="directions-car" size={28} color={styles.ACCENT_COLOR} />
                                <Text style={styles.cardText}>My Vehicle</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('DriverDeliveries', { driver })}
                        >
                            <MaterialIcons name="local-shipping" size={28} color={styles.ACCENT_COLOR} />
                            <Text style={styles.cardText}>Deliveries</Text>
                        </TouchableOpacity>

                        {/* Logout */}
                        <TouchableOpacity
                            style={styles.card}
                            onPress={handleLogout}
                            disabled={loggingOut}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="logout" size={28} color={loggingOut ? '#ccc' : styles.ACCENT_COLOR} />
                            <Text style={[styles.cardText, loggingOut && { color: '#ccc' }]}>
                                {loggingOut ? 'Logging out...' : 'Logout'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}


            </ScrollView>
            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default DriverDashboardScreen;
