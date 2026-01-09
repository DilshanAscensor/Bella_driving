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
    ActivityIndicator,
    useColorScheme
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { updateVehicle } from "../../api/vehicleApi";
import { BASE_URL } from "../../config/api";
import Footer from "../../components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";

const EditVehicleScreen = () => {
    const { vehicle } = useRoute().params;
    const navigation = useNavigation();
    const isDark = useColorScheme() === "dark";

    const [isUpdating, setIsUpdating] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const [form, setForm] = useState({
        make: vehicle.make || "",
        vehicle_type: vehicle.vehicle_type || "",
        model: vehicle.model || "",
        year: vehicle.year
            ? new Date(Number(vehicle.year), 0, 1)
            : new Date(),
        color: vehicle.color || "",
        license_plate: vehicle.license_plate || "",
        vin: vehicle.vin || "",
        seats: String(vehicle.seats || ""),
    });

    const [images, setImages] = useState({
        front_photo: vehicle.front_photo
            ? `${BASE_URL}/storage/${vehicle.front_photo}`
            : null,
        back_photo: vehicle.back_photo
            ? `${BASE_URL}/storage/${vehicle.back_photo}`
            : null,
        sides_photo: vehicle.sides_photo
            ? `${BASE_URL}/storage/${vehicle.sides_photo}`
            : null,
        interior_photo: vehicle.interior_photo
            ? `${BASE_URL}/storage/${vehicle.interior_photo}`
            : null,
        registration_doc: vehicle.registration_doc
            ? `${BASE_URL}/storage/${vehicle.registration_doc}`
            : null,
    });

    const [rawFiles, setRawFiles] = useState({});

    const vehicleMakes = [
        { label: "Select Make", value: "" },
        { label: "Toyota", value: "Toyota" },
        { label: "Honda", value: "Honda" },
        { label: "Ford", value: "Ford" },
        { label: "BMW", value: "BMW" },
        { label: "Mercedes-Benz", value: "Mercedes-Benz" },
    ];

    const colors = [
        { label: "Select Color", value: "" },
        { label: "Black", value: "Black" },
        { label: "White", value: "White" },
        { label: "Silver", value: "Silver" },
        { label: "Red", value: "Red" },
        { label: "Blue", value: "Blue" },
    ];

    const seatOptions = ["", "2", "4", "5", "7", "8"];

    const pickImage = (field) => {
        ImagePicker.launchImageLibrary({ mediaType: "photo" }, (res) => {
            if (res.didCancel || !res.assets) return;
            const file = res.assets[0];
            setImages((prev) => ({ ...prev, [field]: file.uri }));
            setRawFiles((prev) => ({ ...prev, [field]: file }));
        });
    };

    const handleUpdate = async () => {
        if (isUpdating) return;

        try {
            setIsUpdating(true);

            const fd = new FormData();

            fd.append("make", form.make);
            fd.append("vehicle_type", form.vehicle_type);
            fd.append("model", form.model);
            fd.append(
                "year",
                form.year instanceof Date
                    ? form.year.getFullYear().toString()
                    : String(form.year)
            );
            fd.append("color", form.color);
            fd.append("license_plate", form.license_plate);
            fd.append("vin", form.vin);
            fd.append("seats", form.seats);

            Object.keys(rawFiles).forEach((k) => {
                const f = rawFiles[k];
                fd.append(k, {
                    uri: f.uri,
                    type: f.type || "image/jpeg",
                    name: f.fileName || `${k}.jpg`,
                });
            });

            fd.append("_method", "PUT");

            await updateVehicle(vehicle.id, fd);

            Alert.alert("Success", "Vehicle updated successfully");

            navigation.reset({
                index: 0,
                routes: [{ name: "DriverDashboard" }],
            });
        } catch (e) {
            Alert.alert("Error", e.message || "Update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    const ImageTile = ({ label, field }) => (
        <TouchableOpacity style={styles.imageTile} onPress={() => pickImage(field)}>
            {images[field] ? (
                <Image source={{ uri: images[field] }} style={styles.image} />
            ) : (
                <MaterialIcons name="image" size={42} color="#aaa" />
            )}
            <View style={styles.imageOverlay}>
                <MaterialIcons name="camera-alt" size={18} color="#fff" />
            </View>
            <Text style={styles.imageLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={26} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Vehicle</Text>
                </View>

                {/* Vehicle Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Vehicle Information</Text>

                    {/* Make */}
                    <Text style={styles.label}>Make</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={form.make}
                            onValueChange={(v) => setForm({ ...form, make: v })}
                        >
                            {vehicleMakes.map((m) => (
                                <Picker.Item
                                    key={m.value}
                                    label={m.label}
                                    value={m.value}
                                    color={isDark ? "#000" : "#1e293b"}
                                />
                            ))}
                        </Picker>
                    </View>

                    {/* Type */}
                    <Text style={styles.label}>Vehicle Type</Text>
                    <TextInput
                        style={styles.input}
                        value={form.vehicle_type}
                        onChangeText={(v) =>
                            setForm({ ...form, vehicle_type: v })
                        }
                    />

                    {/* Model */}
                    <Text style={styles.label}>Model</Text>
                    <TextInput
                        style={styles.input}
                        value={form.model}
                        onChangeText={(v) => setForm({ ...form, model: v })}
                    />

                    {/* Year */}
                    <Text style={styles.label}>Year of Manufacture</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowYearPicker(true)}
                    >
                        <Text>
                            {form.year instanceof Date
                                ? form.year.getFullYear()
                                : new Date(Number(form.year), 0, 1).getFullYear()}
                        </Text>
                    </TouchableOpacity>

                    {showYearPicker && (
                        <DateTimePicker
                            value={form.year instanceof Date ? form.year : new Date()}
                            mode="date"
                            maximumDate={new Date()}
                            onChange={(e, selectedDate) => {
                                setShowYearPicker(false);
                                if (selectedDate) {
                                    setForm({ ...form, year: selectedDate });
                                }
                            }}
                        />
                    )}

                    {/* Color */}
                    <Text style={styles.label}>Color</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={form.color}
                            onValueChange={(v) =>
                                setForm({ ...form, color: v })
                            }
                        >
                            {colors.map((c) => (
                                <Picker.Item
                                    key={c.value}
                                    label={c.label}
                                    value={c.value}
                                    color={isDark ? "#000" : "#1e293b"}
                                />
                            ))}
                        </Picker>
                    </View>

                    {/* Seats */}
                    <Text style={styles.label}>Seats</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={form.seats}
                            onValueChange={(v) =>
                                setForm({ ...form, seats: v })
                            }
                        >
                            {seatOptions.map((s) => (
                                <Picker.Item
                                    key={s || "empty"}
                                    label={s || "Select Seats"}
                                    value={s}
                                    color={isDark ? "#000" : "#1e293b"}
                                />
                            ))}
                        </Picker>
                    </View>

                    {/* License Plate */}
                    <Text style={styles.label}>License Plate</Text>
                    <TextInput
                        style={styles.input}
                        value={form.license_plate}
                        onChangeText={(v) =>
                            setForm({ ...form, license_plate: v })
                        }
                    />

                    {/* VIN */}
                    <Text style={styles.label}>VIN</Text>
                    <TextInput
                        style={styles.input}
                        value={form.vin}
                        onChangeText={(v) => setForm({ ...form, vin: v })}
                    />
                </View>

                {/* Images */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Vehicle Images</Text>
                    <View style={styles.imageGrid}>
                        <ImageTile label="Front" field="front_photo" />
                        <ImageTile label="Back" field="back_photo" />
                        <ImageTile label="Side" field="sides_photo" />
                        <ImageTile label="Interior" field="interior_photo" />
                    </View>
                </View>

                {/* Save */}
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        isUpdating && styles.buttonDisabled,
                    ]}
                    onPress={handleUpdate}
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <Footer active="home" />
        </SafeAreaView>
    );
};

export default EditVehicleScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },
    buttonDisabled: { opacity: 0.6 },

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        elevation: 3,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
    },

    card: {
        backgroundColor: "#fff",
        margin: 16,
        padding: 16,
        borderRadius: 16,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },

    label: {
        marginTop: 12,
        fontSize: 13,
        fontWeight: "600",
    },

    input: {
        backgroundColor: "#F1F3F6",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E2E6EA",
    },

    pickerContainer: {
        backgroundColor: "#F1F3F6",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E6EA",
    },

    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    imageTile: {
        width: "48%",
        height: 150,
        borderRadius: 14,
        backgroundColor: "#EEF1F4",
        marginBottom: 14,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    image: { width: "100%", height: "100%" },

    imageOverlay: {
        position: "absolute",
        bottom: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 6,
        borderRadius: 20,
    },

    imageLabel: {
        position: "absolute",
        top: 8,
        left: 8,
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 4,
        borderRadius: 6,
        fontSize: 12,
    },

    saveButton: {
        margin: 16,
        backgroundColor: "#122948",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
    },

    saveText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});
