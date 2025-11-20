import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DeliveryConfirmationScreen = ({ route, navigation }) => {
    const pickupPhoto = route?.params?.pickupPhoto;

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}
                style={styles.container}
                showsVerticalScrollIndicator={false}>

                <View style={styles.container}>
                    <Text style={styles.title}>Delivery Confirmation</Text>
                    <Text style={styles.subtitle}>Review pickup details before delivering</Text>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Pickup Photo</Text>

                        {pickupPhoto ? (
                            <Image source={{ uri: pickupPhoto.uri }} style={styles.photo} />
                        ) : (
                            <View style={styles.noPhoto}>
                                <MaterialIcons name="photo" size={40} color="#9ca3af" />
                                <Text style={styles.noPhotoText}>No photo provided</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>Order Details</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Order ID:</Text>
                            <Text style={styles.value}>#123456</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Customer:</Text>
                            <Text style={styles.value}>John Doe</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Pickup Location:</Text>
                            <Text style={styles.value}>Colombo 03</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Delivery Location:</Text>
                            <Text style={styles.value}>Kandy</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => navigation.navigate("DeliveryCompletedScreen")}
                    >
                        <Text style={styles.confirmText}>Confirm Delivery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backText}>Go Back</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DeliveryConfirmationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f8fafc",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    photo: {
        width: "100%",
        height: 220,
        borderRadius: 10,
    },
    noPhoto: {
        height: 150,
        borderRadius: 10,
        backgroundColor: "#f1f5f9",
        justifyContent: "center",
        alignItems: "center",
    },
    noPhotoText: {
        marginTop: 8,
        color: "#6b7280",
    },
    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
    },
    label: {
        fontWeight: "600",
        color: "#475569",
    },
    value: {
        fontWeight: "500",
        color: "#111827",
    },
    confirmButton: {
        marginTop: 25,
        backgroundColor: "#1e3a8a",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    confirmText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    backButton: {
        marginTop: 15,
        padding: 12,
        alignItems: "center",
    },
    backText: {
        fontSize: 16,
        color: "#475569",
    },
});
