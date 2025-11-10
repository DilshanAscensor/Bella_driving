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
    ActivityIndicator,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../assets/theme/colors';
import styles from '../assets/styles/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userLogin, sendOtp } from '../api/authApi';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(true);

    const backgroundColors = isDarkMode ? ['#000', '#172554'] : [PRIMARY_COLOR, '#e0e7ff'];
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBgColor = isDarkMode ? '#334155' : '#f1f5f9';
    const placeholderColor = isDarkMode ? '#a5b4fc' : '#94a3b8';
    const buttonTextColor = '#fff';

    const validateInputs = () => {
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return 'Please enter a valid email';
        }
        if (!password || password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    const handleRegister = async () => {
        setError('');
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('email', String(email));
            formData.append('password', String(password));

            const response = await userLogin(formData);
            if (response.status === true && response.token) {
                if (response?.token) {
                    await AsyncStorage.setItem('auth_token', response.token);
                    console.log('Token saved:', response.token);
                }

                if (response.user) {
                    if (response.user.role === 'driver') {
                        const otpResponse = await sendOtp({ email });
                        if (otpResponse.status === true) {
                            navigation.navigate('OtpScreen', { email });
                        }
                    } else if (response.user.role === 'customer') {
                        const otpResponse = await sendOtp({ email });
                        if (otpResponse.status === true) {
                            navigation.navigate('OtpScreen', { email });
                        }
                    }
                } else {
                    navigation.navigate('HomeHomeScreen');
                }
            } else {
                navigation.navigate('HomeHomeScreen');
            }
        } catch (err) {
            setError(err?.message || String(err) + ' - Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                                    secureTextEntry={hidden}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setHidden(!hidden)}>
                                    <MaterialIcons
                                        name={hidden ? 'visibility-off' : 'visibility'}
                                        size={22}
                                        color={placeholderColor}
                                    />
                                    {/* <MaterialIcons name="visibility" size={24} color={placeholderColor} style={styles.inputIcon} /> */}
                                </TouchableOpacity>
                            </View>

                            {/* show error if any */}
                            {error ? (
                                <Text style={[styles.errorText, { color: '#ff4d4f', marginTop: 8 }]}>{error}</Text>
                            ) : null}

                            {/* Login Button */}
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: ACCENT_COLOR, opacity: loading ? 0.7 : 1 }]}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color={buttonTextColor} style={styles.buttonIcon} />
                                ) : (
                                    <MaterialIcons name="login" size={24} color={buttonTextColor} style={styles.buttonIcon} />
                                )}
                                <Text style={[styles.buttonText, { color: buttonTextColor, marginLeft: 8 }]}>
                                    {loading ? 'Signing in...' : 'Login'}
                                </Text>
                            </TouchableOpacity>

                            {/* Secondary Actions */}
                            <View style={styles.footer}>
                                <Text style={[styles.footerText, { color: placeholderColor }]}>Don't have an account?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
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

export default LoginScreen;
