import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../assets/theme/colors';
import { getOwnerProfile, updateOwnerProfile } from '../../api/ownerApi';
import { BASE_URL } from "../../config/api";
import { useNavigation } from "@react-navigation/native";

const VehicleOwnerSettingsScreen = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    const [owner, setOwner] = useState(null);
    const [image, setImage] = useState(null);
    const navigation = useNavigation();
    const [form, setForm] = useState({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await getOwnerProfile();
            setProfile(res.user);
            setOwner(res.owner);
            setForm({
                first_name: res.user.first_name,
                last_name: res.user.last_name,
                phone: res.user.phone,
                business_name: res.owner.business_name,
                business_email: res.owner.business_email,
                business_phone: res.owner.business_phone,
                business_address: res.owner.business_address,
                owner_name: res.owner.owner_name,
                owner_nic: res.owner.owner_nic,
            });
        } catch (e) {
            Alert.alert('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
        if (res.assets?.length) setImage(res.assets[0]);
    };

    const saveProfile = async () => {
        setSaving(true);
        try {
            const fd = new FormData();

            Object.keys(form).forEach(k => fd.append(k, form[k]));

            if (image) {
                fd.append('profile_pic', {
                    uri: image.uri,
                    type: image.type || 'image/jpeg',
                    name: image.fileName || 'profile.jpg'
                });
            }

            await updateOwnerProfile(fd);
            navigation.reset({
                index: 0,
                routes: [{ name: "VehicleOwnerDashboard" }],
            });
            Alert.alert('Success', 'Profile updated');
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={ACCENT_COLOR} />
            </View>
        );
    }

    return (
        <LinearGradient colors={[PRIMARY_COLOR, '#e0e7ff']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: moderateScale(20) }}>

                    {/* Header */}
                    <View style={{ alignItems: 'center', marginBottom: verticalScale(20) }}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                                source={{
                                    uri: image?.uri || `${BASE_URL}/storage/${owner?.profile_pic}`
                                }}
                                style={{
                                    width: scale(110),
                                    height: scale(110),
                                    borderRadius: scale(55),
                                    borderWidth: 3,
                                    borderColor: ACCENT_COLOR
                                }}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: moderateScale(18), fontWeight: '700', marginTop: 10 }}>
                            {form.business_name}
                        </Text>
                        {/* <Text style={{ color: '#64748b' }}>Fleet Owner</Text> */}
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        {Object.entries(form).map(([key, value]) => (
                            <View key={key} style={styles.field}>
                                <Text style={styles.label}>{key.replace('_', ' ').toUpperCase()}</Text>
                                <TextInput
                                    value={value}
                                    onChangeText={v => setForm({ ...form, [key]: v })}
                                    style={styles.input}
                                />
                            </View>
                        ))}
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={saveProfile}
                        disabled={saving}
                        style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = {
    card: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: verticalScale(20),
        elevation: 3
    },
    field: {
        marginBottom: verticalScale(12)
    },
    label: {
        fontSize: moderateScale(12),
        color: '#64748b',
        marginBottom: verticalScale(4)
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: moderateScale(10),
        padding: moderateScale(12),
        fontSize: moderateScale(14)
    },
    saveBtn: {
        backgroundColor: ACCENT_COLOR,
        padding: moderateScale(14),
        borderRadius: moderateScale(14),
        alignItems: 'center'
    },
    saveText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '700'
    }
};

export default VehicleOwnerSettingsScreen;