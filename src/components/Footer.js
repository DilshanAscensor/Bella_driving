import React, { useRef } from 'react';
import {
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Easing,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const PRIMARY = '#1e3a8a';
const ICON = '#666';
const BG = '#FFF';

export default function Footer() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { width, height } = Dimensions.get('window');

    const BAR_HEIGHT = Math.round(height * 0.08);
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

                {/* HOME */}
                <TouchableOpacity style={styles.col} onPress={() => go('DriverDashboard')} activeOpacity={0.7}>
                    <MaterialIcons name="settings" color={ICON} size={ICON_SIZE} />
                </TouchableOpacity>

                {/* EARNINGS */}
                <TouchableOpacity style={styles.col} onPress={() => go('EarningsScreen')} activeOpacity={0.7}>
                    <MaterialIcons name="account-balance-wallet" color={ICON} size={ICON_SIZE} />
                </TouchableOpacity>

                {/* EMPTY CENTER */}
                <View style={[styles.col, { width: FAB_SIZE }]} />

                {/* SUPPORT */}
                <TouchableOpacity style={styles.col} onPress={() => go('AcceptDeliveryScreen')} activeOpacity={0.7}>
                    <MaterialIcons name="headset-mic" color={ICON} size={ICON_SIZE} />
                </TouchableOpacity>

                {/* PROFILE */}
                <TouchableOpacity style={styles.col} onPress={() => go('DriverProfile')} activeOpacity={0.7}>
                    <MaterialIcons name="person-outline" color={ICON} size={ICON_SIZE} />
                </TouchableOpacity>
            </View>

            {/* Floating Home Button */}
            <Animated.View
                style={[
                    styles.fabContainer,
                    {
                        width: FAB_SIZE,
                        height: FAB_SIZE,
                        bottom: BAR_HEIGHT / 5,
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
                                borderWidth: Math.round(FAB_SIZE * 0.08),
                                borderColor: BG,
                            },
                        ]}
                    >
                        <MaterialIcons name="home" color={BG} size={HOME_ICON_SIZE} />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: BG,
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 10,
        elevation: 5,
    },
    col: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    fabContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
});
