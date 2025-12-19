import React from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import OrderNavigation from "../../../../components/OrderNavigation";

const { height } = Dimensions.get("window");

const DeliveryMapScreen = ({ navigation }) => {
  const driver = { lat: 6.854000, lng: 79.925000 };
  const delivery = { lat: 6.860000, lng: 79.930000 };

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
        .bindPopup('Driver');

      var deliveryMarker = L.marker([${delivery.lat}, ${delivery.lng}])
        .addTo(map)
        .bindPopup('Delivery Location');

      var group = new L.featureGroup([driverMarker, deliveryMarker]);
      map.fitBounds(group.getBounds().pad(0.2));
    </script>
  </body>
  </html>
  `;

  return (
    // <View style={{ flex: 1 }}>
    //   {/* MAP */}
    //   <View style={{ height: height * 0.75 }}>
    //     <WebView source={{ html }} style={{ flex: 1 }} />
    //   </View>

    //   {/* FOOTER */}
    //   <View
    //     style={{
    //       flex: 1,
    //       backgroundColor: "#fff",
    //       paddingBottom: 10,

    //     }}
    //   >
    //     <OrderNavigation order={order} />

    //     <TouchableOpacity
    //       style={{
    //         backgroundColor: "#28a745",
    //         marginHorizontal: 16,
    //         marginTop: 10,
    //         paddingVertical: 16,
    //         borderRadius: 12,
    //         alignItems: "center",
    //       }}
    //       onPress={() => navigation.navigate("DeliveryPhotoUploadScreen")}
    //     >
    //       <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
    //         Complete Order
    //       </Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>
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
          padding: 16,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("DeliveryPhotoUploadScreen")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Complete Order
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeliveryMapScreen;
