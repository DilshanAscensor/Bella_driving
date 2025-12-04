import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import {
    Avatar,
    Text,
    Button,
    Card,
    Surface,
    Divider
} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { BASE_URL } from '../../config/api';
import { getVehicleByDriver } from '../../api/vehicleApi';
import { userLogout } from '../../api/authApi';
import { fetchNewOrders } from '../../api/order';
import { setNewOrder } from '../../redux/slices/orderSlice';
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
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [orderState, setOrderState] = useState([]);


    // Stats (placeholder)
    const [completedRides] = useState(18);
    const [todaysEarnings] = useState(2450);
    const [weeklyEarnings] = useState(9230);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!driver) return;

        const loadStatus = async () => {
            const savedStatus = await AsyncStorage.getItem("driver_online_status");
            if (savedStatus !== null) {
                setIsOnline(JSON.parse(savedStatus));
            }
        };

        const loadVehicle = async () => {
            try {
                const res = await getVehicleByDriver(driver.id);
                setHasVehicle(res.status === true && res.data ? true : false);
            } catch {
                setHasVehicle(false);
            }
            setLoading(false);
        };
        loadStatus();
        loadVehicle();
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
            await AsyncStorage.removeItem("driver_online_status");
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


    const playOrderSound = () => {
        let sound;

        if (Platform.OS === 'ios') {
            // iOS uses require()
            sound = new Sound(
                require('../../assets/sounds/order_notification.mp3'),
                (error) => {
                    if (error) {
                        console.log("Sound loading failed:", error);
                        return;
                    }
                    sound.play();
                }
            );
        } else {
            // Android uses raw folder
            sound = new Sound('order_notification.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log("Sound loading failed:", error);
                    return;
                }
                sound.play();
            });
        }
    };


    const handleGetNewOrders = async () => {
        try {
            setLoadingOrders(true);

            const order = await fetchNewOrders();

            if (!order) {
                Alert.alert("No Orders", "No new orders available right now.");
                return;
            }

            dispatch(setNewOrder(order));
            setOrderState(order);

            // 🔥 PLAY TONE HERE
            playOrderSound();

            // 🔥 THEN NAVIGATE
            navigation.navigate("AcceptDeliveryScreen");

        } catch (error) {
            Alert.alert("Error", "Failed to fetch orders.");
        } finally {
            setLoadingOrders(false);
        }
    };

    const toggleOnlineStatus = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        await AsyncStorage.setItem("driver_online_status", JSON.stringify(newStatus));
    };

    const driverName = driver?.first_name || "Driver";
    const profilePic = driver?.driver_details?.profile_pic
        ? `${BASE_URL}/storage/${driver.driver_details.profile_pic}`
        : null;

    const renderOrderItem = ({ item }) => (
        <Card style={{ marginBottom: 10, padding: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Order Code: {item.order_code}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: ₱{item.total_amount}</Text>
            <Text>Customer: {item.place?.delivery_name}</Text>
            <Text>Pickup: {item.place?.pickup_name}</Text>
        </Card>
    );

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
                                Let's make today productive 🚀
                            </Text>
                        </View>
                    </View>
                </Surface>

                {isOnline && (
                    <>
                        <View style={{ flex: 1, padding: 15 }}>
                            <Button
                                mode="contained"
                                onPress={handleGetNewOrders}
                                loading={loadingOrders}
                                disabled={loadingOrders}
                                style={{ marginBottom: 15, borderRadius: 8 }}
                                buttonColor={"#8DB600"}
                            >
                                {loadingOrders ? "Loading..." : "Get New Orders"}
                            </Button>
                        </View>
                    </>
                )}
                {/* STATISTICS */}
                <View style={styles.sectionHeaderWrap}>
                    <Text style={styles.sectionHeader}>Your Stats</Text>
                </View>

                <View style={styles.statsRow}>
                    <Card style={styles.statsCard}>
                        <Card.Content>
                            <Text style={styles.statsValue}>{completedRides}</Text>
                            <Text style={styles.statsLabel}>Completed Rides</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.statsCard}>
                        <Card.Content>
                            <Text style={styles.statsValue}>Rs. {todaysEarnings}</Text>
                            <Text style={styles.statsLabel}>Today’s Earnings</Text>
                        </Card.Content>
                    </Card>
                </View>

                <Card style={styles.statsCardWide}>
                    <Card.Content>
                        <Text style={styles.statsValue}>Rs. {weeklyEarnings}</Text>
                        <Text style={styles.statsLabel}>Weekly Earnings</Text>
                    </Card.Content>
                </Card>


                {/* ONLINE STATUS */}
                <Surface style={styles.onlineCard}>
                    <View style={styles.onlineHeader}>
                        <Text style={styles.statusLabel}>Driver Status</Text>
                        <View
                            style={[
                                styles.statusDot,
                                { backgroundColor: isOnline ? "#28C76F" : "#EA5455" }
                            ]}
                        />
                        <Text style={styles.statusText}>
                            {isOnline ? "Online" : "Offline"}
                        </Text>
                    </View>

                    <Divider style={{ marginVertical: 10 }} />

                    <Text style={styles.statusSubText}>
                        {isOnline
                            ? "You are currently accepting delivery requests."
                            : "Switch to Online to receive new delivery tasks."}
                    </Text>

                    <Button
                        mode="contained"
                        style={styles.statusButton}
                        onPress={toggleOnlineStatus}
                        buttonColor={isOnline ? "#EA5455" : "#28C76F"}
                    >
                        {isOnline ? "Go Offline" : "Go Online"}
                    </Button>
                </Surface>


                {/* MENU */}
                {isOnline && (
                    <>
                        <View style={styles.sectionHeaderWrap}>
                            <Text style={styles.sectionHeader}>Menu</Text>
                        </View>

                        <View style={styles.menuList}>

                            {/* VEHICLE */}
                            {hasVehicle !== null && (
                                <Card
                                    style={styles.menuCard}
                                    onPress={() =>
                                        hasVehicle
                                            ? navigation.navigate('MyVehicle')
                                            : navigation.navigate('VehicleRegistration', { driver })
                                    }
                                >
                                    <Card.Title
                                        title={hasVehicle ? "My Vehicle" : "Register Vehicle"}
                                        titleStyle={styles.menuTitle}
                                        left={(props) => (
                                            <Avatar.Icon {...props} icon="car" style={styles.menuIcon} />
                                        )}
                                    />
                                </Card>
                            )}

                            {/* DELIVERIES */}
                            <Card
                                style={styles.menuCard}
                                onPress={() => navigation.navigate('DriverDeliveries', { driver })}
                            >
                                <Card.Title
                                    title="Deliveries"
                                    titleStyle={styles.menuTitle}
                                    left={(props) => (
                                        <Avatar.Icon {...props} icon="truck-delivery" style={styles.menuIcon} />
                                    )}
                                />
                            </Card>

                            {/* LOGOUT */}
                            <Card style={styles.menuCard} onPress={handleLogout}>
                                <Card.Title
                                    title={loggingOut ? "Logging Out..." : "Logout"}
                                    titleStyle={[
                                        styles.menuTitle,
                                        loggingOut && { color: "#aaa" }
                                    ]}
                                    left={(props) => (
                                        <Avatar.Icon
                                            {...props}
                                            icon="logout"
                                            style={styles.menuIcon}
                                        />
                                    )}
                                />
                            </Card>
                        </View>
                    </>
                )}

            </ScrollView>

            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default DriverDashboardScreen;
