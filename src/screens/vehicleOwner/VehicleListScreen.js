import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    scale,
    verticalScale,
    moderateScale,
    moderateVerticalScale,
} from 'react-native-size-matters';

import { getMyVehicles, deleteVehicle } from '../../api/vehicleApi';
import {
    PRIMARY_COLOR,
    ACCENT_COLOR,
    TEXT_LIGHT,
} from '../../assets/theme/colors';

const VehicleListScreen = ({ navigation, route }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { owner } = route.params || {};
    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const res = await getMyVehicles();
            setVehicles(res.vehicles || []);
        } catch (err) {
            Alert.alert('Error', 'Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (vehicle) => {
        Alert.alert(
            'Confirm Deletion',
            `Remove ${vehicle.make} ${vehicle.model} (${vehicle.license_plate})?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteVehicle(vehicle.id);
                            setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
                            Alert.alert('Done', 'Vehicle removed');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'VehicleOwnerDashboard' }],
                            });
                        } catch (err) {
                            Alert.alert('Error', 'Deletion failed');
                        }
                    },
                },
            ]
        );
    };

    const renderEmpty = () => (
        <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
                <MaterialIcons name="directions-car" size={moderateScale(100)} color={ACCENT_COLOR} />
            </View>
            <Text style={styles.emptyTitle}>Your Fleet is Empty</Text>
            <Text style={styles.emptySubtitle}>
                Add vehicles to manage registrations, documents and maintenance easily.
            </Text>
            <TouchableOpacity
                style={styles.emptyCTA}
                activeOpacity={0.85}
                oonPress={() => navigation.navigate('MultiVehicleRegistrationScreen', { owner })}
            >
                <MaterialIcons name="add" size={moderateScale(24)} color="#fff" />
                <Text style={styles.emptyCTAText}>Add Your First Vehicle</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient
            colors={[PRIMARY_COLOR, '#1a3b5e']} // softer transition
            style={styles.bg}
        >
            <SafeAreaView style={styles.safe}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Fleet</Text>
                    <TouchableOpacity
                        style={styles.headerAdd}
                        onPress={() => navigation.navigate('MultiVehicleRegistrationScreen', { owner })}
                    >
                        <MaterialIcons name="add" size={moderateScale(28)} color="#fff" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={ACCENT_COLOR} />
                        <Text style={styles.loadingMsg}>Fetching your vehicles...</Text>
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        showsVerticalScrollIndicator={false}
                    >
                        {vehicles.length === 0 ? (
                            renderEmpty()
                        ) : (
                            vehicles.map((v) => (
                                <View key={v.id} style={styles.card}>
                                    <View style={styles.cardInner}>
                                        {/* Left - Icon + Info */}
                                        <View style={styles.leftSection}>
                                            <View style={styles.iconWrap}>
                                                <MaterialIcons name="directions-car" size={moderateScale(40)} color="#fff" />
                                                {/* Optional status dot */}
                                                <View style={styles.statusDot} />
                                            </View>

                                            <View style={styles.info}>
                                                <Text style={styles.name}>
                                                    {v.make} {v.model}
                                                </Text>
                                                <Text style={styles.plate}>{v.license_plate}</Text>
                                                {v.year && <Text style={styles.year}>{v.year}</Text>}
                                            </View>
                                        </View>

                                        {/* Right - Actions */}
                                        <View style={styles.actions}>
                                            <TouchableOpacity
                                                style={styles.iconBtn}
                                                onPress={() => navigation.navigate('EditVehicleScreen', { vehicle: v })}
                                            >
                                                <MaterialIcons name="edit" size={moderateScale(22)} color={TEXT_LIGHT} />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.iconBtn}
                                                onPress={() => handleDelete(v)}
                                            >
                                                <MaterialIcons name="delete-outline" size={moderateScale(22)} color="#ef4444" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </LinearGradient>
    );
};

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
    bg: { flex: 1 },
    safe: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(20),
        paddingVertical: moderateVerticalScale(20),
    },
    headerTitle: {
        fontSize: moderateScale(28),
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: -0.3,
    },
    headerAdd: {
        backgroundColor: ACCENT_COLOR,
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(22),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: ACCENT_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    scroll: {
        paddingHorizontal: scale(16),
        paddingBottom: verticalScale(100),
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.12)', // glass effect base
        borderRadius: moderateScale(20),
        marginBottom: moderateScale(14),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        overflow: 'hidden',
        ... (isIOS
            ? {
                backdropFilter: 'blur(10px)', // iOS glass
            }
            : {}),
    },
    cardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: moderateScale(16),
        backgroundColor: 'rgba(18,41,72,0.4)', // subtle tint behind glass
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconWrap: {
        width: moderateScale(56),
        height: moderateScale(56),
        borderRadius: moderateScale(16),
        backgroundColor: ACCENT_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(16),
        position: 'relative',
    },
    statusDot: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22c55e',
        borderWidth: 2,
        borderColor: '#fff',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: moderateScale(19),
        fontWeight: '700',
        color: '#ffffff',
    },
    plate: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: ACCENT_COLOR,
        marginTop: moderateScale(2),
    },
    year: {
        fontSize: moderateScale(14),
        color: 'rgba(255,255,255,0.7)',
        marginTop: moderateScale(2),
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    iconBtn: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Empty
    empty: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(30),
    },
    emptyIconWrap: {
        marginBottom: moderateScale(24),
        opacity: 0.9,
    },
    emptyTitle: {
        fontSize: moderateScale(26),
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: moderateScale(12),
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: moderateScale(16),
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center',
        marginBottom: moderateScale(40),
        lineHeight: moderateScale(24),
    },
    emptyCTA: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ACCENT_COLOR,
        paddingVertical: moderateScale(16),
        paddingHorizontal: moderateScale(32),
        borderRadius: moderateScale(16),
        gap: scale(10),
        shadowColor: ACCENT_COLOR,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
        elevation: 12,
    },
    emptyCTAText: {
        color: '#fff',
        fontSize: moderateScale(17),
        fontWeight: '600',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingMsg: {
        marginTop: moderateScale(16),
        color: 'rgba(255,255,255,0.8)',
        fontSize: moderateScale(16),
    },
});

export default VehicleListScreen;