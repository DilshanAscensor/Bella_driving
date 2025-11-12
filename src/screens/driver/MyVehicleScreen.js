import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVehicleByDriver } from '../../api/vehicleApi';
import { BASE_URL } from '../../config/api';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

                if (res.status === true && res.data) {
                    setVehicle(res.data);
                }
            } catch (err) {
                console.log("Vehicle fetch error:", err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!vehicle) {
        return (
            <View style={styles.center}>
                <MaterialIcons name="directions-car" size={60} color="#999" />
                <Text style={styles.noVehicleText}>No vehicle registered yet.</Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("VehicleRegistration", { driver })}
                >
                    <Text style={styles.addButtonText}>Register Vehicle</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const imageUrl = vehicle.image ? `${BASE_URL}/storage/vehicles/front/${vehicle.image}` : null;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.vehicleImage} />
                ) : (
                    <Image
                        source={require('../../assets/images/taxi-app-logo.webp')}
                        style={styles.vehicleImage}
                    />
                )}

                <Text style={styles.title}>My Vehicle</Text>

                <View style={styles.item}>
                    <Text style={styles.label}>Vehicle Model:</Text>
                    <Text style={styles.value}>{vehicle.model || 'N/A'}</Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>Vehicle Number:</Text>
                    <Text style={styles.value}>{vehicle.vehicle_number || 'N/A'}</Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>Type:</Text>
                    <Text style={styles.value}>{vehicle.type || 'N/A'}</Text>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate("EditVehicle", { vehicle })}
                >
                    <MaterialIcons name="edit" size={20} color="#fff" />
                    <Text style={styles.editButtonText}>Edit Vehicle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    card: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        alignItems: 'center'
    },
    vehicleImage: {
        width: 140,
        height: 140,
        borderRadius: 8,
        marginBottom: 16
    },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    item: { width: '100%', marginBottom: 8 },
    label: { fontSize: 14, color: '#777' },
    value: { fontSize: 16, fontWeight: '600', color: '#333' },
    editButton: {
        flexDirection: 'row',
        backgroundColor: '#1e3a8a',
        padding: 12,
        marginTop: 20,
        borderRadius: 6,
        alignItems: 'center'
    },
    editButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600'
    },
    center: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    noVehicleText: { fontSize: 16, marginTop: 10, color: '#444' },
    addButton: {
        marginTop: 15,
        padding: 12,
        backgroundColor: '#28a745',
        borderRadius: 6
    },
    addButtonText: { color: '#fff', fontWeight: '600' }
});

export default MyVehicleScreen;
