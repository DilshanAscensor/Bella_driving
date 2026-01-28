import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert,
    Dimensions,
    BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import styles from '../../../../assets/styles/acceptOrder';
import { getOrderById, acceptOrder, rejectOrder } from '../../../../api/order';
import apiClient from '../../../../api/apiClient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stopOrderSound } from '../../../../utils/notificationSound';
import messaging from '@react-native-firebase/messaging';

const { height } = Dimensions.get('window');

const AcceptDeliveryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { order_id } = route.params || {};

    const driver = useSelector(state => state.user.user);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [handledTaken, setHandledTaken] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);

    /* ================= ACTIVE ORDER CHECK ================= */
    const checkActiveOrder = async () => {
        try {
            const res = await apiClient.get('/drivers/active-order');
            const active = res?.data?.data;

            if (active) {
                Alert.alert(
                    'Ongoing Order',
                    'Please complete your current order before accepting a new one.',
                    [{
                        text: 'Go to Order',
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'PickupMap', params: { order_id: active.id } }],
                            });
                        }
                    }],
                    { cancelable: false }
                );
                return false;
            }

            return true;
        } catch {
            return true;
        }
    };

    /* ================= ONE-TIME HANDLER ================= */
    const handleOrderTaken = useCallback(() => {
        if (handledTaken) return;
        setHandledTaken(true);
        setDisabled(true);

        stopOrderSound();

        Alert.alert(
            'Order Unavailable',
            'Order already taken by another driver',
            [
                {
                    text: 'Close',
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'DriverDashboard' }],
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    }, [handledTaken]);

    /* ================= REALTIME LISTENER ================= */
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const type = remoteMessage?.data?.type;
            const oid = remoteMessage?.data?.order_id;
            const acceptedBy = remoteMessage?.data?.accepted_by;

            if (oid != order_id) return;

            // 🔒 ignore if I am currently accepting
            if (isAccepting) return;

            // 🔒 ignore self-accept event
            if (acceptedBy && acceptedBy == driver?.id) return;

            if (type === 'order_taken' || type === 'order_cancelled') {
                handleOrderTaken();
            }
        });

        return unsubscribe;
    }, [order_id, driver?.id, isAccepting, handleOrderTaken]);


    /* ================= POLLING BACKUP ================= */
    useEffect(() => {
        const interval = setInterval(async () => {
            if (handledTaken) return;
            try {
                const res = await getOrderById(order_id);
                const latest = res.data ?? res;

                if (latest?.status && latest.status !== 'pending') {
                    if (isAccepting) return;
                    if (latest?.driver_id && latest.driver_id == driver?.id) return;
                    handleOrderTaken();
                }
            } catch { }
        }, 4000);

        return () => clearInterval(interval);
    }, [order_id, handledTaken, handleOrderTaken, driver?.id]);

    /* ================= FOCUS EFFECT ================= */
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true;

            (async () => {
                const canProceed = await checkActiveOrder();
                if (!canProceed) return;
                fetchOrder();
            })();

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [order_id])
    );

    /* ================= LOAD ORDER ================= */
    const fetchOrder = async () => {
        try {
            const response = await getOrderById(order_id);
            const orderData = response.data ?? response;

            if (orderData?.status && orderData.status !== 'pending') {
                // if accepted by this driver, go to active order
                if (orderData?.driver_id == driver?.id) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'PickupMap', params: { order_id: orderData.id } }],
                    });
                    return;
                }

                handleOrderTaken();
                return;
            }

            setOrder(orderData);
        } catch (e) {
            Alert.alert('Error', 'Failed to load order');
            navigation.reset({
                index: 0,
                routes: [{ name: 'DriverDashboard' }],
            });
        } finally {
            setLoading(false);
        }
    };

    /* ================= ACCEPT ================= */
    const handleAccept = async () => {
        try {
            if (disabled || processing) return;
            setIsAccepting(true);
            setProcessing(true);
            stopOrderSound();

            // final active-order check
            const canProceed = await checkActiveOrder();
            if (!canProceed) {
                setProcessing(false);
                return;
            }

            await acceptOrder(order.id);

            setProcessing(false);

            navigation.reset({
                index: 0,
                routes: [{ name: 'PickupMap', params: { order_id: order.id } }],
            });
        } catch (e) {
            stopOrderSound();
            setProcessing(false);

            const status = e?.response?.status;

            if (status === 409) {
                handleOrderTaken();
            }

            if (status === 423) {
                Alert.alert(
                    'Ongoing Order',
                    'Complete your current order before accepting a new one',
                    [{
                        text: 'Go to Order',
                        onPress: async () => {
                            try {
                                const res = await apiClient.get('/drivers/active-order');
                                const active = res?.data?.data;
                                if (active) {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'PickupMap', params: { order_id: active.id } }],
                                    });
                                }
                            } catch { }
                        }
                    }]
                );
            }

            if (!status) {
                Alert.alert('Error', 'Network error');
            }
        }
    };

    /* ================= DECLINE ================= */
    const handleDecline = async () => {
        try {
            stopOrderSound();

            await rejectOrder(order.id, 'Driver declined');

            navigation.reset({
                index: 0,
                routes: [{ name: 'DriverDashboard' }],
            });


        } catch (e) {
            console.log('Decline error', e?.response?.data || e.message);


            navigation.reset({
                index: 0,
                routes: [{ name: 'DriverDashboard' }],
            });
        }
    };

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 8 }}>Loading order…</Text>
            </View>
        );
    }

    if (!order) return null;

    /* ================= MAP DATA ================= */
    const pickup = {
        lat: Number(order?.place?.pickup_lat ?? '7.925360129479699'),
        lng: Number(order?.place?.pickup_lng ?? '81.56944681983668'),
    };

    const delivery = {
        lat: Number(order?.place?.delivery_lat ?? '7.860948705987937'),
        lng: Number(order?.place?.delivery_lng ?? '81.53975152116719'),
    };

    const driverPos = {
        lat: Number(order?.driver_lat ?? 7.91173),
        lng: Number(order?.driver_lng ?? 81.561939),
    };

    /* ================= MAP HTML ================= */
    const mapHtml = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<style>html, body, #map { height:100%; margin:0; padding:0; }</style>
