import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({
    PRIMARY_COLOR: '#1e3a8a',
    ACCENT_COLOR: '#8DB600',
    BACKGROUND_COLOR: '#f8fafc',
    CARD_COLOR: '#ffffff',

    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },

    container: {
        flex: 1,
    },

    scrollContainer: {
        padding: scale(20),
        paddingBottom: verticalScale(40),
        backgroundColor: '#f8fafc',
    },

    header: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
        paddingVertical: verticalScale(20),
    },

    title: {
        fontSize: moderateScale(25),
        fontWeight: '700',
        color: '#1e3a8a',
        marginTop: verticalScale(16),
        marginBottom: verticalScale(8),
        textAlign: 'center',
    },

    subtitle: {
        fontSize: moderateScale(15),
        color: '#64748b',
        textAlign: 'center',
        fontWeight: '400',
    },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(16),
        padding: scale(20),
        marginBottom: verticalScale(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(8),
        elevation: 3,
    },

    cardTitle: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: verticalScale(16),
    },

    inputContainer: {
        marginBottom: verticalScale(16),
    },

    inputLabel: {
        fontSize: moderateScale(13),
        fontWeight: '500',
        color: '#475569',
        marginBottom: verticalScale(8),
    },

    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e2e8f0',
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(5),
        borderRadius: scale(15),
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },

    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e2e8f0',
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(16),
        height: verticalScale(56),
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },

    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e2e8f0',
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(16),
        height: verticalScale(56),
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },

    inputIcon: {
        marginRight: scale(12),
    },

    input: {
        flex: 1,
        fontSize: moderateScale(15),
        color: '#1e293b',
        paddingVertical: verticalScale(8),
    },

    picker: {
        flex: 1,
        color: '#1e293b',
        fontSize: moderateScale(15),
    },

    dateInput: {
        flex: 1,
        justifyContent: 'center',
    },

    dateText: {
        fontSize: moderateScale(15),
        color: '#1e293b',
        fontWeight: '500',
    },

    imageCard: {
        height: verticalScale(140),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(16),
        overflow: 'hidden',
        backgroundColor: '#e2e8f0',
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },

    imageContainer: {
        flex: 1,
        position: 'relative',
    },

    uploadedImage: {
        width: '100%',
        height: '100%',
    },

    changeImageOverlay: {
        position: 'absolute',
        bottom: verticalScale(8),
        right: scale(8),
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: moderateScale(20),
        padding: scale(8),
    },

    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imagePlaceholderText: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: '#475569',
        marginTop: verticalScale(12),
    },

    imageSubText: {
        fontSize: moderateScale(14),
        color: '#94a3b8',
        marginTop: verticalScale(4),
    },

    registerButton: {
        backgroundColor: '#8DB600',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(15),
        paddingVertical: verticalScale(16),
    },

    registerButtonDisabled: {
        backgroundColor: '#94a3b8',
    },

    buttonIcon: {
        marginRight: scale(8),
    },

    buttonText: {
        color: 'white',
        fontSize: moderateScale(15),
        fontWeight: '600',
    },

    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: moderateScale(12),
        padding: scale(12),
        marginBottom: verticalScale(20),
        borderLeftWidth: moderateScale(4),
        borderLeftColor: '#ef4444',
    },

    errorText: {
        color: '#dc2626',
        fontSize: moderateScale(14),
        marginLeft: scale(8),
        flex: 1,
    },

    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(20),
    },

    loginText: {
        fontSize: moderateScale(15),
        color: '#64748b',
    },

    loginLink: {
        fontSize: moderateScale(15),
        color: '#f59e0b',
        fontWeight: '600',
    },
});
