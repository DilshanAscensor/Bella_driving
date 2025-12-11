import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../theme/colors';

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },

    pageTitle: {
        color: "#111",
        fontSize: 22,
        fontWeight: "700",
        marginVertical: 10,
    },

    orderCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        elevation: 2,
        marginTop: 12,
        marginBottom: '5%',
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    orderId: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },

    statusCompleted: {
        backgroundColor: "#10b981",
    },

    statusCancelled: {
        backgroundColor: "#ef4444",
    },

    statusText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 12,
    },

    dateText: {
        marginTop: 5,
        color: "#666",
        fontSize: 12,
    },

    section: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },

    locationText: {
        marginLeft: 6,
        fontSize: 14,
        color: "#333",
    },

    amountLabel: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "600",
    },

    amountValue: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "700",
        color: ACCENT_COLOR,
    },

    detailsBtn: {
        backgroundColor: PRIMARY_COLOR,
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },

    detailsText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },

    emptyBox: {
        marginTop: 100,
        alignItems: "center",
    },

    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: "#777",
    },
});
