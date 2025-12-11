import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { PRIMARY_COLOR, ACCENT_COLOR } from "../../assets/theme/colors";
import { useDispatch } from "react-redux";
import styles from "../../assets/styles/customer/orderDetails";
import { useSelector } from "react-redux";

export default function EditCustomerProfileScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const order = useSelector((state) => state.order.newOrder);

    if (!order) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Order details not available.</Text>
            </View>
        );
    }

    // Dummy items — later replace with real API items
    const dummyItems = [
        { id: 1, name: "Small Parcel", qty: 1, price: "150" },
        { id: 2, name: "Medium Box", qty: 2, price: "200" },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={26} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Order Details</Text>

                <View style={{ width: 26 }} />
            </View>

            {/* Order Card */}
            <View style={styles.card}>
                <View style={styles.rowBetween}>
                    <Text style={styles.orderId}>Order #{order.id}</Text>

                    <View
                        style={[
                            styles.statusBadge,
                            order.status === "completed"
                                ? styles.statusCompleted
                                : order.status === "cancelled"
                                    ? styles.statusCancelled
                                    : styles.statusPending,
                        ]}
                    >
                        <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                    </View>
                </View>

                <Text style={styles.date}>{order.date}</Text>

                {/* Pickup */}
                <View style={styles.locationRow}>
                    <MaterialIcons name="location-pin" size={20} color={PRIMARY_COLOR} />
                    <Text style={styles.locationText}>{order.pickup_address}</Text>
                </View>

                {/* Delivery */}
                <View style={styles.locationRow}>
                    <MaterialIcons name="flag" size={20} color={ACCENT_COLOR} />
                    <Text style={styles.locationText}>{order.delivery_address}</Text>
                </View>

                {/* Items Section */}
                <Text style={styles.sectionTitle}>Items</Text>

                {dummyItems.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemName}>
                            {item.name} × {item.qty}
                        </Text>
                        <Text style={styles.itemPrice}>₹{item.price}</Text>
                    </View>
                ))}

                <View style={styles.divider} />

                {/* Total */}
                <View style={styles.rowBetween}>
                    <Text style={styles.totalLabel}>Total Amount:</Text>
                    <Text style={styles.totalValue}>₹{order.total_price}</Text>
                </View>
            </View>
        </ScrollView>
    );
}
