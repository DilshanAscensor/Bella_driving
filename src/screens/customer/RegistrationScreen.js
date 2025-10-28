import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { registerCustomer } from '../../api/registration/auth';
import commonStyles from '../../assets/styles/customer';

const { width } = Dimensions.get('window');

const RegistrationScreen = ({ navigation }) => {
    const [profile_pic, setProfilePic] = useState(null);
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // ✅ Request permission for image picking
    const requestPermission = async (permission) => {
        try {
            let result = await check(permission);
            if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
                result = await request(permission);
            }
            return result === RESULTS.GRANTED;
        } catch (err) {
            console.error('Permission error:', err);
            return false;
        }
    };

    // ✅ Handle image selection
    const pickImage = async (setImage) => {
        try {
            const permission =
                Platform.OS === 'ios'
                    ? PERMISSIONS.IOS.PHOTO_LIBRARY
                    : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES || PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

            const hasPermission = await requestPermission(permission);
            if (!hasPermission) {
                Alert.alert('Permission Required', 'Please allow access to photos to upload a profile picture.');
                return;
            }

            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                includeBase64: false,
            });

            if (!result.didCancel && !result.errorCode && result.assets?.length > 0) {
                setImage(result.assets[0]);
            } else if (result.errorCode) {
                Alert.alert('Error', result.errorMessage || 'Image picker error');
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'An unexpected error occurred while selecting image.');
        }
    };

    // ✅ Input validation
    const validateInputs = () => {
        if (!profile_pic) return 'Profile picture is required';
        if (!first_name.trim()) return 'First name is required';
        if (!last_name.trim()) return 'Last name is required';
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email';
        if (!phone.match(/^\+?\d{10,15}$/)) return 'Please enter a valid phone number';
        if (password.length < 6) return 'Password must be at least 6 characters';
        if (!gender) return 'Gender is required';
        return '';
    };

    // ✅ Handle registration and call API
    const handleRegister = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('gender', gender);

            if (profile_pic) {
                formData.append('profile_pic', {
                    uri: profile_pic.uri,
                    type: profile_pic.type || 'image/jpeg',
                    name: profile_pic.fileName || 'profile.jpg',
                });
            }

            // ✅ Call backend API
            const response = await registerCustomer(formData);
            navigation.navigate('Welcome', { first_name });
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const ImageUploadCard = ({ image, onPress }) => (
        <TouchableOpacity
            style={commonStyles.imageCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {image ? (
                <View style={commonStyles.imageContainer}>
                    <Image source={{ uri: image.uri }} style={commonStyles.uploadedImage} />
                    <View style={commonStyles.changeImageOverlay}>
                        <MaterialIcons name="edit" size={20} color="white" />
                    </View>
                </View>
            ) : (
                <View style={commonStyles.imagePlaceholder}>
                    <MaterialIcons name="person-outline" size={40} color={commonStyles.ACCENT_COLOR} />
                    <Text style={commonStyles.imagePlaceholderText}>Profile Picture</Text>
                    <Text style={commonStyles.imageSubText}>Tap to upload</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={commonStyles.container}
            >
                <ScrollView
                    contentContainerStyle={commonStyles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={commonStyles.header}>
                        <MaterialIcons name="person-add" size={60} color={commonStyles.PRIMARY_COLOR} />
                        <Text style={commonStyles.title}>Customer Registration</Text>
                        <Text style={commonStyles.subtitle}>Create your account to get started</Text>
                    </View>

                    {error ? (
                        <View style={commonStyles.errorContainer}>
                            <MaterialIcons name="error-outline" size={20} color="#ef4444" />
                            <Text style={commonStyles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Personal Information */}
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>Personal Information</Text>

                        <ImageUploadCard image={profile_pic} onPress={() => pickImage(setProfilePic)} />

                        <CustomInput
                            label="First Name"
                            icon="person"
                            value={first_name}
                            onChangeText={setFirstName}
                            placeholder="Enter First Name"
                        />
                        <CustomInput
                            label="Last Name"
                            icon="person"
                            value={last_name}
                            onChangeText={setLastName}
                            placeholder="Enter Last Name"
                        />
                        <CustomInput
                            label="Email"
                            icon="email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter Email Address"
                            keyboardType="email-address"
                        />
                        <CustomInput
                            label="Phone"
                            icon="phone"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter Phone Number"
                            keyboardType="phone-pad"
                        />

                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Gender</Text>
                            <View style={commonStyles.pickerContainer}>
                                <MaterialIcons name="wc" size={20} color={commonStyles.PRIMARY_COLOR} style={commonStyles.inputIcon} />
                                <Picker
                                    selectedValue={gender}
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                    style={commonStyles.picker}
                                    dropdownIconColor={commonStyles.PRIMARY_COLOR}
                                >
                                    <Picker.Item label="Select Gender" value="" color="#94a3b8" />
                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Female" value="Female" />
                                    <Picker.Item label="Other" value="Other" />
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* Security */}
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>Security</Text>
                        <CustomInput
                            label="Password"
                            icon="lock"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter Password"
                            secureTextEntry
                        />
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[commonStyles.registerButton, loading && commonStyles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <MaterialIcons name="check" size={20} color="white" style={commonStyles.buttonIcon} />
                                <Text style={commonStyles.buttonText}>Complete Registration</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ✅ Reusable TextInput Component
const CustomInput = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
}) => (
    <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputLabel}>{label}</Text>
        <View style={commonStyles.textInputContainer}>
            <MaterialIcons name={icon} size={20} color={commonStyles.PRIMARY_COLOR} style={commonStyles.inputIcon} />
            <TextInput
                style={commonStyles.input}
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
        </View>
    </View>
);

export default RegistrationScreen;
