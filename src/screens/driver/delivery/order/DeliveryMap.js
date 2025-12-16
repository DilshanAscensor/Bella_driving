import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import styles from "../../../../assets/styles/pickedMap";

const DeliveryMapScreen = ({ navigation }) => {
    const driver = { lat: 6.854000, lng: 79.925000 };
    const delivery = { lat: 6.860000, lng: 79.930000 };

    const html = `
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
      var map = L.map('map').setView([${driver.lat}, ${driver.lng}], 14);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      var pickupMarker = L.marker([${driver.lat}, ${driver.lng}])
        .addTo(map)
        .bindPopup('Pickup Location');

      var deliveryMarker = L.marker([${delivery.lat}, ${delivery.lng}])
        .addTo(map)
        .bindPopup('Delivery Location');

      var group = new L.featureGroup([
        driverMarker,
        deliveryMarker
      ]);

      map.fitBounds(group.getBounds().pad(0.2));
    </script>
  </body>
  </html>
  `;

    return (
        <View style={styles.container}>
            {/* Map */}
            <WebView
                originWhitelist={["*"]}
                source={{ html }}
                style={styles.map}
            />

            {/* Pickup Button */}
            <TouchableOpacity
                style={styles.pickupButton}
                onPress={() => navigation.navigate("DeliveryPhotoUploadScreen")}
            >
                <Text style={styles.pickupText}>Complete Order</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DeliveryMapScreen;
