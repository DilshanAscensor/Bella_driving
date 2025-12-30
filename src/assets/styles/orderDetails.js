import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

// Colors exported separately
export const PRIMARY = "#122948";
export const ACCENT = "#FFA500";
export const TEXT_DARK = "#111";
export const TEXT_LIGHT = "#6b7280";
export const BG = "#fff";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
        padding: scale(16),
    },

    header: {
        backgroundColor: PRIMARY,
        padding: verticalScale(15),
        borderRadius: moderateScale(12),
        alignItems: "center",
        marginBottom: verticalScale(20),
    },

    headerText: {
        color: "#fff",
        fontSize: scale(18),
        fontWeight: "700",
    },

    card: {
        backgroundColor: "#fff",
        padding: scale(18),
        borderRadius: moderateScale(14),
        marginBottom: verticalScale(20),
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: verticalScale(15),
    },

    textBox: {
        marginLeft: scale(10),
    },

    label: {
        color: TEXT_LIGHT,
        fontSize: scale(13),
    },

    value: {
        fontSize: scale(16),
        fontWeight: "600",
        color: TEXT_DARK,
    },

    detailLine: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: verticalScale(10),
    },

    detailText: {
        marginLeft: scale(10),
        fontSize: scale(15),
        color: TEXT_LIGHT,
    },

    section: {
        marginTop: verticalScale(15),
        paddingTop: verticalScale(10),
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
    },

    sectionTitle: {
        fontSize: scale(15),
        fontWeight: "700",
        color: PRIMARY,
        marginBottom: verticalScale(8),
    },

    price: {
        fontSize: scale(18),
        fontWeight: "700",
        marginLeft: scale(10),
        color: PRIMARY,
    },

    startBtn: {
        backgroundColor: ACCENT,
        padding: verticalScale(14),
        borderRadius: moderateScale(10),
        alignItems: "center",
        marginTop: verticalScale(10),
    },

    startText: {
        color: "#fff",
        fontSize: scale(16),
        fontWeight: "700",
    },
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
});

