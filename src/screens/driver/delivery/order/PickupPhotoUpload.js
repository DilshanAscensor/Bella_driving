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
import { onTheWay } from '../../../../api/order';
import { useSelector } from "react-redux";

const PickupPhotoScreen = ({ navigation }) => {

    const [pickupPhoto, setPickupPhoto] = useState(null);
    const order = useSelector((state) => state.order.newOrder);

    const takePhoto = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            cameraType: 'back',
            quality: 0.8,
            includeBase64: false,
        });

        if (result.didCancel) return;

        if (result.errorCode) {
            Alert.alert("Camera Error", result.errorMessage || "Unable to take picture.");
            return;
        }

        if (result.assets?.length > 0) {
            setPickupPhoto(result.assets[0]);
        }
    };

    const pickedUpPhotoUploadFun = async () => {
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

            const response = await onTheWay(order.id, formData);

            if (!response) {
                Alert.alert("Failed", "Failed to upload");
                return;
            }

            Alert.alert("Success", "Package picked up. Status changed to On The Way.");
            navigation.navigate("DeliveryMap");

        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };


    return (
        <View style={styles.container}>

            <Text style={styles.title}>Pickup Photo</Text>
            <Text style={styles.subtitle}>Take a photo of the package before pickup</Text>

            <TouchableOpacity style={styles.imageCard} onPress={takePhoto}>
                {pickupPhoto ? (
                    <Image
                        source={{ uri: pickupPhoto.uri }}
                        style={styles.previewImage}
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <MaterialIcons name="photo-camera" size={50} color="#1e3a8a" />
                        <Text style={styles.placeholderText}>Tap to Take Photo</Text>
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
