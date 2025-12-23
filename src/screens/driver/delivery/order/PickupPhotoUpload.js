import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { onTheWay } from '../../../../api/order';

const PickupPhotoScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { order_id } = route.params || {};

    const [pickupPhoto, setPickupPhoto] = useState(null);

    // ---------------- TAKE PHOTO ----------------
    const takePhoto = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            cameraType: 'back',
            quality: 0.8,
        });

        if (result.didCancel) return;

        if (result.errorCode) {
            Alert.alert(
                "Camera Error",
                result.errorMessage || "Unable to take picture."
            );
            return;
        }

        if (result.assets?.length > 0) {
            setPickupPhoto(result.assets[0]);
        }
    };

    // ---------------- UPLOAD ----------------
    const pickedUpPhotoUploadFun = async () => {
        if (!order_id) {
            Alert.alert("Error", "Order ID missing");
            return;
        }

        if (!pickupPhoto) {
            Alert.alert("Error", "Please take a photo first!");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("picked_up_image", {
                name: pickupPhoto.fileName || "pickup.jpg",
                type: pickupPhoto.type,
                uri: pickupPhoto.uri,
            });

            const response = await onTheWay(order_id, formData);

            if (!response) {
                Alert.alert("Failed", "Failed to upload");
                return;
            }

            Alert.alert(
                "Success",
                "Package picked up. Status changed to On The Way."
            );
            navigation.navigate("DeliveryMap", {
                order_id: order_id,
            });
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    // ---------------- UI ----------------
    return (
        <View style={styles.container}>

            <Text style={styles.title}>Pickup Photo</Text>
            <Text style={styles.subtitle}>
                Take a photo of the package before pickup
            </Text>

            <TouchableOpacity style={styles.imageCard} onPress={takePhoto}>
                {pickupPhoto ? (
                    <Image
                        source={{ uri: pickupPhoto.uri }}
                        style={styles.previewImage}
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <MaterialIcons
                            name="photo-camera"
                            size={50}
                            color="#1e3a8a"
                        />
                        <Text style={styles.placeholderText}>
                            Tap to Take Photo
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: pickupPhoto ? '#1e3a8a' : '#9ca3af' },
                ]}
                disabled={!pickupPhoto}
                onPress={pickedUpPhotoUploadFun}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

        </View>
    );
};

export default PickupPhotoScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 20,
    },
    imageCard: {
        height: 250,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    placeholder: {
        alignItems: "center",
    },
    placeholderText: {
        fontSize: 16,
        marginTop: 10,
        color: "#1e3a8a",
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    button: {
        marginTop: 30,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});
