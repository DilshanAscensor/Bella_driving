// ../assets/styles/home.js
import { StyleSheet, Platform } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const isIOS = Platform.OS === 'ios';

export default StyleSheet.create({
    gradient: {
        flex: 1,
    },

    safeArea: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: scale(24),
        paddingTop: verticalScale(70),
        paddingBottom: verticalScale(160),
    },

    header: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },

    logoWrapper: {
        width: moderateScale(140),
        height: moderateScale(140),
        borderRadius: moderateScale(999),
        // backgroundColor: 'rgba(255, 165, 0, 0.12)',     // very subtle orange tint
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(24),
        // borderWidth: 1,
        // borderColor: 'rgba(255, 165, 0, 0.25)',
        ... (isIOS ? { overflow: 'hidden' } : {}),      // helps with rounded bg
    },

    logo: {
        width: moderateScale(100),
        height: moderateScale(100),
    },

    tagline: {
        fontSize: moderateScale(14.5),
        fontWeight: '600',
        letterSpacing: 1.8,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.90)',
        marginBottom: verticalScale(10),
    },

    subtitle: {
        fontSize: moderateScale(17),
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: moderateScale(26),
        color: 'rgba(255,255,255,0.95)',
        paddingHorizontal: scale(16),
    },

    buttonsContainer: {
        gap: verticalScale(18),
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(20),
        borderRadius: moderateScale(20),
        gap: scale(14),
        minHeight: verticalScale(58),           // better touch target
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.22,
        shadowRadius: 10,
        // elevation: 7,
    },

    // Primary (Login) → solid orange
    buttonPrimary: {
        backgroundColor: '#FFA500',
    },

    buttonSecondary: {
        backgroundColor: 'rgba(99, 113, 131, 0.55)',
        borderWidth: 1.5,
        borderColor: '#FFA500',
        backdropFilter: isIOS ? 'blur(8px)' : undefined,
    },

    buttonTextPrimary: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: 0.3,
    },

    buttonTextSecondary: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: '#ffa600ec',
        letterSpacing: 0.3,
    },

    footer: {
        position: 'absolute',
        bottom: verticalScale(28),
        left: 0,
        right: 0,
        alignItems: 'center',
    },

    footerText: {
        fontSize: moderateScale(13),
        color: 'rgba(117, 117, 117, 0.77)',
        fontWeight: '500',
    },
});