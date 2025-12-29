import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function PickupMapScreen({ route }) {
    const { order } = route.params;

    const driverLat = 6.85123;
    const driverLng = 79.92065;
    const pickupLat = order.place.pickup_lat;
    const pickupLng = order.place.pickup_lng;

    const html = `
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<style>html,body,#map{height:100%;margin:0}</style>
</head>
<body>
<div id="map"></div>
<script>
var map = L.map('map').setView([${driverLat}, ${driverLng}], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.marker([${driverLat}, ${driverLng}]).addTo(map).bindPopup("Driver");
L.marker([${pickupLat}, ${pickupLng}]).addTo(map).bindPopup("Pickup");

fetch("https://router.project-osrm.org/route/v1/driving/${driverLng},${driverLat};${pickupLng},${pickupLat}?overview=full&geometries=geojson")
.then(res => res.json())
.then(data => {
    L.geoJSON(data.routes[0].geometry).addTo(map);
});
</script>
</body>
</html>
`;

    return <WebView source={{ html }} />;
}
