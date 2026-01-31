import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import Styles from '../../assets/styles/driver';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../assets/theme/colors';
import { registerVehicleOwner } from '../../api/registrationApi';
import { setUser } from '../../redux/slices/userSlice';

const VehicleOwnerRegisterScreen = () => {
    const styles = Styles;
    const dispatch = useDispatch();

    /* ================= STATE ================= */
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',

        business_name: '',
        business_email: '',
        business_phone: '',
        business_address: '',
        business_registration_no: '',

        owner_name: '',
        owner_nic: '',
    });

    const [errors, setErrors] = useState({});
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /* ================= VALIDATION ================= */
    const validateInputs = () => {
        let errs = {};

        if (!form.first_name.trim()) errs.first_name = 'First name is required';
        if (!form.last_name.trim()) errs.last_name = 'Last name is required';

        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            errs.email = 'Enter a valid email';

        if (!form.phone.match(/^\+?\d{10,15}$/))
            errs.phone = 'Enter a valid phone number';

        if (form.password.length < 6)
            errs.password = 'Password must be at least 6 characters';

        if (form.confirmPassword !== form.password)
            errs.confirmPassword = 'Passwords do not match';

        /* BUSINESS */
        if (!form.business_name.trim())
            errs.business_name = 'Business name is required';

        if (!form.business_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            errs.business_email = 'Enter a valid business email';

        if (!form.business_phone.match(/^\+?\d{10,15}$/))
            errs.business_phone = 'Enter a valid business phone';

        if (!form.business_address.trim())
            errs.business_address = 'Business address is required';

        if (!form.business_registration_no.trim())
            errs.business_registration_no = 'Registration number is required';

        /* OWNER */
        if (!form.owner_name.trim())
            errs.owner_name = 'Owner name is required';

        if (!/^(?:\d{9}[Vv]|\d{12})$/.test(form.owner_nic))
            errs.owner_nic = 'NIC must be 9 digits + V or 12 digits';

        /* IMAGE */
        if (!profilePic)
            errs.profile_pic = 'Business logo / owner photo is required';

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    /* ================= IMAGE ================= */
    const pickImage = async () => {
        const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
        if (res.assets?.length) setProfilePic(res.assets[0]);
    };

    /* ================= SUBMIT ================= */
    const handleRegister = async () => {
        if (!validateInputs()) return;

        setLoading(true);

        try {
            const fd = new FormData();
            Object.keys(form).forEach(k => fd.append(k, form[k]));

            fd.append('profile_pic', {
                uri: profilePic.uri,
                type: profilePic.type || 'image/jpeg',
                name: profilePic.fileName || 'owner.jpg',
            });

            const response = await registerVehicleOwner(fd);

            await AsyncStorage.setItem('auth_token', response.token);
            dispatch(setUser(response.user));
        } catch (e) {
            console.log('Register error:', e);
        } finally {
            setLoading(false);
        }
    };

    /* ================= INPUT RENDER ================= */
    const renderInput = (key, label, icon, props = {}) => (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.textInputContainer}>
                <MaterialIcons name={icon} size={20} color={PRIMARY_COLOR} />
                <TextInput
                    style={styles.input}
                    value={form[key]}
                    onChangeText={v => setForm({ ...form, [key]: v })}
                    {...props}
                />
            </View>
            {errors[key] && <Text style={styles.fieldErrorText}>{errors[key]}</Text>}
        </View>
    );

    return (
        <LinearGradient colors={[PRIMARY_COLOR, '#e0e7ff']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>

                        {/* HEADER */}
                        <View style={styles.header}>
                            <MaterialIcons name="business" size={60} color={ACCENT_COLOR} />
                            <Text style={styles.title}>Vehicle Owner Registration</Text>
                            <Text style={styles.subtitle}>Register your business & manage fleet</Text>
                        </View>

                        {/* OWNER INFO */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Owner Information</Text>

                            {renderInput('first_name', 'First Name', 'person')}
                            {renderInput('last_name', 'Last Name', 'person')}
                            {renderInput('email', 'Email', 'email', { keyboardType: 'email-address' })}
                            {renderInput('phone', 'Phone', 'phone', { keyboardType: 'phone-pad' })}

                            {/* PASSWORD */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <View style={styles.textInputContainer}>
                                    <MaterialIcons name="lock" size={20} color={PRIMARY_COLOR} />
                                    <TextInput
                                        style={styles.input}
                                        secureTextEntry={!showPassword}
                                        value={form.password}
                                        onChangeText={v => setForm({ ...form, password: v })}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <MaterialIcons
                                            name={showPassword ? 'visibility' : 'visibility-off'}
                                            size={22}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.password && <Text style={styles.fieldErrorText}>{errors.password}</Text>}
                            </View>

                            {/* CONFIRM PASSWORD */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Confirm Password</Text>
                                <View style={styles.textInputContainer}>
                                    <MaterialIcons name="lock" size={20} color={PRIMARY_COLOR} />
                                    <TextInput
                                        style={styles.input}
                                        secureTextEntry={!showConfirmPassword}
                                        value={form.confirmPassword}
                                        onChangeText={v => setForm({ ...form, confirmPassword: v })}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <MaterialIcons
                                            name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                                            size={22}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.confirmPassword && (
                                    <Text style={styles.fieldErrorText}>{errors.confirmPassword}</Text>
                                )}
                            </View>
                        </View>

                        {/* BUSINESS INFO */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Business Information</Text>

                            {renderInput('business_name', 'Business Name', 'store')}
                            {renderInput('business_email', 'Business Email', 'email')}
                            {renderInput('business_phone', 'Business Phone', 'phone')}
                            {renderInput('business_address', 'Business Address', 'location-on')}
                            {renderInput('business_registration_no', 'Business Reg No', 'assignment')}
                            {renderInput('owner_name', 'Owner Name', 'badge')}
                            {renderInput('owner_nic', 'Owner NIC', 'credit-card')}
                        </View>

                        {/* IMAGE */}
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
                        {errors.profile_pic && (
                            <Text style={styles.fieldErrorText}>{errors.profile_pic}</Text>
                        )}

                        {/* BUTTON */}
                        <TouchableOpacity
                            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
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
