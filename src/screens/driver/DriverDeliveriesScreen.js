import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import Styles from "../../assets/styles/driverDeliveries";
import Footer from "../../components/Footer";
import { getDriverOrders } from "../../api/order"; // adjust path if needed

const DriverDeliveriesScreen = ({ navigation }) => {
    const styles = Styles;

    const [tab, setTab] = useState("ongoing");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState("home");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getDriverOrders();
            console.log("Order Status:", data);
            setOrders(data || []);
        } catch (error) {
            console.log("Error fetching driver orders", error);
        } finally {
            setLoading(false);
        }
    };

    const openOrderDetails = (orderId) => {
        navigation.navigate("OrderDetails", { orderId });
    };

    // 🔹 FILTER ORDERS BASED ON TAB
    const filteredOrders = orders.filter(order => {

        if (tab === "ongoing") {
            return [
                "accepted",
                "way_to_pickup",
                "picked_up",
                "on_the_way",
            ].includes(order.status);
        }

        if (tab === "completed") {
            return order.status === "delivered";
        }

        if (tab === "rejected") {
            return order.status === "cancelled";
        }

        return false;
    });

    // 🔹 RENDER ORDER CARD
    const renderDeliveryCard = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
        // onPress={() => openOrderDetails(item.id)}
        >
            <View style={styles.card}>
                {/* HEADER */}
                <View style={styles.cardHeader}>
                    <Text style={styles.orderId}>
                        #{item.order_code || item.id}
                    </Text>
                    <Text style={styles.status}>
                        {item.status.replaceAll("_", " ")}
                    </Text>
                </View>

                {/* PICKUP */}
                <View style={styles.row}>
                    <MaterialIcons
                        name="location-pin"
                        size={20}
                        color="#4b5563"
                    />
                    <Text style={styles.label}>Pickup:</Text>
                    <Text style={styles.value}>
                        {item.place?.pickup_address || "N/A"}
                    </Text>
                </View>

                {/* DROPOFF */}
                <View style={styles.row}>
                    <MaterialIcons
                        name="flag"
                        size={20}
                        color="#4b5563"
                    />
                    <Text style={styles.label}>Dropoff:</Text>
                    <Text style={styles.value}>
                        {item.place?.delivery_address || "N/A"}
                    </Text>
                </View>

                {/* AMOUNT */}
                <View style={styles.row}>
                    <MaterialIcons
                        name="payments"
                        size={20}
                        color="#4b5563"
                    />
                    <Text style={styles.label}>Amount:</Text>
                    <Text style={styles.value}>
                        Rs. {item.total_amount}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safe}>
            {/* TOP TABS */}
            <View style={styles.tabContainer}>
                {["ongoing", "completed", "rejected"].map(item => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.tabButton,
                            tab === item && styles.activeTabButton,
                        ]}
                        onPress={() => setTab(item)}
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
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#000"
                    style={{ marginTop: 40 }}
                />
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderDeliveryCard}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 100,
                    }}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No deliveries found
                        </Text>
                    }
                />
            )}

            {/* FOOTER */}
            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default DriverDeliveriesScreen;
