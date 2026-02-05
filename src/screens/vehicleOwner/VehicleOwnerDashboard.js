import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Alert,
    Image,
    Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
import { ACCENT_COLOR } from '../../assets/theme/colors';
import { userLogout } from '../../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUser } from '../../redux/slices/userSlice';
import { persistor } from '../../redux/store';
import { BASE_URL } from '../../config/api';
import { getMyVehicles } from '../../api/vehicleApi';

const { width } = Dimensions.get('window');

const VehicleOwnerDashboard = ({ navigation }) => {
    const owner = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const profilePic = owner?.vehicle_owner_details?.profile_pic;
    const imageUrl = profilePic
        ? `${BASE_URL}/storage/${profilePic}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            owner?.first_name || 'Owner'
        )}&background=6366f1&color=fff&size=256`;

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const res = await getMyVehicles();
            setVehicles(res?.vehicles || []);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            Alert.alert('Error', 'Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: performLogout },
        ]);
    };

    const performLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);

        try {
            await userLogout();
            await AsyncStorage.multiRemove(['auth_token']);
            dispatch(clearUser());
            await persistor.purge();
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } catch (e) {
            Alert.alert('Sign out failed', 'Please try again.');
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Image source={{ uri: imageUrl }} style={styles.avatar} />
                    <Text style={styles.greeting}>
                        Hello, {owner?.first_name || 'Owner'}
                    </Text>
                    <Text style={styles.subtitle}>Fleet Dashboard</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    {[
                        {
                            icon: 'local-taxi',
                            label: 'Vehicles',
                            value: vehicles.length,
                            color: ACCENT_COLOR,
                        },
                        {
                            icon: 'verified-user',
                            label: 'Status',
                            value: 'Active',
                            color: '#122948',
                        },
                        // {
                        //     icon: 'attach-money',
                        //     label: 'This Month',
                        //     value: '$4,820',
                        //     color: '#f59e0b',
                        // },
                    ].map((item, index) => (
                        <View key={index} style={styles.statCard}>
                            <MaterialIcons
                                name={item.icon}
                                size={moderateScale(28)}
                                color={item.color}
                            />
                            <Text style={styles.statValue}>{item.value}</Text>
                            <Text style={styles.statLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionGrid}>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() =>
                                navigation.navigate(
                                    'MultiVehicleRegistrationScreen',
                                    { owner }
                                )
                            }
                        >
                            <MaterialIcons
                                name="add-circle"
                                size={moderateScale(36)}
                                color={ACCENT_COLOR}
                            />
                            <Text style={styles.actionText}>
                                Register Vehicle
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() =>
                                navigation.navigate('VehicleListScreen', {
                                    owner,
                                })
                            }
                        >
                            <MaterialIcons
                                name="directions-car"
                                size={moderateScale(36)}
                                color={ACCENT_COLOR}
                            />
                            <Text style={styles.actionText}>My Vehicles</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Management */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fleet Management</Text>
                    <TouchableOpacity
                        style={styles.managementRow}
                        onPress={() =>
                            navigation.navigate(
                                'VehicleOwnerSettingsScreen'
                            )
                        }
                    >
                        <MaterialIcons
                            name="settings"
                            size={moderateScale(26)}
                            color={ACCENT_COLOR}
                        />
                        <Text style={styles.rowText}>
                            Settings & Preferences
                        </Text>
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity
                        style={styles.logoutRow}
                        onPress={handleLogout}
                        disabled={loggingOut}
                    >
                        <MaterialIcons
                            name="logout"
                            size={24}
                            color="#ef4444"
                        />
                        <Text style={styles.logoutText}>
                            {loggingOut ? 'Signing out...' : 'Sign Out'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: verticalScale(60) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // light grayish white – clean & modern
    },
    scrollContent: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(40),
    },

    /* Header */
    header: {
        alignItems: 'center',
        marginBottom: verticalScale(32),
    },
    avatarContainer: {
        marginBottom: verticalScale(16),
    },
    avatar: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        borderWidth: 3,
        borderColor: '#ffffff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: { elevation: 6 },
        }),
    },
    greeting: {
        fontSize: moderateScale(26),
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: verticalScale(4),
    },
    subtitle: {
        fontSize: moderateScale(15),
        color: '#64748b',
        fontWeight: '500',
    },

    /* Stats */
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(16),
        marginBottom: verticalScale(32),
    },
    statCard: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        paddingVertical: verticalScale(20),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    statValue: {
        fontSize: moderateScale(26),
        fontWeight: '700',
        color: '#0f172a',
        marginVertical: verticalScale(6),
    },
    statLabel: {
        fontSize: moderateScale(13),
        color: '#64748b',
        fontWeight: '500',
    },

    /* Sections */
    section: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        padding: moderateScale(20),
        marginBottom: verticalScale(20),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 6,
            },
            android: { elevation: 2 },
        }),
    },
    sectionTitle: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: verticalScale(16),
    },

    /* Quick Actions */
    actionGrid: {
        flexDirection: 'row',
        gap: scale(16),
    },
    actionCard: {
        flex: 1,
        backgroundColor: 'rgba(99, 102, 241, 0.06)', // very faint accent tint
        borderRadius: moderateScale(16),
        paddingVertical: verticalScale(28),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.15)',
    },
    actionText: {
        marginTop: verticalScale(12),
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: '#1e293b',
    },

    /* Management Row */
    managementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(12),
        backgroundColor: 'rgba(249, 250, 251, 0.6)',
        borderRadius: moderateScale(12),
    },
    rowText: {
        flex: 1,
        marginLeft: scale(16),
        fontSize: moderateScale(15.5),
        fontWeight: '600',
        color: '#374151',
    },

    /* Logout */
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(16),
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderRadius: moderateScale(14),
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: {
        flex: 1,
        marginLeft: scale(16),
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: '#ef4444',
    },
});

export default VehicleOwnerDashboard;