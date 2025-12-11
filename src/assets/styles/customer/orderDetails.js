import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../theme/colors';

export default StyleSheet.create({

    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },

    orderId: {
        fontSize: 18,
        fontWeight: "700",
    },

    date: {
        color: "#666",
        marginTop: 4,
        marginBottom: 12,
    },

    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    statusCompleted: { backgroundColor: "#16a34a20" },
    statusCancelled: { backgroundColor: "#dc262620" },
    statusPending: { backgroundColor: "#fbbf2420" },
    statusText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#333",
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    locationText: {
        marginLeft: 6,
        fontSize: 14,
        color: "#333",
        flex: 1,
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 16,
        marginBottom: 6,
        color: "#333",
    },

    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    itemName: {
        fontSize: 14,
        color: "#333",
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: "600",
    },

    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 12,
    },

    totalLabel: {
        fontSize: 16,
        fontWeight: "700",
    },
    totalValue: {
        fontSize: 16,
        fontWeight: "700",
        color: PRIMARY_COLOR,
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        fontSize: 16,
        color: "red",
    },
});