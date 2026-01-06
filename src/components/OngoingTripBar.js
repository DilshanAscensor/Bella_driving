import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';
import { PRIMARY_COLOR } from '../assets/theme/colors';

const OngoingTripBar = ({ order, onPress }) => {
    if (!order) return null;

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.85}
            onPress={onPress}
        >
            {/* Left accent */}
            <View style={styles.accent} />

            <View style={styles.content}>
                <Text style={styles.label}>ONGOING TRIP</Text>

                <Text style={styles.order}>
                    Order #{order.order_code}
                </Text>

                <View style={styles.row}>
                    <MaterialIcons
                        name="navigation"
                        size={14}
                        color={PRIMARY_COLOR}
                    />
                    <Text style={styles.hint}>
                        Tap to resume delivery
                    </Text>
                </View>
            </View>

            <MaterialIcons
                name="chevron-right"
                size={24}
                color="#9CA3AF"
            />
        </TouchableOpacity>
    );
};

export default OngoingTripBar;


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(14),
        paddingVertical: scale(14),
        paddingHorizontal: scale(14),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(12),

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },

    accent: {
        width: scale(4),
        height: '100%',
        backgroundColor: '#111827',
        borderRadius: scale(4),
        marginRight: scale(12),
    },

    content: {
        flex: 1,
    },

    label: {
        fontSize: scale(11),
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 1,
        marginBottom: scale(4),
    },

    order: {
        fontSize: scale(15),
        fontWeight: '700',
        color: '#111827',
        marginBottom: scale(6),
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    hint: {
        fontSize: scale(13),
        color: '#374151',
        marginLeft: scale(6),
        fontWeight: '500',
    },
});
