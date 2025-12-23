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

  // ---------------- COORDINATES ----------------
  const driver = {
    lat: order.place.pickup_lat,
    lng: order.place.pickup_lng,
  };

  const delivery = {
    lat: order.place.delivery_lat,
    lng: order.place.delivery_lng,
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
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map').setView([${driver.lat}, ${driver.lng}], 14);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      var driverMarker = L.marker([${driver.lat}, ${driver.lng}])
        .addTo(map)
        .bindPopup('Pickup');

      var deliveryMarker = L.marker([${delivery.lat}, ${delivery.lng}])
        .addTo(map)
        .bindPopup('Delivery');

      var group = new L.featureGroup([driverMarker, deliveryMarker]);
      map.fitBounds(group.getBounds().pad(0.2));
    </script>
  </body>
  </html>
  `;

  return (
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
    backgroundColor: "#8DB600",
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
