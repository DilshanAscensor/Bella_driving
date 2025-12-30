import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { ACCENT_COLOR, TEXT_DARK, TEXT_LIGHT, CARD_BG } from "../../assets/theme/colors";
export default StyleSheet.create({
    root: {
        flex: 1,
    },
    center: {
        flex: 1,
        backgroundColor: CARD_BG,
        justifyContent: 'center',
        alignItems: 'center',
    },

    sheetDark: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        backgroundColor: '#0B2A4A',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    orderId: {
        color: CARD_BG,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    customerName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    urgentBadge: {
        backgroundColor: ACCENT_COLOR,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },

    urgentText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },

    meta: {
        color: '#aaa',
        fontSize: 13,
    },

    metaValue: {
        color: ACCENT_COLOR,
        fontSize: 16,
        fontWeight: '700',
    },

    locationBlock: {
        marginVertical: 6,
    },

    locationTitle: {
        color: '#aaa',
        fontSize: 12,
        fontWeight: '700',
    },

    locationText: {
        color: '#fff',
        fontSize: 14,
    },

    bullets: {
        marginVertical: 10,
    },

    bullet: {
        color: '#ccc',
        fontSize: 13,
        marginBottom: 4,
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
    },

    ignoreBtn: {
        width: '48%',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#aaa',
        alignItems: 'center',
    },

    ignoreText: {
        color: CARD_BG,
        fontWeight: '600',
    },

    acceptBtn: {
        width: '48%',
        padding: 14,
        borderRadius: 10,
        backgroundColor: ACCENT_COLOR,
        alignItems: 'center',
    },

    acceptText: {
        color: '#000',
        fontWeight: '700',
    },
});