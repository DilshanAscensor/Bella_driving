import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../assets/theme/colors';
import { getOwnerProfile, updateOwnerProfile } from '../../api/ownerApi';
import { BASE_URL } from '../../config/api';
import { useNavigation } from '@react-navigation/native';

const VehicleOwnerSettingsScreen = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profilePicUri, setProfilePicUri] = useState(null); // local preview
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        business_name: '',
        business_email: '',
        business_phone: '',
        business_address: '',
        owner_name: '',
        owner_nic: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await getOwnerProfile();
            const user = res.user || {};
            const owner = res.owner || {};

            setForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                business_name: owner.business_name || '',
                business_email: owner.business_email || '',
                business_phone: owner.business_phone || '',
                business_address: owner.business_address || '',
                owner_name: owner.owner_name || '',
                owner_nic: owner.owner_nic || '',
            });

            // Set existing profile pic for preview
            if (owner?.profile_pic) {
                setProfilePicUri(`${BASE_URL}/storage/${owner.profile_pic}`);
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.85,
                includeBase64: false,
            });

            if (result.didCancel) return;
            if (result.errorCode) {
                Alert.alert('Error', result.errorMessage || 'Image selection failed');
                return;
            }

            if (result.assets?.length > 0) {
                const asset = result.assets[0];
                setProfilePicUri(asset.uri);
                setForm((prev) => ({ ...prev, profile_pic: asset })); // we'll use this in FormData
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const saveProfile = async () => {
        if (saving) return;
        setSaving(true);

        try {
            const formData = new FormData();

            // Append text fields
            Object.entries(form).forEach(([key, value]) => {
                if (key !== 'profile_pic' && value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            // Append image if changed
            if (form.profile_pic && typeof form.profile_pic === 'object') {
                formData.append('profile_pic', {
                    uri: form.profile_pic.uri,
                    type: form.profile_pic.type || 'image/jpeg',
                    name: form.profile_pic.fileName || `profile_${Date.now()}.jpg`,
                });
            }

            await updateOwnerProfile(formData);

            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => navigation.navigate('VehicleOwnerDashboard') },
            ]);
        } catch (err) {
            console.warn(err);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={ACCENT_COLOR} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header / Avatar */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{
                                        uri:
                                            profilePicUri ||
                                            'https://ui-avatars.com/api/?name=Fleet+Owner&background=6366f1&color=fff',
                                    }}
                                    style={styles.avatar}
                                />
                                <View style={styles.cameraBadge}>
                                    <MaterialIcons name="photo-camera" size={moderateScale(20)} color="#fff" />
                                </View>
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.businessName}>
                            {form.business_name || 'Your Business'}
                        </Text>
                        <Text style={styles.subtitle}>Fleet Owner Profile</Text>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        {[
                            { key: 'first_name', label: 'First Name' },
                            { key: 'last_name', label: 'Last Name' },
                            { key: 'phone', label: 'Phone Number', keyboardType: 'phone-pad' },
                            { key: 'business_name', label: 'Business Name' },
                            { key: 'business_email', label: 'Business Email', keyboardType: 'email-address' },
                            { key: 'business_phone', label: 'Business Phone', keyboardType: 'phone-pad' },
                            { key: 'business_address', label: 'Business Address', multiline: true },
                            { key: 'owner_name', label: 'Owner Full Name' },
                            { key: 'owner_nic', label: 'Owner NIC / ID' },
                        ].map((field) => (
                            <View key={field.key} style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>{field.label}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={form[field.key] || ''}
                                    onChangeText={(text) =>
                                        setForm((prev) => ({ ...prev, [field.key]: text }))
                                    }
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                    placeholderTextColor="#94a3b8"
                                    keyboardType={field.keyboardType || 'default'}
                                    multiline={field.multiline}
                                    textAlignVertical={field.multiline ? 'top' : 'center'}
                                    autoCapitalize={field.key.includes('email') ? 'none' : 'words'}
                                />
                            </View>
                        ))}
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        onPress={saveProfile}
                        disabled={saving}
                        activeOpacity={0.85}
                    >
                        {saving ? (
                            <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: verticalScale(40) }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = {
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollContent: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(40),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },

    // Header
    header: {
        alignItems: 'center',
        marginBottom: verticalScale(32),
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: verticalScale(12),
    },
    avatar: {
        width: scale(110),
        height: scale(110),
        borderRadius: scale(55),
        borderWidth: 3,
        borderColor: '#ffffff',
        backgroundColor: '#e2e8f0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: { elevation: 5 },
        }),
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: ACCENT_COLOR,
        borderRadius: moderateScale(20),
        width: moderateScale(36),
        height: moderateScale(36),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    businessName: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: verticalScale(4),
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: '#64748b',
        fontWeight: '500',
    },

    // Form
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        padding: moderateScale(20),
        marginBottom: verticalScale(24),
        borderWidth: 1,
        borderColor: '#e2e8f0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    fieldContainer: {
        marginBottom: verticalScale(20),
    },
    fieldLabel: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: '#475569',
        marginBottom: verticalScale(6),
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(14),
        paddingVertical: verticalScale(12),
        fontSize: moderateScale(15),
        color: '#0f172a',
    },

    // Save button
    saveButton: {
        backgroundColor: ACCENT_COLOR,
        paddingVertical: verticalScale(16),
        borderRadius: moderateScale(14),
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: ACCENT_COLOR,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
            },
            android: { elevation: 5 },
        }),
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: moderateScale(16),
        fontWeight: '700',
    },
};

export default VehicleOwnerSettingsScreen;