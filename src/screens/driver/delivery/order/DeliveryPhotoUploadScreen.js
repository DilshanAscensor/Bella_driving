import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { delivered } from '../../../../api/order';
import { SafeAreaView } from 'react-native-safe-area-context';

const DeliveryPhotoUploadScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { order_id } = route.params || {};

    const [photo1, setPhoto1] = useState(null);
    const [photo2, setPhoto2] = useState(null);

    /* ---------------- CAMERA ---------------- */
    const takePhoto = async (setPhoto) => {
        const result = await launchCamera({
            mediaType: 'photo',
            cameraType: 'back',
            quality: 0.8,
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
    const handleContinue = async () => {
        if (!order_id) {
            Alert.alert('Error', 'Order ID missing');
            return;
        }

        if (!photo1 || !photo2) {
            Alert.alert('Missing Photos', 'Please capture both delivery photos.');
            return;
        }

        try {
            const formData = new FormData();

            formData.append('handover_image', {
                uri: photo1.uri,
                name: photo1.fileName || 'delivery_1.jpg',
                type: photo1.type,
            });

            formData.append('handover_image_2', {
                uri: photo2.uri,
                name: photo2.fileName || 'delivery_2.jpg',
                type: photo2.type,
            });

            await delivered(order_id, formData);

            Alert.alert('Success', 'Order delivered successfully');
            navigation.navigate('DeliveryCompletedScreen', { order_id });

        } catch (error) {
            Alert.alert('Upload Failed', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.title}>Delivery Verification</Text>
                <Text style={styles.subtitle}>
                    Capture photos at the drop-off point
                </Text>

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
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            (!photo1 || !photo2) && styles.buttonDisabled,
                        ]}
                        disabled={!photo1 || !photo2}
                        onPress={handleContinue}
                    >
                        <Text style={styles.buttonText}>Confirm Delivery</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DeliveryPhotoUploadScreen;

/* ---------------- PHOTO CARD ---------------- */
const PhotoCard = ({ photo, onPress, label }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.image} />
        ) : (
            <View style={styles.placeholder}>
                <MaterialIcons
                    name="photo-camera"
                    size={moderateScale(26)}
                    color="#1e40af"
                />
                <Text style={styles.placeholderText}>{label}</Text>
            </View>
        )}
    </TouchableOpacity>
);

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
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
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
        color: '#1e40af',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: scale(16),
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    button: {
        backgroundColor: '#1e40af',
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(14),
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#94a3b8',
    },
    buttonText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '700',
    },
});
