import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Pusher from "pusher-js/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import { userLogout } from '../../api/authApi';
import styles from '../../assets/styles/driverDashboard';

import Footer from '../../components/Footer';

const DriverDashboardScreen = () => {
    const navigation = useNavigation();
    const driver = useSelector(state => state.user.user) || {};

    const [loading, setLoading] = useState(true);
    const [hasVehicle, setHasVehicle] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [active, setActive] = useState('home');

    // Extra Stats
    const [completedRides, setCompletedRides] = useState(18);
    const [todaysEarnings, setTodaysEarnings] = useState(2450);
    const [weeklyEarnings, setWeeklyEarnings] = useState(9230);

    useEffect(() => {

        if (!driver) return;

        const pusher = new Pusher("knkbsqrf5zbbhiusneob", {
            wsHost: "10.0.2.2",
            wsPort: 8080,
            forceTLS: false,
            encrypted: false,
            enabledTransports: ['ws'],
            disableStats: true,
            cluster: "mt1",
        });

        pusher.connection.bind('connected', () => {
            console.log("WEBSOCKET CONNECTED ✔");
        });

        const channel = pusher.subscribe("driver-channel");

        channel.bind("order.placed", (data) => {
            Alert.alert(
                "New Order",
                `Pickup: ${data.order.pickup_location}\nDrop: ${data.order.drop_location}\nPrice: ${data.order.price}`
            );
        });

        const loadVehicle = async () => {
            try {
                const res = await getVehicleByDriver(driver.id);
                setHasVehicle(res.status === true && res.data ? true : false);
            } catch {
                setHasVehicle(false);
            }
            setLoading(false);
        };

        loadVehicle();
        return () => pusher.disconnect();
    }, [driver]);

    const handleLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: performLogout }
            ]
        );
    };

    const performLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);

        try {
            const response = await userLogout();
            await AsyncStorage.removeItem("auth_token");

            Alert.alert("Success", response.message || "Logged out successfully.");

            navigation.reset({
                index: 0,
                routes: [{ name: "HomeScreen" }]
            });

        } catch (error) {
            Alert.alert("Logout Error", error.message);
        } finally {
            setLoggingOut(false);
        }
    };

    if (!driver) return null;

    const driverName = driver?.first_name || "Driver";
    const profilePic = driver?.driver_details?.profile_pic
        ? `${BASE_URL}/storage/${driver.driver_details.profile_pic}`
        : null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* HEADER */}
                <Card style={styles.headerCard}>
                    <View style={styles.headerContent}>
                        {profilePic ? (
                            <Avatar.Image size={scale(90)} source={{ uri: profilePic }} />
                        ) : (
                            <Avatar.Icon size={scale(90)} icon="account" />
                        )}

                        <Text variant="headlineSmall" style={styles.welcomeText}>
                            Welcome, {driverName} 👋
                        </Text>

                        <Text variant="bodyMedium" style={styles.subText}>
                            Ready for another productive day?
                        </Text>
                    </View>
                </Card>

                {/* STATISTICS ROW */}
                <View style={styles.statsRow}>
                    <Card style={styles.statsCard}>
                        <Card.Content>
                            <Text style={styles.statsValue}>{completedRides}</Text>
                            <Text style={styles.statsLabel}>Completed Rides</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.statsCard}>
                        <Card.Content>
                            <Text style={styles.statsValue}>₱{todaysEarnings}</Text>
                            <Text style={styles.statsLabel}>Today's Earnings</Text>
                        </Card.Content>
                    </Card>
                </View>

                <View style={styles.statsRow}>
                    <Card style={styles.statsCardLarge}>
                        <Card.Content>
                            <Text style={styles.statsValue}>₱{weeklyEarnings}</Text>
                            <Text style={styles.statsLabel}>Weekly Earnings</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* ONLINE STATUS */}
                <Surface style={styles.onlineCard}>
                    <View style={styles.onlineRow}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        <View
                            style={[styles.onlineDot, { backgroundColor: isOnline ? '#28a745' : '#d9534f' }]}
                        />
                        <Text style={styles.statusState}>{isOnline ? 'Online' : 'Offline'}</Text>
                    </View>

                    <Text style={styles.onlineDescription}>
                        {isOnline
                            ? 'You are available for delivery requests.'
                            : 'Switch to online to start receiving deliveries.'}
                    </Text>

                    <Button
                        mode="contained"
                        onPress={() => setIsOnline(!isOnline)}
                        style={styles.onlineButton}
                        buttonColor={isOnline ? '#d9534f' : '#8DB600'}
                    >
                        {isOnline ? 'Go Offline' : 'Go Online'}
                    </Button>
                </Surface>

                {/* MENU */}
                {isOnline && (
                    <View style={styles.cardList}>
                        {hasVehicle !== null && (
                            <Card
                                style={styles.itemCard}
                                onPress={() =>
                                    hasVehicle
                                        ? navigation.navigate('MyVehicle')
                                        : navigation.navigate('VehicleRegistration', { driver })
                                }
                            >
                                <Card.Title
                                    title={hasVehicle ? 'My Vehicle' : 'Register Vehicle'}
                                    titleStyle={styles.cardTitle}
                                    left={(props) => (
                                        <Avatar.Icon {...props} icon="car" backgroundColor="#8DB600" />
                                    )}
                                />
                            </Card>
                        )}

                        <Card
                            style={styles.itemCard}
                            onPress={() => navigation.navigate('DriverDeliveries', { driver })}
                        >
                            <Card.Title
                                title="Deliveries"
                                titleStyle={styles.cardTitle}
                                left={(props) => (
                                    <Avatar.Icon {...props} icon="truck-delivery" backgroundColor="#8DB600" />
                                )}
                            />
                        </Card>

                        <Card style={styles.itemCard} onPress={handleLogout}>
                            <Card.Title
                                title={loggingOut ? 'Logging out...' : 'Logout'}
                                titleStyle={[styles.cardTitle, loggingOut && { color: '#bbb' }]}
                                left={(props) => (
                                    <Avatar.Icon
                                        {...props}
                                        icon="logout"
                                        color={loggingOut ? '#bbb' : '#fff'}
                                        backgroundColor="#8DB600"
                                    />
                                )}
                            />
                        </Card>
                    </View>
                )}
            </ScrollView>

            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default DriverDashboardScreen;