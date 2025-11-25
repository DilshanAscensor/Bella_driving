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
import styles from '../../assets/styles/myVehicle'
import { PRIMARY_COLOR, SCREEN_BG, TEXT_LIGHT } from '../../assets/theme/colors';

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
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={26} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Vehicle</Text>
                    <View style={{ width: 26 }} />
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

export default MyVehicleScreen;
