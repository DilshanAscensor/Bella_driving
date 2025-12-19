import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { height } = Dimensions.get("window");

export default function OrderNavigation({ order }) {
    return (
        <View style={[styles.footer, { height: height * 0.25 }]}>
            <Text style={styles.orderCode}>Order: {order.code}</Text>

            <View style={styles.infoRow}>
                <Text>Pickup: {order.pickup_name}</Text>
                <Text>{order.destination}</Text>
            </View>

            <View style={styles.actionRow}>
                <Text>ETA: {order.estimate_time}</Text>

                <TouchableOpacity style={styles.chatButton}>
                    <MaterialIcons name="headset-mic" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton}>
                    <MaterialIcons name="navigation" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: "#fff",
        padding: 12,
        borderTopWidth: 1,
        borderColor: "#ddd",
        justifyContent: "space-between",
    },
    orderCode: {
        fontWeight: "bold",
        fontSize: 16,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    chatButton: {
        flexDirection: "row",
        backgroundColor: "#1e3a8a",
        padding: 8,
        borderRadius: 6,
        alignItems: "center",
    },
    chatText: {
        color: "#fff",
        marginLeft: 5,
    },
    navButton: {
        backgroundColor: "#8DB600",
        padding: 10,
        borderRadius: 30,
    },
});
