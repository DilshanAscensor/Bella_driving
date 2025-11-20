import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { launchCamera } from "react-native-image-picker";

export default function DeliveryPhotoUploadScreen({ navigation, route }) {
    const order = route?.params?.order;

    const [deliveryPhoto, setDeliveryPhoto] = useState(null);

    const takePhoto = async () => {
        const result = await launchCamera({
            mediaType: "photo",
            cameraType: "back",
            quality: 0.8,
            includeBase64: false,
        });

        if (result.didCancel) return;

        if (result.errorCode) {
            Alert.alert("Camera Error", result.errorMessage || "Unable to take picture.");
            return;
        }

        if (result.assets?.length > 0) {
            setDeliveryPhoto(result.assets[0]);
        }
    };

    const handleContinue = () => {
        if (!deliveryPhoto) {
            Alert.alert("Photo Required", "Please capture the delivery photo.");
            return;
        }

        navigation.navigate("DeliveryCompletedScreen", { order });
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Delivery Photo</Text>
            <Text style={styles.subtitle}>Take a photo at the drop-off point</Text>

            <TouchableOpacity style={styles.imageBox} onPress={takePhoto}>
                {deliveryPhoto ? (
                    <Image source={{ uri: deliveryPhoto.uri }} style={styles.preview} />
                ) : (
                    <View style={styles.placeholder}>
                        <MaterialIcons name="photo-camera" size={55} color="#1e3a8a" />
                        <Text style={styles.placeholderText}>Tap to capture</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={handleContinue}>
                <Text style={styles.btnText}>Confirm Delivery Photo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: "700",
        color: "#0f172a",
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#64748b",
        marginBottom: 20,
    },
    imageBox: {
        width: "100%",
        height: 280,
        backgroundColor: "#e2e8f0",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    placeholder: {
        alignItems: "center",
    },
    placeholderText: {
        color: "#475569",
        marginTop: 8,
        fontSize: 14,
        fontWeight: "500",
    },
    preview: {
        width: "100%",
        height: "100%",
        borderRadius: 14,
    },
    btn: {
        backgroundColor: "#1e3a8a",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: "auto",
    },
    btnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
