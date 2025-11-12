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
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { updateDriverDetails } from '../../api/user';
import { setUser } from '../../redux/slices/userSlice';
import { launchImageLibrary } from 'react-native-image-picker';
import Styles from '../../assets/styles/editDriver';
import { BASE_URL } from '../../config/api';
import { scale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/Footer';

const resolveFileUrl = (path) => path ? `${BASE_URL}/storage/${path.replace(/^\/+/, '')}` : null;

const EditDriverProfile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user) || {};
    const driverDetails = user.driver_details || {};
    const styles = Styles;
    const [firstName, setFirstName] = useState(user.first_name || '');
    const [lastName, setLastName] = useState(user.last_name || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [district, setDistrict] = useState(driverDetails.district || '');
    const [licenseNumber, setLicenseNumber] = useState(driverDetails.license_number || '');
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState('home');

    // Images
    const [profilePic, setProfilePic] = useState(driverDetails.profile_pic || null);
    // const [nicFront, setNicFront] = useState(driverDetails.nic_front_pic || null);
    // const [nicBack, setNicBack] = useState(driverDetails.nic_back_pic || null);
    // const [licenseFront, setLicenseFront] = useState(driverDetails.license_front_pic || null);
    // const [licenseBack, setLicenseBack] = useState(driverDetails.license_back_pic || null);

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

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = {
                first_name: firstName,
                last_name: lastName,
                phone,
                district,
                license_number: licenseNumber,
            };

            const files = {
                profile_pic: profilePicFile,
                nic_front_pic: nicFrontFile,
                nic_back_pic: nicBackFile,
                license_front_pic: licenseFrontFile,
                license_back_pic: licenseBackFile,
            };

            const response = await updateDriverDetails(user.id, data, files);

            if (response?.status && response.data) {
                dispatch(setUser(response.data));

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

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#8DB600" />
            </View>
        );
    }

    const renderImage = (img, setter, label) => (
        <TouchableOpacity onPress={() => pickImage(setter)} style={styles.imageWrapper}>
            {img ? (
                <Image
                    source={{ uri: typeof img === 'string' ? resolveFileUrl(img) : img.uri }}
                    style={styles.image}
                />
            ) : (
                <View style={styles.placeholder}>
                    <MaterialIcons name="add-a-photo" size={scale(30)} color="#8DB600" />
                    <Text style={styles.placeholderText}>{label}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: scale(100) }}>
                <Text style={styles.title}>Edit Driver Profile</Text>

                {/* Personal Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" />
                    <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" />
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
                    <TextInput style={styles.input} value={district} onChangeText={setDistrict} placeholder="District" />
                    <TextInput style={styles.input} value={licenseNumber} onChangeText={setLicenseNumber} placeholder="License Number" />
                </View>

                {/* Documents */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Profile & Documents</Text>
                    <Text style={styles.labels}>Profile Photo</Text>
                    {renderImage(profilePic, setProfilePic, 'Profile')}

                </View>

                {/* <View style={styles.card}>
                <Text style={styles.sectionTitle}>Profile & Documents</Text>

                {renderImage(profilePic, setProfilePic, 'Profile')}
                <View style={styles.row}>
                    {renderImage(nicFront, setNicFront, 'NIC Front')}
                    {renderImage(nicBack, setNicBack, 'NIC Back')}
                </View>
                <View style={styles.row}>
                    {renderImage(licenseFront, setLicenseFront, 'License Front')}
                    {renderImage(licenseBack, setLicenseBack, 'License Back')}
                </View>
            </View> */}

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <MaterialIcons name="save" size={22} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default EditDriverProfile; 