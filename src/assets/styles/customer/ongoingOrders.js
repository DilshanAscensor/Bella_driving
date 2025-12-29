import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../theme/colors';

export default StyleSheet.create({

    container: { flex: 1, backgroundColor: "#fff", padding: 16 },

    pageTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginVertical: 10,
        textAlign: "center",
    },

    orderCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        elevation: 3,
        marginTop: 10,
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    label: {
        fontSize: 15,
        color: "#555",
        fontWeight: "600",
    },

    value: {
        fontSize: 15,
        color: "#111",
        fontWeight: "600",
    },

    statusBox: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
    },

    statusInProgress: {
        backgroundColor: PRIMARY_COLOR,
        justifyContent: "center",
    },

    statusText: {
        color: "#fff",
        marginLeft: 10,
        fontWeight: "bold",
    },

    section: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },

    sectionTextBox: { marginLeft: 10, flex: 1 },

    sectionLabel: { fontSize: 13, color: "#555" },

    sectionValue: { fontSize: 15, fontWeight: "500", color: "#222" },

    amount: {
        fontSize: 18,
        fontWeight: "700",
        color: ACCENT_COLOR,
    },

    btn: {
        backgroundColor: PRIMARY_COLOR,
        padding: 12,
        borderRadius: 10,
        marginTop: 15,
        alignItems: "center",
    },

    btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

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
