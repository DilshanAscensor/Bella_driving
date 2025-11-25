import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';

export default function AcceptDeliveryScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>

            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}></Text>
            </View>

            <View style={styles.cardContainer}>

                <View style={styles.topRow}>
                    <Text style={styles.newRequest}>NEW REQUEST</Text>
                    <Text style={styles.timer}>Ends in 24s</Text>
                </View>

                <View style={styles.restaurantRow}>
                    <Image
                        source={{
                            uri: "https://img.icons8.com/?size=512&id=59837&format=png",
                        }}
                        style={styles.restaurantIcon}
                    />
                    <View>
                        <Text style={styles.restaurantName}>Burger King</Text>
                        <Text style={styles.subText}>1.2 km away • 3 items</Text>
                    </View>

                    <Text style={styles.earnings}>$5.75</Text>
                </View>

                <View style={styles.locationRow}>
                    <MaterialIcons name="store-mall-directory" size={20} color="#2c3e50" />
                    <Text style={styles.locationText}>123 Colombo</Text>
                </View>

                <View style={styles.locationRow}>
                    <MaterialIcons name="navigation" size={20} color="#1e90ff" />
                    <Text style={styles.locationText}>456 ABC Ave</Text>
                </View>

                <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.declineBtn}>
                        <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.acceptBtn} onPress={() => navigation.navigate("PickupConfirm")}>
                        <Text style={styles.acceptText}>Accept Delivery</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f2f5",
    },

    mapPlaceholder: {
        flex: 1,
        backgroundColor: "#d9d9d9",
        justifyContent: "center",
        alignItems: "center",
    },

    mapText: {
        color: "#7a7a7a",
        fontSize: scale(16),
    },

    cardContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        padding: scale(20),
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        elevation: 12,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    newRequest: {
        color: "#8DB600",
        fontWeight: "700",
        fontSize: scale(12),
    },

    timer: {
        color: "#6b7280",
    },

    restaurantRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: scale(12),
    },

    restaurantIcon: {
        width: scale(40),
        height: scale(40),
        marginRight: scale(12),
    },

    restaurantName: {
        fontSize: scale(18),
        fontWeight: "700",
    },

    subText: {
        color: "#6b7280",
        fontSize: scale(13),
    },

    earnings: {
        marginLeft: "auto",
        fontSize: scale(20),
        fontWeight: "700",
        color: "#111",
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: scale(12),
    },

    locationText: {
        marginLeft: scale(8),
        fontSize: scale(15),
        color: "#111",
    },

    btnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: scale(20),
    },

    declineBtn: {
        flex: 1,
        backgroundColor: "#e5e7eb",
        padding: scale(12),
        borderRadius: moderateScale(10),
        alignItems: "center",
        marginRight: scale(10),
    },

    declineText: {
        color: "#374151",
        fontSize: scale(16),
        fontWeight: "600",
    },

    acceptBtn: {
        flex: 1,
        backgroundColor: "#8DB600",
        padding: scale(12),
        borderRadius: moderateScale(10),
        alignItems: "center",
        marginLeft: scale(10),
    },

    acceptText: {
        color: "#fff",
        fontSize: scale(16),
        fontWeight: "700",
    },
});
