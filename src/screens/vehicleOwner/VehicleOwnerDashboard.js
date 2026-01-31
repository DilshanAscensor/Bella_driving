import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Alert,
    Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../assets/theme/colors';
import { userLogout } from '../../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/slices/userSlice';
import { persistor } from '../../redux/store';
import { BASE_URL } from "../../config/api";

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const VehicleOwnerDashboard = ({ navigation }) => {

    const owner = useSelector(state => state.user.user);
    const [loggingOut, setLoggingOut] = useState(false);
    const dispatch = useDispatch();
    const profilePic = owner?.vehicle_owner_details?.profile_pic;

    const imageUrl = profilePic
        ? `${BASE_URL}/storage/${profilePic}`
        : 'https://ui-avatars.com/api/?name=Owner&background=6366f1&color=fff';

    const handleLogout = async () => {
        try {
            Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', style: 'destructive', onPress: performLogout },
                ]
            );
        } catch (e) {
            performLogout();
        }
    };

    const performLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);

        try {

            await userLogout();

            await AsyncStorage.multiRemove([
                'auth_token',
            ]);

            dispatch(clearUser());
            await persistor.purge();

            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } catch (e) {
            Alert.alert('Logout failed', 'Please try again');
        } finally {
            setLoggingOut(false);
        }
    };


    return (
        <LinearGradient
            colors={[PRIMARY_COLOR, '#eef2ff']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    {/* ===== HERO HEADER ===== */}
                    <View style={styles.hero}>
                        <Image
                            source={{ uri: imageUrl }}
                            style={{
                                width: scale(110),
                                height: scale(110),
                                borderRadius: scale(55),
                                borderWidth: 3,
                                borderColor: ACCENT_COLOR,
                            }}
                            resizeMode="cover"
                        />
                        <Text style={styles.heroTitle}>{owner?.first_name}</Text>
                        <Text style={styles.heroSub}>Premium Fleet Management</Text>
                    </View>

                    {/* ===== STATS ===== */}
                    <View style={styles.statsGrid}>
                        {[
                            { icon: 'local-taxi', label: 'Vehicles', value: '0', color: ACCENT_COLOR },
                            { icon: 'verified', label: 'Status', value: 'Active', color: '#6366f1' },
                        ].map((item, i) => (
                            <View key={i} style={styles.statCard}>
                                <MaterialIcons name={item.icon} size={28} color={item.color} />
                                <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
                                <Text style={styles.statLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ===== QUICK ACTIONS ===== */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>

                        <TouchableOpacity style={styles.rowAction} onPress={() => navigation.navigate('MultiVehicleRegistrationScreen', { owner })}>
                            <MaterialIcons name="add-circle" size={26} color={ACCENT_COLOR} />
                            <Text style={styles.rowText}>Register New Vehicle</Text>
                            <MaterialIcons name="chevron-right" size={26} color="#9ca3af" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.rowAction} onPress={() => navigation.navigate('VehicleListScreen', { owner })}>
                            <MaterialIcons name="directions-car" size={26} color={ACCENT_COLOR} />
                            <Text style={styles.rowText}>View My Vehicles</Text>
                            <MaterialIcons name="chevron-right" size={26} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>

                    {/* ===== FLEET MANAGEMENT ===== */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Fleet Management</Text>

                        <View style={styles.grid}>
                            {[
                                // { icon: 'assignment', label: 'Documents', route: 'DocumentsScreen' },
                                { icon: 'settings', label: 'Settings', route: 'VehicleOwnerSettingsScreen' },
                            ].map((item, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.manageCard}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate(item.route)}
                                >
                                    <MaterialIcons name={item.icon} size={26} color={ACCENT_COLOR} />
                                    <Text style={styles.manageText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* ===== ACCOUNT MANAGEMENT ===== */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Account Management</Text>

                        {/* <TouchableOpacity
                            style={styles.accountRow}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <MaterialIcons name="edit" size={24} color="#2563eb" />
                            <Text style={styles.accountText}>Edit Profile</Text>
                            <MaterialIcons name="chevron-right" size={26} color="#9ca3af" />
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            style={[styles.accountRow, styles.logoutRow]}
                            onPress={handleLogout}
                        >
                            <MaterialIcons name="logout" size={24} color="#dc2626" />
                            <Text style={[styles.accountText, { color: '#dc2626' }]}>Logout</Text>
                            <MaterialIcons name="chevron-right" size={26} color="#fca5a5" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: verticalScale(60) }} />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    safeArea: { flex: 1 },

    scrollContent: {
        paddingHorizontal: scale(18),
        paddingTop: verticalScale(18),
        paddingBottom: verticalScale(36),
    },

    /* Hero */
    hero: {
        alignItems: 'center',
        marginBottom: verticalScale(28),
    },
    heroTitle: {
        fontSize: moderateScale(28),
        fontWeight: '800',
        color: '#fff',
        marginTop: verticalScale(6),
    },
    heroSub: {
        fontSize: moderateScale(14),
        color: 'rgba(255,255,255,0.85)',
    },

    /* Stats */
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(26),
    },
    statCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: moderateScale(18),
        paddingVertical: verticalScale(18),
        alignItems: 'center',
        elevation: 6,
    },
    statValue: {
        fontSize: moderateScale(20),
        fontWeight: '800',
        marginTop: verticalScale(6),
    },
    statLabel: {
        fontSize: moderateScale(12),
        color: '#6b7280',
        marginTop: verticalScale(2),
    },

    /* Section */
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(20),
        padding: moderateScale(18),
        marginBottom: verticalScale(20),
        elevation: 6,
    },
    sectionTitle: {
        fontSize: moderateScale(17),
        fontWeight: '800',
        color: '#111827',
        marginBottom: verticalScale(14),
    },

    /* Rows */
    rowAction: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(14),
    },
    rowText: {
        flex: 1,
        marginLeft: scale(12),
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: '#1f2937',
    },

    /* Management */
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    manageCard: {
        width: '48%',
        backgroundColor: '#f8fafc',
        borderRadius: moderateScale(16),
        paddingVertical: verticalScale(18),
        alignItems: 'center',
        marginBottom: verticalScale(14),
    },
    manageText: {
        fontSize: moderateScale(13.5),
        fontWeight: '600',
        color: '#374151',
        marginTop: verticalScale(6),
    },

    /* Account */
    accountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(14),
    },
    accountText: {
        flex: 1,
        marginLeft: scale(12),
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: '#1f2937',
    },
    logoutRow: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        marginTop: verticalScale(6),
        paddingTop: verticalScale(18),
    },
});

export default VehicleOwnerDashboard;
