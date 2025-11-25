import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useNavigation } from '@react-navigation/native';
export default function PickupConfirmScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            {/* MAP AREA */}
            <View style={styles.mapArea}>
                <Text style={styles.mapText}>Google Map Here</Text>

                {/* Floating Navigation Button */}
                <TouchableOpacity style={styles.navButton}>
                    <MaterialIcons name="navigation" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* BOTTOM CARD */}
            <View style={styles.cardContainer}>

                {/* Drag Handle */}
                <View style={styles.dragHandle} />

                {/* Pickup Title */}
                <View style={styles.titleRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.pickupTitle}>Pickup at Restaurant</Text>
                        <Text style={styles.pickupAddress}>123 Main St, Downtown</Text>
                    </View>

                    <Image
                        source={{
                            uri: "https://img.icons8.com/?size=512&id=59837&format=png",
                        }}
                        style={styles.restaurantIcon}
                    />
                </View>

                {/* Order Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ORDER DETAILS</Text>
                    <Text style={styles.orderId}>ID: #8541</Text>
                </View>

                <View style={styles.orderList}>
                    <Text style={styles.item}>1x Whopper Meal</Text>
                    <Text style={styles.item}>1x Coke Zero</Text>
                </View>

                {/* Buttons Row */}
                <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.smallBtn}>
                        <MaterialIcons name="call" size={22} color="#4b5563" />
                        <Text style={styles.smallBtnText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.smallBtn}>
                        <MaterialIcons name="chat" size={22} color="#4b5563" />
                        <Text style={styles.smallBtnText}>Chat</Text>
                    </TouchableOpacity>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity style={styles.confirmBtn} onPress={() => navigation.navigate("PickupPhotoUpload")}>
                    <Text style={styles.confirmText}>Confirm Pickup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eef1f4",
    },

    mapArea: {
        flex: 1,
        backgroundColor: "#dce0e6",
        justifyContent: "center",
        alignItems: "center",
    },

    mapText: {
        color: "#6b7280",
        fontSize: scale(16),
    },

    navButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#2563eb",
        width: 55,
        height: 55,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
    },

    cardContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: scale(20),
        elevation: 25,
    },

    dragHandle: {
        width: 50,
        height: 5,
        backgroundColor: "#d1d5db",
        borderRadius: 5,
        alignSelf: "center",
        marginBottom: scale(12),
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    pickupTitle: {
        fontSize: scale(18),
        fontWeight: "700",
        color: "#111827",
    },

    pickupAddress: {
        color: "#6b7280",
        marginTop: 3,
    },

    restaurantIcon: {
        width: 42,
        height: 42,
        marginLeft: scale(10),
    },

    section: {
        marginTop: scale(20),
        flexDirection: "row",
    },

    sectionTitle: {
        flex: 1,
        fontSize: scale(14),
        fontWeight: "700",
        color: "#374151",
    },

    orderId: {
        color: "#6b7280",
    },

    orderList: {
        backgroundColor: "#f9fafb",
        padding: scale(12),
        borderRadius: 10,
        marginTop: scale(10),
    },

    item: {
        fontSize: scale(15),
        paddingVertical: 3,
        color: "#1f2937",
    },

    btnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: scale(20),
    },

    smallBtn: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        padding: scale(12),
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },

    smallBtnText: {
        marginLeft: 8,
        fontSize: scale(15),
        color: "#374151",
        fontWeight: "600",
    },

    confirmBtn: {
        backgroundColor: "#1e3a8a",
        padding: scale(16),
        borderRadius: 14,
        alignItems: "center",
        marginTop: scale(20),
    },

    confirmText: {
        color: "#fff",
        fontSize: scale(17),
        fontWeight: "700",
    },
});
