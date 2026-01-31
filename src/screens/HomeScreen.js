import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
    useColorScheme,
    Animated,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    PRIMARY_COLOR,
    ACCENT_COLOR,
    TEXT_DARK,
    TEXT_LIGHT,
} from '../assets/theme/colors';
import homeStyles from '../assets/styles/home'; // ← your updated styles file
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 9,
                tension: 45,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const gradientColors = isDarkMode
        ? [PRIMARY_COLOR, '#0f1e3a']
        : [PRIMARY_COLOR, '#1e3a5f'];

    const textSecondary = isDarkMode ? TEXT_LIGHT : '#d1d5db';
    const backgroundColors = isDarkMode ? ['#000', '#172554'] : [PRIMARY_COLOR, '#e0e7ff'];
    return (
        <LinearGradient
            colors={backgroundColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={homeStyles.gradient}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            <SafeAreaView style={homeStyles.safeArea}>
                <ScrollView
                    contentContainerStyle={homeStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header / Hero */}
                    <Animated.View
                        style={[
                            homeStyles.header,
                            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <View style={homeStyles.logoWrapper}>
                            <Image
                                source={require('../assets/images/mickaido-main-logo.png')}
                                style={homeStyles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={[homeStyles.tagline, { color: textSecondary }]}>
                            Safe • Simple • Reliable
                        </Text>

                        {/* <Text style={[homeStyles.subtitle, { color: textPrimary }]}>
                            Your trusted ride & vehicle management solution
                        </Text> */}
                    </Animated.View>

                    {/* Action Buttons */}
                    <View style={homeStyles.buttonsContainer}>
                        <TouchableOpacity
                            style={[homeStyles.button, homeStyles.buttonPrimary]}
                            activeOpacity={0.88}
                            onPress={() => navigation.navigate('LoginScreen')}
                        >
                            <MaterialIcons name="login" size={24} color="#fff" />
                            <Text style={homeStyles.buttonTextPrimary}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[homeStyles.button, homeStyles.buttonSecondary]}
                            activeOpacity={0.88}
                            onPress={() => navigation.navigate('DriverRegistration')}
                        >
                            <MaterialIcons name="directions-car" size={24} color="#dfdcdc" />
                            <Text style={homeStyles.buttonTextSecondary}>Become a Driver</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[homeStyles.button, homeStyles.buttonSecondary]}
                            activeOpacity={0.88}
                            onPress={() => navigation.navigate('VehicleOwnerRegistration')}
                        >
                            <MaterialIcons name="business" size={24} color="#dfdcdc" />
                            <Text style={homeStyles.buttonTextSecondary}>Vehicle Owner</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[homeStyles.button, homeStyles.buttonSecondary]}
                            activeOpacity={0.88}
                            onPress={() => navigation.navigate('CustomerRegistration')}
                        >
                            <MaterialIcons name="person-add" size={24} color="#dfdcdc" />
                            <Text style={homeStyles.buttonTextSecondary}>Join as Customer</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={homeStyles.footer}>
                    <Text style={homeStyles.footerText}>
                        © {new Date().getFullYear()} Mickaido
                    </Text>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default HomeScreen;