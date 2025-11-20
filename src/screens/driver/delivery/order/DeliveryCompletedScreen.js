import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DeliveryCompletedScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>

            <View style={styles.iconWrap}>
                <MaterialIcons name="check-circle" size={110} color="#16a34a" />
            </View>

            <Text style={styles.title}>Delivery Completed!</Text>
            <Text style={styles.subtitle}>
                You have successfully delivered the order.
            </Text>

            <View style={styles.detailsBox}>
                <Text style={styles.sectionTitle}>Order Summary</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Order ID:</Text>
                    <Text style={styles.value}>#123456</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Delivered To:</Text>
                    <Text style={styles.value}>John Doe</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Location:</Text>
                    <Text style={styles.value}>Kandy</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: "DriverDashboard" }],
                })}
            >
                <Text style={styles.homeText}>Go to Dashboard</Text>
            </TouchableOpacity>

        </View>
    );
};

export default DeliveryCompletedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    iconWrap: {
        marginBottom: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        color: "#0f172a",
    },
    subtitle: {
        fontSize: 15,
        textAlign: "center",
        color: "#64748b",
        marginBottom: 25,
    },
    detailsBox: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 12,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
        color: "#1e3a8a",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
    },
    label: {
        fontSize: 14,
        color: "#475569",
        fontWeight: "600",
    },
    value: {
        fontSize: 14,
        color: "#111827",
        fontWeight: "500",
    },
    homeButton: {
        backgroundColor: "#1e3a8a",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    homeText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
});
