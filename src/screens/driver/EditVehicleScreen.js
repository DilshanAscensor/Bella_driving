import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "react-native-image-picker";
import { updateVehicle } from "../../api/vehicleApi";
import { BASE_URL } from "../../config/api";
import Footer from '../../components/Footer';
import { SafeAreaView } from "react-native-safe-area-context";

const EditVehicleScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { vehicle } = route.params;
    const [active, setActive] = useState("home");

    const [form, setForm] = useState({
        make: vehicle.make,
        vehicle_type: vehicle.vehicle_type,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        license_plate: vehicle.license_plate,
        vin: vehicle.vin,
        seats: String(vehicle.seats),
    });

    const [images, setImages] = useState({
        front_photo: vehicle.front_photo ? `${BASE_URL}/storage/${vehicle.front_photo}` : null,
        back_photo: vehicle.back_photo ? `${BASE_URL}/storage/${vehicle.back_photo}` : null,
        sides_photo: vehicle.sides_photo ? `${BASE_URL}/storage/${vehicle.sides_photo}` : null,
        interior_photo: vehicle.interior_photo ? `${BASE_URL}/storage/${vehicle.interior_photo}` : null,
        registration_doc: vehicle.registration_doc
            ? `${BASE_URL}/storage/${vehicle.registration_doc}`
            : null,
    });

    const [rawFiles, setRawFiles] = useState({});

    // ✅ Pick Image
    const pickImage = (field) => {
        ImagePicker.launchImageLibrary({ mediaType: "photo" }, (res) => {
            if (res.didCancel || !res.assets) return;

            const file = res.assets[0];

            setImages((prev) => ({ ...prev, [field]: file.uri }));
            setRawFiles((prev) => ({ ...prev, [field]: file }));
        });
    };

    // ✅ Submit updates
    const handleUpdate = async () => {
        try {
            const fd = new FormData();

            Object.keys(form).forEach((key) => fd.append(key, form[key]));

            Object.keys(rawFiles).forEach((key) => {
                const f = rawFiles[key];
                fd.append(key, {
                    uri: f.uri,
                    type: f.type,
                    name: f.fileName,
                });
            });

            await updateVehicle(vehicle.id, fd);

            Alert.alert("Success", "Vehicle updated successfully!");
            navigation.goBack();
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    // ✅ Image grid picker component
    const ImageGridPicker = ({ images, pickImage }) => {
        const items = [
            { label: "Front", field: "front_photo" },
            { label: "Back", field: "back_photo" },
            { label: "Side", field: "sides_photo" },
            { label: "Interior", field: "interior_photo" },
        ];

        return (
            <>
                <Text style={styles.sectionTitle}>Vehicle Photos</Text>

                <View style={styles.gridContainer}>
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.gridItem}
                            onPress={() => pickImage(item.field)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.imageWrapper}>
                                {images[item.field] ? (
                                    <Image
                                        source={{ uri: images[item.field] }}
                                        style={styles.gridImage}
                                    />
                                ) : (
                                    <MaterialIcons name="directions-car" size={40} color="#AAA" />
                                )}

                                <View style={styles.cameraOverlay}>
                                    <MaterialIcons name="camera-alt" size={20} color="#fff" />
                                </View>
                            </View>

                            <Text style={styles.gridLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Registration Document</Text>

                <TouchableOpacity
                    style={styles.docCard}
                    onPress={() => pickImage("registration_doc")}
                    activeOpacity={0.8}
                >
                    {images.registration_doc ? (
                        <Image
                            source={{ uri: images.registration_doc }}
                            style={styles.docImage}
                        />
                    ) : (
                        <MaterialIcons name="description" size={40} color="#888" />
                    )}

                    <Text style={styles.docText}>Upload Document</Text>

                    <View style={styles.docOverlay}>
                        <MaterialIcons name="upload-file" size={22} color="#fff" />
                    </View>
                </TouchableOpacity>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                {/* ✅ Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={26} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Edit Vehicle</Text>

                    <View style={{ width: 26 }} />
                </View>

                {/* ✅ Card UI */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Vehicle Information</Text>

                    {/* ✅ Two-column inputs */}
                    <View style={styles.row}>
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Make</Text>
                            <TextInput
                                style={styles.input}
                                value={form.make}
                                onChangeText={(txt) => setForm({ ...form, make: txt })}
                            />
                        </View>

                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Type</Text>
                            <TextInput
                                style={styles.input}
                                value={form.vehicle_type}
                                onChangeText={(txt) => setForm({ ...form, vehicle_type: txt })}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Model</Text>
                            <TextInput
                                style={styles.input}
                                value={form.model}
                                onChangeText={(txt) => setForm({ ...form, model: txt })}
                            />
                        </View>

                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Year</Text>
                            <TextInput
                                style={styles.input}
                                value={form.year}
                                onChangeText={(txt) => setForm({ ...form, year: txt })}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Color</Text>
                            <TextInput
                                style={styles.input}
                                value={form.color}
                                onChangeText={(txt) => setForm({ ...form, color: txt })}
                            />
                        </View>

                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Seats</Text>
                            <TextInput
                                style={styles.input}
                                value={form.seats}
                                onChangeText={(txt) => setForm({ ...form, seats: txt })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.label}>License Plate</Text>
                        <TextInput
                            style={styles.input}
                            value={form.license_plate}
                            onChangeText={(txt) => setForm({ ...form, license_plate: txt })}
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.label}>VIN</Text>
                        <TextInput
                            style={styles.input}
                            value={form.vin}
                            onChangeText={(txt) => setForm({ ...form, vin: txt })}
                        />
                    </View>

                    {/* ✅ NEW IMAGE GRID PICKER */}
                    <ImageGridPicker images={images} pickImage={pickImage} />

                    {/* ✅ Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

/* ✅ STYLES */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f7f9fc" },

    /* Header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        elevation: 4,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
    },

    /* Card */
    card: {
        margin: 16,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 14,
        elevation: 3,
    },
    cardTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16, color: "#333" },

    /* Inputs */
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    inputBox: {
        width: "48%",
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: "500",
        color: "#444",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#f2f4f7",
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
    },

    /* Image Section */
    sectionTitle: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
    },

    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 10,
    },
    gridItem: {
        width: "48%",
        marginVertical: 8,
        alignItems: "center",
    },
    imageWrapper: {
        width: "100%",
        height: 140,
        borderRadius: 14,
        backgroundColor: "#EEF1F4",
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        overflow: "hidden",
        position: "relative",
    },

    gridImage: {
        width: "100%",
        height: "100%",
        borderRadius: 14,
    },

    cameraOverlay: {
        position: "absolute",
        bottom: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.55)",
        padding: 6,
        borderRadius: 50,
    },

    gridLabel: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
    },

    /* Document Picker */
    docCard: {
        width: "100%",
        height: 160,
        marginTop: 12,
        backgroundColor: "#F1F3F6",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        position: "relative",
        overflow: "hidden",
    },

    docImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    docText: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: "600",
        color: "#555",
    },

    docOverlay: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 8,
        borderRadius: 40,
    },

    /* Save Button */
    saveButton: {
        marginTop: 28,
        backgroundColor: "#1e3a8a",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        elevation: 3,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },
});

export default EditVehicleScreen;
