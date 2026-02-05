import React, { useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StatusBar,
    useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLOR } from '../assets/theme/colors';
import styles from '../assets/styles/splashScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        }, 2200);
        return () => clearTimeout(timer);
    }, [navigation]);

    const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';
    const titleColor = isDarkMode ? '#ffffff' : '#0f172a';
    const subtitleColor = isDarkMode ? '#cbd5f5' : '#64748b';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar
                backgroundColor={backgroundColor}
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />

            {/* Logo */}
            <View style={styles.logoWrapper}>
                <Image
                    source={require('../assets/images/mickaido-main-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Text */}
            <Text style={[styles.title, { color: titleColor }]}>
                Mickaido
            </Text>
            <Text style={[styles.subtitle, { color: subtitleColor }]}>
                Your Ride, Your Way
            </Text>
        </SafeAreaView>
    );
};

export default SplashScreen;
