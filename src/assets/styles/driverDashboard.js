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

    container: {
        flex: 1,
        backgroundColor: SCREEN_BG,
    },

    scroll: {
        paddingBottom: scale(100),
    },

    /* HEADER */
    headerCard: {
        margin: scale(18),
        padding: scale(20),
        borderRadius: 16,
        elevation: 2,
        backgroundColor: CARD_BG,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    headerInfo: {
        marginLeft: scale(15),
        flex: 1,
    },

    welcomeText: {
        fontWeight: "700",
        color: PRIMARY_COLOR,
        fontSize: scale(20),
    },

    headerSubText: {
        fontSize: scale(13),
        marginTop: 4,
        color: TEXT_LIGHT,
    },

    /* SECTION HEADER */
    sectionHeaderWrap: {
        marginTop: scale(12),
        marginHorizontal: scale(18),
    },

    sectionHeader: {
        fontSize: scale(16),
        fontWeight: "700",
        color: TEXT_DARK,
    },

    /* STATS */
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: scale(18),
        marginTop: scale(14),
    },

    statsCard: {
        width: "48%",
        borderRadius: 14,
        elevation: 2,
        paddingVertical: scale(6),
        backgroundColor: CARD_BG,
    },

    statsCardWide: {
        marginTop: scale(14),
        marginHorizontal: scale(18),
        borderRadius: 14,
        elevation: 2,
        backgroundColor: CARD_BG,
    },

    statsValue: {
        fontSize: scale(22),
        fontWeight: "700",
        color: ACCENT_COLOR,
    },

    statsLabel: {
        fontSize: scale(13),
        marginTop: 4,
        color: TEXT_LIGHT,
    },

    /* ONLINE STATUS */
    onlineCard: {
        marginTop: scale(20),
        marginHorizontal: scale(18),
        padding: scale(18),
        borderRadius: 16,
        backgroundColor: CARD_BG,
        elevation: 2,
    },

    onlineHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    statusLabel: {
        fontSize: scale(15),
        fontWeight: "600",
        color: TEXT_DARK,
        marginRight: 10,
    },

    statusDot: {
        width: scale(12),
        height: scale(12),
        borderRadius: 6,
        marginRight: 8,
    },

    statusText: {
        fontSize: scale(15),
        fontWeight: "700",
        color: PRIMARY_COLOR,
    },

    statusSubText: {
        color: TEXT_LIGHT,
        fontSize: scale(13),
        marginTop: 8,
        marginBottom: 14,
    },

    statusButton: {
        borderRadius: 10,
        paddingVertical: 4,
    },

    /* MENU */
    menuList: {
        marginTop: scale(10),
        paddingHorizontal: scale(18),
    },

    menuCard: {
        borderRadius: 14,
        marginBottom: scale(15),
        elevation: 2,
        backgroundColor: CARD_BG,
    },

    menuTitle: {
        fontSize: scale(15),
        fontWeight: "600",
        color: TEXT_DARK,
    },

    menuIcon: {
        backgroundColor: PRIMARY_COLOR,
    },
    actionButtonWrapper: {
        marginHorizontal: scale(18),
        marginTop: scale(10),
    },

    actionButton: {
        paddingVertical: scale(6),
        borderRadius: 10,
    },
});
