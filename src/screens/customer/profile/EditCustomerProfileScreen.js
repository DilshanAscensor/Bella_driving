import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Alert,
    Platform,
    KeyboardAvoidingView,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { PRIMARY_COLOR, TEXT_LIGHT } from "../../../assets/theme/colors";
import { BASE_URL } from "../../../config/api";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../../assets/styles/customer/editCustomerProfile";

export default function EditCustomerProfileScreen({ route }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { customer } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showGenderModal, setShowGenderModal] = useState(false);

    const [formData, setFormData] = useState({
        firstName: customer?.first_name || "",
        lastName: customer?.last_name || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        gender: customer?.customer_details?.gender || "",
        profilePic: customer?.customer_details?.profile_pic || null,
    });

    const [errors, setErrors] = useState({});

    // Gender options
    const genderOptions = [
        { label: "Male", value: "male", icon: "male" },
        { label: "Female", value: "female", icon: "female" },
    ];

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field if exists
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save profile
    const handleSaveProfile = async () => {
        if (!validateForm()) {
            Alert.alert("Validation Error", "Please fix the errors in the form");
            return;
        }

        setSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Here you would dispatch an action to update the user in Redux
            // dispatch(updateUserProfile(formData));

            Alert.alert(
                "Success",
                "Profile updated successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            Alert.alert("Error", "Failed to update profile. Please try again.");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // Handle profile picture change (simulated)
    const handleProfilePicChange = () => {
        Alert.alert(
            "Change Profile Picture",
            "Select an option",
            [
                { text: "Take Photo", onPress: () => console.log("Take Photo") },
                { text: "Choose from Gallery", onPress: () => console.log("Choose from Gallery") },
                { text: "Remove Photo", onPress: () => handleInputChange("profilePic", null) },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    const profilePicUri = formData.profilePic
        ? `${BASE_URL}/storage/${formData.profilePic}`
        : null;

    // Header with back button
    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <MaterialIcons name="arrow-back" size={24} color={PRIMARY_COLOR} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
                disabled={saving}
                activeOpacity={0.7}
            >
                {saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    // Gender Selection Modal
    const renderGenderModal = () => (
        <Modal
            visible={showGenderModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowGenderModal(false)}
        >
            <TouchableWithoutFeedback onPress={() => setShowGenderModal(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Gender</Text>
                                <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                                    <MaterialIcons name="close" size={24} color={TEXT_LIGHT} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                {genderOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.genderOption,
                                            formData.gender === option.value && styles.genderOptionSelected
                                        ]}
                                        onPress={() => {
                                            handleInputChange("gender", option.value);
                                            setShowGenderModal(false);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[
                                            styles.genderIconContainer,
                                            formData.gender === option.value && { backgroundColor: `${PRIMARY_COLOR}15` }
                                        ]}>
                                            <MaterialIcons
                                                name={option.icon}
                                                size={20}
                                                color={formData.gender === option.value ? PRIMARY_COLOR : TEXT_LIGHT}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.genderOptionText,
                                            formData.gender === option.value && styles.genderOptionTextSelected
                                        ]}>
                                            {option.label}
                                        </Text>
                                        {formData.gender === option.value && (
                                            <MaterialIcons name="check-circle" size={20} color={PRIMARY_COLOR} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {renderHeader()}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Profile Picture Section */}
                    <View style={styles.profilePicSection}>
                        <View style={styles.profilePicContainer}>
                            <Image
                                source={
                                    profilePicUri
                                        ? { uri: profilePicUri }
                                        : require('../../../assets/images/taxi-app-logo.webp')
                                }
                                style={styles.profilePic}
                            />
                            <TouchableOpacity
                                style={styles.changePhotoButton}
                                onPress={handleProfilePicChange}
                                activeOpacity={0.8}
                            >
                                <MaterialIcons name="photo-camera" size={18} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.changePhotoTextButton}
                            onPress={handleProfilePicChange}
                        >
                            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        {/* Personal Information Card */}
                        <View style={styles.formCard}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="person-outline" size={20} color={PRIMARY_COLOR} />
                                <Text style={styles.cardTitle}>Personal Information</Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>First Name *</Text>
                                <TextInput
                                    style={[styles.textInput, errors.firstName && styles.inputError]}
                                    value={formData.firstName}
                                    onChangeText={(text) => handleInputChange("firstName", text)}
                                    placeholder="Enter first name"
                                    placeholderTextColor={TEXT_LIGHT}
                                />
                                {errors.firstName && (
                                    <Text style={styles.errorText}>{errors.firstName}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Last Name *</Text>
                                <TextInput
                                    style={[styles.textInput, errors.lastName && styles.inputError]}
                                    value={formData.lastName}
                                    onChangeText={(text) => handleInputChange("lastName", text)}
                                    placeholder="Enter last name"
                                    placeholderTextColor={TEXT_LIGHT}
                                />
                                {errors.lastName && (
                                    <Text style={styles.errorText}>{errors.lastName}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Email *</Text>
                                <TextInput
                                    style={[styles.textInput, errors.email && styles.inputError]}
                                    value={formData.email}
                                    onChangeText={(text) => handleInputChange("email", text)}
                                    placeholder="Enter email address"
                                    placeholderTextColor={TEXT_LIGHT}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Phone Number *</Text>
                                <TextInput
                                    style={[styles.textInput, errors.phone && styles.inputError]}
                                    value={formData.phone}
                                    onChangeText={(text) => handleInputChange("phone", text)}
                                    placeholder="Enter phone number"
                                    placeholderTextColor={TEXT_LIGHT}
                                    keyboardType="phone-pad"
                                />
                                {errors.phone && (
                                    <Text style={styles.errorText}>{errors.phone}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Gender</Text>
                                <TouchableOpacity
                                    style={styles.genderSelector}
                                    onPress={() => setShowGenderModal(true)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.genderSelectorContent}>
                                        <MaterialIcons
                                            name={formData.gender === "male" ? "male" :
                                                formData.gender === "female" ? "female" :
                                                    "person-outline"}
                                            size={20}
                                            color={formData.gender ? PRIMARY_COLOR : TEXT_LIGHT}
                                        />
                                        <Text style={[
                                            styles.genderSelectorText,
                                            !formData.gender && styles.genderSelectorPlaceholder
                                        ]}>
                                            {formData.gender ?
                                                genderOptions.find(g => g.value === formData.gender)?.label :
                                                "Select gender"}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="keyboard-arrow-down" size={24} color={TEXT_LIGHT} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => navigation.goBack()}
                                disabled={saving}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.secondaryButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
                                onPress={handleSaveProfile}
                                disabled={saving}
                                activeOpacity={0.9}
                            >
                                {saving ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Text style={styles.primaryButtonText}>Save Changes</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {renderGenderModal()}
        </SafeAreaView>
    );
}