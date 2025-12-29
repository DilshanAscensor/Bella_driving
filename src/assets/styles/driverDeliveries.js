import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';


export default StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        marginTop: "5%",
        flex: 1,
        backgroundColor: "#f8fafc",
    },

    /* ✅ FIXED TABS */
    tabContainer: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        elevation: 3,
        marginBottom: 5,
        justifyContent: "space-between",
    },
    tabButton: {
        flex: 1, // ✅ makes full clickable area
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: "#e2e8f0",
        alignItems: "center",
    },
    activeTabButton: {
        backgroundColor: '#8DB600',
    },
    tabText: {
        fontSize: 14,
        color: "#475569",
        fontWeight: "600",
    },
    activeTabText: {
        color: "#fff",
    },

    /* ✅ Cards */
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginVertical: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    orderId: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1e293b",
    },
    status: {
        color: '#8DB600',
        fontSize: 13,
        fontWeight: "600",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 3,
    },
    label: {
        marginLeft: 6,
        color: "#64748b",
        fontWeight: "600",
    },
    value: {
        marginLeft: 4,
        color: "#1e293b",
        flexShrink: 1,
        fontWeight: "500",
    },

    emptyText: {
        textAlign: "center",
        marginTop: 30,
        color: "#64748b",
        fontSize: 16,
    },
});
