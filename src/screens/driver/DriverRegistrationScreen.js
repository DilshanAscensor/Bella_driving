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
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Styles from '../../assets/styles/driver'
import { registerDriver } from '../../api/registrationApi';

const { width } = Dimensions.get('window');

const DriverRegistrationScreen = ({ navigation }) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nic, setNic] = useState('');
  const [gender, setGender] = useState('');
  const [district, setDistrict] = useState('');
  const [dob, setDob] = useState(new Date());
  const [license_number, setLicenseNumber] = useState('');
  const [license_expiry, setLicenseExpiry] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [profile_pic, setProfilePic] = useState(null);
  const [license_pic, setLicensePic] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = Styles;

  const districts = [
    { label: 'Select District', value: '' },
    { label: 'Colombo', value: 'Colombo' },
    { label: 'Gampaha', value: 'Gampaha' },
    { label: 'Kandy', value: 'Kandy' },
    { label: 'Galle', value: 'Galle' },
    { label: 'Jaffna', value: 'Jaffna' },
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
      let permission;
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      } else {
        permission =
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }

      const hasPermission = await requestPermission(permission);
      if (!hasPermission) {
        Alert.alert('Permission Required', `Please allow access to photos to upload ${type}.`);
        return;
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      if (!result.didCancel && result.assets?.length > 0) {
        // ✅ Store the full asset object like customer registration
        setImage(result.assets[0]);
      } else if (result.errorCode) {
        Alert.alert('Error', `Failed to pick ${type}: ${result.errorMessage || 'Unknown error'}`);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while picking the image.');
      console.error(error);
    }
  };



  const validateInputs = () => {
    if (!first_name.trim()) return 'First name is required';
    if (!last_name.trim()) return 'Last name is required';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email';
    if (!phone.match(/^\+?\d{10,15}$/)) return 'Please enter a valid phone number';
    if (!nic.trim()) return 'National ID (NIC) is required';
    if (!gender) return 'Gender is required';
    if (!district) return 'District is required';
    if (!license_number.trim()) return 'Driver’s License Number is required';
    if (!profile_pic) return 'Profile picture is required';
    if (!license_pic) return 'Driver license is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
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
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('nic', nic);
      formData.append('gender', gender);
      formData.append('district', district);
      formData.append('dob', dob.toISOString().split('T')[0]); // 'YYYY-MM-DD'
      formData.append('license_expiry', license_expiry.toISOString().split('T')[0]);
      formData.append('license_number', license_number);
      formData.append('password', password);

      if (profile_pic) {
        formData.append('profile_pic', {
          uri: profile_pic.uri,
          type: profile_pic.type || 'image/jpeg',
          name: profile_pic.fileName || 'profile.jpg',
        });
      }

      if (license_pic) {
        formData.append('license_pic', {
          uri: license_pic.uri,
          type: license_pic.type || 'image/jpeg',
          name: license_pic.fileName || 'license.jpg',
        });
      }

      const response = await registerDriver(formData);
      Alert.alert('Success', 'Driver registration completed successfully!');
      if (response?.token) {
        await AsyncStorage.setItem('auth_token', response.token);
        console.log('Token saved:', response.token);
      }
      setTimeout(() => {
        navigation.navigate('DriverDashboard', { driver: response.user });
      }, 2000);
    } catch (error) {
      console.error('Driver registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const ImageUploadCard = ({ image, title, icon, type, setImage }) => (
    <TouchableOpacity style={styles.imageCard} onPress={() => pickImage(setImage, type)} activeOpacity={0.7}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
          <View style={styles.changeImageOverlay}>
            <MaterialIcons name="edit" size={20} color="white" />
          </View>
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name={icon} size={40} color={styles.ACCENT_COLOR} />
          <Text style={styles.imagePlaceholderText}>{title}</Text>
          <Text style={styles.imageSubText}>Tap to upload</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <MaterialIcons name="directions-car" size={60} color={styles.PRIMARY_COLOR} />
            <Text style={styles.title}>Driver Registration</Text>
            <Text style={styles.subtitle}>Complete your profile to start driving</Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={20} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            {/* First Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <View style={styles.textInputContainer}>
                <MaterialIcons name="person" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter First Name"
                  placeholderTextColor="#94a3b8"
                  value={first_name}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <View style={styles.textInputContainer}>
                <MaterialIcons name="person" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Last Name"
                  placeholderTextColor="#94a3b8"
                  value={last_name}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.textInputContainer}>
                <MaterialIcons name="email" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email Address"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.textInputContainer}>
                <MaterialIcons name="phone" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Phone Number"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* NIC */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>National ID (NIC)</Text>
              <View style={styles.textInputContainer}>
                <MaterialIcons name="card-membership" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter National ID (NIC)"
                  placeholderTextColor="#94a3b8"
                  value={nic}
                  onChangeText={setNic}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Gender */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.pickerContainer}>
                <MaterialIcons name="wc" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={styles.picker}
                  dropdownIconColor={styles.PRIMARY_COLOR}
                >
                  <Picker.Item label="Select Gender" value="" color="#94a3b8" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>

            {/* District */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>District</Text>
              <View style={styles.pickerContainer}>
                <MaterialIcons name="location-on" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <Picker
                  selectedValue={district}
                  onValueChange={(itemValue) => setDistrict(itemValue)}
                  style={styles.picker}
                  dropdownIconColor={styles.PRIMARY_COLOR}
                >
                  {districts.map((d) => (
                    <Picker.Item
                      key={d.value}
                      label={d.label}
                      value={d.value}
                      color={d.value ? '#1e293b' : '#94a3b8'}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* DOB */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <View style={styles.dateContainer}>
                <MaterialIcons name="cake" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dateText, { color: dob ? '#1e293b' : '#94a3b8' }]}>
                    {dob ? dob.toDateString() : 'Select Date of Birth'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dob}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDob(selectedDate);
                }}
              />
            )}
          </View>

          {/* Documents Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Documents</Text>

            {/* License Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Driver’s License Number</Text>
              <View style={styles.textInputContainer}>
                <MaterialIcons name="badge" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Driver’s License Number"
                  placeholderTextColor="#94a3b8"
                  value={license_number}
                  onChangeText={setLicenseNumber}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* License Expiry */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>License Expiry Date</Text>
              <View style={styles.dateContainer}>
                <MaterialIcons name="event" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowExpiryPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dateText, { color: license_expiry ? '#1e293b' : '#94a3b8' }]}>
                    {license_expiry ? license_expiry.toDateString() : 'Select Expiry Date'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showExpiryPicker && (
              <DateTimePicker
                value={license_expiry}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowExpiryPicker(false);
                  if (selectedDate) setLicenseExpiry(selectedDate);
                }}
              />
            )}

            <ImageUploadCard
              image={profile_pic}
              title="Profile Picture"
              icon="person-outline"
              type="profile picture"
              setImage={setProfilePic}
            />

            <ImageUploadCard
              image={license_pic}
              title="Driver License"
              icon="verified-user"
              type="driver license"
              setImage={setLicensePic}
            />
          </View>

          {/* Security Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Security</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.textInputContainer}>
                <MaterialIcons name="lock" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                />
              </View>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <MaterialIcons name="autorenew" size={20} color="white" />
                <Text style={styles.buttonText}>Registering...</Text>
              </View>
            ) : (
              <>
                <MaterialIcons name="check" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Complete Registration</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLinkContainer}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DriverRegistrationScreen;
