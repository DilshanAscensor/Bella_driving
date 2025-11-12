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
        backgroundColor: '#8DB600',
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
        color: '#1e3a8a',
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
        backgroundColor: '#8DB600',
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
});