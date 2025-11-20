import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateDriverDetails } from '../../api/user';
import { setUser } from '../../redux/slices/userSlice';
import Styles from '../../assets/styles/editDriver';
import Footer from '../../components/Footer';
import { BASE_URL } from "../../config/api";

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 60) / 2; // grid 2 columns with 15px spacing

const EditDriverProfile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user) || {};
    const driverDetails = user.driver_details || {};
    const styles = Styles;

    const [loading, setLoading] = useState(false);

    // Basic Info
    const [firstName, setFirstName] = useState(user.first_name || '');
    const [lastName, setLastName] = useState(user.last_name || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [district, setDistrict] = useState(driverDetails.district || '');
    const [nic, setNic] = useState(driverDetails.nic || '');
    const [gender, setGender] = useState(driverDetails.gender || '');
    const [dob, setDob] = useState(driverDetails.dob || '');
    const [licenseNumber, setLicenseNumber] = useState(driverDetails.license_number || '');
    const [licenseExpiry, setLicenseExpiry] = useState(driverDetails.license_expiry || '');

    // Images
    const [profilePic, setProfilePic] = useState(driverDetails.profile_pic || null);
    const [nicFront, setNicFront] = useState(driverDetails.nic_front_pic || null);
    const [nicBack, setNicBack] = useState(driverDetails.nic_back_pic || null);
    const [licenseFront, setLicenseFront] = useState(driverDetails.license_front_pic || null);
    const [licenseBack, setLicenseBack] = useState(driverDetails.license_back_pic || null);
    const resolveFileUrl = (path) => (path ? `${BASE_URL}/storage/${path.replace(/^\/+/, '')}` : null);
    const pickImage = async (setter) => {
        try {
            const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
            if (!result.didCancel && result.assets?.length) {
                setter(result.assets[0]);
            }
        } catch (err) {
            console.log('Image pick error', err);
            Alert.alert('Error', 'Failed to select image.');
        }
    };

    const toFile = (img) => {
        if (!img || typeof img === 'string') return null;
        return {
            uri: img.uri,
            name: img.fileName || `photo_${Date.now()}.jpg`,
            type: img.type || 'image/jpeg',
        };
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = {
                first_name: firstName,
                last_name: lastName,
                phone,
                district,
                nic,
                gender,
                dob,
                license_number: licenseNumber,
                license_expiry: licenseExpiry,
            };

            const files = {
                profile_pic: toFile(profilePic),
                nic_front_pic: toFile(nicFront),
                nic_back_pic: toFile(nicBack),
                license_front_pic: toFile(licenseFront),
                license_back_pic: toFile(licenseBack),
            };

            const response = await updateDriverDetails(user.id, data, files);

            if (response?.status) {
                const updatedUser = response.data.user || response.data;
                dispatch(setUser(updatedUser));
                Alert.alert('Success', 'Profile updated successfully.');
                navigation.goBack();
            } else {
                Alert.alert('Error', response?.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error('Update error:', err);
            Alert.alert('Error', 'Something went wrong while updating.');
        } finally {
            setLoading(false);
        }
    };

    const renderImageCard = (img, setter, label) => (
        <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
                onPress={() => pickImage(setter)}
                style={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: 10,
                    backgroundColor: '#f0f0f0',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {img ? (
                    <Image
                        source={{
                            uri: typeof img === 'string'
                                ? resolveFileUrl(img)
                                : img.uri.startsWith('file://')
                                    ? img.uri
                                    : 'file://' + img.uri,
                        }}
                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        resizeMode="cover"
                    />
                ) : (
                    <>
                        <MaterialIcons name="add-a-photo" size={30} color="#8DB600" />
                        <Text style={{ marginTop: 5, textAlign: 'center', fontSize: 12 }}>
                            {label}
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Label under the image */}
            <Text style={{ textAlign: 'center', marginTop: 6, fontSize: 13, fontWeight: '500' }}>
                {label}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#8DB600" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20 }}>Edit Profile</Text>

                {/* Profile Photo */}
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    {renderImageCard(profilePic, setProfilePic, 'Profile Photo')}
                </View>

                {/* Personal Info */}
                <View style={{ marginBottom: 30 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Personal Information</Text>
                    <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" />
                    <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" />
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
                    <TextInput style={styles.input} value={district} onChangeText={setDistrict} placeholder="District" />
                    <TextInput style={styles.input} value={nic} onChangeText={setNic} placeholder="NIC Number" />
                    <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder="Gender" />
                    <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="Date of Birth (YYYY-MM-DD)" />
                    <TextInput style={styles.input} value={licenseNumber} onChangeText={setLicenseNumber} placeholder="License Number" />
                    <TextInput style={styles.input} value={licenseExpiry} onChangeText={setLicenseExpiry} placeholder="License Expiry (YYYY-MM-DD)" />
                </View>

                {/* Documents Grid */}
                <View style={{ marginBottom: 30 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Documents</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {renderImageCard(nicFront, setNicFront, 'NIC Front')}
                        {renderImageCard(nicBack, setNicBack, 'NIC Back')}
                        {renderImageCard(licenseFront, setLicenseFront, 'License Front')}
                        {renderImageCard(licenseBack, setLicenseBack, 'License Back')}
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#8DB600',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 14,
                        borderRadius: 8,
                    }}
                    onPress={handleSave}
                >
                    <MaterialIcons name="save" size={22} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10 }}>
                        Save Changes
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <Footer active="home" />
        </SafeAreaView>
    );
};

export default EditDriverProfile;
