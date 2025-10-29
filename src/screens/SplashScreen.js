import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView, useColorScheme } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../assets/theme/colors';
import styles from '../assets/styles/splashScreen';

const SplashScreen = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigation]);

    // Gradient colors
    const backgroundColors = isDarkMode ? ['#000', '#172554'] : [PRIMARY_COLOR, '#e0e7ff'];
    const textColor = isDarkMode ? '#fff' : '#000';
    const subtitleColor = isDarkMode ? '#d4deff' : '#475569';

    return (
        <LinearGradient
            colors={backgroundColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <View style={[styles.logoCircle, { backgroundColor: isDarkMode ? '#334155' : ACCENT_COLOR }]}>
                    <Image
                        source={require('../assets/images/taxi-app-logo.webp')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Text style={[styles.title, { color: textColor }]}>Belle Driving Belle</Text>
                <Text style={[styles.subtitle, { color: subtitleColor }]}>Your Ride, Your Way</Text>
            </SafeAreaView>
        </LinearGradient>
    );
};
export default SplashScreen;
