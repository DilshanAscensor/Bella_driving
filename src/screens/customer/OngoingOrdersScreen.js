import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { ACCENT_COLOR, PRIMARY_COLOR } from "../../assets/theme/colors";
import styles from "../../assets/styles/customer/ongoingOrders";
import { SafeAreaView } from "react-native-safe-area-context";

const OngoingOrdersScreen = () => {
    const navigation = useNavigation();

    const customer = useSelector((state) => state.user.user);
    const ongoingOrder = useSelector((state) => state.order.currentOrder);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOngoingOrders();
    }, []);

    const fetchOngoingOrders = async () => {
        try {
            setLoading(true);
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <Text style={styles.pageTitle}>Your Ongoing Order</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                ) : ongoingOrder ? (
                    <View style={styles.orderCard}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.label}>Order ID:</Text>
                            <Text style={styles.value}>#{ongoingOrder.id}</Text>
                        </View>

                        <View style={[styles.statusBox, styles.statusInProgress]}>
                            <MaterialIcons name="directions-bike" color="#fff" size={22} />
                            <Text style={styles.statusText}>
                                {ongoingOrder.status?.toUpperCase() || "IN PROGRESS"}
                            </Text>
                        </View>

                        {/* PICKUP */}
                        <View style={styles.section}>
                            <MaterialIcons name="location-pin" size={22} color={PRIMARY_COLOR} />
                            <View style={styles.sectionTextBox}>
                                <Text style={styles.sectionLabel}>Pickup Location</Text>
                                <Text style={styles.sectionValue}>
                                    {ongoingOrder.pickup_address || "N/A"}
                                </Text>
                            </View>
                        </View>

                        {/* DELIVERY */}
                        <View style={styles.section}>
                            <MaterialIcons name="flag" size={22} color={ACCENT_COLOR} />
                            <View style={styles.sectionTextBox}>
                                <Text style={styles.sectionLabel}>Delivery Location</Text>
                                <Text style={styles.sectionValue}>
                                    {ongoingOrder.delivery_address || "N/A"}
                                </Text>
                            </View>
                        </View>

                        {/* DRIVER */}
                        <View style={styles.section}>
                            <MaterialIcons name="person" size={22} color="#444" />
                            <View style={styles.sectionTextBox}>
                                <Text style={styles.sectionLabel}>Driver</Text>
                                <Text style={styles.sectionValue}>
                                    {ongoingOrder.driver?.first_name || "Searching for driver..."}
                                </Text>
                            </View>
                        </View>

                        {/* ORDER AMOUNT */}
                        <View style={styles.rowBetween}>
                            <Text style={styles.label}>Amount:</Text>
                            <Text style={styles.amount}>
                                ₹{ongoingOrder.total_price || "0.00"}
                            </Text>
                        </View>

                        {/* BUTTON: View More Details */}
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() =>
                                navigation.navigate("OrderDetailsScreen", { order: ongoingOrder })
                            }
                        >
                            <Text style={styles.btnText}>View Order Details</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.emptyBox}>
                        <MaterialIcons name="info-outline" size={40} color="#777" />
                        <Text style={styles.emptyText}>No ongoing orders right now.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};


export default OngoingOrdersScreen;
