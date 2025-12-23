import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";

import { getOrderById } from "../../../../api/order";
import OrderNavigation from "../../../../components/OrderNavigation";

const { height } = Dimensions.get("window");

const PickupMapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order_id } = route.params || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading pickup…</Text>
      </View>
    );
  }

  if (!order) return null;

  const driver = {
    lat: order.place.pickup_lat,
    lng: order.place.pickup_lng,
  };

  const pickup = {
    lat: order.place.pickup_lat,
    lng: order.place.pickup_lng,
  };

  // ---------------- MAP ----------------
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <style>
      html, body, #map { height:100%; margin:0; padding:0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map').setView([${pickup.lat}, ${pickup.lng}], 15);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.marker([${pickup.lat}, ${pickup.lng}]).addTo(map).bindPopup('Pickup');
    </script>
  </body>
  </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      {/* MAP */}
      <WebView source={{ html }} style={{ height: height * 0.72 }} />

      {/* ORDER DETAILS BAR */}
      <OrderNavigation order={order} />

      {/* ACTION BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("PickupConfirm", {
            order_id: order.id,
          })
        }
      >
        <Text style={styles.buttonText}>Pickup Order</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PickupMapScreen;


const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#fff",
    padding: 10,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  orderCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  estimate: {
    fontSize: 14,
    fontWeight: "500",
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  chatText: {
    color: "#fff",
    marginLeft: 5,
  },
  navButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
  pickupButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  pickupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#8DB600",
    margin: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
