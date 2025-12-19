import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ActivityIndicator,
    Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { acceptOrder } from "../../../../api/order";
import orderNavigation from "../../../../components/OrderNavigation";

export default function AcceptDeliveryScreen() {
    const order = useSelector((state) => state.order.newOrder);
    const navigation = useNavigation();

    const [showModal, setShowModal] = useState(false);

    if (!order) return null;

    // ---------------- ACCEPT ----------------
    const acceptPickup = async () => {
        try {
            setShowModal(true);

            const res = await acceptOrder(order.id);
            if (!res) {
                setShowModal(false);
                Alert.alert("Failed", "Unable to accept order");
                return;
            }

            setShowModal(false);
            navigation.replace("PickupMap");
        } catch (e) {
            setShowModal(false);
            Alert.alert("Error", e.message);
        }
    };

    // ---------------- MAP HTML ----------------
    const mapHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  </head>
  <body style="margin:0">
    <div id="map" style="width:100%;height:100vh"></div>
    <script>
      var map = L.map('map').setView([6.851316,79.922369], 14);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      L.marker([6.851316,79.922369]).addTo(map).bindPopup('Driver');
      L.marker([6.854,79.925]).addTo(map).bindPopup('Pickup');
    </script>
  </body>
  </html>
  `;

    return (
        <View style={styles.root}>

            {/* MAP BACKGROUND */}
            <WebView
                originWhitelist={["*"]}
                source={{ html: mapHtml }}
                style={StyleSheet.absoluteFill}
            />

            {/* ACCEPT CARD */}
            <View style={styles.acceptCard}>
                <Text style={styles.title}>New Delivery Request</Text>
                <View style={styles.orderCodeBadge}>
                    <Text style={styles.orderCodeText}>
                        Order ID • {order.order_code}
                    </Text>
                </View>

                <Text style={styles.shop}>{order.place.pickup_name}</Text>
                <Text style={styles.text}>{order.place.pickup_address}</Text>
                <Text style={styles.text}>{order.place.delivery_address}</Text>

                <View style={styles.btnRow}>
                    <TouchableOpacity
                        style={styles.declineBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={acceptPickup}
                    >
                        <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* MODAL POPUP */}
            <Modal transparent visible={showModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <ActivityIndicator size="large" color="#1e3a8a" />
                        <Text style={styles.modalTitle}>Accepting Delivery</Text>
                        <Text style={styles.modalSubtitle}>Please wait…</Text>
                    </View>
                </View>
            </Modal>

        </View>
    );
}
const styles = StyleSheet.create({
    root: { flex: 1 },

    acceptCard: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 12,
    },

    title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },

    shop: { fontSize: 15, fontWeight: "600" },

    text: { fontSize: 13, color: "#6b7280", marginTop: 4 },

    btnRow: {
        flexDirection: "row",
        marginTop: 16,
    },

    declineBtn: {
        flex: 1,
        padding: 14,
        backgroundColor: "#e5e7eb",
        borderRadius: 10,
        alignItems: "center",
        marginRight: 8,
    },

    acceptBtn: {
        flex: 1,
        padding: 14,
        backgroundColor: "#1e3a8a",
        borderRadius: 10,
        alignItems: "center",
        marginLeft: 8,
    },

    acceptText: {
        color: "#fff",
        fontWeight: "600",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalCard: {
        width: "75%",
        padding: 24,
        backgroundColor: "#fff",
        borderRadius: 16,
        alignItems: "center",
    },

    modalTitle: { marginTop: 12, fontSize: 18, fontWeight: "600" },
    modalSubtitle: { marginTop: 4, fontSize: 14, color: "#6b7280" },

    orderCodeBadge: {
        backgroundColor: "#eef2ff",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 6,
        marginBottom: 8,
    },

    orderCodeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1e3a8a",
        letterSpacing: 0.5,
        textAlign: "center",
    },
});
