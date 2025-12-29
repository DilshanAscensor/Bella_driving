import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Styles from '../../assets/styles/driverDeliveries';
import Footer from '../../components/Footer';
const DriverDeliveriesScreen = ({ navigation }) => {
    const [tab, setTab] = useState("ongoing");

    const deliveries = {
        ongoing: [
            { id: 1, orderId: "ORD-9021", pickup: "123 Main St", dropoff: "45 Market Ave", status: "Picked Up" },
        ],
        rejected: [
            { id: 2, orderId: "ORD-8331", pickup: "Palm Street", dropoff: "Center Mall", status: "Rejected" },
        ],
        completed: [
            { id: 3, orderId: "ORD-7881", pickup: "New Town", dropoff: "Old City", status: "Delivered" },
        ],
    };
    const [active, setActive] = useState("home");
    const styles = Styles;
    const openOrderDetails = (order) => {
        navigation.navigate("OrderDetails", { order });
    };

    const renderDeliveryCard = ({ item }) => (
        <TouchableOpacity
            onPress={() => openOrderDetails(item)}
            activeOpacity={0.7}
        >
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.orderId}>#{item.orderId}</Text>
                    <Text style={[styles.status]}>
                        {item.status}
                    </Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name="location-pin" size={20} color="#4b5563" />
                    <Text style={styles.label}>Pickup:</Text>
                    <Text style={styles.value}>{item.pickup}</Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name="flag" size={20} color="#4b5563" />
                    <Text style={styles.label}>Dropoff:</Text>
                    <Text style={styles.value}>{item.dropoff}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>

                    {/* FIXED TOP TABS */}
                    <View style={styles.tabContainer}>
                        {["ongoing", "rejected", "completed"].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.tabButton,
                                    tab === item && styles.activeTabButton,
                                ]}
                                onPress={() => setTab(item)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        tab === item && styles.activeTabText,
                                    ]}
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* LIST */}
                    <FlatList
                        data={deliveries[tab]}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderDeliveryCard}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No deliveries found.</Text>
                        }
                        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
                    />
                </View>
            </ScrollView>
            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default DriverDeliveriesScreen;
