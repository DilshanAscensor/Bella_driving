import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { confirmDeliveryApi } from '../../../../api/order';
import { useNavigation } from '@react-navigation/native';

export default function DeliveryCompletedScreen() {

    const navigation = useNavigation();
    const order = useSelector((state) => state.order.newOrder);

    const [paymentType, setPaymentType] = useState("cash");

    const handleConfirmDelivery = async () => {
        try {
            const response = await confirmDeliveryApi(order.id, paymentType);

            if (!response?.order) {
                Alert.alert("Failed", "Unable to confirm delivery");
                return;
            }

            Alert.alert("Success", "Delivery completed");
            navigation.navigate("DriverDashboard");

        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || error.message);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: verticalScale(80) }}
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Delivery Confirmation</Text>
                <Text style={styles.subtitle}>
                    Review all details before completing delivery
                </Text>

                {/* Order Details */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Order Details</Text>

                    <DetailRow label="Order Code" value={order?.order_code} />
                    <DetailRow label="Customer" value={order?.place?.delivery_name} />
                    <DetailRow label="Pickup Location" value={order?.place?.pickup_address} />
                    <DetailRow label="Delivery Location" value={order?.place?.delivery_address} />
                    <DetailRow label="Distance" value={`${order?.distance} km`} />
                    <DetailRow label="Estimated Time" value={`${order?.time} mins`} />
                </View>

                {/* Fees */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Charges</Text>
                    {order.details.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <Text style={styles.itemName}>{item.item_name} X {item.quantity}</Text>
                            <Text style={styles.itemPrice}>{item.total}</Text>
                        </View>
                    ))}

                    <DetailRow label="Transport Fee" value={`${order?.delivery_fee}`} />

                    <View style={styles.separator} />

                    <DetailRow
                        label="Total Payable"
                        value={`${order?.total_amount}`}
                        bold
                    />
                </View>

                {/* Payment Type */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Payment Type</Text>

                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={paymentType}
                            onValueChange={(itemValue) => setPaymentType(itemValue)}
                        >
                            <Picker.Item label="Cash" value="cash" />
                            <Picker.Item label="Card" value="card" />
                            <Picker.Item label="Online Payment" value="online" />
                        </Picker>
                    </View>
                </View>

                {/* Buttons */}
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmDelivery}
                >
                    <Text style={styles.confirmText}>Confirm Delivery</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const DetailRow = ({ label, value, bold }) => (
    <View style={styles.rowWrap}>
        <Text style={[styles.label, bold && { fontWeight: "700" }]}>{label}:</Text>

        <Text
            style={[
                styles.valueWrap,
                bold && { fontWeight: "700" }
            ]}
            numberOfLines={0}
        >
            {value}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(10),
        backgroundColor: "#f8fafc",
    },
    title: {
        fontSize: moderateScale(22),
        fontWeight: "700",
        marginBottom: verticalScale(5),
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: "#6b7280",
        marginBottom: verticalScale(20),
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: scale(12),
        padding: scale(15),
        marginBottom: verticalScale(20),
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    cardTitle: {
        fontSize: moderateScale(16),
        fontWeight: "600",
        marginBottom: verticalScale(10),
    },
    photo: {
        width: "100%",
        height: verticalScale(220),
        borderRadius: scale(10),
    },
    noPhoto: {
        height: verticalScale(150),
        borderRadius: scale(10),
        backgroundColor: "#f1f5f9",
        justifyContent: "center",
        alignItems: "center",
    },
    noPhotoText: {
        marginTop: verticalScale(8),
        color: "#6b7280",
        fontSize: moderateScale(13),
    },
    infoCard: {
        backgroundColor: "#fff",
        borderRadius: scale(12),
        padding: scale(15),
        marginBottom: verticalScale(20),
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    sectionTitle: {
        fontSize: moderateScale(17),
        fontWeight: "700",
        marginBottom: verticalScale(10),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: verticalScale(6),
    },
    label: {
        fontWeight: "600",
        color: "#475569",
        fontSize: moderateScale(14),
    },
    value: {
        fontWeight: "500",
        color: "#111827",
        fontSize: moderateScale(14),
    },
    separator: {
        height: verticalScale(1),
        backgroundColor: "#e5e7eb",
        marginVertical: verticalScale(10),
    },
    pickerWrapper: {
        backgroundColor: "#f1f5f9",
        borderRadius: scale(8),
    },
    confirmButton: {
        marginTop: verticalScale(25),
        backgroundColor: "#1e3a8a",
        padding: verticalScale(15),
        borderRadius: scale(10),
        alignItems: "center",
    },
    confirmText: {
        color: "#fff",
        fontSize: moderateScale(18),
        fontWeight: "600",
    },
    backButton: {
        marginTop: verticalScale(15),
        padding: verticalScale(12),
        alignItems: "center",
    },
    backText: {
        fontSize: moderateScale(16),
        color: "#475569",
    },
    rowWrap: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: verticalScale(6),
    },

    valueWrap: {
        flex: 1,
        marginLeft: scale(10),
        fontSize: moderateScale(14),
        fontWeight: "500",
        color: "#111827",
        flexWrap: "wrap",
    },
    itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: scale(6) },
    itemName: { fontSize: scale(15), fontWeight: "500" },
    itemQuantity: { fontSize: scale(15) },
    itemPrice: { fontSize: scale(15), fontWeight: "600" },
});
