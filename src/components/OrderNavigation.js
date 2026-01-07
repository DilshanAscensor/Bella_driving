import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Linking, Platform,
    Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { height } = Dimensions.get("window");

export default function OrderNavigation({ order }) {
    if (!order) {
        return (
            <View style={[styles.footer, { height: height * 0.28 }]}>
                <Text style={styles.orderCode}>No Order Loaded</Text>
            </View>
        );
    }

    // ---------------- DERIVED DATA ----------------
    const distanceKm = order?.place?.distance_km ?? 5; // fallback
    const etaMinutes =
        order?.place?.estimated_time ??
        Math.round(distanceKm * 4); // fallback ETA logic

    const openGoogleMaps = () => {
        if (!order?.place) return;

        const status = order.status;

        // Pickup location (required)
        const pickupLat = Number(order?.place?.pickup_lat);
        const pickupLng = Number(order?.place?.pickup_lng);

        // Delivery location (required only after pickup)
        const deliveryLat = Number(order?.place?.delivery_lat);
        const deliveryLng = Number(order?.place?.delivery_lng);

        if (Number.isNaN(pickupLat) || Number.isNaN(pickupLng)) {
            Alert.alert("Navigation Error", "Pickup location not available");
            return;
        }

        let url = "";

        // ---------------- STATUS LOGIC ----------------
        if (status === "accepted") {
            url = `https://www.google.com/maps/search/?api=1&query=${pickupLat},${pickupLng}`;
        }
        else if (status === "picked_up" || status === "on_the_way") {
            if (Number.isNaN(deliveryLat) || Number.isNaN(deliveryLng)) {
                Alert.alert("Navigation Error", "Delivery location not available");
                return;
            }

            url = `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${deliveryLat},${deliveryLng}&travelmode=driving`;
        }
        else {
            Alert.alert("Navigation not available for this order status");
            return;
        }

        // ---------------- OPEN MAP ----------------
        Linking.openURL(url).catch(() => {
            Alert.alert("Error", "Unable to open Google Maps");
        });
    };



    const handleCallCustomer = () => {
        const phone = order?.customer_phone;

        if (!phone) {
            Alert.alert(
                'Phone number unavailable',
                'Customer phone number is not provided'
            );
            return;
        }

        const phoneUrl = `tel:${phone}`;

        Linking.canOpenURL(phoneUrl)
            .then((supported) => {
                if (!supported) {
                    Alert.alert('Error', 'Cannot open phone dialer');
                } else {
                    return Linking.openURL(phoneUrl);
                }
            })
            .catch(() => {
                Alert.alert('Error', 'Something went wrong');
            });
    };

    return (
        <View style={[styles.footer, { height: height * 0.28 }]}>

            {/* ORDER CODE */}
            <Text style={styles.orderCode}>
                Order • {order.order_code}
            </Text>

            {/* PICKUP & DROP */}
            <View style={styles.routeRow}>
                <View style={styles.routeItem}>
                    <Text style={styles.routeLabel}>Pickup</Text>
                    <Text style={styles.routeValue} numberOfLines={1}>
                        {order?.place?.pickup_name}
                    </Text>
                </View>

                <MaterialIcons
                    name="arrow-forward"
                    size={18}
                    color="#999"
                    style={{ marginHorizontal: 6 }}
                />

                <View style={styles.routeItem}>
                    <Text style={styles.routeLabel}>Drop</Text>
                    <Text style={styles.routeValue} numberOfLines={1}>
                        {order?.place?.delivery_name}
                    </Text>
                </View>
            </View>

            {/* META INFO */}
            <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                    📍 {distanceKm} km
                </Text>
                <Text style={styles.metaText}>
                    ⏱ {etaMinutes} mins
                </Text>
            </View>

            {/* ACTIONS */}
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={handleCallCustomer}
                >
                    <MaterialIcons name="headset-mic" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={openGoogleMaps}
                >
                    <MaterialIcons name="navigation" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

//
// ---------------- STYLES ----------------
//
const styles = StyleSheet.create({
    footer: {
        backgroundColor: "#fff",
        padding: 12,
        borderTopWidth: 1,
        borderColor: "#ddd",
        justifyContent: "space-between",
    },
    orderCode: {
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 6,
    },

    routeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    routeItem: {
        flex: 1,
    },
    routeLabel: {
        fontSize: 11,
        color: "#888",
    },
    routeValue: {
        fontSize: 14,
        fontWeight: "600",
    },

    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    metaText: {
        fontSize: 13,
        fontWeight: "600",
    },

    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chatButton: {
        backgroundColor: "#122948",
        padding: 10,
        borderRadius: 8,
    },
    navButton: {
        backgroundColor: "#FFA500",
        padding: 12,
        borderRadius: 30,
    },
});
