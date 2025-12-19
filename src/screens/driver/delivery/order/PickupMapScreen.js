import React from "react";
import { View, Dimensions, TouchableOpacity, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import OrderNavigation from "../../../../components/OrderNavigation";

const { height } = Dimensions.get("window");

const PickupMapScreen = ({ navigation }) => {
  const driver = { lat: 6.851316, lng: 79.922369 };
  const pickup = { lat: 6.854000, lng: 79.925000 };

  const order = {
    code: "ORD12345",
    pickup_name: "John Doe",
    destination: "5 km",
    estimate_time: "12 mins",
  };

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
      var map = L.map('map').setView([${driver.lat}, ${driver.lng}], 14);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.marker([${driver.lat}, ${driver.lng}]).addTo(map);
      L.marker([${pickup.lat}, ${pickup.lng}]).addTo(map);
    </script>
  </body>
  </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      {/* Map */}
      <WebView source={{ html }} style={{ height: height * 0.75 }} />

      {/* Footer */}
      <OrderNavigation order={order} />

      {/* Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#8DB600",
          margin: 16,
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("PickupConfirm")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Pickup Order
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PickupMapScreen;


const footerStyles = StyleSheet.create({
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
});
