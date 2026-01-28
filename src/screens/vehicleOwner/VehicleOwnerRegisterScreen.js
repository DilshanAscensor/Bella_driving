import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import Styles from '../../assets/styles/driver'; // reuse your theme styles
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../assets/theme/colors';
import { registerVehicleOwner } from '../../api/registrationApi';

const VehicleOwnerRegisterScreen = ({ navigation }) => {

    const styles = Styles;

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        business_name: '',
        business_email: '',
        business_phone: '',
        business_address: '',
        business_registration_no: '',
        owner_name: '',
        owner_nic: '',
    });

    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const pickImage = async () => {
        const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
        if (res.assets?.length) setProfilePic(res.assets[0]);
    };

    const handleRegister = async () => {
        setLoading(true);
        setError('');

        try {
            const fd = new FormData();

            Object.keys(form).forEach(key => {
                fd.append(key, form[key]);
            });

            if (profilePic) {
                fd.append('profile_pic', {
                    uri: profilePic.uri,
                    type: profilePic.type || 'image/jpeg',
                    name: profilePic.fileName || 'owner.jpg',
                });
            }

            await registerVehicleOwner(fd);

            Alert.alert('Success', 'Vehicle Owner Registered Successfully');

            navigation.replace('VehicleOwnerVehicleList');

        } catch (e) {
            console.log(e);
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[PRIMARY_COLOR, '#e0e7ff']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer}>

                        {/* Header */}
                        <View style={styles.header}>
                            <MaterialIcons name="business" size={60} color={ACCENT_COLOR} />
                            <Text style={styles.title}>Vehicle Owner Registration</Text>
                            <Text style={styles.subtitle}>Register your business & manage fleet</Text>
                        </View>

                        {/* Card */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Owner Information</Text>

                            {[
                                ['first_name', 'First Name', 'person'],
                                ['last_name', 'Last Name', 'person'],
                                ['email', 'Email', 'email'],
                                ['phone', 'Phone', 'phone'],
                                ['password', 'Password', 'lock']
                            ].map(([key, label, icon]) => (
                                <View key={key} style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>{label}</Text>
                                    <View style={styles.textInputContainer}>
                                        <MaterialIcons name={icon} size={20} color={PRIMARY_COLOR} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={label}
                                            secureTextEntry={key === 'password'}
                                            value={form[key]}
                                            onChangeText={v => setForm({ ...form, [key]: v })}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Business Card */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Business Information</Text>

                            {[
                                ['business_name', 'Business Name', 'store'],
                                ['business_email', 'Business Email', 'email'],
                                ['business_phone', 'Business Phone', 'phone'],
                                ['business_address', 'Business Address', 'location-on'],
                                ['business_registration_no', 'Business Reg No', 'assignment'],
                                ['owner_name', 'Owner Name', 'badge'],
                                ['owner_nic', 'Owner NIC', 'credit-card'],
                            ].map(([key, label, icon]) => (
                                <View key={key} style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>{label}</Text>
                                    <View style={styles.textInputContainer}>
                                        <MaterialIcons name={icon} size={20} color={PRIMARY_COLOR} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={label}
                                            value={form[key]}
                                            onChangeText={v => setForm({ ...form, [key]: v })}
                                        />
                                    </View>
                                </View>
                            ))}

                            {/* Image Upload */}
                            <Text style={styles.inputLabel}>Business Logo / Owner Photo</Text>
                            <TouchableOpacity style={styles.imageCard} onPress={pickImage}>
                                {profilePic ? (
                                    <Image source={{ uri: profilePic.uri }} style={styles.uploadedImage} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <MaterialIcons name="cloud-upload" size={40} color={ACCENT_COLOR} />
                                        <Text style={styles.imagePlaceholderText}>Upload Image</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Error */}
                        {error ? (
                            <View style={styles.formErrorBox}>
                                <MaterialIcons name="error" size={22} color="#fff" />
                                <Text style={styles.formErrorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* Button */}
                        <TouchableOpacity
                            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            <MaterialIcons name="check-circle" size={22} color="#fff" />
                            <Text style={styles.buttonText}>
                                {loading ? 'Registering...' : 'Register Business'}
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default VehicleOwnerRegisterScreen;
