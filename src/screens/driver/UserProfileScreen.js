import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../config/api';
import { getDriverDetails } from '../../api/user';
import { setUser } from '../../redux/slices/userSlice';
import Footer from '../../components/Footer';
import Styles from '../../assets/styles/driverProfile';
import { scale } from 'react-native-size-matters';
import { userLogout } from '../../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';


const resolveFileUrl = (path) => {
    if (!path) return null;
    return `${BASE_URL}/storage/${String(path).replace(/^\/+/, '')}`;
};

const UserProfileScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [active, setActive] = useState('profile');
    const [loggingOut, setLoggingOut] = useState(false);
    const user = useSelector((state) => state.user.user) || {};

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const styles = Styles;

    const fetchDriver = useCallback(async () => {
        if (!user?.id) {
            setError('User ID not found.');
            setLoading(false);
            return;
        }

        try {
            const response = await getDriverDetails(user.id);
            if (response?.status && response.data) {
                dispatch(setUser(response.data));
            } else {
                setError('Driver details not found.');
            }
        } catch (err) {
            setError('Failed to load driver details.');
        } finally {
            setLoading(false);
        }
    }, [user?.id, dispatch]);

    useEffect(() => {
        fetchDriver();
    }, [fetchDriver]);


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


    const d = user.driver_details;

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1e3a8a" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!d) {
        return (
            <View style={styles.centered}>
                <Text>No driver details found.</Text>
            </View>
        );
    }

    const profilePic = resolveFileUrl(d.profile_pic);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: scale(100) }}
            >
                <View style={styles.profileCard}>
                    <View style={styles.profileLeft}>
                        {profilePic ? (
                            <Image source={{ uri: profilePic }} style={styles.profileAvatar} />
                        ) : (
                            <View style={styles.profileAvatarPlaceholder}>
                                <MaterialIcons name="person" size={55} color="#8DB600" />
                            </View>
                        )}
                    </View>

                    <View style={styles.profileRight}>
                        <Text style={styles.profileName}>
                            {user.first_name} {user.last_name}
                        </Text>
                        <View style={styles.ratingContainer}>
                            <MaterialIcons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>
                                {d.rating ? d.rating.toFixed(1) : '0.0'} Rating
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Personal Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Personal Details</Text>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="badge" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>NIC: {d.nic}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="person" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>Gender: {d.gender}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="place" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>District: {d.district}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="calendar-today" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>DOB: {d.dob}</Text>
                    </View>
                </View>

                {/* License Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>License Information</Text>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="credit-card" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>
                            License Number: {d.license_number}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="event" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>
                            License Expiry: {d.license_expiry}
                        </Text>
                    </View>
                </View>

                <View style={styles.actionButtonsContainer}>
                    {/* Documents & Licenses */}
                    <TouchableOpacity
                        style={styles.actionButtonWhite}
                        onPress={() => navigation.navigate('DocumentsAndLicenses')}
                    >
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionButtonTitle}>Documents & Licenses</Text>
                            <Text style={styles.actionButtonSubtitle}>View all your documents</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={28} color="#8DB600" />
                    </TouchableOpacity>

                    {/* Vehicle Information */}
                    <TouchableOpacity
                        style={styles.actionButtonWhite}
                        onPress={() => navigation.navigate('MyVehicle')}
                    >
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionButtonTitle}>Vehicle Information</Text>
                            <Text style={styles.actionButtonSubtitle}>View your vehicle details</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={28} color="#8DB600" />
                    </TouchableOpacity>

                    {/* Log Out */}
                    <TouchableOpacity
                        style={[styles.actionButtonWhite, styles.logoutButtonWhite]}
                        onPress={handleLogout}
                    >
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.logoutActionButtonTitle}>Log Out</Text>
                            {/* <Text style={styles.actionButtonSubtitle}>Sign out from your account</Text> */}
                        </View>
                        <MaterialIcons name="logout" size={28} color="#ef4444" />
                    </TouchableOpacity>
                </View>


                {/* Edit Button */}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditDriverProfile')}
                >
                    <MaterialIcons name="edit" size={22} color="#fff" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </ScrollView>

            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default UserProfileScreen;
