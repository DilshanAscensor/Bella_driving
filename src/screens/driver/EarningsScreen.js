import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useSelector } from 'react-redux';
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { scale, verticalScale } from "react-native-size-matters";
import styles from "../../assets/styles/earningsStyles";
import Footer from '../../components/Footer';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from '@react-navigation/native';

const EarningsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [active, setActive] = useState("earning");
    const weeklyData = [
        { day: "Mon", value: 32 },
        { day: "Tue", value: 28 },
        { day: "Wed", value: 45 },
        { day: "Thu", value: 0 },
        { day: "Fri", value: 70 },
        { day: "Sat", value: 62, active: true },
        { day: "Sun", value: 48 },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: verticalScale(100) }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.headerTitle}>Earnings</Text>

                {/* Balance Card */}
                <LinearGradient
                    colors={["#4D3EFF", "#553BFF", "#5B39FF"]}
                    style={styles.balanceCard}
                >
                    <View>
                        <View style={styles.balanceRow}>
                            <MaterialIcons
                                name="account-balance-wallet"
                                size={scale(18)}
                                color="#fff"
                            />
                            <Text style={styles.balanceLabel}>Available Balance</Text>
                        </View>

                        <Text style={styles.balanceAmount}>$450.25</Text>

                        <TouchableOpacity style={styles.cashoutButton}>
                            <Text style={styles.cashoutText}>Cash Out Now</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Weekly Summary */}
                <View style={styles.weekContainer}>
                    <Text style={styles.weekAmount}>$919.20</Text>
                    <Text style={styles.weekIncrease}>+12% vs last week</Text>
                </View>

                {/* Chart */}
                <View style={styles.chartContainer}>
                    {weeklyData.map((item, index) => (
                        <View key={index} style={styles.chartItem}>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: verticalScale(item.value * 1.4),
                                        backgroundColor: item.active
                                            ? "#4D3EFF"
                                            : "#d1d5db",
                                    },
                                ]}
                            />
                            <Text style={styles.chartLabel}>{item.day}</Text>
                        </View>
                    ))}
                </View>

                {/* Stats Boxes */}
                <View style={styles.statsRow}>
                    <View style={styles.statsCard}>
                        <MaterialIcons
                            name="access-time"
                            size={scale(26)}
                            color="#4D3EFF"
                        />
                        <Text style={styles.statsValue}>32.5</Text>
                        <Text style={styles.statsLabel}>Hours online</Text>
                    </View>

                    <View style={styles.statsCard}>
                        <MaterialIcons
                            name="emoji-events"
                            size={scale(26)}
                            color="#4D3EFF"
                        />
                        <Text style={styles.statsValue}>92</Text>
                        <Text style={styles.statsLabel}>Completed trips</Text>
                    </View>
                </View>
            </ScrollView>
            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default EarningsScreen;
