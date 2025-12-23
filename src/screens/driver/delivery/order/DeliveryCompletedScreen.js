import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useNavigation, useRoute } from "@react-navigation/native";

import { getOrderById, confirmDeliveryApi } from "../../../../api/order";

export default function DeliveryCompletedScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { order_id } = route.params || {};

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // ---------------- LOAD ORDER ----------------
    useEffect(() => {
        if (!order_id) {
            Alert.alert("Error", "Order ID missing");
            navigation.goBack();
            return;
        }

        fetchOrder();
    }, [order_id]);

    const fetchOrder = async () => {
        try {
            const response = await getOrderById(order_id);
            const orderData = response.data ?? response;
            setOrder(orderData);
        } catch (error) {
            Alert.alert("Error", "Failed to load order");
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    // ---------------- CONFIRM DELIVERY ----------------
    const handleConfirmDelivery = async () => {
        try {
            setProcessing(true);

            const response = await confirmDeliveryApi(order.id);

            if (!response) {
                Alert.alert("Failed", "Unable to confirm delivery");
                return;
            }

            Alert.alert("Success", "Delivery completed");

            navigation.reset({
                index: 0,
                routes: [{ name: "DriverDashboard" }],
            });

        } catch (error) {
            Alert.alert(
                "Error",
                error.response?.data?.message || error.message
            );
        } finally {
            setProcessing(false);
        }
    };

    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Loading order…</Text>
            </SafeAreaView>
        );
    }

    if (!order) return null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: verticalScale(80) }}
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Delivery Confirmation</Text>
                <Text style={styles.subtitle}>
                    Review all details before completing delivery
                </Text>

                {/* ORDER DETAILS */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Order Details</Text>

                    <DetailRow label="Order Code" value={order.order_code} />
                    <DetailRow
                        label="Customer"
                        value={order?.place?.delivery_name}
                    />
                    <DetailRow
                        label="Pickup Location"
                        value={order?.place?.pickup_address}
                    />
                    <DetailRow
                        label="Delivery Location"
                        value={order?.place?.delivery_address}
                    />
                    <DetailRow
                        label="Payment Type"
                        value={order.payment_method}
                    />
                </View>

                {/* CHARGES */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Charges</Text>

                    {order.details.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <Text style={styles.itemName}>
                                {item.item_name} × {item.quantity}
                            </Text>
                            <Text style={styles.itemPrice}>
                                Rs. {item.total}
                            </Text>
                        </View>
                    ))}

                    <DetailRow
                        label="Delivery Fee"
                        value={`Rs. ${order.delivery_fee}`}
                    />

                    <View style={styles.separator} />

                    <DetailRow
                        label="Total Payable"
                        value={`Rs. ${order.total_amount}`}
                        bold
                    />
                </View>

                {/* CONFIRM BUTTON */}
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmDelivery}
                    disabled={processing}
                >
                    <Text style={styles.confirmText}>
                        {processing ? "Confirming..." : "Confirm Delivery"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// ---------------- DETAIL ROW ----------------
const DetailRow = ({ label, value, bold }) => (
    <View style={styles.rowWrap}>
        <Text style={[styles.label, bold && { fontWeight: "700" }]}>
            {label}:
        </Text>
        <Text
            style={[
                styles.valueWrap,
                bold && { fontWeight: "700" },
            ]}
        >
            {value}
        </Text>
    </View>
);

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(10),
        backgroundColor: "#f8fafc",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: moderateScale(22),
        fontWeight: "700",
        marginBottom: verticalScale(5),
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: "#6b7280",
        marginBottom: verticalScale(20),
    },
    infoCard: {
        backgroundColor: "#fff",
        borderRadius: scale(12),
        padding: scale(15),
        marginBottom: verticalScale(20),
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    sectionTitle: {
        fontSize: moderateScale(17),
        fontWeight: "700",
        marginBottom: verticalScale(10),
    },
    rowWrap: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: verticalScale(6),
    },
    label: {
        fontWeight: "600",
        color: "#475569",
        fontSize: moderateScale(14),
    },
    valueWrap: {
        flex: 1,
        marginLeft: scale(10),
        fontSize: moderateScale(14),
        fontWeight: "500",
        color: "#111827",
        flexWrap: "wrap",
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: scale(6),
    },
    itemName: {
        fontSize: scale(15),
        fontWeight: "500",
    },
    itemPrice: {
        fontSize: scale(15),
        fontWeight: "600",
    },
    separator: {
        height: verticalScale(1),
        backgroundColor: "#e5e7eb",
        marginVertical: verticalScale(10),
    },
    confirmButton: {
        marginTop: verticalScale(25),
        backgroundColor: "#1e3a8a",
        padding: verticalScale(15),
        borderRadius: scale(10),
        alignItems: "center",
    },
    confirmText: {
        color: "#fff",
        fontSize: moderateScale(18),
        fontWeight: "600",
    },
});
