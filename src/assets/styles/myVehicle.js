import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { ACCENT_COLOR, TEXT_DARK, CARD_BG, TEXT_LIGHT } from '../../assets/theme/colors';

export default StyleSheet.create({

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: moderateScale(16),
        backgroundColor: "#fff",
        elevation: 4,
        marginBottom: verticalScale(10),
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: moderateScale(18),
        fontWeight: "700",
        color: "#333",
    },

    card: {
        backgroundColor: CARD_BG,
        borderRadius: moderateScale(16),
        padding: moderateScale(20),
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: verticalScale(4) },
        shadowRadius: moderateScale(10)
    },

    imageContainer: {
        backgroundColor: '#E5E7EB',
        padding: moderateScale(10),
        borderRadius: moderateScale(14),
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    vehicleImage: {
        width: scale(180),
        height: verticalScale(180),
        borderRadius: moderateScale(14)
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
        borderRadius: moderateScale(10)
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
        borderRadius: moderateScale(10)
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
