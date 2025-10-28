import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    StatusBar,
    SafeAreaView,
    useColorScheme,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../assets/theme/colors';

const LoginScreen = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const backgroundColors = isDarkMode ? ['#000', '#172554'] : [PRIMARY_COLOR, '#e0e7ff'];
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBgColor = isDarkMode ? '#334155' : '#f1f5f9';
    const placeholderColor = isDarkMode ? '#a5b4fc' : '#94a3b8';
    const buttonTextColor = '#fff';

    return (
        <LinearGradient
            colors={backgroundColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                        {/* Logo and Title */}
                        <View style={styles.header}>
                            <View style={[styles.logoContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                <Image
                                    source={require('../assets/images/taxi-app-logo.webp')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={[styles.title, { color: textColor }]}>Welcome Back</Text>
                            <Text style={[styles.subtitle, { color: placeholderColor }]}>
                                Login to your account
                            </Text>
                        </View>

                        {/* Input Fields */}
                        <View style={styles.form}>
                            <View style={[styles.inputContainer, { backgroundColor: inputBgColor }]}>
                                <MaterialIcons name="email" size={24} color={placeholderColor} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: textColor }]}
                                    placeholder="Email"
                                    placeholderTextColor={placeholderColor}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={[styles.inputContainer, { backgroundColor: inputBgColor }]}>
                                <MaterialIcons name="lock" size={24} color={placeholderColor} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: textColor }]}
                                    placeholder="Password"
                                    placeholderTextColor={placeholderColor}
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: ACCENT_COLOR }]}
                                onPress={() => console.log('Login pressed')}
                            >
                                <MaterialIcons name="login" size={24} color={buttonTextColor} style={styles.buttonIcon} />
                                <Text style={[styles.buttonText, { color: buttonTextColor }]}>Login</Text>
                            </TouchableOpacity>

                            {/* Secondary Actions */}
                            <View style={styles.footer}>
                                <Text style={[styles.footerText, { color: placeholderColor }]}>Don't have an account?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                                    <Text style={[styles.footerLink, { color: ACCENT_COLOR }]}> Register</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        paddingHorizontal: 30,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        padding: 30,
        borderRadius: 100,
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 14,
        borderRadius: 30,
        marginVertical: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 30,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonIcon: {
        marginRight: 12,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 14,
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default LoginScreen;
