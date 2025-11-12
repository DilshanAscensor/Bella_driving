import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ACCENT_COLOR } from "../../assets/theme/colors";

const DriverDeliveriesScreen = () => {
    const [tab, setTab] = useState("ongoing");

    const deliveries = {
        ongoing: [
            { id: 1, orderId: "ORD-9021", pickup: "123 Main St", dropoff: "45 Market Ave", status: "Picked Up" },
        ],
        rejected: [
            { id: 2, orderId: "ORD-8331", pickup: "Palm Street", dropoff: "Center Mall", status: "Rejected" },
        ],
        completed: [
            { id: 3, orderId: "ORD-7881", pickup: "New Town", dropoff: "Old City", status: "Delivered" },
        ],
    };

    const renderDeliveryCard = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>#{item.orderId}</Text>
                <Text style={[styles.status, { color: ACCENT_COLOR }]}>{item.status}</Text>
            </View>

            <View style={styles.row}>
                <MaterialIcons name="location-pin" size={20} color="#4b5563" />
                <Text style={styles.label}>Pickup:</Text>
                <Text style={styles.value}>{item.pickup}</Text>
            </View>

            <View style={styles.row}>
                <MaterialIcons name="flag" size={20} color="#4b5563" />
                <Text style={styles.label}>Dropoff:</Text>
                <Text style={styles.value}>{item.dropoff}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                {/* FIXED TOP TABS */}
                <View style={styles.tabContainer}>
                    {["ongoing", "rejected", "completed"].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.tabButton,
                                tab === item && styles.activeTabButton,
                            ]}
                            onPress={() => setTab(item)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    tab === item && styles.activeTabText,
                                ]}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* LIST */}
                <FlatList
                    data={deliveries[tab]}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderDeliveryCard}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No deliveries found.</Text>
                    }
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default DriverDeliveriesScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        marginTop: "5%",
        flex: 1,
        backgroundColor: "#f8fafc",
    },

    /* ✅ FIXED TABS */
    tabContainer: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        elevation: 3,
        marginBottom: 5,
        justifyContent: "space-between",
    },
    tabButton: {
        flex: 1, // ✅ makes full clickable area
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: "#e2e8f0",
        alignItems: "center",
    },
    activeTabButton: {
        backgroundColor: ACCENT_COLOR,
    },
    tabText: {
        fontSize: 14,
        color: "#475569",
        fontWeight: "600",
    },
    activeTabText: {
        color: "#fff",
    },

    /* ✅ Cards */
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginVertical: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    orderId: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1e293b",
    },
    status: {
        fontSize: 13,
        fontWeight: "600",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 3,
    },
    label: {
        marginLeft: 6,
        color: "#64748b",
        fontWeight: "600",
    },
    value: {
        marginLeft: 4,
        color: "#1e293b",
        flexShrink: 1,
        fontWeight: "500",
    },

    emptyText: {
        textAlign: "center",
        marginTop: 30,
        color: "#64748b",
        fontSize: 16,
    },
});
