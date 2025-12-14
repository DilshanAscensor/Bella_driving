import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ACCENT_COLOR } from '../../assets/theme/colors';
import { BASE_URL } from '../../config/api';
import { userLogout } from '../../api/authApi';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomerDashboardScreen = () => {
    const navigation = useNavigation();

    const [loggingOut, setLoggingOut] = useState(false);
    const customer = useSelector(state => state.user.user) || {};

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

    const customerName = customer?.first_name || 'Customer';
    const profilePic = customer?.profile_pic
        ? `${BASE_URL}/storage/${customer.profile_pic}`
        : null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <Image
                        source={
                            profilePic
                                ? { uri: profilePic }
                                : require('../../assets/images/mickaido-main-logo.png')
                        }
                        style={styles.profileImage}
                    />
                </View>

                <Text style={styles.welcomeText}>Hello, {customerName} 👋</Text>
                <Text style={styles.subText}>What would you like to do today?</Text>
            </View>

            {/* ACTION CARDS */}
            <View style={styles.cardContainer}>

                {/* <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("CreateOrderScreen")}
                >
                    <MaterialIcons name="add-shopping-cart" size={28} color={ACCENT_COLOR} />
                    <Text style={styles.cardText}>Place New Order</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("OngoingOrders")}
                >
                    <MaterialIcons name="directions-bike" size={28} color={ACCENT_COLOR} />
                    <Text style={styles.cardText}>Ongoing Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("OrderHistory")}
                >
                    <MaterialIcons name="history" size={28} color={ACCENT_COLOR} />
                    <Text style={styles.cardText}>Order History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("CustomerProfileScreen")}
                >
                    <MaterialIcons name="account-circle" size={28} color={ACCENT_COLOR} />
                    <Text style={styles.cardText}>Profile Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={handleLogout}
                    disabled={loggingOut}
                >
                    <MaterialIcons name="logout" size={28} color={loggingOut ? '#aaa' : ACCENT_COLOR} />
                    <Text style={[styles.cardText, loggingOut && { color: '#aaa' }]}>
                        {loggingOut ? "Logging out..." : "Logout"}
                    </Text>
                </TouchableOpacity>

            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2025 Belle Driving Belle</Text>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    header: { alignItems: 'center', padding: 20 },
    profileContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        overflow: 'hidden',
        marginBottom: 10,
    },
    profileImage: { width: '100%', height: '100%' },

    welcomeText: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    subText: { fontSize: 14, color: '#555' },

    cardContainer: { paddingHorizontal: 16, marginTop: 10 },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 8,
        elevation: 3,
    },
    cardText: { marginLeft: 12, fontSize: 16, fontWeight: '500', color: '#333' },

    footer: { alignItems: 'center', padding: 20 },
    footerText: { color: '#999', fontSize: 12 },
});

export default CustomerDashboardScreen;
