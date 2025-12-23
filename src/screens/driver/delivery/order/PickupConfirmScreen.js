import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { scale } from "react-native-size-matters";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getOrderById, confirmPickup } from "../../../../api/order";

export default function PickupConfirmScreen() {
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
        } catch (e) {
            Alert.alert("Error", "Failed to load order");
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    // ---------------- CONFIRM PICKUP ----------------
    const confirmPickupFunc = async () => {
        try {
            setProcessing(true);
            await confirmPickup(order.id);
            setProcessing(false);

            navigation.navigate("PickupPhotoUpload", {
                order_id: order.id,
            });
        } catch (error) {
            setProcessing(false);
            Alert.alert("Error", error.message);
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

    // ---------------- COMPUTED ----------------
    const totalItems = order.details.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>

                {/* MAP PLACEHOLDER */}
                <View style={styles.mapArea}>
                    <Text style={styles.mapText}>Google Map Here</Text>

                    <TouchableOpacity style={styles.navButton}>
                        <MaterialIcons name="navigation" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* BOTTOM CARD */}
                <View style={styles.cardContainer}>
                    <ScrollView>

                        <View style={styles.dragHandle} />

                        {/* PICKUP INFO */}
                        <View style={styles.titleRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.pickupTitle}>
                                    {order?.place?.pickup_name}
                                </Text>
                                <Text style={styles.pickupAddress}>
                                    {order?.place?.pickup_address}
                                </Text>
                            </View>

                            <Image
                                source={{
                                    uri: "https://img.icons8.com/?size=512&id=59837&format=png",
                                }}
                                style={styles.restaurantIcon}
                            />
                        </View>

                        {/* ORDER HEADER */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>ORDER DETAILS</Text>
                            <Text style={styles.orderId}>
                                ID: {order?.order_code}
                            </Text>
                        </View>

                        {/* ORDER ITEMS */}
                        <View style={styles.orderList}>
                            {order.details.map((item) => (
                                <View key={item.id} style={styles.itemRow}>
                                    <Text style={styles.itemName}>
                                        {item.item_name}
                                    </Text>
                                    <Text style={styles.itemQuantity}>
                                        x{item.quantity}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* SUMMARY */}
                        <Text style={{ marginTop: scale(10), fontWeight: "600" }}>
                            Items: {totalItems}
                        </Text>

                        {/* ACTION BUTTONS */}
                        <View style={styles.btnRow}>
                            <TouchableOpacity style={styles.smallBtn}>
                                <MaterialIcons name="call" size={22} />
                                <Text style={styles.smallBtnText}>Call</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.smallBtn}>
                                <MaterialIcons name="chat" size={22} />
                                <Text style={styles.smallBtnText}>Chat</Text>
                            </TouchableOpacity>
                        </View>

                        {/* CONFIRM */}
                        <TouchableOpacity
                            style={styles.confirmBtn}
                            onPress={confirmPickupFunc}
                        >
                            <Text style={styles.confirmText}>
                                Confirm Pickup
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </View>

            {/* PROCESSING MODAL */}
            {processing && (
                <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={{ color: "#fff", marginTop: 10 }}>
                        Confirming pickup…
                    </Text>
                </View>
            )}

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#eef1f4" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { fontSize: scale(16), color: "#7a7a7a" },

    mapArea: { flex: 1, backgroundColor: "#dce0e6", justifyContent: "center", alignItems: "center" },
    mapText: { color: "#6b7280", fontSize: scale(16) },
    navButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#2563eb",
        width: 55,
        height: 55,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
    },

    cardContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: scale(20),
        elevation: 25,
        maxHeight: "80%",
    },

    dragHandle: { width: 50, height: 5, backgroundColor: "#d1d5db", borderRadius: 5, alignSelf: "center", marginBottom: scale(12) },

    titleRow: { flexDirection: "row", alignItems: "center" },
    pickupTitle: { fontSize: scale(18), fontWeight: "700", color: "#111827" },
    pickupAddress: { color: "#6b7280", marginTop: 3 },
    restaurantIcon: { width: 42, height: 42, marginLeft: scale(10) },

    section: { marginTop: scale(20), flexDirection: "row" },
    sectionTitle: { flex: 1, fontSize: scale(14), fontWeight: "700", color: "#374151" },
    orderId: { color: "#6b7280" },

    orderList: { backgroundColor: "#f9fafb", padding: scale(12), borderRadius: 10, marginTop: scale(10) },
    itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: scale(6) },
    itemName: { fontSize: scale(15), fontWeight: "500" },
    itemQuantity: { fontSize: scale(15) },
    itemPrice: { fontSize: scale(15), fontWeight: "600" },

    totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: scale(10), borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: scale(6) },
    totalText: { fontSize: scale(16), fontWeight: "700" },
    totalAmount: { fontSize: scale(16), fontWeight: "700" },

    btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: scale(20) },
    smallBtn: { flex: 1, backgroundColor: "#f3f4f6", padding: scale(12), borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", marginHorizontal: 5 },
    smallBtnText: { marginLeft: 8, fontSize: scale(15), color: "#374151", fontWeight: "600" },

    confirmBtn: { backgroundColor: "#1e3a8a", padding: scale(16), borderRadius: 14, alignItems: "center", marginTop: scale(20) },
    confirmText: { color: "#fff", fontSize: scale(17), fontWeight: "700" },
});
