import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView, useColorScheme } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../assets/theme/colors';

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

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    logoCircle: {
        padding: 40,
        borderRadius: 120,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.85,
        lineHeight: 22,
    },
});

export default SplashScreen;
