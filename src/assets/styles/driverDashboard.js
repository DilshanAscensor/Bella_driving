import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import {
    PRIMARY_COLOR,
    ACCENT_COLOR,
    TEXT_DARK,
    TEXT_LIGHT,
    CARD_BG,
    SCREEN_BG,
} from '../../assets/theme/colors';

export default StyleSheet.create({
    /* ================= CONTAINER ================= */
    container: {
        flex: 1,
        backgroundColor: SCREEN_BG,
    },

    scroll: {
        paddingBottom: scale(120),
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* ================= HEADER ================= */
    headerCard: {
        marginHorizontal: scale(18),
        marginTop: scale(18),
        marginBottom: scale(14),
        padding: scale(18),
        borderRadius: scale(22),
        backgroundColor: CARD_BG,
        elevation: 3,
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerInfo: {
        marginLeft: scale(14),
    },

    greeting: {
        fontSize: scale(12),
        color: TEXT_LIGHT,
    },

    driverName: {
        fontSize: scale(20),
        fontWeight: '700',
        color: TEXT_DARK,
        marginTop: scale(2),
    },

    /* ================= STATUS ================= */
    statusCard: {
        marginHorizontal: scale(18),
        padding: scale(18),
        borderRadius: scale(22),
        backgroundColor: CARD_BG,
        elevation: 3,
    },

    statusTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    statusTitle: {
        fontSize: scale(16),
        fontWeight: '700',
        color: TEXT_DARK,
    },

    statusDesc: {
        fontSize: scale(13),
        color: TEXT_LIGHT,
        marginTop: scale(4),
        maxWidth: '90%',
    },

    statusBadge: {
        paddingHorizontal: scale(14),
        paddingVertical: scale(6),
        borderRadius: scale(20),
    },

    statusBadgeText: {
        fontSize: scale(11),
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    statusButton: {
        marginTop: scale(16),
        borderRadius: scale(14),
        paddingVertical: scale(6),
    },

    /* ================= MENU ================= */
    menuList: {
        marginTop: scale(20),
        paddingHorizontal: scale(18),
    },

    menuCard: {
        borderRadius: scale(10),
        marginBottom: scale(12),
        backgroundColor: CARD_BG,
        elevation: 2,
    },

    logoutCard: {
        backgroundColor: '#FFF5F5',
    },

    /* ================= ICON STYLES ================= */
    iconStyle: {
        backgroundColor: `${ACCENT_COLOR}25`,
    },

    iconLogoutStyle: {
        backgroundColor: '#D32F2F25',
    },
});
