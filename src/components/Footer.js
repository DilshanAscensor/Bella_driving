import React, { useRef } from 'react';
import {
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Easing,
    useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const PRIMARY = '#122948';
const ICON = '#666';
const BG = '#FFF';

export default function Footer() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const BAR_HEIGHT = 56 + insets.bottom;
    const FAB_SIZE = Math.round(width * 0.18);
    const ICON_SIZE = Math.round(width * 0.065);
    const HOME_ICON_SIZE = Math.round(width * 0.09);

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animate = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const go = (screen) => navigation.navigate(screen);

    return (
        <View style={[styles.root, { paddingBottom: insets.bottom }]}>

            {/* Footer Bar */}
            <View style={[styles.bar, { height: BAR_HEIGHT }]}>
                <TouchableOpacity style={styles.col} onPress={() => go('DriverDashboard')}>
                    <MaterialIcons name="settings" size={ICON_SIZE} color={ICON} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.col} onPress={() => go('EarningsScreen')}>
                    <MaterialIcons name="account-balance-wallet" size={ICON_SIZE} color={ICON} />
                </TouchableOpacity>

                {/* Spacer for FAB */}
                <View style={{ width: FAB_SIZE }} />

                <TouchableOpacity style={styles.col} onPress={() => go('AcceptDeliveryScreen')}>
                    <MaterialIcons name="headset-mic" size={ICON_SIZE} color={ICON} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.col} onPress={() => go('DriverProfile')}>
                    <MaterialIcons name="person-outline" size={ICON_SIZE} color={ICON} />
                </TouchableOpacity>
            </View>

            {/* Floating Home Button */}
            <Animated.View
                style={[
                    styles.fabContainer,
                    {
                        bottom: BAR_HEIGHT - FAB_SIZE / 2,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        animate();
                        go('DriverDashboard');
                    }}
                >
                    <View
                        style={[
                            styles.fab,
                            {
                                width: FAB_SIZE,
                                height: FAB_SIZE,
                                borderRadius: FAB_SIZE / 2,
                                backgroundColor: PRIMARY,
                                borderWidth: 4,
                                borderColor: BG,
                            },
                        ]}
                    >
                        <MaterialIcons name="home" size={HOME_ICON_SIZE} color={BG} />
                    </View>
                </TouchableOpacity>
            </Animated.View>

        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BG,
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 12,
        elevation: 10,
    },
    col: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
});