import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../../../../assets/styles/acceptOrder';
import { getOrderById, acceptOrder } from '../../../../api/order';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const AcceptDeliveryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { order_id } = route.params || {};

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // ---------------- LOAD ORDER ----------------
    useEffect(() => {
        if (!order_id) {
            Alert.alert('Error', 'Order ID missing');
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
            Alert.alert('Error', 'Failed to load order');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    // ---------------- ACCEPT ----------------
    const handleAccept = async () => {
        try {
            setProcessing(true);
            await acceptOrder(order.id);
            setProcessing(false);

            navigation.replace('PickupMap', {
                order_id: order.id,
            });
        } catch (e) {
            setProcessing(false);
            Alert.alert('Error', 'Failed to accept order');
        }
    };

    // ---------------- DECLINE ----------------
    const handleDecline = () => {
        navigation.goBack();
    };

    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 8 }}>Loading order…</Text>
            </View>
        );
    }

    if (!order) return null;

    const driver = {
        lat: Number(order?.driver_lat ?? 6.86495),
        lng: Number(order?.driver_lng ?? 79.89962),
    };

    const pickup = {
        lat: Number(order?.place?.pickup_lat ?? 6.9271),
        lng: Number(order?.place?.pickup_lng ?? 79.8612),
    };

    const delivery = {
        lat: Number(order?.place?.delivery_lat ?? 6.861),
        lng: Number(order?.place?.delivery_lng ?? 79.899),
    };
    // ---------------- MAP ----------------
    const mapHtml = `
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
    const driver = { lat: ${driver.lat}, lng: ${driver.lng} };
    const pickup = { lat: ${pickup.lat}, lng: ${pickup.lng} };
    const delivery = { lat: ${delivery.lat}, lng: ${delivery.lng} };

    const map = L.map('map').setView(
      [driver.lat, driver.lng],
      14
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    const markers = [
      L.marker([driver.lat, driver.lng]).bindPopup('Driver'),
      L.marker([pickup.lat, pickup.lng]).bindPopup('Pickup'),
      L.marker([delivery.lat, delivery.lng]).bindPopup('Drop')
    ];

    markers.forEach(m => m.addTo(map));

    map.fitBounds(
      L.featureGroup(markers).getBounds(),
      { padding: [40, 40] }
    );
  </script>
</body>
</html>
`;

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.root}>

                {/* MAP */}
                <WebView
                    source={{ html: mapHtml }}
                    style={StyleSheet.absoluteFill}
                />

                {/* BOTTOM CARD */}
                <View style={styles.sheetDark}>

                    <Text style={styles.orderId}>
                        {order.order_code}
                    </Text>

                    <View style={styles.rowBetween}>
                        <Text style={styles.customerName}>
                            {order?.place?.delivery_name ?? 'Customer'}
                        </Text>

                        <View style={styles.urgentBadge}>
                            <Text style={styles.urgentText}>URGENT</Text>
                        </View>
                    </View>

                    {/* Distance & Price */}
                    <View style={styles.rowBetween}>
                        <Text style={styles.meta}>
                            Distance{'\n'}
                            <Text style={styles.metaValue}>
                                {order.distance ?? '0.35'} KM
                            </Text>
                        </Text>

                        <Text style={styles.meta}>
                            Price{'\n'}
                            <Text style={styles.metaValue}>
                                {order.delivery_fee ?? '6.50'}
                            </Text>
                        </Text>
                    </View>

                    {/* PICKUP */}
                    <View style={styles.locationBlock}>
                        <Text style={styles.locationTitle}>PICK-UP</Text>
                        <Text style={styles.locationText}>
                            {order.place.pickup_address}
                        </Text>
                    </View>

                    {/* DROP */}
                    <View style={styles.locationBlock}>
                        <Text style={styles.locationTitle}>DESTINATION</Text>
                        <Text style={styles.locationText}>
                            {order.place.delivery_address}
                        </Text>
                    </View>

                    {/* INFO */}
                    <View style={styles.bullets}>
                        <Text style={styles.bullet}>• Time sensitive</Text>
                        <Text style={styles.bullet}>• Handpicked resources</Text>
                        <Text style={styles.bullet}>
                            • Instant pickup and doorstep drop-off
                        </Text>
                    </View>

                    {/* ACTIONS */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.ignoreBtn}
                            onPress={handleDecline}
                        >
                            <Text style={styles.ignoreText}>IGNORE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={handleAccept}
                        >
                            <Text style={styles.acceptText}>ACCEPT</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                {/* PROCESSING */}
                <Modal transparent visible={processing}>
                    <View style={styles.center}>
                        <ActivityIndicator size="large" />
                        <Text style={{ marginTop: 10 }}>
                            Accepting order…
                        </Text>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    );
};

export default AcceptDeliveryScreen;
