import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    useColorScheme, // Added for system theme support
    Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../assets/theme/colors';

const HomeScreen = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme(); // Detect light/dark mode
    const isDarkMode = scheme === 'dark';
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    // Adaptive colors based on mode
    const backgroundColors = isDarkMode ? ['#000', '#172554'] : [PRIMARY_COLOR, '#e0e7ff'];
    const textColor = isDarkMode ? '#fff' : '#000';
    const buttonSecondaryBg = isDarkMode ? '#334155' : '#f1f5f9';
    const footerTextColor = isDarkMode ? '#a5b4fc' : '#64748b';

    return (
        <LinearGradient
            colors={backgroundColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }} // Vertical gradient for calmer feel
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

                {/* Hero Section - Minimal and Centered */}
                <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                    <View style={[styles.logoContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <Image
                            source={require('../assets/images/taxi-app-logo.webp')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.title, { color: textColor }]}>Belle Driving Belle</Text>
                    <Text style={[styles.subtitle, { color: isDarkMode ? '#d4deff' : '#475569' }]}>
                        Safe, simple rides at your fingertips
                    </Text>
                </Animated.View>

                {/* Buttons Section - Full-width, stacked for ease */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: ACCENT_COLOR }]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <MaterialIcons name="login" size={28} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: buttonSecondaryBg, borderColor: ACCENT_COLOR, borderWidth: 2 }]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('DriverRegistration')}
                    >
                        <MaterialIcons name="directions-car" size={28} color={ACCENT_COLOR} style={styles.buttonIcon} />
                        <Text style={[styles.buttonText, { color: ACCENT_COLOR }]}>Driver Registration</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: buttonSecondaryBg, borderColor: ACCENT_COLOR, borderWidth: 2 }]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Registration')}
                    >
                        <MaterialIcons name="person-add" size={28} color={ACCENT_COLOR} style={styles.buttonIcon} />
                        <Text style={[styles.buttonText, { color: ACCENT_COLOR }]}>Customer Registration</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer - Subtle */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: footerTextColor }]}>© 2025 Belle Driving Belle</Text>
                </View>
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
        paddingHorizontal: 30,
        paddingVertical: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoContainer: {
        padding: 30,
        borderRadius: 100,
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 28,  // Slightly smaller for readability
        fontWeight: '700',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16, // More readable
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
        opacity: 0.85,
    },
    buttonsContainer: {
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18, // Comfortable touch height
        borderRadius: 30,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonIcon: {
        marginRight: 12,
    },
    buttonText: {
        fontSize: 18, // Slightly larger for readability
        fontWeight: '600',
        color: '#fff',
    },
    footer: {
        alignItems: 'center',
        marginTop: 30,
    },
    footerText: {
        fontSize: 12,
        opacity: 0.7,
    },
});

export default HomeScreen;