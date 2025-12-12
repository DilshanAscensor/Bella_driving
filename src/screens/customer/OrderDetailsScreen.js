import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PRIMARY_COLOR, ACCENT_COLOR } from "../../assets/theme/colors";
import styles from "../../assets/styles/customer/orderDetails";

export default function CustomerOrderDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const order = route.params?.order;

    if (!order) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Order details not available.</Text>
            </View>
        );
    }

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
                            order.status === "delivered"
                                ? styles.statusCompleted
                                : order.status === "cancelled"
                                    ? styles.statusCancelled
                                    : styles.statusPending,
                        ]}
                    >
                        <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                    </View>
                </View>

                <Text style={styles.date}>
                    {new Date(order.created_at).toLocaleString()}
                </Text>

                {/* Pickup */}
                <View style={styles.locationRow}>
                    <MaterialIcons name="location-pin" size={20} color={PRIMARY_COLOR} />
                    <Text style={styles.locationText}>
                        {order.place?.pickup_address}
                    </Text>
                </View>

                {/* Delivery */}
                <View style={styles.locationRow}>
                    <MaterialIcons name="flag" size={20} color={ACCENT_COLOR} />
                    <Text style={styles.locationText}>
                        {order.place?.delivery_address}
                    </Text>
                </View>

                {/* Items Section */}
                <Text style={styles.sectionTitle}>Items</Text>

                {order.details?.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemName}>
                            {item.item_name} × {item.quantity}
                        </Text>
                        <Text style={styles.itemPrice}>{item.item_price}</Text>
                    </View>
                ))}

                <View style={styles.divider} />

                {/* Summary */}
                <View style={styles.rowBetween}>
                    <Text style={styles.totalLabel}>Subtotal:</Text>
                    <Text style={styles.totalValue}>{order.subtotal}</Text>
                </View>

                <View style={styles.rowBetween}>
                    <Text style={styles.totalLabel}>Delivery Fee:</Text>
                    <Text style={styles.totalValue}>{order.delivery_fee}</Text>
                </View>

                <View style={styles.rowBetween}>
                    <Text style={styles.totalLabel}>Discount:</Text>
                    <Text style={styles.totalValue}>{order.discount}</Text>
                </View>

                <View style={styles.divider} />

                {/* Total */}
                <View style={styles.rowBetween}>
                    <Text style={styles.totalLabel}>Total Amount:</Text>
                    <Text style={styles.totalAmount}>{order.total_amount}</Text>
                </View>
            </View>
        </ScrollView>
    );
}
