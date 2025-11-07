import React, { useState, useRef, useEffect } from 'react';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ACCENT_COLOR, PRIMARY_COLOR } from '../../assets/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../assets/styles/login';
import { verifyOtp, sendOtp } from '../../api/authApi';

const OtpVerificationScreen = ({ navigation, route }) => {
    const { email } = route.params || {}; // ✅ email passed from login screen
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(180);
    const [resendVisible, setResendVisible] = useState(false);

    const inputs = useRef([]);

    const backgroundColors = isDarkMode ? ['#000', '#172554'] : [PRIMARY_COLOR, '#e0e7ff'];
    const textColor = isDarkMode ? '#fff' : '#000';
    const inputBgColor = isDarkMode ? '#334155' : '#f1f5f9';
    const placeholderColor = isDarkMode ? '#a5b4fc' : '#94a3b8';
    const buttonTextColor = '#fff';

    // ⏱ Start timer countdown
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
            setResendVisible(false);
        } else {
            setResendVisible(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (text, index) => {
        if (/^\d*$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (text && index < inputs.current.length - 1) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 4) {
            setError('Please enter a valid 4-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await verifyOtp({ email, otp: enteredOtp });

            console.log('✅ OTP verification response:', response);

            const success = response?.status === true;
            const message = response?.message || 'OTP verified!';
            const user = response?.user || null;

            if (!success) {
                setError(message || 'OTP verification failed.');
                return;
            }

            // ✅ Save token if backend returns it
            if (response?.token) {
                await AsyncStorage.setItem('auth_token', response.token);
                console.log("✅ Token Saved");
            }

            // ✅ Save user data
            if (user) {
                await AsyncStorage.setItem('user_data', JSON.stringify(user));
                console.log("✅ User Saved:", user);

                const role = String(user.role || '').toLowerCase();

                console.log("✅ Detected Role:", role);

                if (role === 'driver') {
                    navigation.replace('DriverDashboard', { driver: user });
                    return;
                }

                if (role === 'customer') {
                    navigation.replace('CustomerDashboard', { customer: user });
                    return;
                }

                Alert.alert('Success', 'OTP verified but unknown role.');
                return;
            }

            Alert.alert('Success', message);

        } catch (err) {
            console.log('❌ OTP Error:', err);
            setError(err?.message || 'Network error. Try again.');
        } finally {
            setLoading(false);
        }
    };




    // ✅ Resend OTP API
    const handleResendOtp = async () => {
        setResendVisible(false);
        setTimer(180);

        try {
            const formData = new FormData();
            formData.append('email', email);

            const response = await sendOtp(formData);
            Alert.alert('OTP Sent', response?.message || 'A new OTP has been sent to your email.');
        } catch (err) {
            Alert.alert('Error', err?.message || 'Failed to resend OTP.');
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
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.header}>
                            <View
                                style={[
                                    styles.logoContainer,
                                    {
                                        backgroundColor: isDarkMode
                                            ? 'rgba(255,255,255,0.1)'
                                            : 'rgba(0,0,0,0.05)',
                                    },
                                ]}
                            >
                                <Image
                                    source={require('../../assets/images/taxi-app-logo.webp')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={[styles.title, { color: textColor }]}>OTP Verification</Text>
                            <Text style={[styles.subtitle, { color: placeholderColor }]}>
                                Enter the 4-digit code sent to your email
                            </Text>
                        </View>

                        <View style={localStyles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => (inputs.current[index] = ref)}
                                    style={[
                                        localStyles.otpInput,
                                        { backgroundColor: inputBgColor, color: textColor },
                                    ]}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={digit}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={({ nativeEvent }) => {
                                        if (
                                            nativeEvent.key === 'Backspace' &&
                                            !otp[index] &&
                                            index > 0
                                        ) {
                                            inputs.current[index - 1].focus();
                                        }
                                    }}
                                />
                            ))}
                        </View>

                        {error ? (
                            <Text style={[styles.errorText, { color: '#ff4d4f', marginTop: 8 }]}>
                                {error}
                            </Text>
                        ) : null}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: ACCENT_COLOR, opacity: loading ? 0.7 : 1 },
                            ]}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={buttonTextColor} />
                            ) : (
                                <MaterialIcons
                                    name="check-circle"
                                    size={24}
                                    color={buttonTextColor}
                                    style={styles.buttonIcon}
                                />
                            )}
                            <Text
                                style={[
                                    styles.buttonText,
                                    { color: buttonTextColor, marginLeft: 8 },
                                ]}
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            {resendVisible ? (
                                <TouchableOpacity onPress={handleResendOtp}>
                                    <Text style={[styles.footerLink, { color: ACCENT_COLOR }]}>
                                        Resend OTP
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={[styles.footerText, { color: placeholderColor }]}>
                                    Resend available in {formatTime(timer)}
                                </Text>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('LoginScreen')}
                            style={{ marginTop: 20, alignSelf: 'center' }}
                        >
                            <Text style={{ color: placeholderColor }}>← Back to Login</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default OtpVerificationScreen;

const localStyles = StyleSheet.create({
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 20,
        width: '80%',
        alignSelf: 'center',
    },
    otpInput: {
        width: 60,
        height: 60,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 3,
    },
});
