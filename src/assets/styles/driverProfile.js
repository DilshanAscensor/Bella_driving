import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: verticalScale(30),
        borderBottomLeftRadius: scale(25),
        borderBottomRightRadius: scale(25),
        backgroundColor: '#FFA500',
    },
    avatarContainer: {
        width: scale(110),
        height: scale(110),
        borderRadius: scale(55),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10),
        borderWidth: scale(3),
        borderColor: '#fff',
    },
    avatar: {
        width: scale(110),
        height: scale(110),
        borderRadius: scale(55),
    },
    nameText: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: '#fff',
        marginTop: verticalScale(8),
    },
    emailText: {
        fontSize: moderateScale(14),
        color: '#f0fff0',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: scale(16),
        marginHorizontal: scale(16),
        marginTop: verticalScale(25),
        padding: scale(20),
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowRadius: scale(6),
        elevation: 3,
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: '#122948',
        marginBottom: verticalScale(10),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: verticalScale(6),
    },
    infoText: {
        fontSize: moderateScale(15),
        color: '#334155',
        marginLeft: scale(10),
    },
    docImage: {
        width: '100%',
        height: verticalScale(150),
        borderRadius: scale(10),
        marginTop: verticalScale(10),
        resizeMode: 'contain',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFA500',
        marginHorizontal: scale(16),
        marginTop: verticalScale(25),
        paddingVertical: verticalScale(12),
        borderRadius: scale(25),
        gap: scale(8),
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowRadius: scale(3),
        elevation: 3,
    },
    editButtonText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ef4444',
    },

    // =========================================
    profileCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: scale(16),
        marginTop: verticalScale(20),
        padding: scale(18),
        borderRadius: scale(18),
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
        alignItems: 'center',
    },

    profileLeft: {
        marginRight: scale(15),
    },

    profileAvatar: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(40),
    },

    profileAvatarPlaceholder: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(40),
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileRight: {
        flex: 1,
        justifyContent: 'center',
    },

    profileName: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: '#1e293b',
    },

    profileEmail: {
        fontSize: moderateScale(14),
        color: '#475569',
        marginTop: verticalScale(4),
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(6),
        backgroundColor: '#FCD34D20',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(2),
        borderRadius: scale(8),
        alignSelf: 'flex-start',
    },

    ratingText: {
        fontSize: moderateScale(13),
        color: '#92400E',
        fontWeight: '600',
        marginLeft: scale(4),
    },


    actionButtonsContainer: {
        marginHorizontal: scale(16),
        marginTop: verticalScale(20),
        gap: verticalScale(12),
    },

    actionButtonWhite: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1ff',
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(20),
        borderRadius: scale(10),
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowRadius: scale(6),
        // elevation: 2,
    },

    actionTextContainer: {
        flexDirection: 'column',
    },

    actionButtonTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: '#1e293b',
    },
    logoutActionButtonTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: '#c76060ff',
    },
    actionButtonSubtitle: {
        fontSize: moderateScale(13),
        color: '#FFA500',
        marginTop: verticalScale(2),
    },

    logoutButtonWhite: {
        backgroundColor: '#fcf2f2ff',
    },
});