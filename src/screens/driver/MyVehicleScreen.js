import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVehicleByDriver } from '../../api/vehicleApi';
import { BASE_URL } from '../../config/api';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/Footer';

const PRIMARY_COLOR = '#1e3a8a';
const ACCENT_COLOR = '#8DB600';
const TEXT_DARK = '#1F2937';
const TEXT_LIGHT = '#6B7280';
const CARD_BG = '#FFFFFF';
const SCREEN_BG = '#F3F4F6';

const MyVehicleScreen = () => {
    const navigation = useNavigation();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [driver, setDriver] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const storedUser = await AsyncStorage.getItem('user_data');
            if (!storedUser) return;

            const parsedUser = JSON.parse(storedUser);
            setDriver(parsedUser);

            try {
                const res = await getVehicleByDriver(parsedUser.id);
                if (res.status && res.data) {
                    setVehicle(res.data);
                }
            } catch (err) {
                console.log("Error fetching vehicle:", err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                <Text style={styles.loadingText}>Loading vehicle...</Text>
            </View>
        );
    }

    if (!vehicle) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons name="directions-car" size={80} color={TEXT_LIGHT} />

                <Text style={styles.emptyTitle}>No Vehicle Registered</Text>
                <Text style={styles.emptySubtitle}>Add your vehicle to continue</Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("VehicleRegistration", { driver })}
                >
                    <MaterialIcons name="add-circle-outline" size={22} color="#fff" />
                    <Text style={styles.addButtonText}>Register Vehicle</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const imageUrl = vehicle.front_photo
        ? `${BASE_URL}/storage/${vehicle.front_photo}`
        : null;
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: SCREEN_BG }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>

                {/* Header */}
                <View style={styles.header}>
                    <MaterialIcons name="directions-car" size={26} color="#fff" />
                    <Text style={styles.headerText}>My Vehicle</Text>
                </View>

                {/* Card */}
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={
                                imageUrl
                                    ? { uri: imageUrl }
                                    : require('../../assets/images/taxi-app-logo.webp')
                            }
                            style={styles.vehicleImage}
                        />
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="commute" size={22} color={PRIMARY_COLOR} />
                        <Text style={styles.label}>Model</Text>
                        <Text style={styles.value}>{vehicle.model}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="confirmation-number" size={22} color={PRIMARY_COLOR} />
                        <Text style={styles.label}>Vehicle Number</Text>
                        <Text style={styles.value}>{vehicle.license_plate}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="category" size={22} color={PRIMARY_COLOR} />
                        <Text style={styles.label}>Type</Text>
                        <Text style={styles.value}>{vehicle.vehicle_type}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate("EditVehicle", { vehicle })}
                    >
                        <MaterialIcons name="edit" size={22} color="#fff" />
                        <Text style={styles.editButtonText}>Edit Vehicle</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <Footer active="home" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: PRIMARY_COLOR,
        padding: 18,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 5
    },
    headerText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 10
    },

    card: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10
    },

    imageContainer: {
        backgroundColor: '#E5E7EB',
        padding: 10,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 16
    },
    vehicleImage: {
        width: 180,
        height: 180,
        borderRadius: 14
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: TEXT_LIGHT,
        width: 140,
        marginLeft: 8
    },
    value: {
        fontSize: 17,
        fontWeight: '700',
        color: TEXT_DARK
    },

    editButton: {
        marginTop: 24,
        backgroundColor: ACCENT_COLOR,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 10
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '700'
    },

    /* Empty State */
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: TEXT_DARK,
        marginTop: 10
    },
    emptySubtitle: {
        fontSize: 15,
        color: TEXT_LIGHT,
        marginBottom: 20
    },
    addButton: {
        backgroundColor: ACCENT_COLOR,
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 22,
        borderRadius: 10
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10
    },

    /* Loading */
    loadingContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
    },
    loadingText: { marginTop: 10, fontSize: 15, color: TEXT_LIGHT }
});

export default MyVehicleScreen;
