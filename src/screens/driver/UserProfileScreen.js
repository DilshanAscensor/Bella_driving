import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../config/api';
import { getDriverDetails } from '../../api/user';
import { setUser } from '../../redux/slices/userSlice';
import Footer from '../../components/Footer';
import Styles from '../../assets/styles/driverProfile';
import { scale } from 'react-native-size-matters';


const resolveFileUrl = (path) => {
    if (!path) return null;
    return `${BASE_URL}/storage/${String(path).replace(/^\/+/, '')}`;
};

const UserProfileScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [active, setActive] = useState('home');
    const user = useSelector((state) => state.user.user) || {};

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const styles = Styles;
    const fetchDriver = useCallback(async () => {
        if (!user?.id) {
            setError('User ID not found.');
            setLoading(false);
            return;
        }

        try {
            const response = await getDriverDetails(user.id);
            if (response?.status && response.data) {
                dispatch(setUser(response.data));
            } else {
                setError('Driver details not found.');
            }
        } catch (err) {
            setError('Failed to load driver details.');
        } finally {
            setLoading(false);
        }
    }, [user?.id, dispatch]);

    useEffect(() => {
        fetchDriver();
    }, [fetchDriver]);

    const d = user.driver_details;

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1e3a8a" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!d) {
        return (
            <View style={styles.centered}>
                <Text>No driver details found.</Text>
            </View>
        );
    }

    const profilePic = resolveFileUrl(d.profile_pic);
    const licensePic = resolveFileUrl(d.license_pic);

    // const nic_front_pic = resolveFileUrl(d.nic_front_pic);
    // const nic_back_pic = resolveFileUrl(d.nic_back_pic);
    // const license_front_pic = resolveFileUrl(d.license_front_pic);
    // const license_back_pic = resolveFileUrl(d.license_back_pic);

    // const documents = [
    //     { uri: nic_front_pic, label: 'NIC Front' },
    //     { uri: nic_back_pic, label: 'NIC Back' },
    //     { uri: license_front_pic, label: 'License Front' },
    //     { uri: license_back_pic, label: 'License Back' },
    // ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: scale(100) }}
            >
                {/* Header with gradient background */}
                <LinearGradient
                    colors={['#1e3a8a', '#3b82f6']}
                    style={styles.header}
                >
                    <View style={styles.avatarContainer}>
                        {profilePic ? (
                            <Image source={{ uri: profilePic }} style={styles.avatar} />
                        ) : (
                            <MaterialIcons name="person" size={95} color="#fff" />
                        )}
                    </View>
                    <Text style={styles.nameText}>
                        {user.first_name} {user.last_name}
                    </Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                </LinearGradient>

                {/* Personal Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Personal Details</Text>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="badge" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>NIC: {d.nic}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="person" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>Gender: {d.gender}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="place" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>District: {d.district}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="calendar-today" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>DOB: {d.dob}</Text>
                    </View>
                </View>

                {/* License Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>License Information</Text>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="credit-card" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>
                            License Number: {d.license_number}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="event" size={20} color="#1e3a8a" />
                        <Text style={styles.infoText}>
                            License Expiry: {d.license_expiry}
                        </Text>
                    </View>

                    {licensePic && (
                        <Image source={{ uri: licensePic }} style={styles.docImage} />
                    )}
                </View>

                {/* <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Documents</Text>

                    {documents.map((doc, index) => (
                        doc.uri ? <Image key={index} source={{ uri: doc.uri }} style={styles.docImage} /> : null
                    ))}

                    {documents.every(doc => !doc.uri) && (
                        <Text style={{ color: '#666', fontStyle: 'italic', marginTop: 10 }}>
                            No documents uploaded yet.
                        </Text>
                    )}
                </View> */}

                {/* Edit Button */}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditDriverProfile')}
                >
                    <MaterialIcons name="edit" size={22} color="#fff" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </ScrollView>

            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default UserProfileScreen;