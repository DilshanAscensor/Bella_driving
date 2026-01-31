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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import commonStyles from '../../assets/styles/driver';
import { registerVehicle } from '../../api/vehicleApi';
import { SafeAreaView } from 'react-native-safe-area-context';

const MultiVehicleRegistrationScreen = ({ route, navigation }) => {
    const { owner } = route.params || {};

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

    const pickImage = async (setImage, type) => {
        try {
            const permission = Platform.select({
                ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
                android: Platform.Version >= 33
                    ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
                    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            });

            let result = await check(permission);
            if (result === RESULTS.DENIED) result = await request(permission);

            if (result === RESULTS.BLOCKED) {
                Alert.alert('Permission Required', `Please allow photo access for ${type}`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]);
                return;
            }

            if (result !== RESULTS.GRANTED) return;

            const pickerResult = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });

            if (pickerResult.assets?.length) {
                const asset = pickerResult.assets[0];
                setImage({
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    fileName: asset.fileName || `${type}.jpg`,
                });
            }
        } catch (err) {
            Alert.alert('Error', `Failed to pick ${type}`);
        }
    };

    const validateInputs = () => {
        if (!make) return 'Vehicle Make is required';
        if (!vehicle_type) return 'Vehicle Type is required';
        if (!model.trim()) return 'Vehicle Model is required';
        if (!color) return 'Vehicle Color is required';
        if (!year) return 'Vehicle Year is required';
        if (!license_plate.trim()) return 'License Plate is required';
        if (!vin.trim()) return 'VIN is required';
        if (!seats) return 'Seats required';
        if (!front_photo) return 'Front photo required';
        if (!back_photo) return 'Back photo required';
        if (!sides_photo) return 'Sides photo required';
        if (!interior_photo) return 'Interior photo required';
        if (!registration_doc) return 'Registration document required';
        return '';
    };

    const resetForm = () => {
        setMake('');
        setModel('');
        setType('');
        setYear(new Date());
        setColor('');
        setLicensePlate('');
        setVin('');
        setSeats('');
        setFrontPhoto(null);
        setBackPhoto(null);
        setSidesPhoto(null);
        setInteriorPhoto(null);
        setRegistrationDoc(null);
    };

    const saveVehicle = async (mode = 'finish') => {
        console.log('Saving vehicle...');

        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('user_id', owner.id);
            formData.append('make', make);
            formData.append('vehicle_type', vehicle_type);
            formData.append('model', model);
            formData.append('year', year.getFullYear().toString());
            formData.append('color', color);
            formData.append('license_plate', license_plate);
            formData.append('vin', vin);
            formData.append('seats', seats);

            const files = { front_photo, back_photo, sides_photo, interior_photo, registration_doc };

            Object.entries(files).forEach(([key, file]) => {
                if (file) {
                    formData.append(key, {
                        uri: file.uri,
                        type: file.type,
                        name: file.fileName,
                    });
                }
            });

            console.log('Form Data prepared, submitting...');
            await registerVehicle(formData);
            console.log('Vehicle registered successfully');

            if (mode === 'next') {
                Alert.alert('Saved', 'Vehicle added. Add another one.');
                resetForm();
            } else {
                Alert.alert('Success', 'All vehicles registered successfully', [
                    { text: 'Go to Dashboard', onPress: () => navigation.navigate('VehicleOwnerDashboard') },
                ]);
            }

        } catch (err) {
            console.log('Error registering vehicle:', err?.response?.data || err);
            setError(err?.response?.data?.message || 'Vehicle registration failed');
        } finally {
            setLoading(false);
        }
    };


    const ImageUploadCard = ({ image, title, icon, type, setImage }) => (
        <TouchableOpacity style={commonStyles.imageCard} onPress={() => pickImage(setImage, type)}>
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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={commonStyles.container}>
                <ScrollView contentContainerStyle={commonStyles.scrollContainer} keyboardShouldPersistTaps="handled">

                    <View style={commonStyles.header}>
                        <MaterialIcons name="directions-car" size={60} color="#122948" />
                        <Text style={commonStyles.title}>Multi Vehicle Registration</Text>
                        <Text style={commonStyles.subtitle}>Register multiple vehicles</Text>
                    </View>

                    {error ? (
                        <View style={commonStyles.errorContainer}>
                            <MaterialIcons name="error-outline" size={20} color="#ef4444" />
                            <Text style={commonStyles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Vehicle Info */}
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>Vehicle Information</Text>

                        {/* Make */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Vehicle Make</Text>
                            <View style={commonStyles.pickerContainer}>
                                <MaterialIcons name="car-rental" size={20} color="#122948" style={commonStyles.inputIcon} />
                                <Picker selectedValue={make} onValueChange={setMake} style={commonStyles.picker}>
                                    {vehicleMakes.map(item => (
                                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Type */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Vehicle Type</Text>
                            <View style={commonStyles.textInputContainer}>
                                <MaterialIcons name="directions-car" size={20} color="#122948" style={commonStyles.inputIcon} />
                                <TextInput style={commonStyles.input} value={vehicle_type} onChangeText={setType} placeholder="Vehicle Type" />
                            </View>
                        </View>

                        {/* Model */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Vehicle Model</Text>
                            <View style={commonStyles.textInputContainer}>
                                <MaterialIcons name="directions-car" size={20} color="#122948" style={commonStyles.inputIcon} />
                                <TextInput style={commonStyles.input} value={model} onChangeText={setModel} placeholder="Model" />
                            </View>
                        </View>

                        {/* Year */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Year</Text>
                            <View style={commonStyles.dateContainer}>
                                <MaterialIcons name="event" size={20} color="#122948" style={commonStyles.inputIcon} />
                                <TouchableOpacity style={commonStyles.dateInput} onPress={() => setShowYearPicker(true)}>
                                    <Text style={commonStyles.dateText}>{year.getFullYear()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {showYearPicker && (
                            <DateTimePicker value={year} mode="date" display="default" onChange={(e, d) => { setShowYearPicker(false); if (d) setYear(d); }} />
                        )}

                        {/* Color */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Color</Text>
                            <View style={commonStyles.pickerContainer}>
                                <MaterialIcons name="color-lens" size={20} color="#122948" style={commonStyles.inputIcon} />
                                <Picker selectedValue={color} onValueChange={setColor} style={commonStyles.picker}>
                                    {colors.map(item => (
                                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Plate */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>License Plate</Text>
                            <View style={commonStyles.textInputContainer}>
                                <MaterialIcons name="confirmation-number" size={20} color="#122948" style={commonStyles.inputIcon} />
                                <TextInput style={commonStyles.input} value={license_plate} onChangeText={setLicensePlate} placeholder="Plate Number" />
                            </View>
                        </View>

                        {/* VIN */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>VIN</Text>
                            <View style={commonStyles.textInputContainer}>
                                <MaterialIcons name="fingerprint" size={20} color="#122948" style={commonStyles.inputIcon} />
                                <TextInput style={commonStyles.input} value={vin} onChangeText={setVin} placeholder="VIN" />
                            </View>
                        </View>

                        {/* Seats */}
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.inputLabel}>Seats</Text>
                            <View style={commonStyles.pickerContainer}>
                                <MaterialIcons name="event-seat" size={20} color="#122948" style={commonStyles.inputIcon} />
                                <Picker selectedValue={seats} onValueChange={setSeats} style={commonStyles.picker}>
                                    {seatOptions.map(item => (
                                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* Photos */}
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>Vehicle Photos</Text>
                        <ImageUploadCard image={front_photo} title="Front Photo" icon="camera-front" type="front" setImage={setFrontPhoto} />
                        <ImageUploadCard image={back_photo} title="Back Photo" icon="camera-rear" type="back" setImage={setBackPhoto} />
                        <ImageUploadCard image={sides_photo} title="Sides Photo" icon="camera-alt" type="sides" setImage={setSidesPhoto} />
                        <ImageUploadCard image={interior_photo} title="Interior Photo" icon="car-rental" type="interior" setImage={setInteriorPhoto} />
                    </View>

                    {/* Documents */}
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>Documents</Text>
                        <ImageUploadCard image={registration_doc} title="Registration Document" icon="description" type="document" setImage={setRegistrationDoc} />
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity
                        style={[
                            commonStyles.registerButton,
                            { backgroundColor: '#122948', marginBottom: '5%' },
                            loading && commonStyles.registerButtonDisabled
                        ]}
                        onPress={() => saveVehicle('next')}
                        disabled={loading}
                    >
                        {loading ? (
                            <View style={commonStyles.loadingContainer}>
                                <MaterialIcons name="autorenew" size={20} color="white" />
                                <Text style={commonStyles.buttonText}>Saving...</Text>
                            </View>
                        ) : (
                            <>
                                <MaterialIcons name="add-circle-outline" size={20} color="white" />
                                <Text style={commonStyles.buttonText}>Save & Add Another Vehicle</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={[commonStyles.registerButton, loading && commonStyles.registerButtonDisabled]} onPress={() => saveVehicle('finish')} disabled={loading}>
                        {loading ? (
                            <View style={commonStyles.loadingContainer}>
                                <MaterialIcons name="autorenew" size={20} color="white" />
                                <Text style={commonStyles.buttonText}>Saving...</Text>
                            </View>
                        ) : (
                            <>
                                <MaterialIcons name="check" size={20} color="white" />
                                <Text style={commonStyles.buttonText}>Finish Registration</Text>
                            </>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default MultiVehicleRegistrationScreen;
