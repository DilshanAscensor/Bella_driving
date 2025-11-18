import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({

    PRIMARY_COLOR: '#1e3a8a',
    ACCENT_COLOR: '#8DB600',
    TEXT_DARK: '#1F2937',
    TEXT_LIGHT: '#6B7280',
    CARD_BG: '#FFFFFF',
    SCREEN_BG: '#F3F4F6',

    header: {
        backgroundColor: PRIMARY_COLOR,
        padding: scale(18),
        borderRadius: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(20),
        elevation: 5
    },
    headerText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: moderateScale(20),
        fontWeight: '700',
        marginLeft: scale(10)
    },

    card: {
        backgroundColor: CARD_BG,
        borderRadius: scale(16),
        padding: scale(20),
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: verticalScale(4) },
        shadowRadius: scale(10)
    },

    imageContainer: {
        backgroundColor: '#E5E7EB',
        padding: scale(10),
        borderRadius: scale(14),
        alignItems: 'center',
        marginBottom: verticalScale(16)
    },
    vehicleImage: {
        width: scale(180),
        height: verticalScale(180),
        borderRadius: scale(14)
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
    },
    label: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: TEXT_LIGHT,
        width: scale(140),
        marginLeft: scale(8)
    },
    value: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: TEXT_DARK
    },

    editButton: {
        marginTop: verticalScale(24),
        backgroundColor: ACCENT_COLOR,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(14),
        borderRadius: scale(10)
    },
    editButtonText: {
        color: '#fff',
        fontSize: moderateScale(16),
        marginLeft: scale(10),
        fontWeight: '700'
    },

    /* Empty State */
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        backgroundColor: '#fff'
    },
    emptyTitle: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: TEXT_DARK,
        marginTop: verticalScale(10)
    },
    emptySubtitle: {
        fontSize: moderateScale(15),
        color: TEXT_LIGHT,
        marginBottom: verticalScale(20)
    },
    addButton: {
        backgroundColor: ACCENT_COLOR,
        flexDirection: 'row',
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(22),
        borderRadius: scale(10)
    },
    addButtonText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '700',
        marginLeft: scale(10)
    },

    /* Loading */
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    loadingText: {
        marginTop: verticalScale(10),
        fontSize: moderateScale(15),
        color: TEXT_LIGHT
    }
});