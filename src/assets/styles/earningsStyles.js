// earningsStyles.js
import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f7fb",
    },

    headerTitle: {
        fontSize: moderateScale(22),
        fontWeight: "700",
        marginLeft: scale(20),
        marginTop: verticalScale(15),
        color: "#111827",
    },

    // Balance Card
    balanceCard: {
        marginHorizontal: scale(20),
        marginTop: verticalScale(20),
        padding: scale(20),
        borderRadius: scale(20),
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },

    balanceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8),
    },

    balanceLabel: {
        color: "#E6E6FF",
        fontSize: moderateScale(13),
    },

    balanceAmount: {
        fontSize: moderateScale(32),
        color: "#fff",
        fontWeight: "700",
        marginVertical: verticalScale(8),
    },

    cashoutButton: {
        backgroundColor: "#fff",
        paddingVertical: verticalScale(10),
        borderRadius: scale(12),
        alignItems: "center",
        marginTop: verticalScale(10),
    },

    cashoutText: {
        fontSize: moderateScale(15),
        fontWeight: "600",
        color: "#4D3EFF",
    },

    // Weekly Summary
    weekContainer: {
        marginTop: verticalScale(25),
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: scale(20),
        alignItems: "center",
    },

    weekAmount: {
        fontSize: moderateScale(22),
        fontWeight: "700",
        color: "#1f2937",
    },

    weekIncrease: {
        fontSize: moderateScale(13),
        color: "#16a34a",
        fontWeight: "600",
    },

    // Chart
    chartContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: verticalScale(15),
        marginHorizontal: scale(20),
    },

    chartItem: {
        alignItems: "center",
    },

    bar: {
        width: scale(22),
        borderRadius: scale(6),
        marginBottom: verticalScale(5),
    },

    chartLabel: {
        fontSize: moderateScale(12),
        color: "#6b7280",
        marginTop: verticalScale(4),
    },

    // Stats
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: scale(20),
        marginTop: verticalScale(30),
    },

    statsCard: {
        width: "48%",
        backgroundColor: "#fff",
        paddingVertical: verticalScale(22),
        borderRadius: scale(18),
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },

    statsValue: {
        fontSize: moderateScale(22),
        fontWeight: "700",
        color: "#111827",
        marginTop: verticalScale(8),
    },

    statsLabel: {
        fontSize: moderateScale(13),
        color: "#6b7280",
        marginTop: verticalScale(5),
    },
});
