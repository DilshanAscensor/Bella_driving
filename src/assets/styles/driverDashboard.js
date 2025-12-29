import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import {
    PRIMARY_COLOR,
    TEXT_DARK,
    TEXT_LIGHT,
    CARD_BG,
    SCREEN_BG,
    ACCENT_COLOR,
} from '../../assets/theme/colors';

export default StyleSheet.create({
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

    /* HEADER */
    headerCard: {
        margin: scale(18),
        padding: scale(18),
        borderRadius: 20,
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
        fontSize: scale(18),
        fontWeight: '700',
        color: TEXT_DARK,
        marginTop: 2,
    },

    /* STATUS */
    statusCard: {
        marginHorizontal: scale(18),
        padding: scale(18),
        borderRadius: 20,
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
        marginTop: 4,
    },

    statusBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },

    statusBadgeText: {
        fontSize: scale(11),
        fontWeight: '700',
        color: '#fff',
    },

    statusButton: {
        marginTop: scale(16),
        borderRadius: 14,
        paddingVertical: scale(6),
    },

    /* MENU */
    menuList: {
        marginTop: scale(20),
        paddingHorizontal: scale(18),
    },

    menuCard: {
        borderRadius: 16,
        marginBottom: scale(14),
        backgroundColor: CARD_BG,
        elevation: 2,
    },

    logoutCard: {
        backgroundColor: '#FFF5F5',
    },
    iconStyle: {
        backgroundColor: '#8cb60050',
    },
    iconLogoutStyle: {
        backgroundColor: '#b600006b',
    }
});
