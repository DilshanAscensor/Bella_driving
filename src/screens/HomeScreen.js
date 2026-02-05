import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    useColorScheme,
    Animated,
    ScrollView,
    Dimensions,
    Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    PRIMARY_COLOR,
    TEXT_DARK,
    TEXT_LIGHT,
} from '../assets/theme/colors';
import homeStyles from '../assets/styles/home';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonsFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(buttonsFade, {
                toValue: 1,
                duration: 900,
                delay: 250,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const textColor = isDarkMode ? TEXT_LIGHT : TEXT_DARK;

    return (
        <SafeAreaView style={homeStyles.safeArea}>
            <ScrollView
                contentContainerStyle={homeStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HERO */}
                <Animated.View style={[homeStyles.hero, { opacity: fadeAnim }]}>
                    <View style={homeStyles.logoWrapper}>
                        <Image
                            source={require('../assets/images/mickaido-main-logo.png')}
                            style={homeStyles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={[homeStyles.welcomeTitle, { color: textColor }]}>
                        Welcome to Mickaido
                    </Text>

                    <Text style={homeStyles.tagline}>
                        Your Private Courier.
                    </Text>
                    {/* 
                    <Text style={homeStyles.subtitle}>
                        Your everyday ride & vehicle solution — ready when you are.
                    </Text> */}
                </Animated.View>

                {/* ACTIONS */}
                <Animated.View style={[homeStyles.actionsWrapper, { opacity: buttonsFade }]}>
                    <Pressable
                        style={({ pressed }) => [
                            homeStyles.ctaButton,
                            homeStyles.primaryButton,
                            pressed && homeStyles.buttonPressed,
                        ]}
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <MaterialIcons name="login" size={22} color="#fff" />
                        <Text style={homeStyles.ctaTextPrimary}>Login</Text>
                    </Pressable>

                    <View style={homeStyles.secondaryButtonsRow}>
                        <Pressable
                            style={({ pressed }) => [
                                homeStyles.ctaButton,
                                homeStyles.secondaryButton,
                                pressed && homeStyles.buttonPressed,
                            ]}
                            onPress={() => navigation.navigate('DriverRegistration')}
                        >
                            <MaterialIcons name="directions-car" size={20} color={PRIMARY_COLOR} />
                            <Text style={homeStyles.ctaTextSecondary}>Driver Partner</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                homeStyles.ctaButton,
                                homeStyles.secondaryButton,
                                pressed && homeStyles.buttonPressed,
                            ]}
                            onPress={() => navigation.navigate('VehicleOwnerRegistration')}
                        >
                            <MaterialIcons name="business" size={20} color={PRIMARY_COLOR} />
                            <Text style={homeStyles.ctaTextSecondary}>Vehicle Owner</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            homeStyles.ctaButton,
                            homeStyles.secondaryButtonFull,
                            pressed && homeStyles.buttonPressed,
                        ]}
                        onPress={() => navigation.navigate('CustomerRegistration')}
                    >
                        <MaterialIcons name="person-add" size={20} color={PRIMARY_COLOR} />
                        <Text style={homeStyles.ctaTextSecondary}>Join as Customer</Text>
                    </Pressable>
                </Animated.View>

                {/* FOOTER (now scroll-safe) */}
                <View style={homeStyles.footer}>
                    <Text style={homeStyles.footerText}>
                        © {new Date().getFullYear()} Mickaido
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
