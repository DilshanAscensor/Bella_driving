import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Footer from '../../../../components/Footer';
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#1e3a8a";
const ACCENT = "#8DB600";
const TEXT_DARK = "#111";
const TEXT_LIGHT = "#6b7280";
const BG = "#fff";

export default function OrderDetailsScreen({ navigation, route }) {
    const order = route?.params?.order || {
        orderId: "ORD-9021",
        pickup: "Starbucks - City Center",
        dropoff: "12 Park Avenue, Apt 3",
        distance: "3.2 km",
        time: "12 mins",
        items: "2 Items",
        customer: "John Doe",
        phone: "+1 987 654 3210",
        price: "$14.20",
    };
    const [active, setActive] = useState("home");
    const startPickup = () => {
        navigation.navigate("PickupPhotoUpload", { order });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER TOP */}
                <View style={styles.topHeader}>
                    <Text style={styles.orderTitle}>Order Summary</Text>
                    <Text style={styles.orderId}>#{order.orderId}</Text>
                </View>

                {/* ORDER CARD */}
                <View style={styles.card}>

                    {/* PICKUP */}
                    <View style={styles.sectionBlock}>
                        <Text style={styles.sectionHeader}>Pickup</Text>

                        <View style={styles.row}>
                            <MaterialIcons
                                name="store-mall-directory"
                                size={scale(26)}
                                color={PRIMARY}
                            />
                            <Text style={styles.value}>{order.pickup}</Text>
                        </View>
                    </View>

                    {/* DROPOFF */}
                    <View style={styles.sectionBlock}>
                        <Text style={styles.sectionHeader}>Drop-off</Text>

                        <View style={styles.row}>
                            <MaterialIcons
                                name="location-on"
                                size={scale(26)}
                                color={"#dc2626"}
                            />
                            <Text style={styles.value}>{order.dropoff}</Text>
                        </View>
                    </View>

                    {/* DELIVERY DETAILS */}
                    <View style={styles.sectionBlock}>
                        <Text style={styles.sectionHeader}>Delivery Info</Text>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="route"
                                size={scale(22)}
                                color={TEXT_LIGHT}
                            />
                            <Text style={styles.detailText}>
                                Distance: {order.distance}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="schedule"
                                size={scale(22)}
                                color={TEXT_LIGHT}
                            />
                            <Text style={styles.detailText}>
                                Estimated Time: {order.time}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="receipt-long"
                                size={scale(22)}
                                color={TEXT_LIGHT}
                            />
                            <Text style={styles.detailText}>
                                Items: {order.items}
                            </Text>
                        </View>
                    </View>

                    {/* CUSTOMER SECTION */}
                    <View style={styles.sectionBlock}>
                        <Text style={styles.sectionHeader}>Customer</Text>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="person"
                                size={scale(22)}
                                color={TEXT_LIGHT}
                            />
                            <Text style={styles.detailText}>
                                {order.customer}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="phone"
                                size={scale(22)}
                                color={TEXT_LIGHT}
                            />
                            <Text style={styles.detailText}>
                                {order.phone}
                            </Text>
                        </View>
                    </View>

                    {/* PAYMENT */}
                    <View style={styles.sectionBlock}>
                        <Text style={styles.sectionHeader}>Payment</Text>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="attach-money"
                                size={scale(26)}
                                color={ACCENT}
                            />
                            <Text style={styles.price}>{order.price}</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* FIXED BUTTON */}
            {/* <View style={styles.fixedButtonContainer}>
                <TouchableOpacity
                    style={styles.startBtn}
                    onPress={startPickup}
                >
                    <Text style={styles.startText}>Start Pickup</Text>
                </TouchableOpacity>
            </View> */}
            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: scale(16),
    },

    topHeader: {
        paddingVertical: verticalScale(10),
        marginBottom: verticalScale(15),
    },
    orderTitle: {
        fontSize: scale(20),
        fontWeight: "700",
        color: PRIMARY,
    },
    orderId: {
        fontSize: scale(14),
        fontWeight: "600",
        color: TEXT_LIGHT,
        marginTop: 4,
    },

    card: {
        backgroundColor: "#fff",
        padding: scale(18),
        borderRadius: moderateScale(16),
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        marginBottom: verticalScale(80),
    },

    sectionBlock: {
        marginBottom: verticalScale(20),
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingBottom: verticalScale(15),
    },

    sectionHeader: {
        fontSize: scale(16),
        fontWeight: "700",
        color: TEXT_DARK,
        marginBottom: verticalScale(10),
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: verticalScale(6),
    },

    value: {
        fontSize: scale(15),
        marginLeft: scale(10),
        fontWeight: "600",
        color: TEXT_DARK,
        flexShrink: 1,
    },

    detailText: {
        marginLeft: scale(10),
        fontSize: scale(14),
        color: TEXT_LIGHT,
    },

    price: {
        marginLeft: scale(10),
        fontSize: scale(20),
        color: PRIMARY,
        fontWeight: "700",
    },

    fixedButtonContainer: {
        position: "absolute",
        bottom: scale(40),
        left: 0,
        right: 0,
        padding: scale(20),
        backgroundColor: "#fff",
        elevation: 10,
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
    },

    startBtn: {
        backgroundColor: ACCENT,
        paddingVertical: verticalScale(14),
        marginVertical: verticalScale(15),
        borderRadius: moderateScale(12),
        alignItems: "center",
    },
    startText: {
        color: "#fff",
        fontSize: scale(16),
        fontWeight: "700",
    },
});
