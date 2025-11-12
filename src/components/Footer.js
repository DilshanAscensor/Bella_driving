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

const PRIMARY = '#1e3a8a';
const ICON = '#666';
const BG = '#FFF';

export default function Footer() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const columns = 5;
    const columnWidth = width / columns;

    const normalIcon = Math.max(22, Math.min(28, width * 0.06));
    const homeIcon = normalIcon + 12;

    const FAB_SIZE = columnWidth * 1;
    const BAR_HEIGHT = 50;

    // Animation
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

    const go = (r) => navigation.navigate(r);

    return (
        <View style={[styles.root, { paddingBottom: insets.bottom }]}>

            {/* Main Footer Bar */}
            <View style={[styles.bar, { height: BAR_HEIGHT }]}>

                {/* Column 1 */}
                <TouchableOpacity style={[styles.col, { width: columnWidth }]} onPress={() => go('SearchScreen')}>
                    <MaterialIcons name="search" color={ICON} size={normalIcon} />
                </TouchableOpacity>

                {/* Column 2 */}
                <TouchableOpacity style={[styles.col, { width: columnWidth }]} onPress={() => go('NotificationsScreen')}>
                    <MaterialIcons name="notifications-none" color={ICON} size={normalIcon} />
                </TouchableOpacity>

                {/* Column 3 (Center FAB placeholder space) */}
                <View style={[styles.col, { width: columnWidth }]} />

                {/* Column 4 */}
                <TouchableOpacity style={[styles.col, { width: columnWidth }]} onPress={() => go('DriverProfile')}>
                    <MaterialIcons name="person-outline" color={ICON} size={normalIcon} />
                </TouchableOpacity>

                {/* Column 5 */}
                <TouchableOpacity style={[styles.col, { width: columnWidth }]} onPress={() => go('SettingsScreen')}>
                    <MaterialIcons name="settings" color={ICON} size={normalIcon} />
                </TouchableOpacity>

            </View>

            {/* Floating Home Button */}
            <Animated.View
                style={[
                    styles.fabContainer,
                    {
                        transform: [{ translateY: -(BAR_HEIGHT / 2) }, { scale: scaleAnim }],
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
                                borderWidth: 6,
                                borderColor: BG,
                            },
                        ]}
                    >
                        <MaterialIcons name="home" color="#FFF" size={homeIcon} />
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
    },

    bar: {
        backgroundColor: BG,
        borderTopWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },

    col: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },

    fabContainer: {
        position: 'absolute',
        top: '0',
        left: 0,
        right: 0,
        alignItems: 'center',
    },

    fab: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
