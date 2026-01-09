import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import Styles from '../../assets/styles/driver'; // 🔥 SAME AS REGISTRATION
import { updateDriverDetails } from '../../api/user';
import { setUser } from '../../redux/slices/userSlice';
import Footer from '../../components/Footer';
import { BASE_URL } from '../../config/api';

const districts = [
    { label: 'Select District', value: '' },
    { label: 'Colombo', value: 'Colombo' },
    { label: 'Gampaha', value: 'Gampaha' },
    { label: 'Kandy', value: 'Kandy' },
    { label: 'Galle', value: 'Galle' },
    { label: 'Jaffna', value: 'Jaffna' },
];

const EditDriverProfile = () => {
    const styles = Styles;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user) || {};
    const driver = user.driver_details || {};

    /* =======================
       STATE
    ======================= */
    const [first_name, setFirstName] = useState(user.first_name || '');
    const [last_name, setLastName] = useState(user.last_name || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [nic, setNic] = useState(driver.nic || '');
    const [gender, setGender] = useState(driver.gender || '');
    const [district, setDistrict] = useState(driver.district || '');
    const [dob, setDob] = useState(driver.dob ? new Date(driver.dob) : null);
    const [license_number, setLicenseNumber] = useState(driver.license_number || '');
    const [license_expiry, setLicenseExpiry] = useState(
        driver.license_expiry ? new Date(driver.license_expiry) : null
    );

    const [profile_pic, setProfilePic] = useState(driver.profile_pic || null);
    const [nic_front_pic, setNicFrontPic] = useState(driver.nic_front_pic || null);
    const [nic_back_pic, setNicBackPic] = useState(driver.nic_back_pic || null);
    const [license_front_pic, setLicenseFrontPic] = useState(driver.license_front_pic || null);
    const [license_back_pic, setLicenseBackPic] = useState(driver.license_back_pic || null);

    const [showDobPicker, setShowDobPicker] = useState(false);
    const [showExpiryPicker, setShowExpiryPicker] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    /* =======================
       HELPERS
    ======================= */
    const resolveUrl = (img) =>
        typeof img === 'string' ? `${BASE_URL}/storage/${img.replace(/^\/+/, '')}` : img?.uri;

    const pickImage = async (setter) => {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
        if (result.assets?.length) setter(result.assets[0]);
    };

    const toFile = (img) => {
        if (!img || typeof img === 'string') return null;
        return {
            uri: img.uri,
            type: img.type || 'image/jpeg',
            name: img.fileName || `image_${Date.now()}.jpg`,
        };
    };

    const isAtLeast18 = (date) => {
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const m = today.getMonth() - date.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
        return age >= 18;
    };

    const validate = () => {
        if (!first_name.trim()) return 'First name is required';
        if (!last_name.trim()) return 'Last name is required';
        if (!phone.match(/^\+?\d{10,15}$/)) return 'Invalid phone number';
        if (!/^(?:\d{9}[Vv]|\d{12})$/.test(nic))
            return 'NIC must be 9 digits + V or 12 digits';
        if (!gender) return 'Gender is required';
        if (!district) return 'District is required';
        if (!dob) return 'Date of birth is required';
        if (!isAtLeast18(dob)) return 'You must be at least 18 years old';
        if (!license_number.trim()) return 'License number is required';
        if (!license_expiry) return 'License expiry date is required';
        return '';
    };

    /* =======================
       IMAGE CARD (SAME AS REG)
    ======================= */
    const ImageUploadCard = ({ image, title, icon, onPress }) => (
        <TouchableOpacity style={styles.imageCard} onPress={onPress} activeOpacity={0.7}>
            {image ? (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: resolveUrl(image) }} style={styles.uploadedImage} />
                    <View style={styles.changeImageOverlay}>
                        <MaterialIcons name="edit" size={20} color="#fff" />
                    </View>
                </View>
            ) : (
                <View style={styles.imagePlaceholder}>
                    <MaterialIcons name={icon} size={40} color={styles.PRIMARY_COLOR} />
                    <Text style={styles.imagePlaceholderText}>{title}</Text>
                    <Text style={styles.imageSubText}>Tap to upload</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    /* =======================
       SUBMIT
    ======================= */
    const handleSave = async () => {
        const err = validate();
        if (err) {
            setError(err);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = {
                first_name,
                last_name,
                phone,
                nic,
                gender,
                district,
                dob: dob.toISOString().split('T')[0],
                license_number,
                license_expiry: license_expiry.toISOString().split('T')[0],
            };

            const files = {
                profile_pic: toFile(profile_pic),
                nic_front_pic: toFile(nic_front_pic),
                nic_back_pic: toFile(nic_back_pic),
                license_front_pic: toFile(license_front_pic),
                license_back_pic: toFile(license_back_pic),
            };

            const res = await updateDriverDetails(user.id, data, files);

            if (res?.status) {
                dispatch(setUser(res.data.user || res.data));
                Alert.alert('Success', 'Profile updated successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', res?.message || 'Update failed');
            }
        } catch {
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    /* =======================
       UI
    ======================= */
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>

                    {/* PERSONAL INFO */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Personal Information</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>First Name</Text>
                            <View style={styles.textInputContainer}>
                                <MaterialIcons name="person" size={20} color={styles.PRIMARY_COLOR} />
                                <TextInput style={styles.input} value={first_name} onChangeText={setFirstName} />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Last Name</Text>
                            <View style={styles.textInputContainer}>
                                <MaterialIcons name="person" size={20} color={styles.PRIMARY_COLOR} />
                                <TextInput style={styles.input} value={last_name} onChangeText={setLastName} />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Phone</Text>
                            <View style={styles.textInputContainer}>
                                <MaterialIcons name="phone" size={20} color={styles.PRIMARY_COLOR} />
                                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>NIC</Text>
                            <View style={styles.textInputContainer}>
                                <MaterialIcons name="card-membership" size={20} color={styles.PRIMARY_COLOR} />
                                <TextInput
                                    style={styles.input}
                                    value={nic}
                                    onChangeText={(t) => setNic(t.toUpperCase())}
                                    autoCapitalize="characters"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>District</Text>
                            <View style={styles.pickerContainer}>
                                <MaterialIcons name="location-on" size={20} color={styles.PRIMARY_COLOR} />
                                <Picker selectedValue={district} onValueChange={setDistrict} style={styles.picker}>
                                    {districts.map((d) => (
                                        <Picker.Item key={d.value} label={d.label} value={d.value} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Gender</Text>
                            <View style={styles.pickerContainer}>
                                <MaterialIcons name="wc" size={20} color={styles.PRIMARY_COLOR} />
                                <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
                                    <Picker.Item label="Select Gender" value="" />
                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Female" value="Female" />
                                    <Picker.Item label="Other" value="Other" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Date of Birth</Text>
                            <View style={styles.dateContainer}>
                                <MaterialIcons name="cake" size={20} color={styles.PRIMARY_COLOR} />
                                <TouchableOpacity style={styles.dateInput} onPress={() => setShowDobPicker(true)}>
                                    <Text style={styles.dateText}>{dob?.toDateString()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {showDobPicker && (
                            <DateTimePicker
                                value={dob || new Date()}
                                mode="date"
                                onChange={(e, d) => {
                                    setShowDobPicker(false);
                                    if (d) setDob(d);
                                }}
                            />
                        )}
                    </View>

                    {/* LICENSE */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>License Details</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>License Number</Text>
                            <View style={styles.textInputContainer}>
                                <MaterialIcons name="badge" size={20} color={styles.PRIMARY_COLOR} />
                                <TextInput style={styles.input} value={license_number} onChangeText={setLicenseNumber} />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>License Expiry</Text>
                            <View style={styles.dateContainer}>
                                <MaterialIcons name="event" size={20} color={styles.PRIMARY_COLOR} />
                                <TouchableOpacity style={styles.dateInput} onPress={() => setShowExpiryPicker(true)}>
                                    <Text style={styles.dateText}>{license_expiry?.toDateString()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {showExpiryPicker && (
                            <DateTimePicker
                                value={license_expiry || new Date()}
                                mode="date"
                                onChange={(e, d) => {
                                    setShowExpiryPicker(false);
                                    if (d) setLicenseExpiry(d);
                                }}
                            />
                        )}
                    </View>

                    {/* DOCUMENTS */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Documents</Text>

                        <Text style={styles.inputLabel}>Profile Picture</Text>
                        <ImageUploadCard image={profile_pic} title="Profile Picture" icon="person-outline" onPress={() => pickImage(setProfilePic)} />

                        <Text style={styles.inputLabel}>NIC Front</Text>
                        <ImageUploadCard image={nic_front_pic} title="NIC Front" icon="image" onPress={() => pickImage(setNicFrontPic)} />

                        <Text style={styles.inputLabel}>NIC Back</Text>
                        <ImageUploadCard image={nic_back_pic} title="NIC Back" icon="image" onPress={() => pickImage(setNicBackPic)} />

                        <Text style={styles.inputLabel}>License Front</Text>
                        <ImageUploadCard image={license_front_pic} title="License Front" icon="verified-user" onPress={() => pickImage(setLicenseFrontPic)} />

                        <Text style={styles.inputLabel}>License Back</Text>
                        <ImageUploadCard image={license_back_pic} title="License Back" icon="verified-user" onPress={() => pickImage(setLicenseBackPic)} />
                    </View>

                    {error ? (
                        <View style={styles.formErrorBox}>
                            <MaterialIcons name="error" size={22} color="#fff" />
                            <Text style={styles.formErrorText}>{error}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={styles.buttonText}>Saving...</Text>
                            </View>
                        ) : (
                            <>
                                <MaterialIcons name="save" size={20} color="#fff" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>


                </ScrollView>
            </KeyboardAvoidingView>

            <Footer active="home" />
        </SafeAreaView>
    );
};

export default EditDriverProfile;
