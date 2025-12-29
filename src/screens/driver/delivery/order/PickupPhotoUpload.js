import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    SafeAreaView,
    ScrollView,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { onTheWay } from '../../../../api/order';

const PickupPhotoScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { order_id } = route.params || {};

    const [photo1, setPhoto1] = useState(null);
    const [photo2, setPhoto2] = useState(null);

    /* ---------------- CAMERA ---------------- */
    const takePhoto = async (setPhoto) => {
        const result = await launchCamera({
            mediaType: 'photo',
            quality: 0.8,
            cameraType: 'back',
        });

        if (result.didCancel) return;

        if (result.errorCode) {
            Alert.alert('Camera Error', result.errorMessage);
            return;
        }

        if (result.assets?.length) {
            setPhoto(result.assets[0]);
        }
    };

    /* ---------------- UPLOAD ---------------- */
    const uploadPhotos = async () => {
        if (!order_id) {
            Alert.alert('Error', 'Order ID missing');
            return;
        }

        if (!photo1 || !photo2) {
            Alert.alert('Missing Photos', 'Please capture both photos.');
            return;
        }

        try {
            const formData = new FormData();

            formData.append('picked_up_image', {
                uri: photo1.uri,
                name: photo1.fileName || 'pickup_1.jpg',
                type: photo1.type,
            });

            formData.append('picked_up_image_2', {
                uri: photo2.uri,
                name: photo2.fileName || 'pickup_2.jpg',
                type: photo2.type,
            });

            await onTheWay(order_id, formData);

            Alert.alert('Success', 'Pickup confirmed');
            navigation.navigate('DeliveryMap', { order_id });
        } catch (error) {
            Alert.alert('Upload Failed', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* HEADER */}
                <Text style={styles.title}>Pickup Verification</Text>
                <Text style={styles.subtitle}>
                    Take clear photos of the package before pickup
                </Text>

                {/* IMAGE CARDS */}
                <View style={styles.imageRow}>
                    <PhotoCard
                        label="Photo 1"
                        photo={photo1}
                        onPress={() => takePhoto(setPhoto1)}
                    />
                    <PhotoCard
                        label="Photo 2"
                        photo={photo2}
                        onPress={() => takePhoto(setPhoto2)}
                    />
                </View>

            </ScrollView>

            {/* BOTTOM BUTTON */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        (!photo1 || !photo2) && styles.buttonDisabled,
                    ]}
                    disabled={!photo1 || !photo2}
                    onPress={uploadPhotos}
                >
                    <Text style={styles.buttonText}>Confirm Pickup</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

/* ---------------- PHOTO CARD ---------------- */
const PhotoCard = ({ photo, onPress, label }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.image} />
        ) : (
            <View style={styles.placeholder}>
                <MaterialIcons
                    name="photo-camera"
                    size={moderateScale(28)}
                    color="#1e40af"
                />
                <Text style={styles.placeholderText}>{label}</Text>
            </View>
        )}
    </TouchableOpacity>
);

export default PickupPhotoScreen;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },

    container: {
        padding: scale(16),
        paddingBottom: verticalScale(120),
    },

    title: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: verticalScale(6),
    },

    subtitle: {
        fontSize: moderateScale(14),
        color: '#64748b',
        marginBottom: verticalScale(24),
    },

    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    card: {
        width: '48%',
        height: verticalScale(180),
        borderRadius: moderateScale(16),
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    placeholder: {
        alignItems: 'center',
    },

    placeholderText: {
        marginTop: verticalScale(8),
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: '#1e3a8a',
    },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: scale(16),
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },

    button: {
        backgroundColor: '#1e3a8a',
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(14),
        alignItems: 'center',
    },

    buttonDisabled: {
        backgroundColor: '#94a3b8',
    },

    buttonText: {
        color: '#ffffff',
        fontSize: moderateScale(16),
        fontWeight: '700',
    },
});
