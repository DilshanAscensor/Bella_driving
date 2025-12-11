import React from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import { acceptOrder } from '../../../../api/order';

export default function AcceptDeliveryScreen() {
    const order = useSelector((state) => state.order.newOrder);
    const navigation = useNavigation();

    if (!order) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No order loaded.</Text>
            </View>
        );
    }


    const acceptPickup = async () => {
        try {
            const response = await acceptOrder(order.id);

            if (!response) {
                Alert.alert("Failed", "Failed to accept");
                return;
            }
            navigation.navigate("PickupConfirm");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };


    // Compute total items
    const totalItems = order.details.reduce((sum, item) => sum + Number(item.quantity), 0);

    return (
        <View style={styles.container}>
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>Map Placeholder</Text>
            </View>

            <View style={styles.cardContainer}>
                <ScrollView>
                    {/* Header */}
                    <View style={styles.topRow}>
                        <Text style={styles.newRequest}>NEW REQUEST</Text>
                        <Text style={styles.timer}>Ends in 24s</Text>
                    </View>

                    {/* Restaurant info */}
                    <View style={styles.restaurantRow}>
                        <Image
                            source={{
                                uri: "https://img.icons8.com/?size=512&id=59837&format=png",
                            }}
                            style={styles.restaurantIcon}
                        />
                        <View>
                            <Text style={styles.restaurantName}>{order.place.pickup_name}</Text>
                            <Text style={styles.subText}>
                                {order.place.distance_km || "1.2"} km away • {totalItems} items
                            </Text>
                        </View>
                        {/* <Text style={styles.earnings}>{order.total_amount}</Text> */}
                    </View>

                    {/* Pickup address */}
                    <View style={styles.locationRow}>
                        <MaterialIcons name="store-mall-directory" size={20} color="#2c3e50" />
                        <Text style={styles.locationText}>{order.place.pickup_address}</Text>
                    </View>

                    {/* Delivery address */}
                    <View style={styles.locationRow}>
                        <MaterialIcons name="navigation" size={20} color="#1e90ff" />
                        <Text style={styles.locationText}>{order.place.delivery_address}</Text>
                    </View>

                    {/* Note */}
                    {order.note ? (
                        <View style={styles.noteRow}>
                            <Text style={styles.noteText}>Note: {order.note}</Text>
                        </View>
                    ) : null}

                    {/* Buttons */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.declineBtn} onPress={() => navigation.goBack()}>
                            <Text style={styles.declineText}>Decline</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={acceptPickup}
                        >
                            <Text style={styles.acceptText}>Accept Delivery</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f0f2f5" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { fontSize: scale(16), color: "#7a7a7a" },

    mapPlaceholder: { flex: 1, backgroundColor: "#d9d9d9", justifyContent: "center", alignItems: "center" },
    mapText: { color: "#7a7a7a", fontSize: scale(16) },

    cardContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        padding: scale(20),
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        elevation: 12,
        maxHeight: "80%",
    },

    topRow: { flexDirection: "row", justifyContent: "space-between" },
    newRequest: { color: "#8DB600", fontWeight: "700", fontSize: scale(12) },
    timer: { color: "#6b7280" },

    restaurantRow: { flexDirection: "row", alignItems: "center", marginTop: scale(12) },
    restaurantIcon: { width: scale(40), height: scale(40), marginRight: scale(12) },
    restaurantName: { fontSize: scale(18), fontWeight: "700" },
    subText: { color: "#6b7280", fontSize: scale(13) },
    earnings: { marginLeft: "auto", fontSize: scale(20), fontWeight: "700", color: "#111" },

    locationRow: { flexDirection: "row", alignItems: "center", marginTop: scale(12) },
    locationText: { marginLeft: scale(8), fontSize: scale(15), color: "#111" },

    noteRow: { marginTop: scale(12) },
    noteText: { fontSize: scale(14), color: "#374151" },

    itemsContainer: { marginTop: scale(12), borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: scale(8) },
    itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: scale(6) },
    itemName: { fontSize: scale(14), fontWeight: "500" },
    itemQuantity: { fontSize: scale(14) },
    itemPrice: { fontSize: scale(14), fontWeight: "600" },

    btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: scale(20) },
    declineBtn: { flex: 1, backgroundColor: "#e5e7eb", padding: scale(12), borderRadius: moderateScale(10), alignItems: "center", marginRight: scale(10) },
    declineText: { color: "#374151", fontSize: scale(16), fontWeight: "600" },
    acceptBtn: { flex: 1, backgroundColor: "#8DB600", padding: scale(12), borderRadius: moderateScale(10), alignItems: "center", marginLeft: scale(10) },
    acceptText: { color: "#fff", fontSize: scale(16), fontWeight: "700" },
});
