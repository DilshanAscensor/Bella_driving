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
  Dimensions,
  useColorScheme,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Styles from '../../assets/styles/driver'
import { registerDriver } from '../../api/registrationApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../assets/theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DriverRegistrationScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const dispatch = useDispatch();
  const [fieldErrors, setFieldErrors] = useState({});

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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nic_front_pic, setNicFrontPic] = useState(null);
  const [nic_back_pic, setNicBackPic] = useState(null);
  const [license_front_pic, setLicenseFrontPic] = useState(null);
  const [license_back_pic, setLicenseBackPic] = useState(null);

  const styles = Styles;

  const backgroundColors = isDarkMode ? ['#000', '#172554'] : [PRIMARY_COLOR, '#e0e7ff'];
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBgColor = isDarkMode ? '#334155' : '#f1f5f9';
  const placeholderColor = isDarkMode ? '#a5b4fc' : '#94a3b8';
  const buttonTextColor = '#fff';
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

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

  const validateImageSize = (asset, label) => {
    const size = asset?.fileSize;

    if (typeof size !== 'number') {
      console.warn('Image size unavailable for:', label);
      return true;
    }

    if (size > MAX_IMAGE_SIZE) {
      setError(`${label} must be less than 2 MB`);
      return false;
    }

    return true;
  };


  const pickImage = async (setImage, label) => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    const status = await check(permission);
    if (status !== RESULTS.GRANTED) {
      const req = await request(permission);
      if (req !== RESULTS.GRANTED) {
        Alert.alert('Permission required', 'Please allow photo access');
        return;
      }
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      includeExtra: true,
    });
    if (result.assets?.length) {
      const asset = result.assets[0];
      if (!validateImageSize(asset, label)) return;
      setImage(asset);
      setError('');
    }
  };


  const validateInputs = () => {
    let errors = {};

    if (!first_name.trim()) errors.first_name = 'First name is required';
    if (!last_name.trim()) errors.last_name = 'Last name is required';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Please enter a valid email';
    if (!phone.match(/^\+?\d{10,15}$/)) errors.phone = 'Please enter a valid phone number';
    if (!/^(?:\d{9}[Vv]|\d{12})$/.test(nic)) errors.nic = 'NIC must be either 9 digits + V or 12 digits';
    if (!gender) errors.gender = 'Gender is required';
    if (!district) errors.district = 'District is required';
    if (!license_number.trim()) errors.license_number = 'License number required';
    if (!dob) errors.dob = 'Date of birth required';
    else if (!isAtLeast18(dob)) errors.dob = 'Must be at least 18 years old';

    if (!profile_pic) errors.profile_pic = 'Profile picture required';
    if (!nic_front_pic) errors.nic_front_pic = 'NIC front image required';
    if (!nic_back_pic) errors.nic_back_pic = 'NIC back image required';
    if (!license_front_pic) errors.license_front_pic = 'License front image required';
    if (!license_back_pic) errors.license_back_pic = 'License back image required';

    if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const isAtLeast18 = (dob) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age >= 18;
  };

  const handleRegister = async () => {
    const validationError = validateInputs();
    if (!validateInputs()) return;

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
      formData.append('dob', dob.toISOString().split('T')[0]);
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

      if (nic_front_pic) {
        formData.append('nic_front_pic', {
          uri: nic_front_pic.uri,
          type: nic_front_pic.type || 'image/jpeg',
          name: nic_front_pic.fileName || 'nic_front.jpg',
        });
      }
      if (nic_back_pic) {
        formData.append('nic_back_pic', {
          uri: nic_back_pic.uri,
          type: nic_back_pic.type || 'image/jpeg',
          name: nic_back_pic.fileName || 'nic_back.jpg',
        });
      }

      if (license_front_pic) {
        formData.append('license_front_pic', {
          uri: license_front_pic.uri,
          type: license_front_pic.type || 'image/jpeg',
          name: license_front_pic.fileName || 'license_front.jpg',
        });
      }

      if (license_back_pic) {
        formData.append('license_back_pic', {
          uri: license_back_pic.uri,
          type: license_back_pic.type || 'image/jpeg',
          name: license_back_pic.fileName || 'license_back.jpg',
        });
      }


      const response = await registerDriver(formData);

      if (response?.token) {
        await AsyncStorage.setItem('auth_token', response.token);
      }

      if (response?.user) {
        await AsyncStorage.setItem('user_data', JSON.stringify(response.user));
      }

      dispatch(setUser(response.user));

      Alert.alert('Success', 'Driver registration completed successfully!');

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }, 1000);

    } catch (error) {
      console.error('Driver registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ error }) => {
    if (!error) return null;
    return (
      <View style={styles.formErrorBox}>
        <MaterialIcons name="error" size={22} color="#ec2121" />
        <Text style={styles.formErrorText}>{error}</Text>
      </View>
    );
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
              <FieldError error={fieldErrors.first_name} />
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
              <FieldError error={fieldErrors.last_name} />
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
              <FieldError error={fieldErrors.email} />
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
              <FieldError error={fieldErrors.phone} />
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
                  onChangeText={(text) => {
                    setNic(text.toUpperCase());
                    if (error) setError('');
                  }}
                  autoCapitalize="characters"
                  returnKeyType="next"
                />
              </View>
              <FieldError error={fieldErrors.nic} />
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
              <FieldError error={fieldErrors.gender} />
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
              <FieldError error={fieldErrors.district} />
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
              <FieldError error={fieldErrors.dob} />
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
              <FieldError error={fieldErrors.license_number} />
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
              <FieldError error={fieldErrors.license_expiry} />
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

            <Text style={styles.inputLabel}>Profile Picture</Text>
            <ImageUploadCard
              image={profile_pic}
              title="Profile Picture"
              icon="person-outline"
              type="profile picture"
              setImage={setProfilePic}
            />
            <FieldError error={fieldErrors.profile_pic} />

            <Text style={styles.inputLabel}>NIC Front</Text>
            <ImageUploadCard
              image={nic_front_pic}
              title="NIC Front"
              icon="image"
              type="NIC front"
              setImage={setNicFrontPic}
            />
            <FieldError error={fieldErrors.nic_front_pic} />

            <Text style={styles.inputLabel}>NIC Back</Text>
            <ImageUploadCard
              image={nic_back_pic}
              title="NIC Back"
              icon="image"
              type="NIC back"
              setImage={setNicBackPic}
            />
            <FieldError error={fieldErrors.nic_back_pic} />

            <Text style={styles.inputLabel}>License Front</Text>
            <ImageUploadCard
              image={license_front_pic}
              title="License Front"
              icon="verified-user"
              type="license front"
              setImage={setLicenseFrontPic}
            />
            <FieldError error={fieldErrors.license_front_pic} />

            <Text style={styles.inputLabel}>License Back</Text>
            <ImageUploadCard
              image={license_back_pic}
              title="License Back"
              icon="verified-user"
              type="license back"
              setImage={setLicenseBackPic}
            />
            <FieldError error={fieldErrors.license_back_pic} />

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
                  secureTextEntry={hidden}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={() => setHidden(!hidden)}>
                  <MaterialIcons
                    name={hidden ? 'visibility-off' : 'visibility'}
                    size={22}
                    color={placeholderColor}
                  />
                </TouchableOpacity>
              </View>
              <FieldError error={fieldErrors.password} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.textInputContainer}>
                <MaterialIcons name="lock" size={20} color={styles.PRIMARY_COLOR} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={hidden}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={() => setHidden(!hidden)}>
                  <MaterialIcons
                    name={hidden ? 'visibility-off' : 'visibility'}
                    size={22}
                    color={placeholderColor}
                  />
                </TouchableOpacity>
              </View>
              <FieldError error={fieldErrors.confirmPassword} />
            </View>


          </View>

          {error ? (
            <View style={styles.formErrorBox}>
              <MaterialIcons name="error" size={22} color="#fff" />
              <Text style={styles.formErrorText}>{error}</Text>
            </View>
          ) : null}

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
