import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { PRIMARY_COLOR } from "../../../assets/theme/colors";
import { BASE_URL } from "../../../config/api";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../../assets/styles/customer/customerProfile";

export default function CustomerProfileScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const customer = useSelector((state) => state.user.user) || {};

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
        );
    }

    if (!customer) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={60} color="#ff4757" />
                <Text style={styles.errorText}>Unable to load profile</Text>
                <TouchableOpacity style={styles.retryButton}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const profilePic = customer.customer_details?.profile_pic
        ? `${BASE_URL}/storage/${customer.customer_details.profile_pic}`
        : null;

    const infoRows = [
        {
            label: "Gender",
            value: customer.customer_details?.gender || "Not set",
            icon: "wc",
            color: "#6c5ce7"
        },
        {
            label: "Phone",
            value: customer.phone,
            icon: "phone",
            color: "#00b894"
        },
        {
            label: "Email",
            value: customer.email,
            icon: "email",
            color: "#0984e3"
        },
        {
            label: "Member Since",
            value: new Date(customer.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            }),
            icon: "calendar-today",
            color: "#fd79a8"
        },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Header with Gradient */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                profilePic
                                    ? { uri: profilePic }
                                    : require('../../../assets/images/mickaido-main-logo.png')
                            }
                            style={styles.profilePic}
                        />
                        <View style={styles.verifiedBadge}>
                            <MaterialIcons name="verified" size={16} color="#fff" />
                        </View>
                    </View>

                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>
                            {customer.first_name} {customer.last_name}
                        </Text>
                        <View style={styles.memberBadge}>
                            <MaterialIcons name="star" size={12} color="#fff" />
                            <Text style={styles.memberText}>Premium Member</Text>
                        </View>
                    </View>

                    <View style={styles.contactContainer}>
                        <View style={styles.contactItem}>
                            <MaterialIcons name="phone" size={14} color="#636e72" />
                            <Text style={styles.contactText}>{customer.phone}</Text>
                        </View>
                        <View style={styles.contactItem}>
                            <MaterialIcons name="email" size={14} color="#636e72" />
                            <Text style={styles.contactText}>{customer.email}</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Card */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>24</Text>
                        <Text style={styles.statLabel}>Order</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>4.8</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                    {/* <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Favorites</Text>
                    </View> */}
                </View>

                {/* Information Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="person-outline" size={22} color={PRIMARY_COLOR} />
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                    </View>

                    <View style={styles.infoGrid}>
                        {infoRows.map((row, index) => (
                            <View key={index} style={styles.infoCard}>
                                <View style={[styles.iconContainer, { backgroundColor: `${row.color}15` }]}>
                                    <MaterialIcons
                                        name={row.icon}
                                        size={20}
                                        color={row.color}
                                    />
                                </View>
                                <Text style={styles.infoLabel}>{row.label}</Text>
                                <Text style={styles.infoValue} numberOfLines={1}>
                                    {row.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Actions Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="settings" size={22} color={PRIMARY_COLOR} />
                        <Text style={styles.sectionTitle}>Account Settings</Text>
                    </View>

                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate("EditCustomerProfile", { customer })}
                        >
                            <View style={styles.actionButtonContent}>
                                <View style={[styles.actionIcon, { backgroundColor: "#ffeaa7" }]}>
                                    <MaterialIcons name="edit" size={20} color="#e17055" />
                                </View>
                                <View style={styles.actionTextContainer}>
                                    <Text style={styles.actionTitle}>Edit Profile</Text>
                                    <Text style={styles.actionSubtitle}>Update your personal information</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#dfe6e9" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionButtonContent}>
                                <View style={[styles.actionIcon, { backgroundColor: "#a29bfe" }]}>
                                    <MaterialIcons name="security" size={20} color="#fff" />
                                </View>
                                <View style={styles.actionTextContainer}>
                                    <Text style={styles.actionTitle}>Security</Text>
                                    <Text style={styles.actionSubtitle}>Change password & privacy</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#dfe6e9" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionButtonContent}>
                                <View style={[styles.actionIcon, { backgroundColor: "#fd79a8" }]}>
                                    <MaterialIcons name="notifications" size={20} color="#fff" />
                                </View>
                                <View style={styles.actionTextContainer}>
                                    <Text style={styles.actionTitle}>Notifications</Text>
                                    <Text style={styles.actionSubtitle}>Manage notifications</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#dfe6e9" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
