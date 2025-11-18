import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PRIMARY = '#1e3a8a';
const ACCENT = '#8DB600';
const BG = '#fff';
const TEXT_DARK = '#111';
const TEXT_LIGHT = '#6b7280';

export default function AcceptDeliveryScreen({ navigation }) {

    const acceptOrder = () => {
        navigation.navigate("DeliveryInProgress");
    };

    const rejectOrder = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>New Delivery Request</Text>
            </View>

            {/* Order Card */}
            <View style={styles.card}>

                {/* Pickup */}
                <View style={styles.row}>
                    <MaterialIcons name="store-mall-directory" size={scale(22)} color={PRIMARY} />
                    <View style={styles.textBox}>
                        <Text style={styles.label}>Pickup</Text>
                        <Text style={styles.value}>Starbucks, City Center</Text>
                    </View>
                </View>

                {/* Drop Off */}
                <View style={styles.row}>
                    <MaterialIcons name="location-on" size={scale(22)} color="red" />
                    <View style={styles.textBox}>
                        <Text style={styles.label}>Drop-off</Text>
                        <Text style={styles.value}>12 Park Avenue, Apt 3</Text>
                    </View>
                </View>

                {/* Details */}
                <View style={styles.detailBox}>
                    <View style={styles.info}>
                        <MaterialIcons name="route" size={scale(20)} color={TEXT_LIGHT} />
                        <Text style={styles.detailText}>3.2 km</Text>
                    </View>

                    <View style={styles.info}>
                        <MaterialIcons name="schedule" size={scale(20)} color={TEXT_LIGHT} />
                        <Text style={styles.detailText}>12 min</Text>
                    </View>

                    <View style={styles.info}>
                        <MaterialIcons name="receipt-long" size={scale(20)} color={TEXT_LIGHT} />
                        <Text style={styles.detailText}>2 Items</Text>
                    </View>
                </View>

                {/* Timer */}
                <View style={styles.timerBox}>
                    <MaterialIcons name="timer" size={scale(24)} color={PRIMARY} />
                    <Text style={styles.timerText}>00:18</Text>
                </View>

            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.rejectBtn} onPress={rejectOrder}>
                    <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.acceptBtn} onPress={acceptOrder}>
                    <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
        padding: scale(15),
    },

    header: {
        backgroundColor: PRIMARY,
        padding: verticalScale(15),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    headerText: {
        color: '#fff',
        fontSize: scale(18),
        fontWeight: '700',
    },

    card: {
        backgroundColor: '#fff',
        padding: scale(18),
        borderRadius: moderateScale(14),
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: verticalScale(20),
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(15),
    },
    textBox: { marginLeft: scale(10) },
    label: {
        color: TEXT_LIGHT,
        fontSize: scale(13),
    },
    value: {
        fontSize: scale(16),
        fontWeight: '600',
        color: TEXT_DARK,
    },

    detailBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: verticalScale(15),
        paddingVertical: verticalScale(10),
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
    },

    info: {
        alignItems: 'center',
    },
    detailText: {
        marginTop: verticalScale(5),
        fontSize: scale(14),
        color: TEXT_LIGHT,
        fontWeight: '500',
    },

    timerBox: {
        alignSelf: 'center',
        marginTop: verticalScale(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerText: {
        marginLeft: scale(8),
        fontSize: scale(26),
        fontWeight: '700',
        color: PRIMARY,
    },

    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(10),
    },

    rejectBtn: {
        flex: 1,
        backgroundColor: '#ef4444',
        padding: verticalScale(12),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        marginRight: scale(10),
    },
    rejectText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '700',
    },

    acceptBtn: {
        flex: 1,
        backgroundColor: ACCENT,
        padding: verticalScale(12),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        marginLeft: scale(10),
    },
    acceptText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '700',
    },
});
