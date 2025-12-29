import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../assets/styles/customer/orderHistory";
import { SafeAreaView } from "react-native-safe-area-context";
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../assets/theme/colors';
import { getOrders } from '../../api/order';
import { useSelector } from "react-redux";

export default function OrderHistoryScreen() {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user) || {};

    const [loading, setLoading] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const fetchOrderHistory = async () => {
        try {
            setLoading(true);

            const res = await getOrders(user.id);
            console.log("📦 API response:", res);

            if (res?.orders) {
                const formatted = res.orders.map(mapOrderToUIFormat);
                setOrderHistory(formatted);
            }

        } catch (error) {
            console.log("Error loading order history", error);
        } finally {
            setLoading(false);
        }
    };

    const mapOrderToUIFormat = (order) => {
        return {
            id: order.id,
            status: order.status,
            date: new Date(order.created_at).toLocaleString(),

            pickup_address: order.place?.pickup_address || "",
            delivery_address: order.place?.delivery_address || "",
            total_price: Number(order.total_amount).toFixed(2),

            full_data: order
        };
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <Text style={styles.pageTitle}>Order History</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                ) : orderHistory.length > 0 ? (
                    orderHistory.map((order) => (
                        <View key={order.id} style={styles.orderCard}>

                            <View style={styles.rowBetween}>
                                <Text style={styles.orderId}>Order #{order.id}</Text>

                                <View style={[
                                    styles.statusBadge,
                                    order.status === "delivered"
                                        ? styles.statusCompleted
                                        : styles.statusCancelled
                                ]}>
                                    <Text style={styles.statusText}>
                                        {order.status.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.dateText}>{order.date}</Text>

                            <View style={styles.section}>
                                <MaterialIcons name="location-pin" size={20} color={PRIMARY_COLOR} />
                                <Text style={styles.locationText}>{order.pickup_address}</Text>
                            </View>

                            <View style={styles.section}>
                                <MaterialIcons name="flag" size={20} color={ACCENT_COLOR} />
                                <Text style={styles.locationText}>{order.delivery_address}</Text>
                            </View>

                            <View style={styles.rowBetween}>
                                <Text style={styles.amountLabel}>Total Amount:</Text>
                                <Text style={styles.amountValue}>₹{order.total_price}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.detailsBtn}
                                onPress={() =>
                                    navigation.navigate("CustomerOrderDetails", {
                                        order: order.full_data
                                    })
                                }
                            >
                                <Text style={styles.detailsText}>View Details</Text>
                            </TouchableOpacity>

                        </View>
                    ))
                ) : (
                    <View style={styles.emptyBox}>
                        <MaterialIcons name="history" size={50} color="#999" />
                        <Text style={styles.emptyText}>No past orders yet.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