</head>
<body>
<div id="map"></div>
<script>
const driver = { lat:${driverPos.lat}, lng:${driverPos.lng} };
const pickup = { lat:${pickup.lat}, lng:${pickup.lng} };
const delivery = { lat:${delivery.lat}, lng:${delivery.lng} };
const map = L.map('map').setView([driver.lat, driver.lng], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
const markers = [
  L.marker([driver.lat, driver.lng]).bindPopup('Driver'),
  L.marker([pickup.lat, pickup.lng]).bindPopup('Pickup'),
  L.marker([delivery.lat, delivery.lng]).bindPopup('Drop')
];
markers.forEach(m => m.addTo(map));
map.fitBounds(L.featureGroup(markers).getBounds(), { padding:[40,40] });
</script>
</body>
</html>`;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                <WebView
                    originWhitelist={['*']}
                    javaScriptEnabled
                    domStorageEnabled
                    mixedContentMode="always"
                    source={{ html: mapHtml }}
                    style={{ flex: 1 }}
                />

                <View style={styles.sheetDark}>
                    <Text style={styles.orderId}>{order.order_code}</Text>

                    <View style={styles.rowBetween}>
                        <Text style={styles.customerName}>
                            {order?.place?.delivery_name ?? 'Customer'}
                        </Text>
                        <View style={styles.urgentBadge}>
                            <Text style={styles.urgentText}>URGENT</Text>
                        </View>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.meta}>Distance{'\n'}<Text style={styles.metaValue}>{order.distance ?? '0.35'} KM</Text></Text>
                        <Text style={styles.meta}>Price{'\n'}<Text style={styles.metaValue}>{order.total_amount ?? '250'}</Text></Text>
                    </View>

                    <View style={styles.locationBlock}>
                        <Text style={styles.locationTitle}>PICK-UP</Text>
                        <Text style={styles.locationText}>{order.place.pickup_address}</Text>
                    </View>

                    <View style={styles.locationBlock}>
                        <Text style={styles.locationTitle}>DESTINATION</Text>
                        <Text style={styles.locationText}>{order.place.delivery_address}</Text>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.ignoreBtn} onPress={handleDecline}>
                            <Text style={styles.ignoreText}>IGNORE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.acceptBtn, (processing || disabled) && { opacity: 0.5 }]}
                            disabled={processing || disabled}
                            onPress={handleAccept}
                        >
                            <Text style={styles.acceptText}>ACCEPT</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal transparent visible={processing}>
                    <View style={styles.center}>
                        <ActivityIndicator size="large" />
                        <Text style={{ marginTop: 10 }}>Accepting order…</Text>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    );
};

export default AcceptDeliveryScreen;
