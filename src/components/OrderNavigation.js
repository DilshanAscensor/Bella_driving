import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Linking, Platform,
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

        // 🔹 Driver current location (GPS or mock)
        const driverLat = Number(order?.driver_lat ?? 7.91173);
        const driverLng = Number(order?.driver_lng ?? 81.561939);

        // 🔹 Pickup
        const pickupLat = Number(order?.place?.pickup_lat ?? 7.925843);
        const pickupLng = Number(order?.place?.pickup_lng ?? 81.569569);

        // 🔹 Delivery
        const deliveryLat = Number(order?.place?.delivery_lat ?? 7.860895);
        const deliveryLng = Number(order?.place?.delivery_lng ?? 81.53973);

        let originLat, originLng, destLat, destLng;

        // ---------------- STATUS BASED LOGIC ----------------
        if (status === "accepted") {
            // Driver → Pickup
            originLat = driverLat;
            originLng = driverLng;
            destLat = pickupLat;
            destLng = pickupLng;
        }
        else if (status === "picked_up" || status === "on_the_way") {
            // Pickup → Delivery
            originLat = pickupLat;
            originLng = pickupLng;
            destLat = deliveryLat;
            destLng = deliveryLng;
        }
        else {
            alert("Navigation not available for this order status");
            return;
        }

        // ---------------- GOOGLE MAP URL ----------------
        let url = "";

        if (Platform.OS === "ios") {
            url = `comgooglemaps://?saddr=${originLat},${originLng}&daddr=${destLat},${destLng}&directionsmode=driving`;
        } else {
            url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
        }

        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    const fallback = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}`;
                    Linking.openURL(fallback);
                } else {
                    Linking.openURL(url);
                }
            })
            .catch(err => console.error("Map error:", err));
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
                <TouchableOpacity style={styles.chatButton}>
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
