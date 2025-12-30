import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";

import { getOrderById } from "../../../../api/order";
import OrderNavigation from "../../../../components/OrderNavigation";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const DeliveryMapScreen = () => {
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
        <Text>Loading delivery…</Text>
      </View>
    );
  }

  if (!order) return null;

  const delivery = {
    lat: Number(order?.place?.delivery_lat ?? 6.9271),
    lng: Number(order?.place?.delivery_lng ?? 79.8612),
  };

  // ---------------- MAP HTML ----------------
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
      var map = L.map('map').setView([${delivery.lat}, ${delivery.lng}], 15);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.marker([${delivery.lat}, ${delivery.lng}]).addTo(map).bindPopup('Pickup');
    </script>
  </body>
  </html>
  `;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* MAP */}
        <WebView source={{ html }} style={{ height: height * 0.72 }} />

        {/* ORDER INFO */}
        <OrderNavigation order={order} />

        {/* COMPLETE BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("DeliveryPhotoUploadScreen", {
              order_id: order.id,
            })
          }
        >
          <Text style={styles.buttonText}>Complete Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryMapScreen;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FFA500",
    margin: 16,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
