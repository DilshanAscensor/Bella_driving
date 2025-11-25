import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    Linking,
    SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import commonStyles from '../../assets/styles/driver';
import { registerVehicle } from '../../api/vehicleApi';


const VehicleRegistrationScreen = ({ route, navigation }) => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [vehicle_type, setType] = useState('');
    const [year, setYear] = useState(new Date());
    const [color, setColor] = useState('');
    const [license_plate, setLicensePlate] = useState('');
    const [vin, setVin] = useState('');
    const [seats, setSeats] = useState('');
    const [front_photo, setFrontPhoto] = useState(null);
    const [back_photo, setBackPhoto] = useState(null);
    const [sides_photo, setSidesPhoto] = useState(null);
    const [interior_photo, setInteriorPhoto] = useState(null);
    const [registration_doc, setRegistrationDoc] = useState(null);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { driver } = route.params || {};

    const vehicleMakes = [
        { label: 'Select Make', value: '' },
        { label: 'Toyota', value: 'Toyota' },
        { label: 'Honda', value: 'Honda' },
        { label: 'Ford', value: 'Ford' },
        { label: 'BMW', value: 'BMW' },
        { label: 'Mercedes-Benz', value: 'Mercedes-Benz' },
    ];

    const colors = [
        { label: 'Select Color', value: '' },
        { label: 'Black', value: 'Black' },
        { label: 'White', value: 'White' },
        { label: 'Silver', value: 'Silver' },
        { label: 'Red', value: 'Red' },
        { label: 'Blue', value: 'Blue' },
    ];

    const seatOptions = [
        { label: 'Select Seats', value: '' },
        { label: '2', value: '2' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
    ];

    const requestPermission = async (permission) => {
        try {
            let result = await check(permission);
            if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
                result = await request(permission);
            }
            return result === RESULTS.GRANTED;
        } catch (err) {
            console.error('Permission check/request error:', err);
            return false;
        }
    };

    const pickImage = async (setImage, type) => {
        try {
            const permission = Platform.select({
                ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
                android: Platform.Version >= 33
                    ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
                    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            });

            let result = await check(permission);

            if (result === RESULTS.DENIED) {
                result = await request(permission);
            }

            if (result === RESULTS.BLOCKED) {
                Alert.alert(
                    'Permission Required',
                    `Please allow access to photos from Settings to upload your ${type}.`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
                return;
            }

            if (result !== RESULTS.GRANTED) {
                Alert.alert(
                    'Permission Required',
                    `Access to photos is needed to upload your ${type}.`
                );
                return;
            }

            const pickerResult = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });

            if (!pickerResult.didCancel && pickerResult.assets?.length) {
                const asset = pickerResult.assets[0];
                setImage({
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    fileName: asset.fileName || `${type.replace(/\s/g, '_')}.jpg`,
                });
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', `Failed to pick ${type}.`);
        }
    };

    const validateInputs = () => {
        if (!make) return 'Vehicle Make is required';
        if (!vehicle_type) return 'Vehicle Type is required';
        if (!model.trim()) return 'Vehicle Model is required';
        if (!color) return 'Vehicle Color is required';
        if (!year) return 'Vehicle Year is required';
        if (!license_plate.trim()) return 'License Plate Number is required';
        if (!vin.trim()) return 'Vehicle Identification Number (VIN) is required';
        if (!seats) return 'Number of Seats is required';
        if (!front_photo) return 'Front vehicle photo is required';
        if (!back_photo) return 'Back vehicle photo is required';
        if (!sides_photo) return 'Sides vehicle photo is required';
        if (!interior_photo) return 'Interior vehicle photo is required';
        if (!registration_doc) return 'Vehicle Registration Document is required';
        return '';
    };

    const handleRegister = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('user_id', driver.id);
            formData.append('make', make);
            formData.append('vehicle_type', vehicle_type);
            formData.append('model', model);
            formData.append('year', year.getFullYear().toString());
            formData.append('color', color);
            formData.append('license_plate', license_plate);
            formData.append('vin', vin);
            formData.append('seats', seats);

            const files = {
                front_photo,
                back_photo,
                sides_photo,
                interior_photo,
                registration_doc,
            };

            Object.entries(files).forEach(([key, file]) => {
                if (file) {
                    formData.append(key, {
                        uri: file.uri,
                        type: file.type,
                        name: file.fileName,
                    });
                }
            });

            console.log('🚀 Sending to API:', formData);

            const response = await registerVehicle(formData);

            Alert.alert(
                'Vehicle Registered 🎉',
                'Your vehicle has been successfully registered!',
                [
                    {
                        text: 'Continue',
                        onPress: () =>
                            navigation.navigate('DriverDashboard', { driver }),
                    },
                ]
            );
        } catch (err) {
            console.error('❌ Vehicle registration error:', err);
            setError(err.message || 'Vehicle registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const ImageUploadCard = ({ image, title, icon, type, setImage }) => (
        <TouchableOpacity
            style={commonStyles.imageCard}
            onPress={() => pickImage(setImage, type)}
        >
            {image ? (
                <View style={commonStyles.imageContainer}>
                    <Image source={{ uri: image.uri }} style={commonStyles.uploadedImage} />
                    <View style={commonStyles.changeImageOverlay}>
                        <MaterialIcons name="edit" size={20} color="white" />
                    </View>
                </View>
            ) : (
                <View style={commonStyles.imagePlaceholder}>
                    <MaterialIcons name={icon} size={40} color="#f59e0b" />
                    <Text style={commonStyles.imagePlaceholderText}>{title}</Text>
                    <Text style={commonStyles.imageSubText}>Tap to upload</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={commonStyles.container}
            >
                <ScrollView
                    contentContainerStyle={commonStyles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={commonStyles.header}>
                        <MaterialIcons name="directions-car" size={60} color="#1e3a8a" />
                        <Text style={commonStyles.title}>Vehicle Registration</Text>
                        <Text style={commonStyles.subtitle}>
                            Add your vehicle details to get started
                        </Text>
                    </View>

                    {error ? (
                        <View style={commonStyles.errorContainer}>
                            <MaterialIcons name="error-outline" size={20} color="#ef4444" />
                            <Text style={commonStyles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>Vehicle Information</Text>

                        {/* Make */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Vehicle Make</Text>
                            <View style={commonStyles.pickerContainer}>
                                <MaterialIcons
                                    name="car-rental"
                                    size={20}
                                    color="#1e3a8a"
                                    style={commonStyles.inputIcon}
                                />
                                <Picker
                                    selectedValue={make}
                                    onValueChange={setMake}
                                    style={commonStyles.picker}
                                    dropdownIconColor="#1e3a8a"
                                >
                                    {vehicleMakes.map((item) => (
                                        <Picker.Item
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}
                                            color={item.value ? '#1e293b' : '#94a3b8'}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Type */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Vehicle Type</Text>
                            <View style={commonStyles.textInputContainer}>
                                <MaterialIcons
                                    name="directions-car"
                                    size={20}
                                    color="#1e3a8a"
                                    style={commonStyles.inputIcon}
                                />
                                <TextInput
                                    style={commonStyles.input}
                                    placeholder="Enter Vehicle Type"
                                    placeholderTextColor="#94a3b8"
                                    value={vehicle_type}
                                    onChangeText={setType}
                                />
                            </View>
                        </View>

                        {/* Model */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Vehicle Model</Text>
                            <View style={commonStyles.textInputContainer}>
                                <MaterialIcons
                                    name="directions-car"
                                    size={20}
                                    color="#1e3a8a"
                                    style={commonStyles.inputIcon}
                                />
                                <TextInput
                                    style={commonStyles.input}
                                    placeholder="Enter Vehicle Model"
                                    placeholderTextColor="#94a3b8"
                                    value={model}
                                    onChangeText={setModel}
                                />
                            </View>
                        </View>

                        {/* Year */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Year of Manufacture</Text>
                            <View style={commonStyles.dateContainer}>
                                <MaterialIcons
                                    name="event"
                                    size={20}
                                    color="#1e3a8a"
                                    style={commonStyles.inputIcon}
                                />
                                <TouchableOpacity
                                    style={commonStyles.dateInput}
                                    onPress={() => setShowYearPicker(true)}
                                >
                                    <Text style={commonStyles.dateText}>{year.getFullYear()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {showYearPicker && (
                            <DateTimePicker
                                value={year}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                minimumDate={new Date(1900, 0, 1)}
                                maximumDate={new Date()}
                                onChange={(event, selectedDate) => {
                                    setShowYearPicker(Platform.OS === 'ios');
                                    if (selectedDate) setYear(selectedDate);
                                }}
                            />
                        )}

                        {/* Color */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Vehicle Color</Text>
                            <View style={commonStyles.pickerContainer}>
                                <MaterialIcons
                                    name="color-lens"
                                    size={20}
                                    color="#1e3a8a"
                                    style={commonStyles.inputIcon}
                                />
                                <Picker
                                    selectedValue={color}
                                    onValueChange={setColor}
                                    style={commonStyles.picker}
                                    dropdownIconColor="#1e3a8a"
                                >
                                    {colors.map((item) => (
                                        <Picker.Item
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}
                                            color={item.value ? '#1e293b' : '#94a3b8'}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* License Plate */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>License Plate Number</Text>
                            <View style={commonStyles.textInputContainer}>
                                <MaterialIcons
                                    name="confirmation-number"
                                    size={20}
                                    color="#1e3a8a"
                                    style={commonStyles.inputIcon}
                                />
                                <TextInput
                                    style={commonStyles.input}
                                    placeholder="Enter License Plate Number"
                                    placeholderTextColor="#94a3b8"
                                    value={license_plate}
                                    onChangeText={setLicensePlate}
                                    autoCapitalize="characters"
                                />
                            </View>
                        </View>

                        {/* VIN */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>
                                Vehicle Identification Number (VIN)
                            </Text>
                            <View style={commonStyles.textInputContainer}>
                                <MaterialIcons
                                    name="fingerprint"
                                    size={20}
                                    color="#1e3a8a"
                                    style={commonStyles.inputIcon}
                                />
                                <TextInput
                                    style={commonStyles.input}
                                    placeholder="Enter VIN"
                                    placeholderTextColor="#94a3b8"
                                    value={vin}
                                    onChangeText={setVin}
                                    autoCapitalize="characters"
                                />
                            </View>
                        </View>

                        {/* Seats */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Number of Seats</Text>
                            <View style={commonStyles.pickerContainer}>
                                <MaterialIcons
                                    name="event-seat"
                                    size={20}
                                    color="#1e3a8a"
                                    style={commonStyles.inputIcon}
                                />
                                <Picker
                                    selectedValue={seats}
                                    onValueChange={setSeats}
                                    style={commonStyles.picker}
                                    dropdownIconColor="#1e3a8a"
                                >
                                    {seatOptions.map((item) => (
                                        <Picker.Item
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}
                                            color={item.value ? '#1e293b' : '#94a3b8'}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* Photos */}
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>Vehicle Photos</Text>
                        <ImageUploadCard
                            image={front_photo}
                            title="Front Photo"
                            icon="camera-front"
                            type="front photo"
                            setImage={setFrontPhoto}
                        />
                        <ImageUploadCard
                            image={back_photo}
                            title="Back Photo"
                            icon="camera-rear"
                            type="back photo"
                            setImage={setBackPhoto}
                        />
                        <ImageUploadCard
                            image={sides_photo}
                            title="Sides Photo"
                            icon="camera-alt"
                            type="sides photo"
                            setImage={setSidesPhoto}
                        />
                        <ImageUploadCard
                            image={interior_photo}
                            title="Interior Photo"
                            icon="car-rental"
                            type="interior photo"
                            setImage={setInteriorPhoto}
                        />
                    </View>

                    {/* Documents */}
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>Documents</Text>
                        <ImageUploadCard
                            image={registration_doc}
                            title="Vehicle Registration Document"
                            icon="description"
                            type="registration document"
                            setImage={setRegistrationDoc}
                        />
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        style={[
                            commonStyles.registerButton,
                            loading && commonStyles.registerButtonDisabled,
                        ]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <View style={commonStyles.loadingContainer}>
                                <MaterialIcons name="autorenew" size={20} color="white" />
                                <Text style={commonStyles.buttonText}>Registering...</Text>
                            </View>
                        ) : (
                            <>
                                <MaterialIcons
                                    name="check"
                                    size={20}
                                    color="white"
                                    style={commonStyles.buttonIcon}
                                />
                                <Text style={commonStyles.buttonText}>
                                    Complete Vehicle Registration
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        style={commonStyles.loginLinkContainer}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={commonStyles.loginText}>Back to </Text>
                        <Text style={commonStyles.loginLink}>Driver Registration</Text>
                    </TouchableOpacity> */}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default VehicleRegistrationScreen;
