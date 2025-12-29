import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from "../../../config/api";
import Styles from "../../../assets/styles/documentsViewStyles";
import Footer from '../../../components/Footer';


const resolveFileUrl = (path) => {
    if (!path) return null;
    return `${BASE_URL}/storage/${String(path).replace(/^\/+/, "")}`;
};

const DocumentsAndLicenses = () => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user) || {};
    const d = user.driver_details || {};
    const [active, setActive] = useState('document');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openImage = (url) => {
        setSelectedImage(url);
        setModalVisible(true);
    };

    const documents = [
        { label: "NIC Front", file: d.nic_front_pic },
        { label: "NIC Back", file: d.nic_back_pic },
        { label: "License Front", file: d.license_front_pic },
        { label: "License Back", file: d.license_back_pic },
    ];

    return (
        <SafeAreaView style={Styles.safeArea}>
            <ScrollView contentContainerStyle={Styles.container}>
                <View style={Styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={26} color="#333" />
                    </TouchableOpacity>
                    <Text style={Styles.headerMainTitle}>Documents & License</Text>
                    <View style={{ width: 26 }} />
                </View>

                <View style={Styles.headerWrapper}>
                    <Text style={Styles.headerTitle}>Documents & License</Text>
                    <View style={Styles.headerUnderline} />
                    <Text style={Styles.headerSubtitle}>
                        View all required verification documents
                    </Text>
                </View>

                {documents.map((item, i) => {
                    const imgUrl = resolveFileUrl(item.file);
                    const isVerified = item.file ? true : false;

                    return (
                        <View key={i} style={Styles.card}>
                            <View style={Styles.cardTop}>
                                <View style={Styles.iconWrapper}>
                                    <MaterialIcons name="folder" size={22} color="#fff" />
                                </View>
                                <Text style={Styles.cardTitle}>{item.label}</Text>
                            </View>

                            {imgUrl ? (
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => openImage(imgUrl)}
                                    style={Styles.imageWrapper}
                                >
                                    <Image
                                        source={{ uri: imgUrl }}
                                        style={Styles.documentImage}
                                        resizeMode="cover"
                                    />

                                    {isVerified ? (
                                        <View style={Styles.professionalBadge}>
                                            <MaterialIcons
                                                name="verified"
                                                size={16}
                                                color="#fff"
                                            />
                                            <Text style={Styles.badgeText}>Verified</Text>
                                        </View>
                                    ) : (
                                        <View style={Styles.unverifiedBadge}>
                                            <Text style={Styles.unverifiedText}>Unverified</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <View style={Styles.emptyState}>
                                    <MaterialIcons
                                        name="image-not-supported"
                                        size={52}
                                        color="#cbd5e1"
                                    />
                                    <Text style={Styles.emptyText}>No image uploaded</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            <Modal visible={modalVisible} transparent>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                    style={Styles.modalContainer}
                >
                    <Image
                        source={{ uri: selectedImage }}
                        style={Styles.modalImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </Modal>
            <Footer active={active} onPress={setActive} />
        </SafeAreaView>
    );
};

export default DocumentsAndLicenses;
