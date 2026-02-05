import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import Footer from "../../../../components/Footer";
import {
    getOrderById,
    WayToPickup,
    confirmPickup,
    onTheWay,
    delivered,
} from "../../../../api/order";
import { BASE_URL } from "../../../../config/api";

const PRIMARY = "#122948";
const ACCENT = "#ec932a";
const TEXT_DARK = "#111";
const TEXT_LIGHT = "#6b7280";

export default function OrderDetailsScreen({ route }) {
    const { orderId } = route.params;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [active, setActive] = useState("home");

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await getOrderById(orderId);
            setOrder(res.data);
        } catch (e) {
            Alert.alert("Error", "Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- STATUS ACTION ---------------- */

    const handleStatusChange = async () => {
        if (!order) return;

        try {
            setProcessing(true);

            if (order.status === "accepted") {
                await WayToPickup(order.id);
            } else if (order.status === "way_to_pickup") {
                await confirmPickup(order.id);
            } else if (order.status === "picked_up") {
                await onTheWay(order.id);
            } else if (order.status === "on_the_way") {
                await delivered(order.id);
            }

            await fetchOrder();
        } catch (e) {
            Alert.alert("Error", "Failed to update order status");
        } finally {
            setProcessing(false);
        }
    };

    const getButtonLabel = () => {
        switch (order?.status) {
            case "accepted":
                return "Way to Pickup";
            case "way_to_pickup":
                return "Confirm Pickup";
            case "picked_up":
                return "On The Way";
            case "on_the_way":
                return "Mark as Delivered";
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color={PRIMARY} />
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>No order found</Text>
            </SafeAreaView>
        );
    }

    const customerName = `${order.customer.first_name} ${order.customer.last_name}`;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.topHeader}>
                    <Text style={styles.orderTitle}>Order Summary</Text>
                    <Text style={styles.orderId}>#{order.order_code}</Text>
                    <Text style={styles.status}>
                        {order.status.replaceAll("_", " ")}
                    </Text>
                </View>

                {/* CARD */}
                <View style={styles.card}>
                    {/* PICKUP */}
                    <Section title="Pickup">
                        <Row
                            icon="store-mall-directory"
                            value={order.place.pickup_name}
                        />
                        <Text style={styles.detailText}>
                            {order.place.pickup_address}
                        </Text>
                    </Section>

                    {/* DROPOFF */}
                    <Section title="Drop-off">
                        <Row
                            icon="location-on"
                            color="#dc2626"
                            value={order.place.delivery_name}
                        />
                        <Text style={styles.detailText}>
                            {order.place.delivery_address}
                        </Text>
                    </Section>

                    {/* DELIVERY INFO */}
                    <Section title="Delivery Info">
                        <Info
                            icon="route"
                            label="Distance"
                            value={
                                order.place.distance_km
                                    ? `${order.place.distance_km} km`
                                    : "N/A"
                            }
                        />
                        <Info
                            icon="schedule"
                            label="Estimated Time"
                            value={
                                order.place.estimated_time
                                    ? order.place.estimated_time
                                    : "N/A"
                            }
                        />
                    </Section>

                    {/* CUSTOMER */}
                    <Section title="Customer">
                        <Info
                            icon="person"
                            label="Name"
                            value={customerName}
                        />
                        <Info
                            icon="phone"
                            label="Phone"
                            value={order.customer.phone}
                        />
                    </Section>

                    {/* PAYMENT */}
                    <Section title="Payment">
                        <Info
                            icon="payments"
                            label="Method"
                            value={order.payment_method}
                        />
                        <Info
                            icon="receipt-long"
                            label="Total"
                            value={`₹${order.total_amount}`}
                            bold
                        />
                    </Section>

                    {/* NOTE */}
                    {order.note && (
                        <Section title="Note">
                            <Text style={styles.detailText}>{order.note}</Text>
                        </Section>
                    )}

                    {/* IMAGES */}
                    {(order.picked_up_image || order.handover_image) && (
                        <Section title="Proof Images">
                            {order.picked_up_image && (
                                <ImageBlock
                                    label="Pickup Image"
                                    uri={`${BASE_URL}/storage/${order.picked_up_image}`}
                                />
                            )}
                            {order.handover_image && (
                                <ImageBlock
                                    label="Delivery Image"
                                    uri={`${BASE_URL}/storage/${order.handover_image}`}
                                />
                            )}
                        </Section>
                    )}
                </View>
            </ScrollView>

            {/* ACTION BUTTON */}
            {getButtonLabel() && (
                <View style={styles.fixedButtonContainer}>
                    <TouchableOpacity
                        style={styles.startBtn}
                        disabled={processing}
                        onPress={handleStatusChange}
                    >
                        <Text style={styles.startText}>
                            {processing ? "Please wait..." : getButtonLabel()}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
}

/* ---------------- SMALL COMPONENTS ---------------- */

const Section = ({ title, children }) => (
    <View style={styles.sectionBlock}>
        <Text style={styles.sectionHeader}>{title}</Text>
        {children}
    </View>
);

const Row = ({ icon, value, color = PRIMARY }) => (
    <View style={styles.row}>
        <MaterialIcons name={icon} size={24} color={color} />
        <Text style={styles.value}>{value || "N/A"}</Text>
    </View>
);

const Info = ({ icon, label, value, bold }) => (
    <View style={styles.infoRow}>
        <MaterialIcons name={icon} size={22} color={TEXT_LIGHT} />
        <Text style={styles.detailText}>
            {label}:{" "}
            <Text style={bold && { fontWeight: "700", color: TEXT_DARK }}>
                {value}
            </Text>
        </Text>
    </View>
);

const ImageBlock = ({ label, uri }) => (
    <View style={{ marginTop: 10 }}>
        <Text style={styles.detailText}>{label}</Text>
        <Image source={{ uri }} style={styles.image} />
    </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        padding: scale(16),
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    topHeader: {
        marginBottom: verticalScale(15),
    },
    orderTitle: {
        fontSize: scale(20),
        fontWeight: "700",
        color: PRIMARY,
    },
    orderId: {
        fontSize: scale(14),
        color: TEXT_LIGHT,
    },
    status: {
        marginTop: 4,
        fontSize: scale(14),
        fontWeight: "600",
        color: ACCENT,
    },
    card: {
        backgroundColor: "#fff",
        padding: scale(18),
        borderRadius: moderateScale(16),
        elevation: 3,
    },
    sectionBlock: {
        marginBottom: verticalScale(20),
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingBottom: verticalScale(15),
    },
    sectionHeader: {
        fontSize: scale(16),
        fontWeight: "700",
        marginBottom: verticalScale(10),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
    },
    value: {
        marginLeft: scale(10),
        fontSize: scale(15),
        fontWeight: "600",
        color: TEXT_DARK,
        flexShrink: 1,
    },
    detailText: {
        fontSize: scale(14),
        color: TEXT_LIGHT,
        marginVertical: 4,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginTop: 6,
    },
    fixedButtonContainer: {
        position: "absolute",
        bottom: scale(40),
        left: 0,
        right: 0,
        padding: scale(20),
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
    },
    startBtn: {
        backgroundColor: ACCENT,
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(12),
        alignItems: "center",
    },
    startText: {
        color: "#fff",
        fontSize: scale(16),
        fontWeight: "700",
    },
});
