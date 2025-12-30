import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
export default StyleSheet.create({

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: moderateScale(16),
        backgroundColor: "#fff",
        elevation: 4,
        marginBottom: verticalScale(10),
    },
    headerMainTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: moderateScale(18),
        fontWeight: "700",
        color: "#333",
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#f1f5f9",
    },

    container: {
        paddingBottom: scale(80),
    },

    headerWrapper: {
        paddingHorizontal: scale(18),
        marginBottom: verticalScale(25),
    },

    headerTitle: {
        fontSize: moderateScale(22),
        fontWeight: "800",
        color: "#1e293b",
    },

    headerUnderline: {
        width: scale(50),
        height: verticalScale(3),
        backgroundColor: "#FFA500",
        borderRadius: 10,
        marginTop: verticalScale(4),
        marginBottom: verticalScale(8),
    },

    headerSubtitle: {
        fontSize: moderateScale(12),
        color: "#64748b",
        fontWeight: "500",
    },

    /* ================= Card Styling ================= */
    card: {
        backgroundColor: "#fff",
        padding: scale(16),
        margin: scale(18),
        borderRadius: scale(24),
        marginBottom: verticalScale(18),
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
    },

    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: verticalScale(14),
    },

    iconWrapper: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(12),
        backgroundColor: "#FFA500",
        justifyContent: "center",
        alignItems: "center",
        marginRight: scale(10),
        shadowColor: "#FFA500",
        shadowOpacity: 0.4,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },

    cardTitle: {
        fontSize: moderateScale(17),
        fontWeight: "700",
        color: "#1e293b",
    },

    documentImage: {
        width: "100%",
        height: verticalScale(170),
        borderRadius: scale(18),
    },

    emptyState: {
        width: "100%",
        height: verticalScale(160),
        borderRadius: scale(18),
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        justifyContent: "center",
        alignItems: "center",
    },

    emptyText: {
        marginTop: verticalScale(6),
        color: "#94a3b8",
        fontSize: moderateScale(13),
        fontWeight: "600",
    },

    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalImage: {
        width: "90%",
        height: "80%",
    },
    imageWrapper: {
        position: "relative",
    },

    professionalBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(34, 197, 94, 0.9)",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    badgeText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
        marginLeft: 6,
        letterSpacing: 0.5,
    },

    unverifiedBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "#f87171",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ef4444",
    },
    unverifiedText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
});
