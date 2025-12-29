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
    ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';

import { getOrderById, acceptOrder } from '../../../../api/order';

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

    // ---------------- MAP ----------------
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
        var map = L.map('map').setView([${order.place.pickup_lat}, ${order.place.pickup_lng}], 14);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([${order.place.pickup_lat}, ${order.place.pickup_lng}]).addTo(map).bindPopup('Pickup');
        L.marker([${order.place.delivery_lat}, ${order.place.delivery_lng}]).addTo(map).bindPopup('Drop');
      </script>
    </body>
    </html>
  `;

    // ---------------- UI ----------------
    return (
        <View style={styles.root}>

            {/* MAP */}
            <WebView source={{ html: mapHtml }} style={StyleSheet.absoluteFill} />

            {/* BOTTOM SHEET */}
            <View style={styles.sheet}>

                {/* HANDLE */}
                <View style={styles.handle} />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <Text style={styles.title}>New Delivery Request</Text>

                    <Text style={styles.orderCode}>
                        Order • {order?.order_code}
                    </Text>

                    {/* PICKUP */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pickup</Text>
                        <Text style={styles.placeName}>
                            {order?.place?.pickup_name}
                        </Text>
                        <Text style={styles.address}>
                            {order?.place?.pickup_address}
                        </Text>
                    </View>

                    {/* DROP */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Drop</Text>
                        <Text style={styles.placeName}>
                            {order?.place?.delivery_name}
                        </Text>
                        <Text style={styles.address}>
                            {order?.place?.delivery_address}
                        </Text>
                    </View>

                    {/* ORDER SUMMARY */}
                    <View style={styles.summary}>
                        <Text style={styles.summaryText}>
                            Items: {order?.details?.length ?? 0}
                        </Text>
                        {/* <Text style={styles.summaryText}>
                            Total: Rs. {order?.total_amount}
                        </Text> */}
                    </View>

                    {/* ACTIONS */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.declineBtn}
                            onPress={handleDecline}
                        >
                            <Text>Decline</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={handleAccept}
                        >
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>

            {/* PROCESSING MODAL */}
            <Modal transparent visible={processing}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                    <Text style={{ marginTop: 10 }}>Accepting order…</Text>
                </View>
            </Modal>

        </View>
    );
};

export default AcceptDeliveryScreen;

//
// ---------------- STYLES ----------------
//
const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },

    // Bottom Sheet
    sheet: {
        position: 'absolute',
        bottom: 0,
        height: height * 0.45,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    handle: {
        width: 50,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 8,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    orderCode: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        color: '#555',
    },

    section: {
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#888',
        marginBottom: 2,
    },
    placeName: {
        fontSize: 15,
        fontWeight: '600',
    },
    address: {
        fontSize: 13,
        color: '#666',
    },

    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    summaryText: {
        fontWeight: '600',
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    declineBtn: {
        width: '48%',
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#eee',
        alignItems: 'center',
    },
    acceptBtn: {
        width: '48%',
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#8DB600',
        alignItems: 'center',
    },
    acceptText: {
        color: '#fff',
        fontWeight: '700',
    },
});
