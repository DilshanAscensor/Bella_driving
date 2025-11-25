import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { ACCENT_COLOR, TEXT_DARK, TEXT_LIGHT, CARD_BG } from "../../assets/theme/colors";

export default StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        padding: moderateScale(16),
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: verticalScale(12),
        backgroundColor: "#FFFFFF",
        borderRadius: scale(12),
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        paddingHorizontal: scale(16),
        marginBottom: verticalScale(14),
    },

    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: moderateScale(18),
        fontWeight: "700",
        color: TEXT_DARK,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: scale(18),
        padding: moderateScale(18),
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
        marginBottom: verticalScale(16),
    },

    /* Image Picker / Image Display */
    imageContainer: {
        backgroundColor: "#F1F5F9",
        padding: moderateScale(12),
        borderRadius: scale(14),
        alignItems: "center",
        marginBottom: verticalScale(14),
    },

    vehicleImage: {
        width: scale(170),
        height: scale(170),
        borderRadius: scale(14),
        resizeMode: "cover",
    },

    /* Info list */
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },

    label: {
        fontSize: moderateScale(14),
        fontWeight: "600",
        color: TEXT_LIGHT,
        width: scale(130),
        marginLeft: scale(6),
    },

    value: {
        fontSize: moderateScale(16),
        fontWeight: "700",
        color: TEXT_DARK,
    },

    /* Edit Button */
    editButton: {
        marginTop: verticalScale(22),
        backgroundColor: ACCENT_COLOR,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
    },

    editButtonText: {
        color: "#fff",
        fontSize: moderateScale(16),
        marginLeft: scale(8),
        fontWeight: "700",
    },

    /* Empty State */
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: moderateScale(20),
        backgroundColor: "#fff",
    },

    emptyTitle: {
        fontSize: moderateScale(22),
        fontWeight: "700",
        color: TEXT_DARK,
        marginTop: verticalScale(10),
    },

    emptySubtitle: {
        fontSize: moderateScale(14),
        color: TEXT_LIGHT,
        marginBottom: verticalScale(18),
        textAlign: "center",
    },

    addButton: {
        backgroundColor: ACCENT_COLOR,
        flexDirection: "row",
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(22),
        borderRadius: scale(10),
    },

    addButtonText: {
        color: "#fff",
        fontSize: moderateScale(15),
        fontWeight: "700",
        marginLeft: scale(8),
    },

    /* Loading */
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },

    loadingText: {
        marginTop: verticalScale(10),
        fontSize: moderateScale(14),
        color: TEXT_LIGHT,
    },

});
